const { createClient } = require('@supabase/supabase-js');

const url = 'https://ukuacwjiaeqhkidskrjb.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdWFjd2ppYWVxaGtpZHNrcmpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE5NjAyNSwiZXhwIjoyMDg0NzcyMDI1fQ.tolcqz7ma6ORJNYTHpkNMn-Iq7sF8nBXYm9_YAswcno';
const supabase = createClient(url, key);

async function run() {
    console.log('--- Aplicando Correção em Questões Cruzadas ---');

    // 1. Substituir a questão 10 da Prova 1 (Fundamentos)
    // Era Simbologismo, agora será sobre Classes de Crentes (Cap 05 do PDF 01)
    console.log('Substituindo questão de Simbologismo na Prova 1...');
    await supabase.from('questions').update({
        text: 'O texto do Módulo 01 define três classes de crentes em relação a usos e costumes. Qual classe é descrita como o "ponto de equilíbrio"?',
        options: {
            A: 'Radicais (Ultraconservadores)',
            B: 'Liberais',
            C: 'Conservadores',
            D: 'Modernistas'
        },
        correct_option: 'C'
    }).eq('exam_id', 1).eq('order_index', 10);

    // 2. Mover a questão de Simbologismo para a Prova 2 (Hermenêutica)
    // Vamos substituir a questão id 20 (vinho) pela de simbologismo para manter a coerência temática
    console.log('Movendo Simbologismo para a Prova 2...');
    await supabase.from('questions').update({
        text: 'De acordo com o Módulo 02 (Hermenêutica), como é chamado o uso exagerado do recurso da simbologia?',
        options: {
            A: 'Exegese',
            B: 'Eisegese',
            C: 'Simbologismo',
            D: 'Hebraísmo'
        },
        correct_option: 'C'
    }).eq('id', 20);

    console.log('--- Correção Finalizada com Sucesso ---');
}

run();
