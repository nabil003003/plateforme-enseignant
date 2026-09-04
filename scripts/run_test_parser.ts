import fs from "fs";
import path from "path";
import { parseExcelBuffer } from "../src/lib/excel";

const filePath = path.join(process.cwd(), "sample_massar_maroc.xlsx");
const buffer = fs.readFileSync(filePath);

const result = parseExcelBuffer(buffer);

console.log("=== EXCEL PARSER TEST RESULTS ===");
console.log("Detected Column Name:", result.detectedColumnName);
console.log("Detected Class Meta:", result.detectedClassMeta);
console.log("Total Valid Students Found:", result.validStudentsCount);
console.log("Available Columns:", result.availableColumns);
console.log("First 5 Student Names:");
result.previewStudents.slice(0, 5).forEach((s, idx) => {
  console.log(`  ${idx + 1}. ${s.name} (Valid: ${s.isValid})`);
});
console.log("Last Student Name:", result.previewStudents[result.previewStudents.length - 1]?.name);
console.log("=================================");
