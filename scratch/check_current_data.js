const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fsjroxinzhhjovqeaowp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzanJveGluemhoam92cWVhb3dwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDM5NDg2OSwiZXhwIjoyMDg5OTcwODY5fQ.OGxPZCSmq6TdHx8hhwZK9KuQoBo5WP64AjyMf10p_ls';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExams() {
  console.log('--- EXAMS (1 to 20) ---');
  const { data: exams, error: examError } = await supabase.from('exams').select('*').gte('id', 1).lte('id', 20);
  if (exams) {
    console.log(JSON.stringify(exams, null, 2));
    for (const exam of exams) {
      console.log(`--- QUESTIONS FOR EXAM ${exam.id}: ${exam.title} ---`);
      const { data: questions } = await supabase.from('questions').select('*').eq('exam_id', exam.id);
      console.log(JSON.stringify(questions, null, 2));
    }
  }
}

checkExams();
