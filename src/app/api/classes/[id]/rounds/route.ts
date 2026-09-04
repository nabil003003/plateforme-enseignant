import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    const classItem = await prisma.class.findFirst({
      where: { id: params.id, userId: user.id },
      include: {
        students: {
          orderBy: { name: "asc" },
        },
      },
    });

    if (!classItem) {
      return NextResponse.json({ error: "الفصل غير موجود" }, { status: 404 });
    }

    // Find latest active round or latest round
    let activeRound = await prisma.round.findFirst({
      where: {
        classId: params.id,
        status: "ACTIVE",
      },
      orderBy: { roundNumber: "desc" },
      include: {
        selections: {
          include: {
            student: { select: { id: true, name: true } },
          },
          orderBy: { selectionOrder: "asc" },
        },
      },
    });

    // If no active round exists, let's find the latest round number
    if (!activeRound) {
      const latestRound = await prisma.round.findFirst({
        where: { classId: params.id },
        orderBy: { roundNumber: "desc" },
      });

      const nextRoundNumber = (latestRound?.roundNumber || 0) + 1;

      // Auto-create initial active round if there are students
      activeRound = await prisma.round.create({
        data: {
          classId: params.id,
          roundNumber: nextRoundNumber,
          status: "ACTIVE",
        },
        include: {
          selections: {
            include: {
              student: { select: { id: true, name: true } },
            },
            orderBy: { selectionOrder: "asc" },
          },
        },
      });
    }

    // Previous rounds for history
    const allRounds = await prisma.round.findMany({
      where: { classId: params.id },
      orderBy: { roundNumber: "desc" },
      include: {
        _count: {
          select: { selections: true },
        },
      },
    });

    const selectedStudentIds = new Set(
      activeRound.selections.map((s) => s.studentId)
    );

    const remainingStudents = classItem.students.filter(
      (s) => !selectedStudentIds.has(s.id)
    );

    return NextResponse.json({
      class: {
        id: classItem.id,
        name: classItem.name,
        description: classItem.description,
      },
      students: classItem.students,
      activeRound,
      allRounds,
      selectedStudentIds: Array.from(selectedStudentIds),
      remainingStudents,
      totalStudentsCount: classItem.students.length,
      selectedCount: activeRound.selections.length,
      remainingCount: remainingStudents.length,
    });
  } catch (error) {
    console.error("Fetch rounds error:", error);
    return NextResponse.json({ error: "تعذر تحميل بيانات جولات السحب" }, { status: 500 });
  }
}

// Start a new round explicitly
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    const classItem = await prisma.class.findFirst({
      where: { id: params.id, userId: user.id },
    });
    if (!classItem) {
      return NextResponse.json({ error: "الفصل غير موجود" }, { status: 404 });
    }

    // Complete any currently active rounds
    await prisma.round.updateMany({
      where: { classId: params.id, status: "ACTIVE" },
      data: { status: "COMPLETED", completedAt: new Date() },
    });

    // Determine new round number
    const latest = await prisma.round.findFirst({
      where: { classId: params.id },
      orderBy: { roundNumber: "desc" },
    });

    const newRoundNumber = (latest?.roundNumber || 0) + 1;

    const newRound = await prisma.round.create({
      data: {
        classId: params.id,
        roundNumber: newRoundNumber,
        status: "ACTIVE",
      },
      include: {
        selections: true,
      },
    });

    return NextResponse.json({ success: true, round: newRound });
  } catch (error) {
    console.error("Start new round error:", error);
    return NextResponse.json({ error: "تعذر بدء جولة جديدة" }, { status: 500 });
  }
}
