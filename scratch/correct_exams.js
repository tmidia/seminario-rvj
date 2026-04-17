const { createClient } = require('@supabase/supabase-js');

const url = 'https://ukuacwjiaeqhkidskrjb.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdWFjd2ppYWVxaGtpZHNrcmpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE5NjAyNSwiZXhwIjoyMDg0NzcyMDI1fQ.tolcqz7ma6ORJNYTHpkNMn-Iq7sF8nBXYm9_YAswcno';
const supabase = createClient(url, key);

async function run() {
    console.log('--- Iniciando Auditoria e Correção ---');

    // 1. Refazer Prova 1 (Fundamentos da Doutrina)
    console.log('Atualizando Prova 1...');
    await supabase.from('questions').delete().eq('exam_id', 1);

    const q1 = [
        {
            exam_id: 1,
            text: 'No sentido bíblico, como pode ser definido o termo "doutrina"?',
            options: {
                A: 'Um conjunto de regras políticas do estado',
                B: 'Ensino bíblico da Palavra de Deus que orienta o cristão',
                C: 'Uma tradição oral sem base nas escrituras',
                D: 'Apenas um conjunto de costumes locais'
            },
            correct_option: 'B',
            points: 10,
            order_index: 1
        },
        {
            exam_id: 1,
            text: 'No Éden, Deus estabeleceu a "Lei Proibitiva". Qual era o dever imposto ao homem?',
            options: {
                A: 'Frutificar e multiplicar',
                B: 'Dominar sobre os peixes e aves',
                C: 'Não comer da árvore da ciência do bem e do mal',
                D: 'Trabalhar a terra para subsistência'
            },
            correct_option: 'C',
            points: 10,
            order_index: 2
        },
        {
            exam_id: 1,
            text: 'A doutrina possui três elementos básicos. O "Elemento Central" define que:',
            options: {
                A: 'O homem é o centro de toda regra',
                B: 'Deus é a fonte originadora das regras',
                C: 'A experiência pessoal é a única fonte',
                D: 'A história secular determina as leis'
            },
            correct_option: 'B',
            points: 10,
            order_index: 3
        },
        {
            exam_id: 1,
            text: 'Sobre os fundamentos da doutrina, o "Princípio da Imutabilidade" ensina que:',
            options: {
                A: 'As regras devem mudar conforme o tempo muda',
                B: 'A doutrina está fincada em alicerces que não mudam',
                C: 'O homem pode alterar a doutrina a qualquer momento',
                D: 'Não há princípios fixos na fé cristã'
            },
            correct_option: 'B',
            points: 10,
            order_index: 4
        },
        {
            exam_id: 1,
            text: 'O que é o "Critério da Concordância" no estudo das doutrinas?',
            options: {
                A: 'Aceitar qualquer ideia popular como verdade',
                B: 'Verificar se a doutrina está de acordo com o pensamento geral das Escrituras',
                C: 'Concordar com opiniões de outros alunos apenas',
                D: 'Seguir apenas o que o diabo interpreta no Éden'
            },
            correct_option: 'B',
            points: 10,
            order_index: 5
        },
        {
            exam_id: 1,
            text: 'Qual das seguintes é classificada pelo texto como uma "Doutrina Essencial" (Primária)?',
            options: {
                A: 'Uso do véu pelas mulheres',
                B: 'Doutrina da Salvação',
                C: 'A saudação com a Paz do Senhor',
                D: 'Cantar hinos apenas da Harpa Cristã'
            },
            correct_option: 'B',
            points: 10,
            order_index: 6
        },
        {
            exam_id: 1,
            text: 'No texto, como o apóstolo Paulo chama os mandamentos que orientam o comportamento cristão?',
            options: {
                A: 'Regras da Ditadura',
                B: 'Ornamento da doutrina de Deus',
                C: 'Doutrinas secundárias',
                D: 'Experiências temporais'
            },
            correct_option: 'B',
            points: 10,
            order_index: 7
        },
        {
            exam_id: 1,
            text: 'Qual a diferença fundamental entre "Doutrina" e "Costume" segundo o estudo?',
            options: {
                A: 'Não há diferença, são sinônimos',
                B: 'A doutrina é baseada na Palavra de Deus; o costume pode ser cultural ou tradicional',
                C: 'O costume é mais importante que a doutrina',
                D: 'Doutrina é apenas para pastores'
            },
            correct_option: 'B',
            points: 10,
            order_index: 8
        },
        {
            exam_id: 1,
            text: 'Sobre o uso do véu em 1 Coríntios 11, o texto recomenda CAUTELA porque se trata de um elemento de valor:',
            options: {
                A: 'Espiritual eterno',
                B: 'Cultural e local da época',
                C: 'Moral universal',
                D: 'Doutrinário essencial'
            },
            correct_option: 'B',
            points: 10,
            order_index: 9
        },
        {
            exam_id: 1,
            text: 'De acordo com o texto, qual o perigo do "Simbologismo"?',
            options: {
                A: 'Respeitar o contexto original',
                B: 'Enfeitar o texto e acrescentar significados que ele não permite',
                C: 'Usar a Bíblia como única regra de fé',
                D: 'Diferenciar corretamente doutrina de costume'
            },
            correct_option: 'B',
            points: 10,
            order_index: 10
        }
    ];

    await supabase.from('questions').insert(q1);

    // 2. Ajustar Prova 2 (Hermenêutica)
    console.log('Ajustando Prova 2...');

    // Questão 12 original era sobre princípio número 1
    await supabase.from('questions').update({
        text: 'No campo da interpretação, o que significa o "Distanciamento Temporal"?',
        options: {
            A: 'A Bíblia foi escrita em um tempo diferente do nosso tempo atual',
            B: 'A distância física entre o Brasil e Israel',
            C: 'A diferença linguística entre português e latim',
            D: 'O tempo que o aluno leva para ler o texto'
        },
        correct_option: 'A'
    }).eq('id', 12);

    // Questão 17 original era sobre Gênero Apocalíptico
    await supabase.from('questions').update({
        text: 'O que caracteriza a figura de linguagem "Hipérbole" muito comum na Bíblia?',
        options: {
            A: 'Uma comparação direta entre dois seres',
            B: 'Um exagero proposital para dar ênfase a uma lição',
            C: 'Atribuição de sentimentos humanos a árvores',
            D: 'Uma profecia sobre o fim dos tempos'
        },
        correct_option: 'B'
    }).eq('id', 17);

    // Questão 18 original era sobre Texto sem contexto
    await supabase.from('questions').update({
        text: 'Na estrutura da poesia bíblica, como é definida a rima?',
        options: {
            A: 'Rima de sons ao final das palavras',
            B: 'Rima de ideias, também chamada de paralelismo',
            C: 'Total ausência de ritmo ou ordem',
            D: 'Repetição exata de parágrafos inteiros'
        },
        correct_option: 'B'
    }).eq('id', 18);

    // Questão 19 original era sobre conjunções
    await supabase.from('questions').update({
        text: 'O que é uma "Citação Extrabíblica" segundo o Capítulo 05?',
        options: {
            A: 'Um versículo do livro de Gênesis',
            B: 'Frases populares comuns que não estão registradas na Bíblia',
            C: 'Uma parábola contada por Jesus',
            D: 'Um mandamento do Decálogo'
        },
        correct_option: 'B'
    }).eq('id', 19);

    // Questão 20 original era sobre línguas clássicas
    await supabase.from('questions').update({
        text: 'No texto, o versículo "Não bebas mais água só, mas usa de um pouco de vinho" é classificado como:',
        options: {
            A: 'Doutrina universal para todos os cristãos',
            B: 'Recomendação particular e contexto cultural da época',
            C: 'Mandamento essencial para salvação',
            D: 'Uma parábola com significado oculto'
        },
        correct_option: 'B'
    }).eq('id', 20);

    // 3. Ajustar Prova 3 (História da Igreja)
    console.log('Ajustando Prova 3...');

    // Questão 26 original era sobre Calvino
    await supabase.from('questions').update({
        text: 'Em que ano e concílio foi ratificado o cânon dos 66 livros da Bíblia?',
        options: {
            A: '325 d.C. no Concílio de Niceia',
            B: '393 d.C. no Concílio de Hipona',
            C: '1517 d.C. no Castelo de Wintemberg',
            D: '1546 d.C. no Concílio de Trento'
        },
        correct_option: 'B'
    }).eq('id', 26);

    // Questão 29 original era sobre John Wesley
    await supabase.from('questions').update({
        text: 'Qual foi o marco inicial das Assembleias de Deus no Rio de Janeiro?',
        options: {
            A: 'A pregação em alto mar no navio Clement',
            B: 'O primeiro culto na casa da família Brito em 1923',
            C: 'A fundação de uma Escola de Guerra',
            D: 'A tradução da Vulgata Latina'
        },
        correct_option: 'B'
    }).eq('id', 29);

    // Questão 30 original era sobre Rua Azusa
    await supabase.from('questions').update({
        text: 'Quem foi um dos principais baluartes da AD no Rio, fundador do Ministério de Madureira?',
        options: {
            A: 'Martinho Lutero',
            B: 'Paulo Leivas Macalão',
            C: 'John Wesley',
            D: 'Constantino'
        },
        correct_option: 'B'
    }).eq('id', 30);

    console.log('--- Correção Finalizada com Sucesso ---');
}

run();
