import * as XLSX from "xlsx";
import { ExcelPreviewResponse, ExcelPreviewRow } from "@/types";

// Patterns that strongly indicate a student name column (Arabic & French)
const NAME_PATTERNS = [
  /^(إسم\s*التلميذ|اسم\s*التلميذ|إسم\s*التلميذ\(ة\)|اسم\s*التلميذ\(ة\)|إسم\s*الطالب|اسم\s*الطالب|إسم\s*المتعلم|اسم\s*المتعلم)$/i,
  /^(الاسم\s*الكامل|الاسم\s*والنسب|اسم\s*ونسب|الاسم|إسم)$/i,
  /^(nom\s*et\s*pr[eé]nom|nom\s*complet|nom\s*de\s*l['’]?[eé]l[eè]ve|nom\s*pr[eé]nom|pr[eé]nom\s*et\s*nom|pr[eé]nom\s*nom)$/i,
  /^(nom|[eé]l[eè]ve|[eé]tudiant|apprenant|student|full\s*name)$/i,
  /[إا]سم.*(تلميذ|طالب|متعلم|كامل)/i,
  /nom|pr[eé]nom|[eé]l[eè]ve|student/i,
];

// Patterns that must NEVER be treated as student names (e.g. Massar Code, Date of birth, Grades)
const REJECT_PATTERNS = [
  /رقم|code|massar|cne|cin|id|identifiant/i,
  /تاريخ|date|naissance|ازدياد|إزدياد|ميلاد/i,
  /نقط|ملاحظ|note|point|remarque|appr[eé]ciation/i,
  /قسم|مستوى|مادة|دورة|سنة|classe|niveau|mati[eè]re/i,
  /غياب|absence/i,
];

export function parseExcelBuffer(
  buffer: Buffer | ArrayBuffer,
  targetSheetName?: string,
  targetColumnName?: string
): ExcelPreviewResponse {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheetNames = workbook.SheetNames;

  if (sheetNames.length === 0) {
    throw new Error("ملف Excel فارغ ولا يحتوي على أي ورقة عمل / Le fichier est vide.");
  }

  const selectedSheet =
    targetSheetName && sheetNames.includes(targetSheetName)
      ? targetSheetName
      : sheetNames[0];

  const worksheet = workbook.Sheets[selectedSheet];
  if (!worksheet) {
    throw new Error(`ورقة العمل "${selectedSheet}" غير موجودة.`);
  }

  // Convert to 2D array of rows to handle headers positioned after metadata rows (like Moroccan Massar system)
  const rawMatrix: unknown[][] = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
    blankrows: false,
  });

  if (!rawMatrix || rawMatrix.length === 0) {
    throw new Error("لم يتم العثور على أي صفوف من البيانات في هذا الملف.");
  }

  // Look for metadata in top rows (e.g. "القسم : 2APIC-5", "Classe : ...")
  let detectedClassMeta: string | undefined;
  for (let r = 0; r < Math.min(12, rawMatrix.length); r++) {
    const rowStr = (rawMatrix[r] || []).map((c) => String(c || "")).join(" ");
    const matchClass = rowStr.match(/(?:القسم|Classe)\s*[:：]\s*([A-Za-z0-9\-_ /]+)/i);
    const matchLevel = rowStr.match(/(?:المستوى|Niveau)\s*[:：]\s*([^:,;\n\r]+)/i);

    if (matchClass && matchClass[1]?.trim()) {
      detectedClassMeta = matchClass[1].trim();
      if (matchLevel && matchLevel[1]?.trim()) {
        detectedClassMeta += ` (${matchLevel[1].trim()})`;
      }
      break;
    }
  }

  // Scan rows to find the actual table header row
  let headerRowIndex = -1;
  let nameColIndex = -1;
  let detectedHeaderTitle = "";

  const maxHeaderSearch = Math.min(25, rawMatrix.length);

  for (let r = 0; r < maxHeaderSearch; r++) {
    const row = rawMatrix[r] || [];
    for (let c = 0; c < row.length; c++) {
      const cellVal = String(row[c] || "").trim();
      if (!cellVal) continue;

      // If user specified target column, check for exact match
      if (targetColumnName && cellVal.toLowerCase() === targetColumnName.toLowerCase()) {
        headerRowIndex = r;
        nameColIndex = c;
        detectedHeaderTitle = cellVal;
        break;
      }

      // Check if matches a rejection pattern (e.g. "رقم التلميذ" or "Code Massar")
      const isRejected = REJECT_PATTERNS.some((p) => p.test(cellVal));
      if (isRejected) continue;

      // Check against name patterns
      for (const pattern of NAME_PATTERNS) {
        if (pattern.test(cellVal)) {
          headerRowIndex = r;
          nameColIndex = c;
          detectedHeaderTitle = cellVal;
          break;
        }
      }

      if (headerRowIndex !== -1) break;
    }
    if (headerRowIndex !== -1) break;
  }

  // Fallback: If no recognized header found, assume header is row 0 and pick first non-empty column
  if (headerRowIndex === -1) {
    headerRowIndex = 0;
    const firstRow = rawMatrix[0] || [];
    nameColIndex = 0;
    detectedHeaderTitle = String(firstRow[0] || "العمود الأول");
  }

  const headerRow = rawMatrix[headerRowIndex] || [];
  const availableColumns = headerRow
    .map((c) => String(c || "").trim())
    .filter((c) => c.length > 0);

  // If user passed targetColumnName, find its index in the identified header row
  if (targetColumnName) {
    const customIdx = headerRow.findIndex(
      (c) => String(c || "").trim().toLowerCase() === targetColumnName.toLowerCase()
    );
    if (customIdx !== -1) {
      nameColIndex = customIdx;
      detectedHeaderTitle = targetColumnName;
    }
  }

  const previewStudents: ExcelPreviewRow[] = [];
  const seenNames = new Set<string>();
  const duplicatesSet = new Set<string>();
  const uniqueStudents: string[] = [];

  // Footer indicators to stop scanning if encountered
  const FOOTER_PATTERNS = [
    /^المجموع/i,
    /^المعدل/i,
    /^النسبة/i,
    /^توقيع/i,
    /^total/i,
    /^moyenne/i,
    /^signature/i,
  ];

  for (let r = headerRowIndex + 1; r < rawMatrix.length; r++) {
    const row = rawMatrix[r] || [];
    const rawVal = row[nameColIndex];
    let nameStr = typeof rawVal === "string" ? rawVal.trim() : String(rawVal || "").trim();

    // Skip empty lines
    if (!nameStr) continue;

    // Stop if footer row detected
    if (FOOTER_PATTERNS.some((p) => p.test(nameStr))) {
      continue;
    }

    // Ignore if cell is clearly an alphanumeric code with multiple numbers (e.g. Massar code "F160008372" or integer)
    if (/^[A-Za-z]?[0-9]{4,}[A-Za-z0-9]*$/.test(nameStr) || /^[0-9]+$/.test(nameStr)) {
      continue;
    }

    // Strip leading/trailing bullets, numbers or symbols
    nameStr = nameStr.replace(/^[\d\s.\-–_*•]+/, "").trim();
    if (!nameStr) continue;

    // Check if it repeated the header title
    if (nameStr.toLowerCase() === detectedHeaderTitle.toLowerCase()) continue;

    const isValid = nameStr.length >= 2 && nameStr.length <= 100;
    const lowerKey = nameStr.toLowerCase();
    const isDuplicate = seenNames.has(lowerKey);

    if (isDuplicate) {
      duplicatesSet.add(lowerKey);
    } else {
      seenNames.add(lowerKey);
      if (isValid) {
        uniqueStudents.push(nameStr);
      }
    }

    previewStudents.push({
      rowNumber: r + 1,
      name: nameStr,
      isValid,
      isDuplicate,
      notes: !isValid
        ? "الاسم غير صالح / Nom non valide"
        : isDuplicate
        ? "اسم مكرر في الملف / Doublon détecté"
        : undefined,
    });
  }

  return {
    totalRowsFound: previewStudents.length,
    validStudentsCount: uniqueStudents.length,
    duplicatesCount: duplicatesSet.size,
    detectedColumnName: detectedHeaderTitle || "إسم التلميذ / Nom de l'élève",
    availableColumns,
    detectedClassMeta,
    sheetNames,
    selectedSheet,
    previewStudents,
    uniqueStudents,
  };
}
