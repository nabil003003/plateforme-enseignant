import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseExcelBuffer } from "@/lib/excel";

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
      include: { students: { select: { name: true } } },
    });

    if (!classItem) {
      return NextResponse.json({ error: "الفصل غير موجود" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const targetSheet = (formData.get("sheet") as string) || undefined;
    const targetColumn = (formData.get("column") as string) || undefined;

    if (!file) {
      return NextResponse.json({ error: "يرجى تحديد ملف Excel لرفعه" }, { status: 400 });
    }

    // Validate extension
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      return NextResponse.json({ error: "صيغة الملف غير مدعومة. يرجى رفع ملف بصيغة xlsx أو xls" }, { status: 400 });
    }

    // Limit file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "حجم الملف كبير جدًا (الحد الأقصى 5 ميغابايت)" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const parsedData = parseExcelBuffer(arrayBuffer, targetSheet, targetColumn);

    // Also mark if any student already exists in this class
    const existingNamesSet = new Set(
      classItem.students.map((s) => s.name.trim().toLowerCase())
    );

    let alreadyInClassCount = 0;
    const updatedPreview = parsedData.previewStudents.map((row) => {
      const isAlreadyInClass = existingNamesSet.has(row.name.trim().toLowerCase());
      if (isAlreadyInClass) {
        alreadyInClassCount++;
      }
      return {
        ...row,
        isAlreadyInClass,
        notes: isAlreadyInClass
          ? "موجود مسبقًا في الفصل"
          : row.notes,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        ...parsedData,
        previewStudents: updatedPreview,
        alreadyInClassCount,
      },
    });
  } catch (error: unknown) {
    console.error("Excel preview error:", error);
    const msg = error instanceof Error ? error.message : "تعذر تحليل ملف Excel";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
