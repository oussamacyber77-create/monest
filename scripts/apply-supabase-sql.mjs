import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function runSql(filePath) {
  const sql = readFileSync(filePath, "utf8")
  console.log(`Running ${filePath}...`)

  // Split by semicolons and execute each statement separately
  const statements = sql
    .split(";")
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith("--"))

  let success = 0
  let failed = 0

  for (const stmt of statements) {
    try {
      // Use rpc to execute raw SQL
      const { error } = await supabase.rpc("exec_sql", { sql: stmt + ";" })
      if (error) {
        // Try direct query via REST API
        const { error: restError } = await supabase.from("_exec_sql").select("*").filter("sql", "eq", stmt).single()
        if (restError) {
          console.error(`  ✗ Error executing: ${stmt.slice(0, 80)}...`)
          console.error(`    ${error.message}`)
          failed++
        } else {
          success++
        }
      } else {
        success++
      }
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`)
      failed++
    }
  }

  console.log(`  ✓ ${success} statements succeeded, ${failed} failed`)
  return failed === 0
}

async function main() {
  // First, create the exec_sql function if it doesn't exist
  // We need this because PostgREST doesn't support DDL directly
  const setupSql = `
    CREATE OR REPLACE FUNCTION exec_sql(sql text)
    RETURNS void AS $$
    BEGIN
      EXECUTE sql;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `

  console.log("Setting up exec_sql function...")
  try {
    // We'll use a raw HTTP request for the initial setup
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceRoleKey,
        "Authorization": `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: setupSql }),
    })
    console.log(`  Setup response: ${response.status}`)
  } catch (err) {
    console.log(`  Note: ${err.message} (the function may already exist)`)
  }

  const schemaPath = join(__dirname, "..", "supabase", "schema.sql")
  const seedPath = join(__dirname, "..", "supabase", "seed.sql")

  const schemaOk = await runSql(schemaPath)
  if (schemaOk) {
    console.log("\nSchema applied successfully!")
    const seedOk = await runSql(seedPath)
    if (seedOk) {
      console.log("\nSeed data applied successfully!")
    }
  }

  console.log("\nDone!")
}

main().catch(console.error)
