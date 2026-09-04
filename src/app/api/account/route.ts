import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, hashPassword, verifyPassword, clearSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const updateAccountSchema = z.object({
  name: z.string().min(2, "الاسم قصير جدًا").optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل").optional(),
});

const deleteAccountSchema = z.object({
  confirmationText: z.string(),
});

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateAccountSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message }, { status: 400 });
    }

    const { name, currentPassword, newPassword } = parsed.data;
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    const updateData: { name?: string; passwordHash?: string } = {};

    if (name) {
      updateData.name = name.trim();
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "يرجى إدخال كلمة المرور الحالية لتغيير كلمة المرور" },
          { status: 400 }
        );
      }

      const isCurrentValid = await verifyPassword(currentPassword, dbUser.passwordHash);
      if (!isCurrentValid) {
        return NextResponse.json(
          { error: "كلمة المرور الحالية غير صحيحة" },
          { status: 400 }
        );
      }

      updateData.passwordHash = await hashPassword(newPassword);
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update account error:", error);
    return NextResponse.json({ error: "تعذر تحديث بيانات الحساب" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = deleteAccountSchema.safeParse(body);
    if (
      !parsed.success ||
      (parsed.data.confirmationText !== "حذف حسابي" &&
       parsed.data.confirmationText !== "supprimer mon compte")
    ) {
      return NextResponse.json(
        { error: 'لتأكيد الحذف، يرجى كتابة "حذف حسابي" أو "supprimer mon compte" بدقة' },
        { status: 400 }
      );
    }

    // Cascading delete: Selections -> Rounds -> Students -> Classes -> Settings -> User
    const userClasses = await prisma.class.findMany({
      where: { userId: user.id },
      select: { id: true },
    });
    const classIds = userClasses.map((c) => c.id);

    await prisma.selection.deleteMany({
      where: { round: { classId: { in: classIds } } },
    });
    await prisma.round.deleteMany({
      where: { classId: { in: classIds } },
    });
    await prisma.student.deleteMany({
      where: { classId: { in: classIds } },
    });
    await prisma.class.deleteMany({
      where: { userId: user.id },
    });
    await prisma.userSettings.deleteMany({
      where: { userId: user.id },
    });
    await prisma.user.delete({
      where: { id: user.id },
    });

    await clearSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "تعذر حذف الحساب" }, { status: 500 });
  }
}
