const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.resolve(__dirname, '../.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkStudent() {
  const cpf = '21689666803';
  console.log(`Checking CPF: ${cpf}`);
  
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('*, enrollments(courses(title))')
    .eq('cpf', cpf)
    .single();
    
  if (profileErr) {
    console.error('Profile Error:', profileErr.message);
  } else {
    console.log('Profile found:', JSON.stringify(profile, null, 2));
  }
  
  const email = `${cpf}.rvj@gmail.com`;
  console.log(`Checking Auth for email: ${email}`);
  
  const { data: authUsers, error: authErr } = await supabase.auth.admin.listUsers();
  const user = authUsers.users.find(u => u.email === email);
  
  if (user) {
    console.log('Auth User found:', JSON.stringify(user, null, 2));
  } else {
    console.log('Auth User NOT found');
  }
}

checkStudent();
