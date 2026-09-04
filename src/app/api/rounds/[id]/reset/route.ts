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
    const round = await prisma.round.findUnique({
      where: { id: params.id },
      include: { class: true },
    });

    if (!round || round.class.userId !== user.id) {
      return NextResponse.json({ error: "الجولة غير موجودة" }, { status: 404 });
    }

    // Optional body check for clearAllHistory flag
    let clearAll = false;
    try {
      const body = await req.json();
      if (body?.clearAllHistory) clearAll = true;
    } catch {
      // Body is empty or not JSON
    }

    if (clearAll) {
      // Delete all selections and completed rounds for this class
      await prisma.selection.deleteMany({
        where: { round: { classId: round.classId } },
      });
      await prisma.round.deleteMany({
        where: { classId: round.classId, id: { not: round.id } },
      });
    } else {
      // Delete all selections belonging to this round
      await prisma.selection.deleteMany({
        where: { roundId: round.id },
      });
    }

    // Reset current round state
    const cleanRound = await prisma.round.update({
      where: { id: round.id },
      data: {
        status: "ACTIVE",
        completedAt: null,
        roundNumber: clearAll ? 1 : round.roundNumber,
      },
      include: {
        selections: {
          include: {
            student: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      round: cleanRound,
      newRound: cleanRound,
      message: "تمت إعادة تعيين الجولة وحذف سجل السحب بنجاح",
    });
  } catch (error) {
    console.error("Reset round error:", error);
    return NextResponse.json({ error: "تعذر إعادة تعيين الجولة" }, { status: 500 });
  }
}
