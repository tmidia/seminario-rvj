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

  console.log("Listing Auth Users...");
  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Total Auth Users:", data.users.length);
  data.users.forEach(u => {
    console.log(`- Email: ${u.email}, ID: ${u.id}, Created: ${u.created_at}`);
  });
}

check();
