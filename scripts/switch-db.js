const fs = require("fs");
const path = require("path");

const target = process.argv[2];
if (!target || (target !== "postgres" && target !== "sqlite")) {
  console.error("Usage: node scripts/switch-db.js <postgres|sqlite>");
  process.exit(1);
}

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
let content = fs.readFileSync(schemaPath, "utf8");

if (target === "postgres") {
  content = content.replace(/provider\s*=\s*"sqlite"/, 'provider = "postgresql"');
  console.log("✅ Configuré prisma/schema.prisma pour PostgreSQL (Vercel / Supabase / Neon)");
} else {
  content = content.replace(/provider\s*=\s*"postgresql"/, 'provider = "sqlite"');
  console.log("✅ Configuré prisma/schema.prisma pour SQLite (Développement local)");
}

fs.writeFileSync(schemaPath, content, "utf8");
