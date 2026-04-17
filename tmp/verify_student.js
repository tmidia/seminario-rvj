const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fsjroxinzhhjovqeaowp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanJveGluemhoam92cWVhb3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTQ4NjksImV4cCI6MjA4OTk3MDg2OX0.3Dj0nr9JSCyayiv8vZVxkfyOLabV9tO_ih6cTFXlRFs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStudent() {
  const cpf = '21689666803';
  console.log(`Checking student ${cpf} after unpausing...`);
  
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, status, role')
    .eq('cpf', cpf)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') {
      console.log('Student not found in profiles table.');
    } else {
      console.error('Error:', error.message);
    }
  } else {
    console.log('Student found:', JSON.stringify(data, null, 2));
  }
}

checkStudent();
