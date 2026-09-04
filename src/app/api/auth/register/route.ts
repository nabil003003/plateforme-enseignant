import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSessionToken, setSessionCookie } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit comporter au moins 2 caractères / يجب أن يتكون الاسم من حرفين على الأقل"),
  email: z.string().email("Adresse e-mail invalide / البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères / كلمة المرور يجب أن لا تقل عن 6 أحرف"),
});

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting: Max 4 registrations per 10 minutes per IP
    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(`register:${clientIp}`, {
      limit: 4,
      windowSeconds: 600,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: `Trop de créations de compte depuis cette adresse. Veuillez patienter avant de réessayer. / تم تجاوز الحد المسموح لتسجيل الحسابات. يرجى الانتظار.`,
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
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Données invalides / بيانات غير صالحة" },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cette adresse e-mail est déjà utilisée / هذا البريد الإلكتروني مسجل بالفعل لدينا" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        settings: {
          create: {
            theme: "system",
            soundEnabled: true,
            animationSpeed: "normal",
            locale: "ar",
          },
        },
      },
    });

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
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création du compte / حدث خطأ غير متوقع أثناء التسجيل." },
      { status: 500 }
    );
  }
}
