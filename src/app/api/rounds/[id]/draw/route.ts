import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    // Execute inside transaction for strict concurrency safety
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch round and verify user ownership of the parent class
      const round = await tx.round.findUnique({
        where: { id: params.id },
        include: {
          class: true,
          selections: {
            select: { studentId: true },
          },
        },
      });

      if (!round || round.class.userId !== user.id) {
        throw new Error("ROUND_NOT_FOUND");
      }

      if (round.status === "COMPLETED") {
        return {
          isRoundComplete: true,
          error: "الجولة الحالية مكتملة بالفعل. يرجى بدء جولة جديدة.",
        };
      }

      // 2. Fetch all students in this class
      const allStudents = await tx.student.findMany({
        where: { classId: round.classId },
      });

      if (allStudents.length === 0) {
        throw new Error("NO_STUDENTS_IN_CLASS");
      }

      // 3. Determine who has already been selected
      const selectedIds = new Set(round.selections.map((s) => s.studentId));
      const remainingStudents = allStudents.filter((s) => !selectedIds.has(s.id));

      if (remainingStudents.length === 0) {
        // Complete the round
        await tx.round.update({
          where: { id: round.id },
          data: { status: "COMPLETED", completedAt: new Date() },
        });

        return {
          isRoundComplete: true,
          totalStudents: allStudents.length,
          selectedCount: allStudents.length,
          remainingCount: 0,
        };
      }

      // 4. Truly random selection from remaining candidates (uniform random)
      const randomIndex = Math.floor(Math.random() * remainingStudents.length);
      const chosenStudent = remainingStudents[randomIndex];

      const nextOrder = round.selections.length + 1;

      // 5. Create Selection record
      await tx.selection.create({
        data: {
          roundId: round.id,
          studentId: chosenStudent.id,
          selectionOrder: nextOrder,
        },
      });

      const isNowComplete = remainingStudents.length === 1;

      if (isNowComplete) {
        await tx.round.update({
          where: { id: round.id },
          data: { status: "COMPLETED", completedAt: new Date() },
        });
      }

      return {
        success: true,
        selectedStudent: {
          id: chosenStudent.id,
          name: chosenStudent.name,
        },
        selectionOrder: nextOrder,
        roundStatus: isNowComplete ? "COMPLETED" : "ACTIVE",
        totalStudents: allStudents.length,
        selectedCount: nextOrder,
        remainingCount: remainingStudents.length - 1,
        isRoundComplete: isNowComplete,
      };
    });

    if ("error" in result && result.error) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Draw error:", error);
    const msg = error instanceof Error ? error.message : "تعذر إجراء السحب العشوائي";

    if (msg === "ROUND_NOT_FOUND") {
      return NextResponse.json({ error: "الجولة غير موجودة أو انتهت صلاحيتها" }, { status: 404 });
    }
    if (msg === "NO_STUDENTS_IN_CLASS") {
      return NextResponse.json({ error: "لا يوجد طلاب في هذا الفصل لإجراء السحب" }, { status: 400 });
    }

    return NextResponse.json({ error: "حدث خطأ غير متوقع أثناء السحب" }, { status: 500 });
  }
}
