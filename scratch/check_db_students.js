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

  console.log("Checking profiles table...");
  const { data, error, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' });

  if (error) {
    console.error("Error:", error);
    return;
  }

  console.log("Total profiles:", count);
  console.log("Roles found:", [...new Set(data.map(p => p.role))]);
  
  const students = data.filter(p => p.role === 'aluno');
  console.log("Number of students (role = 'aluno'):", students.length);
  
  if (students.length > 0) {
    console.log("Sample student:", {
      id: students[0].id,
      full_name: students[0].full_name,
      cpf: students[0].cpf,
      role: students[0].role
    });
  }
}

check();
