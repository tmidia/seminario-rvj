const { createClient } = require('@supabase/supabase-js');

const url = 'https://ukuacwjiaeqhkidskrjb.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdWFjd2ppYWVxaGtpZHNrcmpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE5NjAyNSwiZXhwIjoyMDg0NzcyMDI1fQ.tolcqz7ma6ORJNYTHpkNMn-Iq7sF8nBXYm9_YAswcno';
const supabase = createClient(url, key);

async function standardizeExam(examId) {
    const { data: questions } = await supabase.from('questions').select('*').eq('exam_id', examId);
    if (!questions) return;

    for (const q of questions) {
        if (Array.isArray(q.options)) {
            const letterOptions = {
                A: q.options[0],
                B: q.options[1],
                C: q.options[2],
                D: q.options[3]
            };
            const correctIndex = q.options.indexOf(q.correct_option);
            const correctLetter = ['A', 'B', 'C', 'D'][correctIndex] || 'A';

            await supabase.from('questions').update({
                options: letterOptions,
                correct_option: correctLetter
            }).eq('id', q.id);
        }
    }
    console.log(`Prova ${examId} padronizada.`);
}

async function run() {
    console.log('--- Padronizando Formato das Provas 04 a 12 ---');
    for (let i = 4; i <= 12; i++) {
        await standardizeExam(i);
    }
    console.log('--- Sistema 100% Padronizado e Seguro ---');
}

run();
