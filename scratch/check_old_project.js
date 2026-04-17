const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fsjroxinzhhjovqeaowp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanJveGluemhoam92cWVhb3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTQ4NjksImV4cCI6MjA4OTk3MDg2OX0.3Dj0nr9JSCyayiv8vZVxkfyOLabV9tO_ih6cTFXlRFs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking OLD project profiles table...");
  const { data, error, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact' });

  if (error) {
    console.error("Error:", error.message);
    return;
  }

  console.log("Total profiles in OLD project:", count);
  const students = data ? data.filter(p => p.role === 'aluno') : [];
  console.log("Number of students (role = 'aluno'):", students.length);
  
  if (students.length > 0) {
    console.log("Sample student from OLD project:", students[0].full_name);
  }
}

check();
