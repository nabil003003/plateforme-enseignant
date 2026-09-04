import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const addStudentSchema = z.object({
  name: z.string().min(2, "اسم الطالب يجب أن يحتوي على حرفين على الأقل"),
});

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
    });
    if (!classItem) {
      return NextResponse.json({ error: "الفصل غير موجود" }, { status: 404 });
    }

    const students = await prisma.student.findMany({
      where: { classId: params.id },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { selections: true },
        },
      },
    });

    const formatted = students.map((s) => ({
      id: s.id,
      classId: s.classId,
      name: s.name,
      createdAt: s.createdAt.toISOString(),
      selectionCount: s._count.selections,
    }));

    return NextResponse.json({ students: formatted });
  } catch (error) {
    console.error("Fetch students error:", error);
    return NextResponse.json({ error: "تعذر جلب قائمة الطلاب" }, { status: 500 });
  }
}

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

    const body = await req.json();
    const parsed = addStudentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const trimmedName = parsed.data.name.trim();

    // Check duplicate in the same class
    const existing = await prisma.student.findFirst({
      where: {
        classId: params.id,
        name: trimmedName,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: `الطالب "${trimmedName}" موجود بالفعل في هذا الفصل` },
        { status: 409 }
      );
    }

    const newStudent = await prisma.student.create({
      data: {
        classId: params.id,
        name: trimmedName,
      },
    });

    return NextResponse.json({ success: true, student: newStudent });
  } catch (error) {
    console.error("Add student error:", error);
    return NextResponse.json({ error: "تعذر إضافة الطالب" }, { status: 500 });
  }
}
