import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const updateStudentSchema = z.object({
  name: z.string().min(2, "اسم الطالب يجب أن يحتوي على حرفين على الأقل"),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateStudentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: { class: true },
    });

    if (!student || student.class.userId !== user.id) {
      return NextResponse.json({ error: "الطالب غير موجود أو ليس لديك صلاحية" }, { status: 404 });
    }

    const updated = await prisma.student.update({
      where: { id: params.id },
      data: { name: parsed.data.name.trim() },
    });

    return NextResponse.json({ success: true, student: updated });
  } catch (error) {
    console.error("Update student error:", error);
    return NextResponse.json({ error: "تعذر تعديل بيانات الطالب" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: { class: true },
    });

    if (!student || student.class.userId !== user.id) {
      return NextResponse.json({ error: "الطالب غير موجود أو ليس لديك صلاحية" }, { status: 404 });
    }

    // Delete student selections first
    await prisma.selection.deleteMany({
      where: { studentId: params.id },
    });

    await prisma.student.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete student error:", error);
    return NextResponse.json({ error: "تعذر حذف الطالب" }, { status: 500 });
  }
}
