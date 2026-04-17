const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Hardcoded for diag since fetch failed before - we'll try to use the ENV directly if we can run it in a way that works
const supabaseUrl = 'https://fsjroxinzhhjovqeaowp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanJveGluemhoam92cWVhb3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzOTQ4NjksImV4cCI6MjA4OTk3MDg2OX0.3Dj0nr9JSCyayiv8vZVxkfyOLabV9tO_ih6cTFXlRFs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAdmins() {
  console.log("Checking for admin users in profiles table...");
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, role, status, id')
    .eq('role', 'admin');
    
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Admins found:', JSON.stringify(data, null, 2));
  }
}

checkAdmins();
