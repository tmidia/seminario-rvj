const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://fsjroxinzhhjovqeaowp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanJveGluemhoam92cWVhb3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTQ4NjksImV4cCI6MjA4OTk3MDg2OX0.3Dj0nr9JSCyayiv8vZVxkfyOLabV9tO_ih6cTFXlRFs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectStudent() {
  const cpf = '21689666803';
  console.log(`Inspecting student with CPF: ${cpf}`);
  
  // Since we don't have service role key in diag script, we'll try to guess if it exists via RPC or public profile
  const { data: profile, error: profileErr } = await supabase
    .from('profiles')
    .select('id, full_name, role, status')
    .eq('cpf', cpf)
    .single();
    
  if (profileErr) {
    console.error('Profile query failed (maybe RLS?):', profileErr.message);
  } else {
    console.log('Profile found:', JSON.stringify(profile, null, 2));
  }
}

inspectStudent();
