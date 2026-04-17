const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

async function check() {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const url = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
  const key = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)[1].trim();
  const supabase = createClient(url, key);

  console.log("Courses in current project:");
  const { data } = await supabase.from('courses').select('id, title');
  console.log(JSON.stringify(data, null, 2));
}

check();
