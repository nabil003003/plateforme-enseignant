import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const forgotSchema = z.object({
  email: z.string().email("Adresse e-mail invalide / البريد الإلكتروني غير صالح"),
});

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`forgot:${clientIp}`, {
      limit: 3,
      windowSeconds: 900, // Max 3 requests per 15 minutes
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Trop de demandes. Veuillez patienter avant de renouveler la demande. / تم تجاوز عدد المحاولات المسموح بها.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    const body = await req.json();
    const parsed = forgotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Adresse e-mail invalide / البريد الإلكتروني غير صالح" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();
    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success for privacy reasons
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Si cette adresse est enregistrée, les instructions ont été transmises. / إذا كان هذا البريد مسجلاً لدينا، فستتلقى رابط استعادة كلمة المرور.",
      });
    }

    // Generate token valid for 1 hour
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt,
      },
    });

    console.log(`[Email Service] Password reset requested for ${email}. Token: ${token}`);

    return NextResponse.json({
      success: true,
      message: "Si cette adresse est enregistrée, les instructions ont été transmises. / إذا كان هذا البريد مسجلاً لدينا، فستتلقى رابط استعادة كلمة المرور.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Une erreur est survenue lors du traitement / حدث خطأ أثناء معالجة الطلب" }, { status: 500 });
  }
}
