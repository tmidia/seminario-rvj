-- Bloco 1: Matérias 25 a 28

-- 25: Fundamentos da Doutrina
WITH new_exam AS (
  INSERT INTO exams (subject_id, title, description, time_limit_minutes, is_active, allowed_courses)
  VALUES (
    25, 
    'Prova Final: Fundamentos da Doutrina', 
    'Avaliação cobrindo as doutrinas fundamentais da fé cristã, essencial para o desenvolvimento ministerial.', 
    60, 
    true, 
    ARRAY[ (SELECT id FROM courses WHERE title ILIKE '%Básico%' LIMIT 1) ]
  )
  RETURNING id
)
INSERT INTO questions (exam_id, text, options, correct_option, points, order_index)
SELECT id, 'O que significa o termo teológico "Soteriologia"?', '["Estudo sobre os Anjos", "Estudo sobre a Salvação", "Estudo sobre o Fim dos Tempos", "Estudo sobre a Igreja"]'::jsonb, 'Estudo sobre a Salvação', 1, 1 FROM new_exam UNION ALL
SELECT id, 'Qual a principal fonte de autoridade para a elaboração de Doutrinas Cristãs?', '["Os ensinos dos patriarcas", "Os livros apócrifos", "As Escrituras Sagradas", "Os dogmas denominacionais"]'::jsonb, 'As Escrituras Sagradas', 1, 2 FROM new_exam UNION ALL
SELECT id, 'A doutrina da Trindade afirma que:', '["Deus é três deuses diferentes com personalidades diferentes", "Deus é um só ser, eternamente subsistente em três Pessoas", "Jesus e o Espírito Santo foram criados por Deus Pai", "Deus atua de três formas, mas é uma única pessoa"]'::jsonb, 'Deus é um só ser, eternamente subsistente em três Pessoas', 1, 3 FROM new_exam UNION ALL
SELECT id, 'Em relação ao pecado, a doutrina da "Hamartiologia" ensina que o pecado original resultou na:', '["Rejeição completa de Jesus pelos fariseus", "Separação espiritual entre a humanidade e Deus", "Perda imediata do mundo físico", "Falta de vontade humana para fazer o bem"]'::jsonb, 'Separação espiritual entre a humanidade e Deus', 1, 4 FROM new_exam UNION ALL
SELECT id, 'Qual dos atributos pertence à essência exclusiva de Deus e não é comunicável aos homens?', '["Amorosidade", "Misericórdia", "Onipresença", "Bondade"]'::jsonb, 'Onipresença', 1, 5 FROM new_exam UNION ALL
SELECT id, 'De acordo com a doutrina cristã pentecostal, o que evidencia o batismo no Espírito Santo?', '["Falar em línguas estranhas, conforme o relato de Atos 2", "Ter sido mergulhado nas águas", "Alcançar a paz interior imediata", "Curar um enfermo imediatamente"]'::jsonb, 'Falar em línguas estranhas, conforme o relato de Atos 2', 1, 6 FROM new_exam UNION ALL
SELECT id, 'O que estabelece a doutrina da Justificação pela Fé?', '["O homem é perdoado apenas por suas boas obras", "Deus declara o pecador justo somente por meio da fé nos méritos de Cristo", "O batismo nas águas salva e justifica qualquer pessoa", "A salvação é comprada mediante boas contribuições"]'::jsonb, 'Deus declara o pecador justo somente por meio da fé nos méritos de Cristo', 1, 7 FROM new_exam UNION ALL
SELECT id, 'Qual é o termo teológico que estuda os Eventos Finais (A Segunda Vinda, o Tribunal de Cristo e o Milênio)?', '["Cristologia", "Eclesiologia", "Pneumatologia", "Escatologia"]'::jsonb, 'Escatologia', 1, 8 FROM new_exam UNION ALL
SELECT id, 'Sobre a natureza de Cristo (Cristologia), a doutrina ortodoxa sustenta que Ele é:', '["100% Homem e 50% Deus", "Apenas uma emanação divina", "Verdadeiramente Deus e Verdadeiramente Homem, em uma só pessoa", "Um homem iluminado que atingiu a divindade"]'::jsonb, 'Verdadeiramente Deus e Verdadeiramente Homem, em uma só pessoa', 1, 9 FROM new_exam UNION ALL
SELECT id, 'A ordenança bíblica instituída por Cristo que simboliza Seu corpo partido e sangue derramado é a:', '["Oração Diária", "A Ceia do Senhor", "O Jejum de 21 dias", "A Entrega de Dízimos"]'::jsonb, 'A Ceia do Senhor', 1, 10 FROM new_exam;


