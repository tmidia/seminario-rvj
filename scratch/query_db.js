const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ukuacwjiaeqhkidskrjb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdWFjd2ppYWVxaGtpZHNrcmpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE5NjAyNSwiZXhwIjoyMDg0NzcyMDI1fQ.tolcqz7ma6ORJNYTHpkNMn-Iq7sF8nBXYm9_YAswcno';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('--- SUBJECTS ---');
  const { data: subjects, error: subjError } = await supabase.from('subjects').select('*');
  if (subjError) console.error(subjError);
  else console.log(JSON.stringify(subjects, null, 2));

  console.log('--- EXAMS ---');
  const { data: exams, error: examError } = await supabase.from('exams').select('*');
  if (examError) console.error(examError);
  else console.log(JSON.stringify(exams, null, 2));
}

checkData();
