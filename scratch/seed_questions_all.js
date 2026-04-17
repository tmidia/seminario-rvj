const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ukuacwjiaeqhkidskrjb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdWFjd2ppYWVxaGtpZHNrcmpiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTE5NjAyNSwiZXhwIjoyMDg0NzcyMDI1fQ.tolcqz7ma6ORJNYTHpkNMn-Iq7sF8nBXYm9_YAswcno';

const supabase = createClient(supabaseUrl, supabaseKey);

const modules = [
  {
    subject_id: 30,
    title: "Prova Final: Homilética",
    description: "Avaliação sobre a arte e ciência da pregação, focando na preparação e entrega do sermão bíblico.",
    questions: [
      { text: "Qual é a definição etimológica da palavra 'Homilética'?", options: ["A arte de cantar", "A ciência da interpretação", "A arte de preparar e pregar sermões bíblicos", "O estudo das línguas originais"], correct: "A arte de preparar e pregar sermões bíblicos" },
      { text: "Qual a diferença entre Homilética e Eloquência?", options: ["São sinônimos", "Homilética é a pregação cristã; Eloquência é a arte de falar bem em qualquer campo", "Homilética é política; Eloquência é religiosa", "Não há diferença prática"], correct: "Homilética é a pregação cristã; Eloquência é a arte de falar bem em qualquer campo" },
      { text: "De acordo com o texto, qual deve ser a base de todo sermão?", options: ["Experiências pessoais", "Notícias do jornal", "A Palavra de Deus (Bíblia)", "Livros de autoajuda"], correct: "A Palavra de Deus (Bíblia)" },
      { text: "O que caracteriza o 'Sermão Temático'?", options: ["Segue um único versículo", "As divisões derivam do tema, independente do texto bíblico principal", "Analisa uma parábola completa", "Explica uma palavra grega"], correct: "As divisões derivam do tema, independente do texto bíblico principal" },
      { text: "Qual a principal característica do 'Sermão Textual'?", options: ["Baseia-se em um livro inteiro", "As divisões principais são retiradas diretamente das palavras do texto bíblico", "Não usa a Bíblia", "Foca apenas em grandes temas sociais"], correct: "As divisões principais são retiradas diretamente das palavras do texto bíblico" },
      { text: "O que define um 'Sermão Expositivo'?", options: ["Uma palestra sobre ciência", "A explicação detalhada de uma passagem bíblica em seu contexto", "Um sermão sem esboço", "Apenas contar histórias bíblicas"], correct: "A explicação detalhada de uma passagem bíblica em seu contexto" },
      { text: "Quais são as três partes fundamentais de um esboço de sermão?", options: ["Música, Oração e Louvor", "Título, Introdução e Conclusão", "Introdução, Argumentação (Tópicos) e Conclusão/Apelo", "Início, Meio e Fim"], correct: "Introdução, Argumentação (Tópicos) e Conclusão/Apelo" },
      { text: "O que o Pregador deve evitar na 'Introdução' do sermão?", options: ["Ser breve", "Despertar o interesse", "Promessas que não cumprirá no sermão ou ser longo demais", "Citar o texto bíblico"], correct: "Promessas que não cumprirá no sermão ou ser longo demais" },
      { text: "Qual o propósito da 'Conclusão' em uma pregação?", options: ["Apenas terminar o tempo", "Levar o ouvinte a uma decisão ou aplicação prática da mensagem", "Contar uma piada", "Pedir ofertas"], correct: "Levar o ouvinte a uma decisão ou aplicação prática da mensagem" },
      { text: "Segundo o material, qual a importância da oração na Homilética?", options: ["Nenhuma", "É opcional", "É a base espiritual; o sermão deve ser 'preparado no joelho'", "Serve apenas para o final das reuniões"], correct: "É a base espiritual; o sermão deve ser 'preparado no joelho'" }
    ]
  },
  {
    subject_id: 31,
    title: "Prova Final: Seitas e Heresias",
    description: "Avaliação sobre a defesa da fé (Apologética) e identificação de desvios doutrinários.",
    questions: [
      { text: "O que é 'Heresia' no sentido teológico?", options: ["Uma nova religião", "Uma opinião ou escolha contrária à doutrina estabelecida", "Um tipo de música gospel", "Uma tradução da Bíblia"], correct: "Uma opinião ou escolha contrária à doutrina estabelecida" },
      { text: "Qual a definição de 'Apologética'?", options: ["Pedir desculpas por ser cristão", "A defesa racional da fé cristã", "O estudo dos apóstolos", "A história das igrejas"], correct: "A defesa racional da fé cristã" },
      { text: "Quais são os quatro sinais característicos de uma seita mencionados no texto?", options: ["Cantar, orar, ler e pregar", "Adição, Subtração, Multiplicação e Divisão (dos ensinos bíblicos)", "Pobres, ricos, homens e mulheres", "Grécia, Roma, Egito e Israel"], correct: "Adição, Subtração, Multiplicação e Divisão (dos ensinos bíblicos)" },
      { text: "O que significa 'Adição' no contexto de seitas?", options: ["Aumentar o número de membros", "Adicionar livros ou revelações à autoridade da Bíblia", "Somar dízimos", "Colocar mais cadeiras no templo"], correct: "Adicionar livros ou revelações à autoridade da Bíblia" },
      { text: "Como as seitas geralmente praticam a 'Subtração'?", options: ["Retirando móveis da igreja", "Esvaziando as igrejas", "Subtraindo a divindade de Cristo ou a autoridade das Escrituras", "Não pagando impostos"], correct: "Subtraindo a divindade de Cristo ou a autoridade das Escrituras" },
      { text: "O que caracteriza a 'Multiplicação' nas heresias?", options: ["Ter muitos filhos", "Crescer rapidamente", "Multiplicar as exigências para a salvação (obras, regras humanas)", "Fazer muitos eventos"], correct: "Multiplicar as exigências para a salvação (obras, regras humanas)" },
      { text: "Qual o efeito da 'Divisão' promovido pelas seitas?", options: ["Divisão de tarefas", "Partilha de bens", "Causar desunião e exclusivismo religioso ('só nós salvamos')", "Dividir a Bíblia em capítulos"], correct: "Causar desunião e exclusivismo religioso ('só nós salvamos')" },
      { text: "Sobre a 'Trindade', qual o erro comum das seitas?", options: ["Crer em um só Deus", "Negar que existam três pessoas distintas em uma só Divindade", "Crer no Espírito Santo", "Ler o Novo Testamento"], correct: "Negar que existam três pessoas distintas em uma só Divindade" },
      { text: "Por que os 'Mórmons' são considerados uma seita segundo o texto?", options: ["Por causa de suas roupas", "Por usarem o Livro de Mórmon como autoridade superior ou igual à Bíblia", "Por morarem nos EUA", "Por serem missionários"], correct: "Por usarem o Livro de Mórmon como autoridade superior ou igual à Bíblia" },
      { text: "Qual o posicionamento das Testemunhas de Jeová sobre a divindade de Jesus?", options: ["Crer que Ele é Deus", "Negar que Jesus seja Jeová Deus, considerando-o uma criatura", "Jesus não existiu", "Jesus foi apenas um profeta comum"], correct: "Negar que Jesus seja Jeová Deus, considerando-o uma criatura" }
    ]
  },
  {
    subject_id: 32,
    title: "Prova Final: Teologia Sistemática I",
    description: "Estudo organizado das doutrinas bíblicas: Escrituras, Deus e o Homem.",
    questions: [
      { text: "O que é 'Teologia Sistemática'?", options: ["Estudo desorganizado da Bíblia", "A organização das doutrinas bíblicas em um sistema lógico e ordenado", "O estudo apenas do Apocalipse", "Uma lista de versículos aleatórios"], correct: "A organização das doutrinas bíblicas em um sistema lógico e ordenado" },
      { text: "Qual a definição de 'Bibliografia' no contexto teológico?", options: ["Lista de livros de uma biblioteca", "O estudo sobre a origem, inspiração e autoridade da Bíblia", "Escrever um livro", "O índice da Bíblia"], correct: "O estudo sobre a origem, inspiração e autoridade da Bíblia" },
      { text: "O que significa a 'Inspiração Plenária e Verbal' das Escrituras?", options: ["Apenas ideias foram inspiradas", "Deus inspirou cada palavra e a totalidade do texto bíblico", "A Bíblia contém erros", "Os autores escreveram o que queriam"], correct: "Deus inspirou cada palavra e a totalidade do texto bíblico" },
      { text: "Na doutrina de Deus (Teontologia), o que é a 'Onisciência'?", options: ["Poder total", "Presença em todo lugar", "Conhecimento total de todas as coisas (passado, presente, futuro)", "Criar todas as coisas"], correct: "Conhecimento total de todas as coisas (passado, presente, futuro)" },
      { text: "O que define a 'Imutabilidade' de Deus?", options: ["Deus pode mudar de ideia", "Deus não muda em Seu ser, perfeições, propósitos e promessas", "Deus se adapta ao tempo", "Deus evolui com a humanidade"], correct: "Deus não muda em Seu ser, perfeições, propósitos e promessas" },
      { text: "Qual a definição de 'Justiça' de Deus?", options: ["Ato de ser vingativo", "A retitude de Deus em Seus julgamentos e ações conforme Sua Lei", "Deus favorece Seus amigos", "Deus não pune ninguém"], correct: "A retitude de Deus em Seus julgamentos e ações conforme Sua Lei" },
      { text: "Na Antropologia Bíblica, qual a origem do homem?", options: ["Evolução das espécies", "Criação direta e especial de Deus, à Sua imagem e semelhança", "Veio do espaço", "Resultou de uma explosão"], correct: "Criação direta e especial de Deus, à Sua imagem e semelhança" },
      { text: "O que significa o homem ser criado à 'Imagem e Semelhança' de Deus?", options: ["Forma física igual", "Capacidade moral, racional e espiritual de relacionar-se com o Criador", "Ter asas como anjos", "Ser imortal como Deus por natureza"], correct: "Capacidade moral, racional e espiritual de relacionar-se com o Criador" },
      { text: "Qual a consequência imediata da 'Queda' de Adão e Eva?", options: ["Ganharam sabedoria", "Morte espiritual e separação de Deus", "Tornaram-se deuses", "Nada mudou"], correct: "Morte espiritual e separação de Deus" },
      { text: "O que é o 'Pecado Original'?", options: ["O primeiro pecado cometido por uma criança", "A natureza pecaminosa herdada de Adão por toda a humanidade", "Um erro de tradução", "Pecar pela primeira vez na vida"], correct: "A natureza pecaminosa herdada de Adão por toda a humanidade" }
    ]
  },
  {
    subject_id: 33,
    title: "Prova Final: Teologia Sistemática II",
    description: "Estudo das doutrinas de Cristo, Espírito Santo, Salvação e Igreja.",
    questions: [
      { text: "O que estuda a 'Cristologia'?", options: ["A história do cristianismo", "A pessoa, obra e naturezas de Jesus Cristo", "A vida dos anjos", "As festas cristãs"], correct: "A pessoa, obra e naturezas de Jesus Cristo" },
      { text: "Sobre as naturezas de Jesus, o que a Bíblia ensina?", options: ["Jesus era apenas homem", "Jesus era apenas Deus", "Jesus é 100% Deus e 100% Homem (União Hipostática)", "Jesus se tornou Deus após a morte"], correct: "Jesus é 100% Deus e 100% Homem (União Hipostática)" },
      { text: "Qual o significado da 'Expiação' realizada por Cristo?", options: ["Dar um bom exemplo", "O ato de Cristo sofrer o castigo em nosso lugar para reconciliar-nos com Deus", "Um ritual de limpeza", "Uma viagem missionária"], correct: "O ato de Cristo sofrer o castigo em nosso lugar para reconciliar-nos com Deus" },
      { text: "O que estuda a 'Pneumatologia'?", options: ["Estudo dos pneus", "Estudo da pessoa e obra do Espírito Santo", "Estudo das orações", "Estudo das nuvens"], correct: "Estudo da pessoa e obra do Espírito Santo" },
      { text: "O Espírito Santo é uma força ou uma pessoa?", options: ["Uma força impessoal como eletricidade", "Uma Pessoa da Trindade, com atributos de personalidade (vontade, mente, emoção)", "Um sentimento de paz", "Uma energia cósmica"], correct: "Uma Pessoa da Trindade, com atributos de personalidade (vontade, mente, emoção)" },
      { text: "O que é a 'Soteriologia'?", options: ["Estudo do sol", "Doutrina da Salvação", "Doutrina do Inferno", "Doutrina dos Dízimos"], correct: "Doutrina da Salvação" },
      { text: "O que define a 'Justificação' pela fé?", options: ["Tornar-se perfeito sem pecado", "O ato judicial de Deus declarar o pecador justo baseando-se no sacrifício de Cristo", "Fazer muitas boas obras", "Pagar pelos próprios erros"], correct: "O ato judicial de Deus declarar o pecador justo baseando-se no sacrifício de Cristo" },
      { text: "Qual a definição de 'Santificação'?", options: ["Processo de tornar-se um santo de altar", "O processo contínuo de separação do pecado e crescimento à imagem de Cristo", "Ganhar uma auréola", "Fazer um voto de silêncio"], correct: "O processo contínuo de separação do pecado e crescimento à imagem de Cristo" },
      { text: "O que estuda a 'Eclesiologia'?", options: ["Estudo dos prédios", "Doutrina da Igreja (corpo de Cristo)", "Estudo das estrelas", "Estudo das águas"], correct: "Doutrina da Igreja (corpo de Cristo)" },
      { text: "Qual a missão principal da Igreja na terra?", options: ["Arrecadar fundos", "Glorificar a Deus, edificar os crentes e evangelizar o mundo", "Promover festas sociais", "Dominar o governo político"], correct: "Glorificar a Deus, edificar os crentes e evangelizar o mundo" }
    ]
  },
  {
    subject_id: 34,
    title: "Prova Final: Teologia da Liderança",
    description: "Avaliação sobre os princípios bíblicos para o exercício da liderança cristã e ministerial.",
    questions: [
      { text: "Qual a base da liderança cristã segundo o Novo Testamento?", options: ["Poder e Autoritarismo", "Serviço e Humildade (Liderança Serva)", "Riqueza e Status", "Popularidade nas redes sociais"], correct: "Serviço e Humildade (Liderança Serva)" },
      { text: "Segundo o exemplo de Jesus, o que o maior deve fazer?", options: ["Mandar nos outros", "Ser o servo de todos", "Ganhar o maior salário", "Sentar no melhor lugar"], correct: "Ser o servo de todos" },
      { text: "Quais são os requisitos morais fundamentais para um líder citados em 1 Timóteo 3?", options: ["Ser rico e influente", "Irrepreensível, marido de uma só mulher, temperante, sóbrio", "Ter muitos títulos acadêmicos", "Saber lutar"], correct: "Irrepreensível, marido de uma só mulher, temperante, sóbrio" },
      { text: "O que define a 'Integridade' na vida do líder?", options: ["Ser perfeito e nunca errar", "A coerência entre o que se prega e o que se vive (ser inteiro)", "Saber esconder os erros", "Ter boa oratória"], correct: "A coerência entre o que se prega e o que se vive (ser inteiro)" },
      { text: "Sobre a 'Visão' na liderança, qual o seu papel?", options: ["Apenas sonhar coisas impossíveis", "Discernir o propósito de Deus para o grupo e guiar o povo nessa direção", "Imitar outras igrejas", "Criar logotipos bonitos"], correct: "Discernir o propósito de Deus para o grupo e guiar o povo nessa direção" },
      { text: "Como o líder deve lidar com conflitos segundo princípios bíblicos?", options: ["Expulsar quem discordar", "Com diálogo, paciência, verdade em amor e busca pela reconciliação", "Ignorar o problema até que passe", "Gritar mais alto"], correct: "Com diálogo, paciência, verdade em amor e busca pela reconciliação" },
      { text: "O que é a 'Mordomia' na liderança?", options: ["Administrar bem a casa pastoral", "A administração fiel dos talentos, tempo e recursos que Deus confiou", "Ter muitos empregados", "Viver no luxo"], correct: "A administração fiel dos talentos, tempo e recursos que Deus confiou" },
      { text: "Qual a importância da 'Oração' na vida de um líder cristão?", options: ["É opcional se o líder for inteligente", "É a fonte de poder e dependência de Deus para tomar decisões", "Serve apenas para abrir reuniões", "Não tem efeito prático"], correct: "É a fonte de poder e dependência de Deus para tomar decisões" },
      { text: "O que significa 'Delegar' na gestão ministerial?", options: ["Fugir das responsabilidades", "Confiar tarefas a outros, capacitando-os e desenvolvendo novos líderes", "Mandar os outros fazerem o trabalho chato", "Não fazer nada"], correct: "Confiar tarefas a outros, capacitando-os e desenvolvendo novos líderes" },
      { text: "Qual o maior perigo para a liderança mencionado frequentemente?", options: ["Ter muitos membros", "O Orgulho e a autossuficiência", "A falta de dinheiro", "O cansaço físico"], correct: "O Orgulho e a autossuficiência" }
    ]
  },
  {
    subject_id: 35,
    title: "Prova Final: Bibliologia",
    description: "Avaliação sobre a origem, estrutura, cânon e inspiração das Sagradas Escrituras.",
    questions: [
      { text: "Qual a origem etimológica da palavra 'Bíblia'?", options: ["Do latim biblos", "Do grego biblia (livros), plural de biblion", "Do hebraico sefer", "Do aramaico targum"], correct: "Do grego biblia (livros), plural de biblion" },
      { text: "O que significa o termo 'Cânon' em seu sentido original e teológico?", options: ["Uma arma de guerra", "Uma lista de nomes", "Regra ou instrumento de medição; lista de livros reconhecidos como inspirados", "O índice da Bíblia"], correct: "Regra ou instrumento de medição; lista de livros reconhecidos como inspirados" },
      { text: "Qual a importância histórica da cidade de 'Biblos' mencionada no texto?", options: ["Era onde Jesus nasceu", "Era famosa pela fabricação de papiros e evolução da escrita", "Foi onde a Arca da Aliança ficou guardada", "Era a capital do Egito"], correct: "Era famosa pela fabricação de papiros e evolução da escrita" },
      { text: "O que é a 'Septuaginta' (LXX) e por que ela tem esse nome?", options: ["Uma tradução da Bíblia para o Latim por 70 padres", "Uma tradução do Antigo Testamento para o Grego, feita por 72 anciãos judeus", "A lista dos 70 mandamentos", "Um livro escrito por 70 profetas"], correct: "Uma tradução do Antigo Testamento para o Grego, feita por 72 anciãos judeus" },
      { text: "O que são os 'Manuscritos do Mar Morto' (Qumran) e qual sua importância?", options: ["Mapas de tesouros antigos", "Descoberta arqueológica do século XX com manuscritos bíblicos milenares", "Diários dos primeiros cristãos", "Leis romanas gravadas em pedra"], correct: "Descoberta arqueológica do século XX com manuscritos bíblicos milenares" },
      { text: "Conforme o texto, qual a diferença entre 'Revelação Geral' e 'Revelação Especial'?", options: ["Não há diferença", "Geral é através da natureza/história; Especial é através da Palavra Encarnada e Escrita", "Geral é para todos; Especial é só para pastores", "Geral é o Novo Testamento; Especial é o Antigo"], correct: "Geral é através da natureza/história; Especial é através da Palavra Encarnada e Escrita" },
      { text: "No contexto bíblico, o que significa a palavra 'Testamento'?", options: ["Herança de bens materiais", "Último desejo de um morto", "Pacto ou Aliança", "Um tipo de documento jurídico"], correct: "Pacto ou Aliança" },
      { text: "Quais são os dois principais idiomas originais da Bíblia mencionados no Capítulo 1.4?", options: ["Português e Inglês", "Latim e Alemão", "Hebraico (Antigo Testamento) e Grego (Novo Testamento)", "Aramaico e Egípcio"], correct: "Hebraico (Antigo Testamento) e Grego (Novo Testamento)" },
      { text: "O que é a 'Vulgata' latina mencionada no texto?", options: ["Uma versão distorcida da Bíblia", "A tradução da Bíblia para o Latim completada por Jerônimo", "O idioma falado pelos judeus no exílio", "Um tipo de papel resistente"], correct: "A tradução da Bíblia para o Latim completada por Jerônimo" },
      { text: "De acordo com o texto, qual a principal característica do idioma Hebraico?", options: ["É uma língua de reflexão abstrata", "É uma língua pictórica, concreta e direta ('pintada verbalmente')", "É idêntica ao português", "Não possui verbos"], correct: "É uma língua pictórica, concreta e direta ('pintada verbalmente')" }
    ]
  },
  {
    subject_id: 36,
    title: "Prova Final: Teologia do AT",
    description: "Avaliação sobre os fundamentos teológicos, históricos e proféticos do Antigo Testamento.",
    questions: [
      { text: "Como o autor descreve a relação entre o Antigo e o Novo Testamento no prefácio?", options: ["O Antigo é obsoleto e o Novo é o que vale", "O Antigo Testamento é a 'sombra' cujo clímax e realidade estão no Novo", "São livros totalmente diferentes sem conexão", "O Novo Testamento é a sombra do Antigo"], correct: "O Antigo Testamento é a 'sombra' cujo clímax e realidade estão no Novo" },
      { text: "Qual a importância da citação de Jesus em Mateus 4:4 ('Nem só de pão viverá o homem...') no contexto da tentação?", options: ["Jesus estava com muita fome", "Jesus usou o Antigo Testamento (Deuteronômio 8:3) para vencer a tentação", "Jesus queria pão de melhor qualidade", "Jesus estava ensinando sobre alimentação saudável"], correct: "Jesus usou o Antigo Testamento (Deuteronômio 8:3) para vencer a tentação" },
      { text: "Durante o Pentecostes (Atos 2), qual profeta do Antigo Testamento Pedro cita para explicar o derramamento do Espírito Santo?", options: ["Isaías", "Jeremias", "Joel", "Malaquias"], correct: "Joel" },
      { text: "De acordo com o Capítulo 02, como sabemos que existe um único Deus Soberano?", options: ["Através da herança teológica da Lei de Moisés e profetas do AT", "Através de livros de ciência moderna", "Por dedução lógica sem base bíblica", "Através de mitos gregos"], correct: "Através da herança teológica da Lei de Moisés e profetas do AT" },
      { text: "Qual a definição de 'Redenção' apresentada na herança teológica do Antigo Testamento?", options: ["O ato de pagar uma dívida bancária", "A compra de um escravo mediante o pagamento de um preço para obter liberdade", "A construção de um novo templo", "O ato de viajar para Israel"], correct: "A compra de um escravo mediante o pagamento de um preço para obter liberdade" },
      { text: "No debate sobre a criação, qual a interpretação defendida pelo texto para os 'dias' de Gênesis?", options: ["Teoria dos períodos geológicos de milhões de anos", "Teoria dos dias literais (criação imediata)", "O relato é apenas um mito sem tempo definido", "Deus não criou o mundo"], correct: "Teoria dos dias literais (criação imediata)" },
      { text: "Como o autor explica o episódio de Josué onde 'sol e lua pararam'?", options: ["Foi um erro do autor bíblico", "Visão periférica/geográfica (a partir da terra) e não cósmica", "O sol girou em torno da lua", "Foi um eclipse solar total"], correct: "Visão periférica/geográfica (a partir da terra) e não cósmica" },
      { text: "O que é a 'Lei da Dupla Referência' no elemento profético?", options: ["Citar dois versículos ao mesmo tempo", "Quando uma profecia se refere a um personagem imediato e, simultaneamente, projeta-se sobre outro futuro (ex: Rei de Tiro e Satanás)", "Ter dois profetas falando a mesma coisa", "Escrever em dois idiomas"], correct: "Quando uma profecia se refere a um personagem imediato e, simultaneamente, projeta-se sobre outro futuro (ex: Rei de Tiro e Satanás)" },
      { text: "Qual evento histórico de 14 de maio de 1948 é citado como cumprimento da profecia de Isaías 66:8?", options: ["O fim da Segunda Guerra Mundial", "O reconhecimento do Estado de Israel", "A descoberta do petróleo no Oriente Médio", "A fundação da ONU no Brasil"], correct: "O reconhecimento do Estado de Israel" },
      { text: "No vislumbre histórico, o que a 'Serpente de Metal' (Números 21:9) tipifica no Novo Testamento segundo João 3:14?", options: ["O perigo de animais peçonhentos", "O Filho do Homem sendo levantado (Cristo)", "A sabedoria de Moisés", "A construção de ídolos"], correct: "O Filho do Homem sendo levantado (Cristo)" }
    ]
  },
  {
    subject_id: 37,
    title: "Prova Final: Teologia do NT",
    description: "Avaliação sobre os fundamentos teológicos, históricos e doutrinários do Novo Testamento.",
    questions: [
      { text: "De acordo com o Capítulo 01, o que o autor quer dizer quando afirma que o Novo Testamento é o 'Melhor Concerto'?", options: ["Que ele substitui totalmente o Antigo e o invalida", "Que ele é o concerto perfeito e final, vaticinado no Antigo e cumprido em Cristo", "Que ele é apenas um livro de poesias", "Que ele é o melhor em vendas no mundo"], correct: "Que ele é o concerto perfeito e final, vaticinado no Antigo e cumprido em Cristo" },
      { text: "Como o autor explica a frase de Jesus 'Não vim ab-rogar a lei, mas cumprir' (Mateus 5:17)?", options: ["Jesus veio para destruir a lei", "Jesus veio para 'encher completamente', satisfazendo e suprindo o que a lei apontava", "Jesus não se importava com a lei", "A lei era inútil antes de Jesus"], correct: "Jesus veio para 'encher completamente', satisfazendo e suprindo o que a lei apontava" },
      { text: "Qual a divisão básica do Novo Testamento apresentada no Capítulo 02?", options: ["Poesia, História e Música", "Evangelhos, Histórico (Atos), Doutrinário (Epístolas) e Profético (Apocalipse)", "Antigo, Médio e Novo", "Somente Evangelhos e Cartas"], correct: "Evangelhos, Histórico (Atos), Doutrinário (Epístolas) e Profético (Apocalipse)" },
      { text: "A quem foi endereçado o Evangelho de Lucas e qual a sua característica principal?", options: ["Aos judeus, focado na lei", "A Teófilo e à comunidade grega, apresentando Jesus como o Homem Perfeito", "Somente aos romanos, com muitas ações", "Aos anjos que caíram"], correct: "A Teófilo e à comunidade grega, apresentando Jesus como o Homem Perfeito" },
      { text: "Por que o livro de Atos dos Apóstolos é considerado por alguns como 'Atos do Espírito Santo'?", options: ["Porque os apóstolos não faziam nada", "Porque o Espírito Santo é o personagem de maior proeminência, guiando a expansão da Igreja", "Porque foi escrito por um anjo", "Porque não tem história humana"], correct: "Porque o Espírito Santo é o personagem de maior proeminência, guiando a expansão da Igreja" },
      { text: "Na Teologia Paulina, qual o tema central da Epístola aos Romanos?", options: ["Regras sobre alimentação", "A universalidade do pecado e a justiça de Deus através da salvação pela fé", "Instruções para viagens missionárias", "Poesias sobre Roma"], correct: "A universalidade do pecado e a justiça de Deus através da salvação pela fé" },
      { text: "Na Primeira Carta aos Coríntios, qual o objetivo da doutrina bíblica diante dos problemas da igreja?", options: ["Ignorar os erros e focar apenas no louvor", "Corrigir as problemáticas (partidarismo, desordem) e colocar as coisas no devido lugar", "Expulsar todos os membros pecadores", "Fechar a igreja de Corinto"], correct: "Corrigir as problemáticas (partidarismo, desordem) e colocar as coisas no devido lugar" },
      { text: "De acordo com Colossenses (Capítulo 03), quais são as únicas duas práticas cerimoniais ordenadas no NT?", options: ["Dízimo e Oferta", "Batismo nas águas e Santa Ceia", "Lavagem dos pés e unção de óleo", "Casamento e Funerária"], correct: "Batismo nas águas e Santa Ceia" },
      { text: "Qual a principal exortação da Segunda Epístola de Pedro contra os falsos mestres?", options: ["Que eles são pessoas gentis", "Alerta contra 'heresias de perdição' introduzidas encobertamente", "Que a ciência é melhor que a fé", "Que não haverá julgamento para os mestres"], correct: "Alerta contra 'heresias de perdição' introduzidas encobertamente" },
      { text: "No Capítulo 04, qual a lição central da Epístola a Filemon sobre Onésimo?", options: ["Que Filemon deveria punir o escravo", "Amor, perdão e receber Onésimo não mais como escravo, mas como irmão em Cristo", "Que a escravidão é um desejo de Deus", "Que Paulo não gostava de Filemon"], correct: "Amor, perdão e receber Onésimo não mais como escravo, mas como irmão em Cristo" }
    ]
  }
];

