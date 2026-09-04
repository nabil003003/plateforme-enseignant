import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء تعبئة قاعدة البيانات (Seeding database)...");

  // Clean existing demo data if any
  await prisma.selection.deleteMany();
  await prisma.round.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.userSettings.deleteMany();
  await prisma.user.deleteMany();

  // Create demo teacher
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      email: "teacher@example.com",
      name: "الأستاذ رشيد المنصوري",
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

  console.log(`👤 تم إنشاء المعلم التجريبي: ${user.name} (${user.email})`);

  // Class 1
  const class1 = await prisma.class.create({
    data: {
      userId: user.id,
      name: "السنة الأولى إعدادي - الفوج 1",
      description: "مادة اللغة العربية والتربية الإسلامية - قاعة 4",
      students: {
        create: [
          { name: "محمد العلوي" },
          { name: "سارة الإدريسي" },
          { name: "يوسف بنعلي" },
          { name: "مريم الشرايبي" },
          { name: "عبد الرحمن الفاسي" },
          { name: "فاطمة الزهراء بنجلون" },
          { name: "عمر التازي" },
          { name: "آية المرابط" },
          { name: "حمزة الصالحي" },
          { name: "خديجة العمري" },
          { name: "أمين الودغيري" },
          { name: "زينب الصنهاجي" },
          { name: "ياسين برادة" },
          { name: "سلمى العلمي" },
          { name: "مهدي الرحماني" },
          { name: "هبة بناني" },
          { name: "وليد السوسي" },
          { name: "إيمان الحنفي" },
        ],
      },
    },
  });

  // Create an active round for Class 1 with 3 already selected students to demonstrate resume state
  const round1 = await prisma.round.create({
    data: {
      classId: class1.id,
      roundNumber: 1,
      status: "ACTIVE",
    },
  });

  const students1 = await prisma.student.findMany({ where: { classId: class1.id } });
  if (students1.length >= 3) {
    await prisma.selection.createMany({
      data: [
        { roundId: round1.id, studentId: students1[0].id, selectionOrder: 1 },
        { roundId: round1.id, studentId: students1[1].id, selectionOrder: 2 },
        { roundId: round1.id, studentId: students1[2].id, selectionOrder: 3 },
      ],
    });
  }

  // Class 2
  await prisma.class.create({
    data: {
      userId: user.id,
      name: "السنة الثانية إعدادي - المجموعة 2",
      description: "فوج الرياضيات والعلوم الفزيائية",
      students: {
        create: [
          { name: "أحمد بوزيد" },
          { name: "كنزة المرنيسي" },
          { name: "طه الصقلي" },
          { name: "نورهان الزياتي" },
          { name: "بلال الحسني" },
          { name: "ريم القادري" },
          { name: "أيوب العسري" },
          { name: "سناء العباسي" },
          { name: "طارق المزواري" },
          { name: "إسراء الوالي" },
          { name: "كريم الشرقاوي" },
          { name: "أسماء الطاهري" },
        ],
      },
    },
  });

  // Class 3
  await prisma.class.create({
    data: {
      userId: user.id,
      name: "السنة الثالثة إعدادي - مسار دولي",
      description: "تحضير للامتحان الموحد الجهوي",
      students: {
        create: [
          { name: "سعد الجعفري" },
          { name: "دعاء اليعقوبي" },
          { name: "رضا الخمليشي" },
          { name: "نهيلة الزروالي" },
          { name: "أنور بناني" },
          { name: "هاجر الفيلالي" },
          { name: "إلياس السباعي" },
          { name: "وفاء العمراني" },
        ],
      },
    },
  });

  console.log("✅ تم ملء قاعدة البيانات بنجاح بثلاثة فصول ونخبة من الطلاب العرب.");
}

main()
  .catch((e) => {
    console.error("❌ خطأ أثناء تعبئة قاعدة البيانات:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
