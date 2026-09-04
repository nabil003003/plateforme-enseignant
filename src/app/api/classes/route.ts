import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const createClassSchema = z.object({
  name: z.string().min(2, "اسم الفصل يجب أن يحتوي على حرفين على الأقل"),
  description: z.string().optional(),
});

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    const classes = await prisma.class.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: {
            students: true,
            rounds: true,
          },
        },
        rounds: {
          orderBy: { roundNumber: "desc" },
          take: 1,
          select: {
            id: true,
            roundNumber: true,
            status: true,
          },
        },
      },
    });

    const formattedClasses = classes.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      _count: c._count,
      latestRound: c.rounds[0] || null,
    }));

    return NextResponse.json({ classes: formattedClasses });
  } catch (error) {
    console.error("Fetch classes error:", error);
    return NextResponse.json({ error: "تعذر جلب قائمة الفصول" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createClassSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "بيانات غير صالحة" },
        { status: 400 }
      );
    }

    const newClass = await prisma.class.create({
      data: {
        userId: user.id,
        name: parsed.data.name.trim(),
        description: parsed.data.description?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, class: newClass });
  } catch (error) {
    console.error("Create class error:", error);
    return NextResponse.json({ error: "تعذر إنشاء الفصل الجديد" }, { status: 500 });
  }
}