async function seed() {
  for (const mod of modules) {
    console.log(`Processing module: ${mod.title}...`);
    
    // 1. Check/Create Exam
    let { data: exam, error: examError } = await supabase
      .from('exams')
      .select('id')
      .eq('subject_id', mod.subject_id)
      .single();

    if (examError && examError.code === 'PGRST116') {
      console.log(`Creating exam for subject ${mod.subject_id}...`);
      const { data: newExam, error: createError } = await supabase
        .from('exams')
        .insert({
          subject_id: mod.subject_id,
          title: mod.title,
          description: mod.description,
          time_limit_minutes: 60,
          is_active: true,
          allowed_courses: [1]
        })
        .select()
        .single();
      
      if (createError) {
        console.error(`Error creating exam:`, createError);
        continue;
      }
      exam = newExam;
    } else if (examError) {
      console.error(`Error checking exam:`, examError);
      continue;
    }

    console.log(`Exam ID for ${mod.title} is ${exam.id}. Inserting questions...`);

    // 2. Insert Questions
    const questionsToInsert = mod.questions.map((q, index) => ({
      exam_id: exam.id,
      text: q.text,
      options: q.options,
      correct_option: q.correct,
      points: 1,
      order_index: index + 1
    }));

    const { error: insertError } = await supabase
      .from('questions')
      .insert(questionsToInsert);

    if (insertError) {
      console.error(`Error inserting questions for ${mod.title}:`, insertError);
    } else {
      console.log(`Successfully inserted 10 questions for ${mod.title}.`);
    }
  }
}

seed().catch(console.error);