-- 26: Hermenêutica
WITH new_exam AS (
  INSERT INTO exams (subject_id, title, description, time_limit_minutes, is_active, allowed_courses)
  VALUES (
    26, 
    'Prova Final: Hermenêutica', 
    'Avaliação de Hermenêutica Bíblica, a ciência e a arte de interpretar as Sagradas Escrituras.', 
    60, 
    true, 
    ARRAY[ (SELECT id FROM courses WHERE title ILIKE '%Básico%' LIMIT 1) ]
  )
  RETURNING id
)
INSERT INTO questions (exam_id, text, options, correct_option, points, order_index)
SELECT id, 'Qual é a definição mais precisa de Hermenêutica Bíblica?', '["A arte de decorar versículos bíblicos de forma rápida", "A ciência e a arte da correta interpretação do texto sagrado", "Uma técnica para escrever livros de forma divinamente inspirada", "A prática de traduzir a Bíblia do hebraico para o latim"]'::jsonb, 'A ciência e a arte da correta interpretação do texto sagrado', 1, 1 FROM new_exam UNION ALL
SELECT id, 'Qual é o princípio fundamental número um da Hermenêutica Protestante?', '["O texto depende da autoridade da Igreja institucional", "A Bíblia interpreta a própria Bíblia (Scriptura sui ipsius interpres)", "O intérprete deve confiar apenas em visões pessoais", "Livros históricos são sempre alegorias"]'::jsonb, 'A Bíblia interpreta a própria Bíblia (Scriptura sui ipsius interpres)', 1, 2 FROM new_exam UNION ALL
SELECT id, 'O que significa fazer uma "Exegese" correta de um texto?', '["Ler o texto e aplicar significado tirado da própria cabeça", "Comparar várias traduções diferentes em voz alta", "Extrair do texto o significado original pretendido pelo autor", "Inserir ideias modernas dentro do texto bíblico antigo"]'::jsonb, 'Extrair do texto o significado original pretendido pelo autor', 1, 3 FROM new_exam UNION ALL
SELECT id, 'O termo "Eisegese" (o oposto de Exegese) ocorre quando o leitor:', '["Obtém informações arqueológicas sobre o texto", "Impõe sobre o texto os seus próprios pensamentos e preconceitos", "Divide a passagem em tópicos sistemáticos", "Estuda o sentido das palavras gregas originais"]'::jsonb, 'Impõe sobre o texto os seus próprios pensamentos e preconceitos', 1, 4 FROM new_exam UNION ALL
SELECT id, 'Na Hermenêutica, por que é crucial analisar o contexto histórico-cultural?', '["Para mostrar aos outros leitores quem sabe mais", "Porque provará que a Bíblia tem erros científicos", "Para entender o que o texto significava para os destinatários originais antes de se aplicar aos dias atuais", "Porque o texto não possui significado sem a cultura grega"]'::jsonb, 'Para entender o que o texto significava para os destinatários originais antes de se aplicar aos dias atuais', 1, 5 FROM new_exam UNION ALL
SELECT id, 'Quando lemos que Jesus disse "Eu sou a porta" ou "Eu sou a videira verdadeira", estamos lidando com qual figura de linguagem?', '["Hipérbole", "Metáfora", "Parábola", "Metonímia"]'::jsonb, 'Metáfora', 1, 6 FROM new_exam UNION ALL
SELECT id, 'O que caracteriza o gênero literário "Apocalíptico" em partes de Daniel e Apocalipse?', '["São epístolas direcionadas exclusivamente para líderes da igreja", "Consistem primordialmente em relatos biográficos precisos de Jesus", "São narrações poéticas do Antigo Testamento com rimas no Hebraico", "Utilizam de grande quantidade de visões futurísticas, símbolos, números e figuras extravagantes"]'::jsonb, 'Utilizam de grande quantidade de visões futurísticas, símbolos, números e figuras extravagantes', 1, 7 FROM new_exam UNION ALL
SELECT id, 'Uma das regras de ouro é que "Texto sem contexto, vira..."', '["um grande conselho", "pretexto para heresias", "texto alegórico", "livro canônico"]'::jsonb, 'pretexto para heresias', 1, 8 FROM new_exam UNION ALL
SELECT id, 'Na análise gramatical, observar conjunções (como "comtudo", "logo", "portanto") ajuda especialmente a:', '["Descobrir em que ano o livro foi escrito", "Traduzir o texto para aramaico", "Identificar a ligação lógica e argumentativa entre os parágrafos do autor", "Reconhecer nomes geográficos escondidos na passagem"]'::jsonb, 'Identificar a ligação lógica e argumentativa entre os parágrafos do autor', 1, 9 FROM new_exam UNION ALL
SELECT id, 'A Bíblia foi escrita predominantemente nestas três línguas clássicas:', '["Latim, Grego e Árabe", "Hebraico, Aramaico e Latim", "Hebraico, Aramaico e Grego Antigo (Koiné)", "Siríaco, Hebraico e Egípcio"]'::jsonb, 'Hebraico, Aramaico e Grego Antigo (Koiné)', 1, 10 FROM new_exam;


