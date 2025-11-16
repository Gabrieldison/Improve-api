import { readFileSync } from "fs";
import { readdir } from "fs/promises";
import { join } from "path";
import { pool } from "../connection";

async function ensureMigrationTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS migration_history (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMP DEFAULT NOW()
    )
  `);
}

async function getExecutedMigrations(): Promise<string[]> {
  const result = await pool.query(
    "SELECT filename FROM migration_history ORDER BY filename"
  );

  return result.rows.map((row) => row.filename);
}

async function getMigrationFiles(): Promise<string[]> {
  const migrationsPath = join(__dirname, ".");
  const files = await readdir(migrationsPath);

  return files.filter((file) => file.endsWith(".sql")).sort();
}

async function executeMigration(filename: string) {
  const migrationsPath = join(__dirname, filename);
  const sql = readFileSync(migrationsPath, "utf-8");

  await pool.query(sql);
  await pool.query("INSERT INTO migration_history (filename) VALUES ($1)", [
    filename,
  ]);

  console.log(`✅ Migration executed: ${filename}`);
}

export async function runMigrations() {
  try {
    console.log("🔄 Starting migrations...");

    await ensureMigrationTable();
    const executed = await getExecutedMigrations();
    const files = await getMigrationFiles();
    const pending = files.filter((file) => !executed.includes(file));

    if (pending.length === 0) {
      console.log("✅ No pending migrations");
      return;
    }

    for (const file of pending) {
      await executeMigration(file);
    }

    console.log(`✅ All migrations executed! (${pending.length} new)`);
  } catch (error) {
    console.error("❌ Migration error:", error);
    throw error;
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log("✅ Migrations completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Migrations failed:", error);
      process.exit(1);
    });
}
