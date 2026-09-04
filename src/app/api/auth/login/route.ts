import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const loginSchema = z.object({
  email: z.string().email("البريد الإلكتروني غير صالح / Adresse e-mail invalide"),
  password: z.string().min(1, "يرجى إدخال كلمة المرور / Veuillez saisir le mot de passe"),
});

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting: Max 5 login attempts per minute per IP
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`login:${clientIp}`, {
      limit: 6,
      windowSeconds: 60,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Trop de tentatives de connexion. Veuillez réessayer dans ${rateLimit.retryAfterSeconds} secondes. / تم تجاوز عدد المحاولات المسموح بها. يرجى الانتظار قليلاً.`,
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
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Données invalides / بيانات غير صالحة" },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Identifiants incorrects / البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Identifiants incorrects / البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const token = await createSessionToken(user.id);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Une erreur inattendue est survenue lors de la connexion. / حدث خطأ غير متوقع أثناء تسجيل الدخول." },
      { status: 500 }
    );
  }
}