-- 27: História da Igreja
WITH new_exam AS (
  INSERT INTO exams (subject_id, title, description, time_limit_minutes, is_active, allowed_courses)
  VALUES (
    27, 
    'Prova Final: História da Igreja', 
    'Avaliação abrangente sobre o decorrer da História da Igreja, as perseguições, a Reforma e o período contemporâneo.', 
    60, 
    true, 
    ARRAY[ (SELECT id FROM courses WHERE title ILIKE '%Básico%' LIMIT 1) ]
  )
  RETURNING id
)
INSERT INTO questions (exam_id, text, options, correct_option, points, order_index)
SELECT id, 'A "Era Apostólica" se caracterizou principalmente pelo(a):', '["Apoio estatal irrestrito do Império Romano para a construção de templos cristãos", "Poder papal absoluto imposto por todos os doze apóstolos", "Poderoso derramamento do Espírito em Atos e na violenta perseguição das primeiras comunidades", "Invenção da imprensa para circular as primeiras bíblias em massa"]'::jsonb, 'Poderoso derramamento do Espírito em Atos e na violenta perseguição das primeiras comunidades', 1, 1 FROM new_exam UNION ALL
SELECT id, 'Qual foi o imperador romano responsável pela oficialização do Cristianismo e pela convocação do histórico Concílio de Niceia em 325 d.C?', '["Calígula", "Nero", "Júlio César", "Constantino"]'::jsonb, 'Constantino', 1, 2 FROM new_exam UNION ALL
SELECT id, 'Durante a Idade Média, o período negro da Igreja marcou-se principalmente pela:', '["Aproximação extrema da Bíblia com os camponeses através das línguas maternas", "Constante venda de indulgências e o monopólio eclesiástico das escrituras", "Total ausência do Catolicismo Romano na Europa", "Dispersão do Pentecostalismo nas catedrais da Alemanha"]'::jsonb, 'Constante venda de indulgências e o monopólio eclesiástico das escrituras', 1, 3 FROM new_exam UNION ALL
SELECT id, 'O maior expoente do pontapé inicial para a Reforma Protestante que pregou as "95 Teses" na porta do castelo de Wittenberg foi:', '["João Calvino", "John Wycliffe", "Martinho Lutero", "Ulrico Zuínglio"]'::jsonb, 'Martinho Lutero', 1, 4 FROM new_exam UNION ALL
SELECT id, 'A tese principal recuperada por Lutero baseada em Romanos 1:17 foi:', '["A justificação pelas obras e caridade", "A adoração aos relíquios confere graça imerecida", "O justo viverá pela fama de seus superiores hierárquicos", "O justo viverá pela fé (Sola Fide)"]'::jsonb, 'O justo viverá pela fé (Sola Fide)', 1, 5 FROM new_exam UNION ALL
SELECT id, 'João Calvino, influente teólogo da Reforma, destacou-se principalmente em qual cidade européia ao escrever as "Institutas"?', '["Londres (Inglaterra)", "Genebra (Suíça)", "Atenas (Grécia)", "Roma (Itália)"]'::jsonb, 'Genebra (Suíça)', 1, 6 FROM new_exam UNION ALL
SELECT id, 'Os pré-reformadores, líderes que prepararam o caminho criticando desvios eclesiásticos muito antes de Lutero, incluíam nomes como:', '["Billy Graham e C.S. Lewis", "Agostinho e Tomás de Aquino", "John Wycliffe e Jan Hus", "Constantino e Teodósio"]'::jsonb, 'John Wycliffe e Jan Hus', 1, 7 FROM new_exam UNION ALL
SELECT id, 'Quais pilares não pertence aos famosos "Cinco Solas" da Reforma Protestante?', '["Sola Scriptura (Somente a Escritura)", "Sola Fide (Somente a Fé)", "Solo Pontifex (Somente o Supremo Sacerdote)", "Solus Christus (Somente Cristo)"]'::jsonb, 'Solo Pontifex (Somente o Supremo Sacerdote)', 1, 8 FROM new_exam UNION ALL
SELECT id, 'John Wesley representou um dos maiores reavivamentos na Inglaterra no Século XVIII e foi fundador do movimento base para os pentecostais chamado de:', '["Metodismo", "Arminianismo Presbiteriano", "Catolicismo Ortodoxo", "Igreja Luterana Renovada"]'::jsonb, 'Metodismo', 1, 9 FROM new_exam UNION ALL
SELECT id, 'O histórico e mundial Reavivamento Pentecostal que ocorreu inicialmente numa igrejinha de afro-americanos usando caixotes de maçã ocorreu na cidade de Los Angeles, originando a Missão da Rua:', '["Broadway", "Azusa", "Wall Street", "Lincoln"]'::jsonb, 'Azusa', 1, 10 FROM new_exam;


