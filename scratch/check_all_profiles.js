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

  console.log("Checking ALL rows in profiles table...");
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(10);

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Rows found:", data.length);
  data.forEach(p => {
    console.log(`- Nome: ${p.full_name}, CPF: ${p.cpf}, Role: ${p.role}`);
  });
}

check();
