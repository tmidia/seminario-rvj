const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

async function check() {
  console.log("Reading .env.local...");
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const urlMatches = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
  const keyMatches = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);

  if (!urlMatches || !keyMatches) {
    console.error("Could not find URL or Service Key in .env.local");
    return;
  }

  const url = urlMatches[1].trim();
  const key = keyMatches[1].trim();
  
  const supabase = createClient(url, key);

  const tables = ['courses', 'subjects', 'exams', 'exam_attempts', 'enrollments'];
  
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`Table ${table}: Error - ${error.message}`);
    } else {
      console.log(`Table ${table}: ${count} rows`);
    }
  }
}

check();
