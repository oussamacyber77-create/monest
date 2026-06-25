import pg from "pg"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const { Client } = pg

const PASSWORD = encodeURIComponent(",CJQJ@R@n9aqJdM")
const PROJECT_REF = "qtnepctztxknrfeoqnty"
const CONNECTION_STRING = `postgresql://postgres:${PASSWORD}@db.${PROJECT_REF}.supabase.co:5432/postgres`

const fileArg = process.argv[2]

async function runSqlFile(client, filePath, label) {
  const sql = readFileSync(filePath, "utf8")
  console.log(`\n=== ${label} ===`)
  try {
    await client.query(sql)
    console.log("✓ Success")
    return true
  } catch (err) {
    console.error(`✗ ${err.message}`)
    return false
  }
}

async function main() {
  const client = new Client({
    connectionString: CONNECTION_STRING,
    ssl: { rejectUnauthorized: false },
  })
  await client.connect()
  console.log("Connected to Supabase PostgreSQL")

  const supabaseDir = join(__dirname, "..", "supabase")

  if (fileArg === "schema") {
    await runSqlFile(client, join(supabaseDir, "schema.sql"), "Running schema.sql")
  } else if (fileArg === "seed") {
    await runSqlFile(client, join(supabaseDir, "seed.sql"), "Running seed.sql")
  } else if (fileArg) {
    await runSqlFile(client, fileArg, `Running ${fileArg}`)
  } else {
    // Run both
    const schemaOk = await runSqlFile(client, join(supabaseDir, "schema.sql"), "Running schema.sql")
    if (schemaOk) {
      await runSqlFile(client, join(supabaseDir, "seed.sql"), "Running seed.sql")
    } else {
      console.log("\n⚠ Schema failed. Skipping seed.")
    }
  }

  await client.end()
  console.log("\nDone!")
}

main().catch(err => {
  console.error("Fatal:", err.message)
  process.exit(1)
})
