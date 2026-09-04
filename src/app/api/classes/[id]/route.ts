import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const updateClassSchema = z.object({
  name: z.string().min(2, "اسم الفصل يجب أن يحتوي على حرفين على الأقل").optional(),
  description: z.string().nullable().optional(),
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
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        students: {
          orderBy: { name: "asc" },
        },
        rounds: {
          orderBy: { roundNumber: "desc" },
          take: 1,
          include: {
            selections: {
              include: {
                student: {
                  select: { id: true, name: true },
                },
              },
              orderBy: { selectionOrder: "asc" },
            },
          },
        },
      },
    });

    if (!classItem) {
      return NextResponse.json({ error: "الفصل غير موجود أو ليس لديك صلاحية للوصول إليه" }, { status: 404 });
    }

    return NextResponse.json({ class: classItem });
  } catch (error) {
    console.error("Fetch class detail error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء تحميل بيانات الفصل" }, { status: 500 });
  }
}

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
    const parsed = updateClassSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const classItem = await prisma.class.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!classItem) {
      return NextResponse.json({ error: "الفصل غير موجود" }, { status: 404 });
    }

    const updated = await prisma.class.update({
      where: { id: params.id },
      data: {
        ...(parsed.data.name && { name: parsed.data.name.trim() }),
        ...(parsed.data.description !== undefined && {
          description: parsed.data.description?.trim() || null,
        }),
      },
    });

    return NextResponse.json({ success: true, class: updated });
  } catch (error) {
    console.error("Update class error:", error);
    return NextResponse.json({ error: "تعذر تحديث بيانات الفصل" }, { status: 500 });
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
    const classItem = await prisma.class.findFirst({
      where: { id: params.id, userId: user.id },
    });

    if (!classItem) {
      return NextResponse.json({ error: "الفصل غير موجود" }, { status: 404 });
    }

    // Delete class and cascading records
    await prisma.selection.deleteMany({
      where: { round: { classId: params.id } },
    });
    await prisma.round.deleteMany({
      where: { classId: params.id },
    });
    await prisma.student.deleteMany({
      where: { classId: params.id },
    });
    await prisma.class.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete class error:", error);
    return NextResponse.json({ error: "تعذر حذف الفصل" }, { status: 500 });
  }
}