-- 28: História das Assembleias de Deus
WITH new_exam AS (
  INSERT INTO exams (subject_id, title, description, time_limit_minutes, is_active, allowed_courses)
  VALUES (
    28, 
    'Prova Final: História das Assembleias de Deus', 
    'Avaliação detalhando a rica e vibrante trajetória centenária da fundação das Assembleias de Deus no Brasil.', 
    60, 
    true, 
    ARRAY[ (SELECT id FROM courses WHERE title ILIKE '%Básico%' LIMIT 1) ]
  )
  RETURNING id
)
INSERT INTO questions (exam_id, text, options, correct_option, points, order_index)
SELECT id, 'Os suecos Daniel Berg e Gunnar Vingren iniciaram o movimento das Assembleias de Deus no Brasil inspirados por um chamado profético direcionado para qual Local?', '["Rio de Janeiro", "Belém do Pará", "Recife", "São Paulo"]'::jsonb, 'Belém do Pará', 1, 1 FROM new_exam UNION ALL
SELECT id, 'Em que data oficial as Assembleias de Deus foram fundadas no Brasil, marcando o início da Missão de Fé Apostólica?', '["18 de Junho de 1911", "01 de Janeiro de 1900", "07 de Setembro de 1922", "15 de Novembro de 1889"]'::jsonb, '18 de Junho de 1911', 1, 2 FROM new_exam UNION ALL
SELECT id, 'Antes de formar a "Missão de Fé Apostólica" (que depois mudaria o nome para AD), em qual congregação brasileira os missionários chegaram apresentando a doutrina pentecostal pela primeira vez?', '["Igreja Presbiteriana Central do Brasil", "Igreja Batista de Belém (Pr. Raimundo Nobre)", "Igreja Metodista do Pará", "Catedral da Sé em São Paulo"]'::jsonb, 'Igreja Batista de Belém (Pr. Raimundo Nobre)', 1, 3 FROM new_exam UNION ALL
SELECT id, 'A primeira brasileira batizada com o Espírito Santo nestas reuniões formadoras foi:', '["Irmã Celina de Albuquerque", "Irmã Frida Vingren", "Irmã Maria de Lourdes", "Irmã Zélia Berg"]'::jsonb, 'Irmã Celina de Albuquerque', 1, 4 FROM new_exam UNION ALL
SELECT id, 'Qual dos missionários fundadores ficou responsável inicialmente pelas intensas e contínuas viagens evangelísticas para os interiores, subindo os rios do Nordeste e Norte para pregar?', '["Gunnar Vingren", "Daniel Berg", "Samuel Nyström", "Otto Nelson"]'::jsonb, 'Daniel Berg', 1, 5 FROM new_exam UNION ALL
SELECT id, 'Qual foi a estratégia literária fundamental utilizada pelas ADs ainda nos primórdios para a difusão da doutrina (até hoje com a CPAD)?', '["Mensageiro da Paz e Lições Bíblicas", "Revista Atalaia", "Jornais de Praça Católica", "Bíblias Impressas pelo Próprio Vingren em Belém"]'::jsonb, 'Mensageiro da Paz e Lições Bíblicas', 1, 6 FROM new_exam UNION ALL
SELECT id, 'Gunnar Vingren enfrentou grande perseguição, e após os primeiros anos, ele mudou-se para organizar solidamente as ADs com grandes cultos evangelísticos na cidade de:', '["Recife (PE)", "Manaus (AM)", "Rio de Janeiro (RJ, de onde ajudou fundar a CGADB)", "Curitiba (PR)"]'::jsonb, 'Rio de Janeiro (RJ, de onde ajudou fundar a CGADB)', 1, 7 FROM new_exam UNION ALL
SELECT id, 'No que diz respeito ao sustento financeiro, como se manteve Daniel Berg e a obra pioneira quando não possuíam igreja local rica o suficiente?', '["Ele importava carros da Suécia", "Ele sustentava a si trabalhando como caldeireiro nas Companhias de Navegação", "Ele processou o estado solicitando dízimos do império", "O rei da Suécia o pagava secretamente"]'::jsonb, 'Ele sustentava a si trabalhando como caldeireiro nas Companhias de Navegação', 1, 8 FROM new_exam UNION ALL
SELECT id, 'O órgão máximo, civil, nacional (Convenção Geral) das Assembleias de Deus no Brasil é referenciado pela sigla:', '["CBB", "CPAD", "CGADB", "UBEB"]'::jsonb, 'CGADB', 1, 9 FROM new_exam UNION ALL
SELECT id, 'Um marco inconfundível dos cultos da Assembleia de Deus no Brasil não apenas com o falar em línguas, mas com corinhos fortes e ritmados do tradicional Harpa Cristã. O hinário principal se chama originalmente:', '["Salmos e Hinos", "Cantor Cristão", "Harpa Cristã", "Hinos Antigos do Brasil"]'::jsonb, 'Harpa Cristã', 1, 10 FROM new_exam;
