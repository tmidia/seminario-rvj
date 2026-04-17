const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually load .env.local
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const examsData = [
  {
    subject_id: 37,
    title: "Prova: Epístolas Paulinas",
    questions: [
      { text: "Qual era o nome do Apóstolo Paulo antes de sua conversão no caminho de Damasco?", options: ["Simão", "Saulo de Tarso", "Silas", "Barnabé"], correct_option: "Saulo de Tarso", points: 1 },
      { text: "Qual Epístola é considerada o tratado teológico mais sistemático de Paulo sobre a salvação?", options: ["Romanos", "1 Coríntios", "Filipenses", "2 Timóteo"], correct_option: "Romanos", points: 1 },
      { text: "Em 1 Coríntios, qual é a principal metáfora usada por Paulo para descrever a unidade e diversidade da Igreja?", options: ["O Edifício", "O Corpo de Cristo", "A Videira", "O Rebanho"], correct_option: "O Corpo de Cristo", points: 1 },
      { text: "Qual carta foi escrita por Paulo com o objetivo central de defender a liberdade cristã contra o legalismo?", options: ["Efésios", "Colossenses", "Gálatas", "Tito"], correct_option: "Gálatas", points: 1 },
      { text: "Em qual epístola Paulo descreve a \"armadura de Deus\" para a batalha espiritual?", options: ["Efésios", "Filipenses", "1 Tessalonicenses", "2 Coríntios"], correct_option: "Efésios", points: 1 },
      { text: "Qual epístola, escrita da prisão, é conhecida como a \"Carta da Alegria\"?", options: ["Hebreus", "Filipenses", "Gálatas", "Romanos"], correct_option: "Filipenses", points: 1 },
      { text: "O tema central da Epístola aos Colossenses é refutar heresias enfatizando o quê?", options: ["A volta de Cristo", "A lei judaica", "A supremacia de Cristo", "O Batismo"], correct_option: "A supremacia de Cristo", points: 1 },
      { text: "Quais são as chamadas \"Epístolas Pastorais\"?", options: ["Romanos e Gálatas", "1 e 2 Timóteo e Tito", "Efésios e Filipenses", "1 e 2 Pedro"], correct_option: "1 e 2 Timóteo e Tito", points: 1 },
      { text: "Em 2 Timóteo, Paulo afirma ter combatido o bom combate e guardado o quê?", options: ["O tesouro", "A fé", "O rebanho", "A lei"], correct_option: "A fé", points: 1 },
      { text: "Segundo 2 Pedro 3:15-16, a quem as cartas de Paulo são equiparadas em autoridade?", options: ["Aos hinos cristãos", "Às outras Escrituras", "Aos conselhos humanos", "Aos escritos de Sócrates"], correct_option: "Às outras Escrituras", points: 1 }
    ]
  },
  {
    subject_id: 38,
    title: "Prova: Escatologia",
    questions: [
      { text: "Qual a definição etimológica do termo \"Escatologia\"?", options: ["Estudo das almas", "Estudo dos últimos eventos", "Estudo da criação", "Estudo das línguas"], correct_option: "Estudo dos últimos eventos", points: 1 },
      { text: "Segundo Daniel 2:21, quem é descrito como Aquele que \"muda os tempos e as estações; remove reis e estabelece reis\"?", options: ["O Anticristo", "Nabucodonosor", "Deus", "O Arcanjo Miguel"], correct_option: "Deus", points: 1 },
      { text: "Qual a visão escatológica que defende a remoção da Igreja antes do período de 7 anos de sofrimento?", options: ["Pós-tribulacionismo", "Amilenismo", "Pré-tribulacionismo", "Pós-milenismo"], correct_option: "Pré-tribulacionismo", points: 1 },
      { text: "Qual evento central em 1 Tessalonicenses 4:16-17 descreve os fiéis sendo \"levados nas nuvens\"?", options: ["O Juízo Final", "O Arrebatamento", "O Batismo", "A Transfiguração"], correct_option: "O Arrebatamento", points: 1 },
      { text: "De acordo com Apocalipse 20, por quanto tempo durará o reinado de Cristo na terra antes do estado eterno?", options: ["100 anos", "500 anos", "1000 anos (Milênio)", "Para sempre"], correct_option: "1000 anos (Milênio)", points: 1 },
      { text: "Quem são as duas figuras que formam a aliança maligna que enganará as nações no fim dos tempos?", options: ["Faraó e Herodes", "O Anticristo e o Falso Profeta", "Golias e Jezabel", "Judas e Pilatos"], correct_option: "O Anticristo e o Falso Profeta", points: 1 },
      { text: "Onde as Escrituras dizem que ocorrerá o confronto final entre as nações e o exército de Cristo?", options: ["Jerusalém", "Babilônia", "Armagedom", "Egito"], correct_option: "Armagedom", points: 1 },
      { text: "O que o \"Grande Trono Branco\" representa em Apocalipse 20:11-15?", options: ["O Milênio", "O Juízo Final", "O Ceia do Senhor", "O Templo de Salomão"], correct_option: "O Juízo Final", points: 1 },
      { text: "Qual o objetivo final da escatologia segundo a promessa de Deus em Apocalipse 21?", options: ["A destruição total", "Novos Céus e Nova Terra", "O retorno ao Éden", "A dispersão das nações"], correct_option: "Novos Céus e Nova Terra", points: 1 },
      { text: "A \"Segunda Vinda de Cristo\" será caracterizada por qual forma de retorno, segundo Atos 1:11?", options: ["Apenas espiritual", "Invisível ao olho humano", "Visível e físico", "Por meio de reencarnação"], correct_option: "Visível e físico", points: 1 }
    ]
  },
  {
    subject_id: 39,
    title: "Prova: Família Cristã",
    questions: [
      { text: "Segundo o livro de Gênesis, quem instituiu a família como a primeira célula da sociedade?", options: ["Adão", "Moisés", "Deus", "A Igreja"], correct_option: "Deus", points: 1 },
      { text: "Qual é o fundamento bíblico do casamento segundo Gênesis 2:24?", options: ["Acordo financeiro", "União entre um homem e uma mulher", "Apenas tradição social", "Convivência temporária"], correct_option: "União entre um homem e uma mulher", points: 1 },
      { text: "No contexto dos papéis familiares, quem é exortado a amar a esposa como Cristo amou a Igreja?", options: ["Os filhos", "O marido", "O pastor", "O vizinho"], correct_option: "O marido", points: 1 },
      { text: "Qual é a responsabilidade dos pais em relação aos filhos, conforme Efésios 6:4?", options: ["Provocá-los à ira", "Criá-los na instrução e conselho do Senhor", "Deixá-los agir livremente", "Delegar a educação apenas à escola"], correct_option: "Criá-los na instrução e conselho do Senhor", points: 1 },
      { text: "De acordo com o Decálogo (Êxodo 20), qual é o mandamento com promessa dirigido aos filhos?", options: ["Não matar", "Honrar pai e mãe", "Não furtar", "Santificar o sábado"], correct_option: "Honrar pai e mãe", points: 1 },
      { text: "Qual é o principal \"ingrediente\" para a resolução de conflitos na família, segundo Colossenses 3:13-14?", options: ["O domínio próprio", "O perdão e o amor", "A imposição de regras", "O silêncio"], correct_option: "O perdão e o amor", points: 1 },
      { text: "A Bíblia ensina que a família deve ser um lugar de qual prioridade espiritual?", options: ["Adoração e serviço a Deus", "Busca por riqueza", "Isolamento social", "Apenas lazer"], correct_option: "Adoração e serviço a Deus", points: 1 },
      { text: "Em Provérbios, qual é a ferramenta essencial recomendada para a instrução da sabedoria no lar?", options: ["A disciplina com amor", "A ausência de limites", "O entretenimento excessivo", "A competitividade entre irmãos"], correct_option: "A disciplina com amor", points: 1 },
      { text: "Qual deve ser a base da autoridade no lar cristão?", options: ["A força física", "A Palavra de Deus", "A vontade do filho", "A opinião pública"], correct_option: "A Palavra de Deus", points: 1 },
      { text: "Segundo a Teologia Bíblica, a família é um reflexo de qual relacionamento divino?", options: ["Do sol com a lua", "De Cristo com Sua Igreja", "Das estrelas com o céu", "Da natureza com o homem"], correct_option: "De Cristo com Sua Igreja", points: 1 }
    ]
  },
  {
    subject_id: 40,
    title: "Prova: História de Israel",
    questions: [
      { text: "Quem foi o líder escolhido por Deus para conduzir Israel na conquista da Terra Prometida após a morte de Moisés?", options: ["Calebe", "Josué", "Gideão", "Arão"], correct_option: "Josué", points: 1 },
      { text: "Qual foi a primeira cidade conquistada pelos israelitas de forma sobrenatural em Canaã?", options: ["Ai", "Jericó", "Jerusalém", "Belém"], correct_option: "Jericó", points: 1 },
      { text: "O episódio da derrota em Ai (Josué 7) ensina que o pecado de um indivíduo pode afetar o quê?", options: ["Apenas a ele mesmo", "Toda a comunidade", "Somente sua família", "Nada, pois Deus não vê"], correct_option: "Toda a comunidade", points: 1 },
      { text: "Qual era o principal objetivo de Deus ao ordenar a Israel que possuísse a terra de Canaã?", options: ["Torná-los ricos", "Cumprir a promessa feita aos patriarcas", "Expandir o Império Egípcio", "Destruir sem motivo"], correct_option: "Cumprir a promessa feita aos patriarcas", points: 1 },
      { text: "Quem era a mulher que ajudou os espiões e foi poupada na destruição de Jericó?", options: ["Rute", "Raabe", "Débora", "Ester"], correct_option: "Raabe", points: 1 },
      { text: "Como pode ser definido o período de Israel relatado no livro de Juízes?", options: ["Um período de paz constante", "Ciclos de desobediência, opressão e libertação", "O auge da monarquia israelita", "A escravidão no Egito"], correct_option: "Ciclos de desobediência, opressão e libertação", points: 1 },
      { text: "Quem foi o último juiz e o primeiro profeta a ungir um rei em Israel?", options: ["Samuel", "Sansão", "Eli", "Saul"], correct_option: "Samuel", points: 1 },
      { text: "Qual rei consolidou o reino e estabeleceu Jerusalém como a capital e centro de adoração?", options: ["Robson", "Davi", "Salomão", "Saul"], correct_option: "Davi", points: 1 },
      { text: "O que causou a divisão do Reino de Israel em Norte e Sul após a morte de Salomão?", options: ["Invasão de alienígenas", "O peso dos impostos e a rebeldia de Roboão", "Uma inundação", "O excesso de ouro"], correct_option: "O peso dos impostos e a rebeldia de Roboão", points: 1 },
      { text: "Qual império destruiu o Reino do Norte (Israel) e dispersou suas dez tribos em 722 a.C.?", options: ["Império Romano", "Império Assírio", "Império Babilônico", "Império Persa"], correct_option: "Império Assírio", points: 1 }
    ]
  },
  {
    subject_id: 41,
    title: "Prova: Ética Cristã",
    questions: [
      { text: "Qual é a raiz etimológica do termo \"Ética\" e o que ele originalmente significava?", options: ["Ethos (caráter ou costume)", "Logos (estudo)", "Nomos (lei)", "Pathos (sentimento)"], correct_option: "Ethos (caráter ou costume)", points: 1 },
      { text: "Para o cristão, qual é o fundamento supremo da ética e da moralidade?", options: ["O código civil", "O caráter de Deus revelado nas Escrituras", "A opinião da maioria", "A tradição cultural"], correct_option: "O caráter de Deus revelado nas Escrituras", points: 1 },
      { text: "No Antigo Testamento, qual documento serve de base para a ética judaico-cristã?", options: ["O livro de Ester", "Crônicas", "O Decálogo (Os Dez Mandamentos)", "Provérbios"], correct_option: "O Decálogo (Os Dez Mandamentos)", points: 1 },
      { text: "No Novo Testamento, qual ensinamento de Jesus é considerado a \"magna carta\" da ética cristã?", options: ["Parábola do Filho Pródigo", "O Sermão do Monte", "A multiplicação dos pães", "A cura do cego"], correct_option: "O Sermão do Monte", points: 1 },
      { text: "Qual é o \"grande mandamento\" mencionado por Jesus que resume toda a Lei e os Profetas?", options: ["Não matar", "Amar a Deus sobre todas as coisas e ao próximo como a si mesmo", "Santificar o sábado", "Pagar os impostos"], correct_option: "Amar a Deus sobre todas as coisas e ao próximo como a si mesmo", points: 1 },
      { text: "A ética cristã se diferencia de uma ética relativa por ser baseada em quê?", options: ["Valores que mudam com o tempo", "Absolutos bíblicos eternos", "Desejos pessoais", "Conveniência política"], correct_option: "Absolutos bíblicos eternos", points: 1 },
      { text: "Segundo a ética cristã, qual deve ser a motivação principal de toda ação do crente?", options: ["Medo da punição", "Busca por reconhecimento", "O amor a Deus e a glória de Seu nome", "Ganho financeiro"], correct_option: "O amor a Deus e a glória de Seu nome", points: 1 },
      { text: "Como a ética cristã vê o relacionamento do crente com as autoridades governamentais, segundo Romanos 13?", options: ["Rebelia constante", "Submissão e respeito dentro dos limites da lei de Deus", "Indiferença total", "Busca pelo poder político"], correct_option: "Submissão e respeito dentro dos limites da lei de Deus", points: 1 },
      { text: "Qual virtude é essencial na ética cristã para lidar com as falhas do próximo?", options: ["O julgamento severo", "O perdão", "A vingança", "O distanciamento"], correct_option: "O perdão", points: 1 },
      { text: "A ética cristã exige integridade apenas em público ou também no privado?", options: ["Apenas em público para dar testemunho", "Em ambas, pois Deus vê o coração", "Apenas na igreja", "No privado não importa"], correct_option: "Em ambas, pois Deus vê o coração", points: 1 }
    ]
  },
  {
    subject_id: 42,
    title: "Prova: Epístolas Universais",
    questions: [
      { text: "Por que as epístolas de Hebreus a Judas são chamadas de \"Universais\" ou \"Católicas\"?", options: ["Porque foram escritas em Roma", "Porque não eram dirigidas a uma igreja específica, mas à igreja em geral", "Porque foram escritas por Paulo", "Porque tratam apenas de assuntos sociais"], correct_option: "Porque não eram dirigidas a uma igreja específica, mas à igreja em geral", points: 1 },
      { text: "Qual é o tema central da Epístola aos Hebreus?", options: ["A construção do Tabernáculo", "A superioridade de Cristo sobre os anjos, Moisés e o sacerdócio antigo", "A história dos reis de Judá", "A viagem de Paulo a Roma"], correct_option: "A superioridade de Cristo sobre os anjos, Moisés e o sacerdócio antigo", points: 1 },
      { text: "Em Hebreus 11, encontramos a lista de personagens bíblicos conhecida como o quê?", options: ["Galeria dos Apóstolos", "Heróis da Fé", "Lista dos Profetas", "Juízes de Israel"], correct_option: "Heróis da Fé", points: 1 },
      { text: "Qual o foco principal da Epístola de Tiago em relação à vida cristã?", options: ["Apenas a teoria escatológica", "A prática da fé e a relação entre fé e obras", "A construção do Templo", "A genealogia de Cristo"], correct_option: "A prática da fé e a relação entre fé e obras", points: 1 },
      { text: "Segundo 1 Pedro, qual deve ser a atitude do cristão diante do sofrimento e da perseguição?", options: ["Revolta contra Deus", "Esperança e firmeza em Cristo", "Negar a fé", "Fugir de todas as responsabilidades"], correct_option: "Esperança e firmeza em Cristo", points: 1 },
      { text: "Qual é o principal alerta de 2 Pedro e da Epístola de Judas?", options: ["Contra o excesso de oração", "Contra falsos mestres e a apostasia", "Contra a leitura dos Salmos", "Contra o batismo"], correct_option: "Contra falsos mestres e a apostasia", points: 1 },
      { text: "Nas epístolas de João (1, 2 e 3 João), qual é a palavra-chave que define a natureza de Deus e a vida do crente?", options: ["Poder", "Amor", "Lei", "Dinheiro"], correct_option: "Amor", points: 1 },
      { text: "Como a primeira epístola de João nos ensina a provar se realmente conhecemos a Deus?", options: ["Se falamos muitas línguas", "Se guardamos os Seus mandamentos e amamos os irmãos", "Se somos ricos", "Se conhecemos toda a história grega"], correct_option: "Se guardamos os Seus mandamentos e amamos os irmãos", points: 1 },
      { text: "A epístola de Judas exorta os cristãos a fazer o quê em relação à fé?", options: ["Esquecê-la", "Batalhar diligentemente pela fé que uma vez foi entregue", "Guardá-la apenas para si", "Mudá-la conforme a cultura"], correct_option: "Batalhar diligentemente pela fé que uma vez foi entregue", points: 1 },
      { text: "Qual é o \"Sumo Pastor\" mencionado em 1 Pedro que recompensará os líderes fiéis?", options: ["Pedro", "Moisés", "Jesus Cristo", "Davi"], correct_option: "Jesus Cristo", points: 1 }
    ]
  },
  {
    subject_id: 43,
    title: "Prova: Livros Históricos",
    questions: [
      { text: "No livro de Juízes, qual é o padrão repetitivo (ciclo) que Israel vivenciava?", options: ["Prosperidade constante", "Pecado, escravidão, clamor e libertação por um juiz", "Mudança de idioma", "Construção de pirâmides"], correct_option: "Pecado, escravidão, clamor e libertação por um juiz", points: 1 },
      { text: "Qual personagem dos livros históricos é conhecida por sua lealdade à sogra Noemi e por se tornar bisavó do Rei Davi?", options: ["Ester", "Rute", "Débora", "Dalila"], correct_option: "Rute", points: 1 },
      { text: "Quem foi o primeiro rei de Israel, ungido pelo profeta Samuel, que acabou sendo rejeitado por Deus?", options: ["Davi", "Saul", "Salomão", "Roboão"], correct_option: "Saul", points: 1 },
      { text: "Por que o Rei Davi é chamado de \"um homem segundo o coração de Deus\"?", options: ["Porque ele nunca pecou", "Devido à sua sinceridade de arrependimento e desejo de agradar a Deus", "Porque ele era muito rico", "Porque ele construiu o Templo"], correct_option: "Devido à sua sinceridade de arrependimento e desejo de agradar a Deus", points: 1 },
      { text: "Qual rei de Israel foi famoso por sua sabedoria e pela construção do primeiro Templo em Jerusalém?", options: ["Ezequias", "Salomão", "Acabe", "Josias"], correct_option: "Salomão", points: 1 },
      { text: "O que aconteceu com o Reino de Israel após a morte de Salomão?", options: ["Tornou-se o maior império do mundo", "Dividiu-se em Reino do Norte (Israel) e Reino do Sul (Judá)", "Foi completamente destruído por um terremoto", "Unificou-se com o Egito"], correct_option: "Dividiu-se em Reino do Norte (Israel) e Reino do Sul (Judá)", points: 1 },
      { text: "Quais foram os dois profetas principais que confrontaram a idolatria nos livros de Reis?", options: ["Isaías e Jeremias", "Elias e Eliseu", "Daniel e Ezequiel", "Amós e Oséias"], correct_option: "Elias e Eliseu", points: 1 },
      { text: "Qual império levou o Reino de Judá para o cativeiro por 70 anos e destruiu Jerusalém em 586 a.C.?", options: ["Assírio", "Babilônico", "Romano", "Grego"], correct_option: "Babilônico", points: 1 },
      { text: "Quais líderes foram fundamentais no retorno do exílio para a reconstrução do Templo e dos muros de Jerusalém?", options: ["Saul e Jónatas", "Esdras e Neemias", "Sansão e Gideão", "Josué e Calebe"], correct_option: "Esdras e Neemias", points: 1 },
      { text: "Qual é a principal lição teológica dos Livros Históricos em relação à aliança de Deus com Israel?", options: ["Deus é indiferente", "A fidelidade a Deus traz bênção, e a desobediência traz juízo", "A história não tem sentido", "O exército mais forte sempre vence"], correct_option: "A fidelidade a Deus traz bênção, e a desobediência traz juízo", points: 1 }
    ]
  },
  {
    subject_id: 44,
    title: "Prova: Livros Poéticos",
    questions: [
      { text: "Qual é o tema central do livro de Jó?", options: ["A construção de Israel", "O sofrimento do justo e a soberania de Deus", "Regras de etiqueta", "A saída do Egito"], correct_option: "O sofrimento do justo e a soberania de Deus", points: 1 },
      { text: "O livro de Salmos é dividido em quantos livros internos e qual o seu principal propósito?", options: ["5 livros; Adoração, oração e louvor a Deus", "10 livros; Contar a história dos reis", "2 livros; Ensinar leis civis", "Não tem divisão; É um livro de piadas"], correct_option: "5 livros; Adoração, oração e louvor a Deus", points: 1 },
      { text: "Segundo Provérbios 1:7, o que é \"o princípio da sabedoria\"?", options: ["Estudar em grandes universidades", "O temor do Senhor", "Ter muito dinheiro", "Viajar pelo mundo"], correct_option: "O temor do Senhor", points: 1 },
      { text: "Qual o tema principal do livro de Eclesiastes e sua conclusão final?", options: ["A busca pelo prazer; aproveite a vida", "A vaidade das coisas terrenas e que o dever do homem é temer a Deus", "A história da criação", "O fim do mundo"], correct_option: "A vaidade das coisas terrenas e que o dever do homem é temer a Deus", points: 1 },
      { text: "O livro de Cantares de Salomão (Cântico dos Cânticos) celebra qual tipo de relacionamento?", options: ["Amizade entre soldados", "O amor e o compromisso no casamento", "A relação entre patrão e servo", "O amor pela natureza"], correct_option: "O amor e o compromisso no casamento", points: 1 },
      { text: "A poesia hebraica é caracterizada principalmente pelo quê, em vez de rimas?", options: ["Metros fixos musicais", "Paralelismo de ideias", "Uso excessivo de adjetivos", "Ausência de verbos"], correct_option: "Paralelismo de ideias", points: 1 },
      { text: "Em Jó, qual a resposta final de Deus aos questionamentos de Jó?", options: ["Ele explica cada detalhe do porquê do sofrimento", "Ele revela Sua majestade e sabedoria na criação", "Ele pede desculpas a Jó", "Ele não responde"], correct_option: "Ele revela Sua majestade e sabedoria na criação", points: 1 },
      { text: "Qual Salmo é conhecido como o \"Salmo do Pastor\", declarando que \"O Senhor é o meu pastor e nada me faltará\"?", options: ["Salmo 91", "Salmo 23", "Salmo 119", "Salmo 1"], correct_option: "Salmo 23", points: 1 },
      { text: "O livro de Provérbios foi escrito principalmente por quem, segundo o próprio texto?", options: ["Davi", "Salomão", "Moisés", "Isaías"], correct_option: "Salomão", points: 1 },
      { text: "Qual livro poético foca na inutilidade de uma vida vivida \"debaixo do sol\" sem Deus?", options: ["Salmos", "Eclesiastes", "Cantares", "Jó"], correct_option: "Eclesiastes", points: 1 }
    ]
  },
  {
    subject_id: 45,
    title: "Prova: O Pentateuco",
    questions: [
      { text: "Quais são os cinco primeiros livros da Bíblia que compõem o Pentateuco (ou Torá)?", options: ["Josué a Rute", "Gênesis, Êxodo, Levítico, Números e Deuteronômio", "Mateus a Atos", "Isaías a Daniel"], correct_option: "Gênesis, Êxodo, Levítico, Números e Deuteronômio", points: 1 },
      { text: "Qual é o tema central do livro de Gênesis?", options: ["A saída do Egito", "As origens do mundo, da humanidade e do povo de Israel", "As leis dos sacrifícios", "A construção do Templo"], correct_option: "As origens do mundo, da humanidade e do povo de Israel", points: 1 },
      { text: "No livro de Êxodo, qual é o evento central que marca a libertação de Israel do Egito?", options: ["O Dilúvio", "A travessia do Mar Vermelho sob a liderança de Moisés", "A queda de Jericó", "O nascimento de Sansão"], correct_option: "A travessia do Mar Vermelho sob a liderança de Moisés", points: 1 },
      { text: "Qual livro do Pentateuco foca detalhadamente na santidade de Deus e nos rituais de sacrifício?", options: ["Levítico", "Números", "Gênesis", "Provérbios"], correct_option: "Levítico", points: 1 },
      { text: "O livro de Números recebe este nome principalmente devido a quê?", options: ["Ao grande número de milagres", "Aos recenseamentos (contagem) do povo no deserto", "Ao número de leis civis", "Ao número de páginas"], correct_option: "Aos recenseamentos (contagem) do povo no deserto", points: 1 },
      { text: "Qual é o significado do nome do livro \"Deuteronômio\"?", options: ["Segunda Lei (Repetição da Lei de Deus)", "Primeira Promessa", "O fim do deserto", "A glória de Moisés"], correct_option: "Segunda Lei (Repetição da Lei de Deus)", points: 1 },
      { text: "Quem é tradicionalmente reconhecido como o autor do Pentateuco?", options: ["Davi", "Moisés", "Abraão", "Samuel"], correct_option: "Moisés", points: 1 },
      { text: "Em qual livro do Pentateuco encontramos o relato sobre os patriarcas Abraão, Isaque e Jacó?", options: ["Êxodo", "Gênesis", "Levítico", "Deuteronômio"], correct_option: "Gênesis", points: 1 },
      { text: "O \"Tabernáculo\", a tenda móvel de adoração, teve suas instruções de construção dadas em qual livro?", options: ["Gênesis", "Êxodo", "Cantares", "Salmos"], correct_option: "Êxodo", points: 1 },
      { text: "Qual o propósito de Deus ao dar a Lei no Monte Sinai, conforme o Pentateuco?", options: ["Aprisionar o povo", "Revelar Sua santidade e guiar o povo em uma vida de obediência", "Separar as famílias", "Mostrar que Deus é apenas juiz"], correct_option: "Revelar Sua santidade e guiar o povo em uma vida de obediência", points: 1 }
    ]
  },
  {
    subject_id: 46,
    title: "Prova: Os Evangelhos e Atos",
    questions: [
      { text: "Quais são os quatro Evangelhos e o que eles narram?", options: ["Mateus, Marcos, Lucas e João; narram a vida e o ministério de Jesus", "Atos, Romanos, Timóteo e Tito; narram as viagens de Paulo", "Salmos a Cantares; narram orações", "Êxodo a Deuteronômio; narram leis"], correct_option: "Mateus, Marcos, Lucas e João; narram a vida e o ministério de Jesus", points: 1 },
      { text: "Quais são conhecidos como os \"Evangelhos Sinóticos\" devido à sua estrutura semelhante?", options: ["Mateus, Marcos e João", "Mateus, Marcos e Lucas", "Lucas e Atos", "Todos os quatros"], correct_option: "Mateus, Marcos e Lucas", points: 1 },
      { text: "Em qual Evangelho Jesus é apresentado enfaticamente como o Messias e o Rei que cumpre as profecias do Antigo Testamento?", options: ["Mateus", "João", "Marcos", "Atos"], correct_option: "Mateus", points: 1 },
      { text: "Qual livro é a continuação do Evangelho de Lucas e narra o nascimento da Igreja?", options: ["Romanos", "Atos dos Apóstolos", "Hebreus", "Apocalipse"], correct_option: "Atos dos Apóstolos", points: 1 },
      { text: "O livro de Atos destaca qual figura divina agindo poderosamente no início da Igreja?", options: ["O Anjo Gabriel", "O Espírito Santo", "Moisés", "Elias"], correct_option: "O Espírito Santo", points: 1 },
      { text: "Qual evento em Jerusalém, relatado em Atos 2, marca o batismo no Espírito Santo coletivo dos discípulos?", options: ["O Cenáculo", "O Dia de Pentecostes", "A crucificação", "A Transfiguração"], correct_option: "O Dia de Pentecostes", points: 1 },
      { text: "Quem foi o principal missionário aos gentios nas narrativas de Atos dos Apóstolos?", options: ["Pedro", "Tiago", "Saulo de Tarso (Paulo)", "João Batista"], correct_option: "Saulo de Tarso (Paulo)", points: 1 },
      { text: "No Evangelho de João, qual o principal objetivo declarado do autor ao escrever o livro?", options: ["Contar uma história divertida", "Para que creiais que Jesus é o Cristo, o Filho de Deus, e tenhais vida", "Explicar a política de Roma", "Listar genealogias"], correct_option: "Para que creiais que Jesus é o Cristo, o Filho de Deus, e tenhais vida", points: 1 },
      { text: "Em Atos 1:8, qual é a promessa feita aos discípulos para que sejam testemunhas em todo o mundo?", options: ["Fama e prestígio", "Recebereis poder, ao descer sobre vós o Espírito Santo", " Muitos tesouros materiais", "Ausência de sofrimento"], correct_option: "Recebereis poder, ao descer sobre vós o Espírito Santo", points: 1 },
      { text: "Qual Evangelho foca no aspecto de Jesus como o \"Servo Sofredor\" que veio para servir e dar a vida?", options: ["João", "Mateus", "Marcos", "Lucas"], correct_option: "Marcos", points: 1 }
    ]
  },
  {
    subject_id: 47,
    title: "Prova: Profetas – Maiores e Menores",
    questions: [
      { text: "Qual era a principal função dos profetas em Israel e Judá?", options: ["Prever apenas o futuro distante", "Ser mensageiros de Deus chamando o povo ao arrependimento e fidelidade", "Arrecadar impostos para o rei", "Cantar músicas no Templo"], correct_option: "Ser mensageiros de Deus chamando o povo ao arrependimento e fidelidade", points: 1 },
      { text: "Por que alguns profetas são chamados de \"Maiores\" e outros de \"Menores\"?", options: ["Pela importância da mensagem", "Pela extensão (tamanho) de seus escritos", "Pela idade dos profetas", "Pela altura física"], correct_option: "Pela extensão (tamanho) de seus escritos", points: 1 },
      { text: "Qual profeta é conhecido como o \"Profeta Messiânico\" devido às suas inúmeras profecias sobre a vinda de Cristo?", options: ["Jeremias", "Daniel", "Isaías", "Amós"], correct_option: "Isaías", points: 1 },
      { text: "Jeremias é frequentemente chamado de \"o profeta chorão\" por qual motivo?", options: ["Porque ele não gostava de ser profeta", "Por sua profunda tristeza e lamento pela desobediência e ruína de Jerusalém", "Porque ele tinha problemas de saúde", "Por ser medroso"], correct_option: "Por sua profunda tristeza e lamento pela desobediência e ruína de Jerusalém", points: 1 },
      { text: "Em qual livro profético encontramos a visão do vale de ossos secos que voltam à vida pela Palavra de Deus?", options: ["Ezequiel", "Ageu", "Naum", "Daniel"], correct_option: "Ezequiel", points: 1 },
      { text: "Daniel é um livro profético que contém visões famosas sobre o quê?", options: ["Apenas a história do passado", "Impérios mundiais e o Reino eterno de Deus", "A vida animal", "Técnicas de arquitetura"], correct_option: "Impérios mundiais e o Reino eterno de Deus", points: 1 },
      { text: "Qual profeta menor foi enviado para pregar em Nínive, tentou fugir e acabou sendo engolido por um grande peixe?", options: ["Jonas", "Joel", "Habacuque", "Zacarias"], correct_option: "Jonas", points: 1 },
      { text: "O livro de Zacarias, entre os profetas menores, destaca-se por quais temas?", options: ["Apenas leis civis", "Visões escatológicas e profecias sobre o Messias", "A vida no Egito", "O dilúvio"], correct_option: "Visões escatológicas e profecias sobre o Messias", points: 1 },
      { text: "Qual profeta menor enfatiza a restauração de Israel e a promessa de que Deus derramaria o Seu Espírito sobre toda carne?", options: ["Joel", "Oséias", "Malaquias", "Miqueias"], correct_option: "Joel", points: 1 },
      { text: "O livro de Malaquias encerra o período profético do Antigo Testamento falando sobre qual tema persistente?", options: ["A construção de muros", "A infidelidade do povo e a promessa do mensageiro que prepararia o caminho", "O comércio com o Egito", "A queda de Roma"], correct_option: "A infidelidade do povo e a promessa do mensageiro que prepararia o caminho", points: 1 }
    ]
  },
  {
    subject_id: 48,
    title: "Prova: Teologia Prática",
    questions: [
      { text: "Como pode ser definida a \"Teologia Prática\"?", options: ["O estudo apenas de línguas mortas", "A aplicação dos princípios bíblicos e teológicos na vida cristã e ministerial cotidianas", "A curiosidade sobre anjos", "O estudo da geologia bíblica"], correct_option: "A aplicação dos princípios bíblicos e teológicos na vida cristã e ministerial cotidianas", points: 1 },
      { text: "Qual área da Teologia Prática estuda a preparação e entrega do sermão (pregação)?", options: ["Hermenêutica", "Homilética", "Escatologia", "Missiologia"], correct_option: "Homilética", points: 1 },
      { text: "Em relação ao cuidado pastoral, qual deve ser a principal base para o aconselhamento cristão?", options: ["Tendências puramente seculares", "A Palavra de Deus (Bíblia)", "Apenas a intuição pessoal", "A opinião popular"], correct_option: "A Palavra de Deus (Bíblia)", points: 1 },
      { text: "Qual a importância da \"Missiologia\" para a Igreja contemporânea?", options: ["Serve apenas para arrecadar fundos", "Estuda e incentiva o cumprimento da Grande Comissão de proclamar o Evangelho a todas as nações", "É um estudo histórico sobre cidades", "Estuda apenas a política internacional"], correct_option: "Estuda e incentiva o cumprimento da Grande Comissão de proclamar o Evangelho a todas as nações", points: 1 },
      { text: "No exercício da liderança cristã, qual é o modelo supremo deixado por Jesus?", options: ["A busca pelo poder absoluto", "O modelo de Líder-Servo", "O distanciamento das pessoas", "A riqueza pessoal"], correct_option: "O modelo de Líder-Servo", points: 1 },
      { text: "Qual é o papel das \"Boas Obras\" na vida prática do cristão, segundo a teologia bíblica?", options: ["Servem para comprar o perdão", "São o fruto natural e a evidência de uma fé salvadora autêntica", "Não têm nenhuma importância", "São opcionais"], correct_option: "São o fruto natural e a evidência de uma fé salvadora autêntica", points: 1 },
      { text: "A \"Ética no Ministério\" exige que o líder seja irrepreensível em quais áreas?", options: ["Apenas na pregação no templo", "Em todas as áreas: financeira, moral, espiritual e social", "Apenas perante os superiores", "Apenas quando for conveniente"], correct_option: "Em todas as áreas: financeira, moral, espiritual e social", points: 1 },
      { text: "No contexto da Teologia Prática, o que significa ter uma \"Cidadania do Reino\"?", options: ["Viver de acordo com as leis divinas enquanto testemunha em meio à sociedade", "Isolar-se completamente do mundo", "Buscar privilégios apenas para religiosos", "Ignorar as leis humanas"], correct_option: "Viver de acordo com as leis divinas enquanto testemunha em meio à sociedade", points: 1 },
      { text: "Como a oração é vista na Teologia Prática em relação ao ministério?", options: ["Como um ritual desnecessário", "Como a fonte de poder e comunhão indispensável para todo serviço a Deus", "Como algo que apenas pastores fazem", "Como uma perda de tempo"], correct_option: "Como a fonte de poder e comunhão indispensável para todo serviço a Deus", points: 1 },
      { text: "Qual é o objetivo final da vida cristã prática segundo 1 Coríntios 10:31?", options: ["A felicidade pessoal momentânea", "Fazer tudo para a glória de Deus", "Ser admirado por todos", "Acumular bens materiais"], correct_option: "Fazer tudo para a glória de Deus", points: 1 }
    ]
  }
];

async function seed() {
  console.log("Starting seed...");
  for (const exam of examsData) {
    console.log(`Creating exam: ${exam.title}`);
    const { data: examRecord, error: examError } = await supabase
      .from('exams')
      .insert({
        subject_id: exam.subject_id,
        title: exam.title,
        description: `Avaliação da matéria: ${exam.title.split(': ')[1]}`
      })
      .select()
      .single();

    if (examError) {
      console.error(`Error creating exam ${exam.title}:`, examError);
      continue;
    }

    const questionsToInsert = exam.questions.map((q, index) => ({
      exam_id: examRecord.id,
      text: q.text,
      options: q.options,
      correct_option: q.correct_option,
      points: q.points,
      order_index: index + 1
    }));

    const { error: questionsError } = await supabase
      .from('questions')
      .insert(questionsToInsert);

    if (questionsError) {
      console.error(`Error creating questions for exam ${exam.title}:`, questionsError);
    } else {
      console.log(`Successfully created 10 questions for ${exam.title}`);
    }
  }
  console.log("Seed finished!");
}

seed();
