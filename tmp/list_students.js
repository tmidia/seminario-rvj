const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://fsjroxinzhhjovqeaowp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanJveGluemhoam92cWVhb3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTQ4NjksImV4cCI6MjA4OTk3MDg2OX0.3Dj0nr9JSCyayiv8vZVxkfyOLabV9tO_ih6cTFXlRFs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function listStudents() {
  console.log("Listing some students to help identify the issue...");
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, cpf, status')
    .eq('role', 'aluno')
    .limit(50);
    
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Students found:', JSON.stringify(data, null, 2));
  }
}

listStudents();
