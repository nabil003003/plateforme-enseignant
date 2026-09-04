import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const confirmImportSchema = z.object({
  names: z.array(z.string().min(2)).min(1, "لا توجد أسماء للاستيراد"),
});

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
      include: { students: { select: { name: true } } },
    });

    if (!classItem) {
      return NextResponse.json({ error: "الفصل غير موجود" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = confirmImportSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || "بيانات غير صالحة" }, { status: 400 });
    }

    const existingNamesSet = new Set(
      classItem.students.map((s) => s.name.trim().toLowerCase())
    );

    const namesToInsert: string[] = [];
    const seenInBatch = new Set<string>();

    for (const rawName of parsed.data.names) {
      const trimmed = rawName.trim();
      const lower = trimmed.toLowerCase();

      if (!existingNamesSet.has(lower) && !seenInBatch.has(lower)) {
        seenInBatch.add(lower);
        namesToInsert.push(trimmed);
      }
    }

    if (namesToInsert.length === 0) {
      return NextResponse.json(
        { error: "جميع الأسماء المحددة مسجلة بالفعل في هذا الفصل" },
        { status: 400 }
      );
    }

    await prisma.student.createMany({
      data: namesToInsert.map((name) => ({
        classId: params.id,
        name,
      })),
    });

    // Update class updatedAt timestamp
    await prisma.class.update({
      where: { id: params.id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      importedCount: namesToInsert.length,
      skippedCount: parsed.data.names.length - namesToInsert.length,
    });
  } catch (error) {
    console.error("Confirm import error:", error);
    return NextResponse.json({ error: "تعذر حفظ قائمة الطلاب" }, { status: 500 });
  }
}
