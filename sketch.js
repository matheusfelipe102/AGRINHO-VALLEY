// ============================================================================
// 1. CONFIGURAÇÕES, RECURSOS E VARIÁVEIS GLOBAIS
// ============================================================================

// --- Sistema de Responsividade ---
var LARGURA_BASE = 780;
var ALTURA_BASE = 560;
var escala = 1;
var margemX = 0;
var margemY = 0;

// --- Sistema de Missões Dinâmicas (Em Fases) ---
var nivelMissao = 0;
var missoes = [];
var missoesConcluidas = 0;

// --- Recursos Básicos da Fazenda ---
var dinheiro = 1200;
var sustentabilidade = 75;
var aguaReserva = 50; // MODO HARD: Começa com apenas 50% do tanque
var dia = 1;
var sementes = 8;
var colheitaEstoque = 0;
var taxaManutencao = 25; 

// --- Sistema de Recordes Históricos ---
var respostasCorretas = 0;
var recordDias = 0;
var recordRespostas = 0;
var recordDinheiro = 0;

// --- Economia e Balanço de Upgrades ---
var precoMercadoOntem = 350; 
var precoMercadoHoje = 350;
var taxaRegaDrone = 15; 
var nivelAntena = 0;   
var bonusSustentabilidadeColheita = 1;

// --- Controle de Repetição de Narrativas (Sistema de Pool) ---
var poolNarrativas = [0, 1, 1, 1, 2, 3]; 

// --- Estrutura do Tabuleiro (Grid de Cultivo) ---
var fazenda = [];
var colunas = 5;
var linhas = 3;
var tamanhoTile = 85;

// --- Máquina de Estados e Fluxo do Jogo ---
var ESTADO = "TUTORIAL"; 
var feedbackJanela = "Sistema pronto. Ative a telemetria do drone e gerencie o caixa.";
var indiceQuiz = 0;
var tipoNarrativa = 0;
var msgErroNarrativa = ""; 

// --- Controle de Tempo e Feedbacks de Interface ---
var tempoEstadoEntrada = 0; 
var statusQuiz = "";        
var statusGeada = "";       

// --- Componentes de Interface (Botões do p5.dom) ---
var btnComecar;
var btnRecomecarLateral;
var btnRecomecarFim;
var btnRegar; 
var btnVender;
var btnDormir;
var btnMute;
var btnComprarSemente;
var btnComprarLote;
var btnRecords;
var btnVoltarMenu;

// BOTÕES PARA DISPOSITIVOS TOUCH
var btnOpcaoA;
var btnOpcaoB;

// --- Sistema de Áudio com Envelope ADSR ---
var somSintetizador;
var envelope; 
var somAtivo = false;
var mutado = false;
var notaPasso = 0;
var notasMelodia = [261.63, 293.66, 329.63, 392.00, 440.00, 392.00];

var tempoAtaque = 0.05; 
var tempoDecaimento = 0.2;
var nivelSustentacao = 0.2;
var tempoLiberacao = 0.5;

// --- Banco de Dados do Quiz ---
var bancoQuiz = [
  { q: "Como a producao organica evita pragas e doencas sem o uso de materiais artificiais?", a: "Utilizando sementes modificadas em laboratorio para resistirem sozinhas", b: "Atraves da rotacao de culturas, diversidade biologica e defensivos naturais", res: "b", tipo: "padrao" },
  { q: "Qual tecnica paranaense evita a erosao plantando sobre a palha da colheita anterior?", a: "Aracao Convencional", b: "Plantio Direto", res: "b", tipo: "padrao" },
  { q: "Para enfrentar periodos de seca sem esgotar rios, qual infraestrutura e ideal?", a: "Bombear agua do lencol freatico sem parar ate o solo ficar encharcado", b: "Construir sistemas de captacao e armazenamento de agua da chuva (cisternas)", res: "b", tipo: "padrao" },
  { q: "Por que e obrigatorio manter a Mata Ciliar na beira dos rios da propriedade?", a: "Apenas para deixar a fazenda bonita para as auditorias de satelites", b: "Para proteger as margens contra erosao e evitar o assoreamento da agua", res: "b", tipo: "fiscalizacao" },
  { q: "Em vez de quimicos pesados, o que caracteriza o Manejo Integrado de Pragas (MIP)?", a: "Esperar que as pragas sumam sozinhas com a mudanca de estacao do ano", b: "O uso de inimigos naturais (como insetos beneficos) para controle", res: "b", tipo: "padrao" },
  { q: "Qual e a principal importancia da agricultura familiar para a populacao brasileira?", a: "Ela foca exclusivamente na exportacao de monoculturas em larga escala", b: "Ela e responsavel por produzir a maior parte dos alimentos frescos que vao para a mesa", res: "b", tipo: "padrao" },
  { q: "Por que a agricultura familiar aposta na diversificacao de cultivos?", a: "Porque misturar plantas diferentes facilita o uso de grandes colheitadeiras e tratores", b: "Para garantir alimentos variados, proteger a renda e melhorar a saude do solo", res: "b", tipo: "padrao" },
  { q: "Como o cooperativismo ajuda os pequenos produtores de agricultura familiar no Parana?", a: "Obriga os agricultores a entregarem suas terras para grandes empresas gerenciarem", b: "Permite comprar insumos mais baratos, compartilhar tecnologias e conseguir precos justos", res: "b", tipo: "padrao" },
  { q: "O que e a tecnica de adubacao verde?", a: "Aplicacao de corantes ecologicos na agua de irrigacao do drone", b: "Cultivo de plantas (como leguminosas) para serem incorporadas ao solo e nutri-lo", res: "b", tipo: "padrao" },
  { q: "Voce pode comercializar suas safras como 'organicas' sem o Selo Organico Brasil oficial?", a: "Sim, desde que eu comprove verbalmente para o comprador no mercado", b: "Nao, a certificacao por auditoria e obrigatoria para venda legal", res: "b", tipo: "fiscalizacao" },
  { q: "O Norte do PR possui um solo escuro e fertil devido a vulcoes antigos. Qual o nome dele?", a: "Arenito Caiua", b: "Terra Roxa", res: "b", tipo: "padrao" },
  { q: "Qual e o principal produto agricola do estado?", a: "Milho", b: "Soja", res: "b", tipo: "padrao" },
  { q: "Onde escoar e exportar sua producao?", a: "Porto de Santos", b: "O Porto de Paranagua", res: "b", tipo: "padrao" },
  { q: "Como a tecnologia digital ajuda a valorizar seu produto no mercado global?", a: "Apenas tirando fotos para postar nas redes sociais da fazenda", b: "Garantindo a rastreabilidade, provando que foi produzido sem desmatamento", res: "b", tipo: "padrao" },
  { q: "Qual e a vantagem de usar biofertilizantes produzidos na propria fazenda?", a: "Aumenta a dependencia de empresas estrangeiras e encarece a producao", b: "Aproveita residuos organicos, reduzindo custos e nutrindo o solo naturalmente", res: "b", tipo: "padrao" },
  { q: "O que deve ser feito com as embalagens vazias de defensivos agricolas?", a: "Queimar ou enterrar no fundo da propriedade para esconder a sujeira", b: "Realizar a triplice lavagem e devolver em postos de coleta autorizados", res: "b", tipo: "fiscalizacao" },
  { q: "Por que e tao importante preservar as abelhas no ambiente agricola?", a: "Apenas para produzir mel para o consumo interno da fazenda", b: "Elas sao as principais polinizadoras, vitais para a producao da maioria dos alimentos", res: "b", tipo: "padrao" },
  { q: "Na compra de mudas e sementes, por que o produtor familiar deve escolher variedades adaptadas ao clima local?", a: "Elas exigem mais irrigacao, mas sao muito mais valiosas para vender no exterior", b: "Garantem maior resistencia a secas e doencas nativas da regiao, evitando perdas totais", res: "b", tipo: "padrao" },
  { q: "O que e compostagem na realidade da agricultura familiar e urbana?", a: "Processo de misturar produtos quimicos vencidos para tentar criar uma semente mais barata", b: "Reciclagem e transformacao de restos de vegetais, esterco e folhas em um rico adubo escuro", res: "b", tipo: "padrao" },
  { q: "O uso de defensivos deve respeitar obrigatoriamente o 'periodo de carencia'. O que e isso?", a: "O tempo que a praga demora para voltar a invadir a lavoura depois da pulverizacao forte", b: "Os dias de intervalo obrigatorio entre aplicar o produto e realizar a colheita, garantindo saude", res: "b", tipo: "fiscalizacao" },
  { q: "Por que aplicar inseticidas de 'amplo espectro' (que matam tudo) de forma indiscriminada e perigoso?", a: "Eles matam apenas o inseto focado e ajudam a planta a absorver vitaminas do ar mais rapido", b: "Eles destroem junto os insetos beneficos, aranhas predadoras e abelhas vitais para a produtividade", res: "b", tipo: "padrao" },
  { q: "Como o grave desmatamento ilegal la na Amazonia pode impactar negativamente a agricultura no Parana?", a: "Nao afeta absolutamente nada, as duas regioes estao a milhares de quilometros de distancia", b: "Ele corta as correntes de umidade conhecidas como 'Rios Voadores', provocando grandes secas", res: "b", tipo: "padrao" },
  { q: "Na suinocultura, o que a lei manda fazer com as grandes quantidades de dejetos orgânicos das granjas?", a: "Podem ser jogados sem problema nos rios, ja que se trata apenas de restos organicos", b: "Precisam obrigatoriamente ser tratados em biodigestores ou lagoas antes de irem para o solo", res: "b", tipo: "fiscalizacao" },
  { q: "O que significa o conceito de 'Pegada Hidrica' na producao dos alimentos?", a: "Sinaliza as fendas profundas que as rodas dos tratores estao provocando nas margens dos rios", b: "Mede o volume total e oculto de agua doce utilizado ate o produto chegar as prateleiras do mercado", res: "b", tipo: "padrao" },
  { q: "Em lavouras organicas, se houver excesso de mato competindo com as plantas, faz-se o que?", a: "Aplica-se um herbicida sistemico pesado para matar o mato no menor prazo possivel", b: "Realiza-se capinas manuais ou rocadas, devolvendo o mato como adubo na propria terra", res: "b", tipo: "padrao" },
  { q: "O que sao as chamadas Tecnologias Sociais aplicadas a agricultura familiar?", a: "Solucoes simples e baratas, como cisternas de placas para guardar agua da chuva", b: "Softwares carissimos que exigem computadores de ultima geracao e internet via satelite", res: "a", tipo: "padrao" },
  { q: "Na jornada do campo ate a mesa, como a gestao da colheita familiar evita o desperdicio?", a: "Utilizando embalagens adequadas e transporte rapido, evitando que produtos estraguem", b: "Deixando o excesso de produtos apodrecer no campo para servir de adubo automatico", res: "a", tipo: "padrao" },
  { q: "O que e a Integracao Lavoura-Pecuaria-Floresta (ILPF)?", a: "Sistema que mistura plantio, gado e arvores para recuperar o solo e gerar renda", b: "Desmatar uma floresta para plantar soja e depois colocar gado", res: "a", tipo: "padrao" },
  { q: "Como a rotacao de culturas ajuda a controlar pragas e doencas?", a: "Quebra o ciclo de vida dos insetos e fungos que atacam sempre a mesma planta", b: "Atrai mais pragas diferentes para a fazenda, causando caos", res: "a", tipo: "padrao" },
  { q: "O que e a chamada 'Agricultura de Precisao'?", a: "Uso de dados, GPS e drones para aplicar agua e nutrientes apenas onde a planta precisa", b: "Plantar as sementes usando reguas perfeitas para o campo ficar alinhado", res: "a", tipo: "padrao" },
  { q: "O que e uma Area de Preservacao Permanente (APP) segundo as leis ambientais?", a: "Area natural protegida, como beiras de rios e topos de morros, essencial para a fauna e a agua", b: "Um terreno protegido de impostos onde se pode construir galpoes pesados", res: "a", tipo: "fiscalizacao" },
  { q: "Como o plantio de arvores em consorcio com o cafe (Sistema Agroflorestal) beneficia a producao?", a: "Cria sombra que melhora a qualidade do grao e protege contra picos de calor e geadas", b: "Rouba todos os nutrientes do solo, matando a plantacao principal em poucos meses", res: "a", tipo: "padrao" },
  { q: "O uso de energia solar nas fazendas rurais ajuda na sustentabilidade porque:", a: "Reduz a emissao de gases de efeito estufa e diminui os custos operacionais da propriedade", b: "Impede que o sol esquente demais e evapore a agua do solo e das plantas sensiveis", res: "a", tipo: "padrao" },
  { q: "Qual a funcao das praticas de 'curvas de nivel' no preparo do solo em relevos inclinados?", a: "Evitar a erosao, reduzindo a velocidade da agua da chuva e retendo nutrientes na terra", b: "Acelerar o escoamento da agua para os rios o mais rapido possivel para nao fazer pocoes", res: "a", tipo: "padrao" },
  { q: "Como os biodigestores ajudam fazendas que possuem grandes criacoes de animais?", a: "Transformam o esterco poluidor em gas de cozinha, energia eletrica e excelente adubo", b: "Servem apenas como piscinas fechadas para armazenar agua da chuva limpa no verao", res: "a", tipo: "padrao" },
  { q: "O que caracteriza o selo internacional 'Fair Trade' (Comercio Justo) nas exportacoes agricolas?", a: "Garante que o produto foi feito com respeito aos direitos dos trabalhadores e a natureza local", b: "Significa que o produtor vendeu pelo preco mais baixo possivel para derrotar a concorrencia", res: "a", tipo: "padrao" },
  { q: "Por que a pratica de queimar a palhada da colheita (queimada tradicional) e condenada hoje?", a: "Mata os microrganismos do solo, libera carbono poluidor e eleva muito o risco de incendios", b: "E a melhor forma ecologica de espalhar cinzas ricas em minerais e limpar o mato rapidamente", res: "a", tipo: "fiscalizacao" },
  { q: "A inovacao de sensores IoT (Internet das Coisas) espalhados pelo campo permite que:", a: "O computador avise o agricultor exatamente as partes da lavoura que precisam de agua ou atencao", b: "Os agricultores tenham internet de alta velocidade para assistir videos durante o trabalho no trator", res: "a", tipo: "padrao" },
  { q: "O que o CAR (Cadastro Ambiental Rural) representa para as propriedades no Brasil?", a: "Um registro publico obrigatorio que mapeia e controla a situacao ambiental e legal das fazendas", b: "Um imposto novo cobrado apenas dos pequenos produtores que possuem muitas arvores", res: "a", tipo: "fiscalizacao" },
  { q: "O que sao as chamadas 'plantas de cobertura' ou adubos verdes plantados no inverno do Sul?", a: "Plantas que protegem a terra da geada e do sol forte, devolvendo nitrogenio para a proxima safra", b: "Lonas de plastico biodegradavel esticadas sobre o solo nu para esquentar as sementes ali plantadas", res: "a", tipo: "padrao" },
  { q: "Qual a grande importancia dos 'corredores ecologicos' que ligam as areas de mata de diferentes fazendas?", a: "Permitem que animais silvestres como oncas e macacos se movam, mantendo a diversidade e o equilibrio", b: "Sao passagens exclusivas de terra batida para as imensas colheitadeiras cruzarem sem pisar na rua", res: "a", tipo: "padrao" },
  { q: "O moderno sistema de irrigacao por Gotejamento e considerado altamente sustentavel devido a qual motivo?", a: "Entrega a agua em gotas devagar direto na raiz da planta, gastando muito menos H2O do que aspersores", b: "Lanca um grande e forte jato de agua para os ares, o que acaba refrescando o clima da fazenda toda", res: "a", tipo: "padrao" },
  { q: "Um agricultor percebe que a praga agora resiste ao defensivo que ele sempre usa. O que causou isso?", a: "O uso incorreto e sempre do mesmo quimico selecionou os insetos mais fortes e resistentes", b: "O inseticida vencido sofreu uma reacao solar no tanque de aplicacao e perdeu o efeito", res: "a", tipo: "padrao" },
  { q: "Por que as famosas Sementes Crioulas (guardadas pelas familias) importam tanto na agroecologia?", a: "Preservam a diversidade genetica local, garantindo que os agricultores nao fiquem refens da industria", b: "Sao as unicas sementes antigas que toleram grandes pancadas de fertilizantes industriais pesados", res: "a", tipo: "padrao" },
  { q: "Qual o objetivo principal da tecnica de 'calagem' (distribuir po de calcario no solo)?", a: "Tirar a alta acidez natural do solo (aumentar o pH), permitindo que a planta absorva nutrientes", b: "Deixar o solo duro e impermeavel para evitar que a agua da chuva se infiltre demais na terra", res: "a", tipo: "padrao" },
  { q: "Por que ignorar o uso de EPI (Equipamento de Protecao Individual) ao aplicar insumos agricolas e perigoso?", a: "Porque expoe a pele e os pulmoes do operador a agentes toxicos, causando doencas graves", b: "Apenas para evitar que as roupas cotidianas e caras do agricultor fiquem manchadas e sujas", res: "a", tipo: "fiscalizacao" },
  { q: "No Parana, programas educacionais como o Agrinho atuam em milhares de escolas visando que meta principal?", a: "Sensibilizar e educar as novas geracoes sobre a interacao entre o meio ambiente, a saude e o campo", b: "Treinar criancas de forma tecnica para saberem exatamente como operar grandes colheitadeiras", res: "a", tipo: "padrao" },
  { q: "O que os temidos morcegos insetivoros oferecem de positivo a lavoura noturna?", a: "Sao predadores implacaveis, capazes de limpar nuvens e toneladas de insetos pragas por mes", b: "Nao oferecem nada positivo e ainda sugam o sangue do rebanho, estressando os animais", res: "a", tipo: "padrao" },
  { q: "Florestas adultas e arvores nativas sao as maiores 'sequestradoras de carbono' porque:", a: "Capturam bilhoes de toneladas do nocivo gas carbonico do ar, retendo-o na sua madeira", b: "Com as grandes folhas bloqueando a luz do sol, o solo escuro forca a liberacao de gases frios", res: "a", tipo: "padrao" },
  { q: "Pneus pesados de maquinas causam a 'compactacao do solo'. Por que isso e uma falha de manejo?", a: "Tira o oxigenio da terra, dificultando a raiz da planta de crescer e causando erosao com a chuva", b: "Solidifica o solo para suportar terremotos, porem os custos com o diesel das maquinas explodem", res: "a", tipo: "padrao" }
];

// ============================================================================
// 2. INICIALIZAÇÃO E RESPONSIVIDADE
// ============================================================================

function setup() {
  createCanvas(windowWidth, windowHeight);
  calcularEscala();
  
  try {
    if (typeof p5.Oscillator !== 'undefined') {
      somSintetizador = new p5.Oscillator('sine');
      envelope = new p5.Envelope();
      envelope.setADSR(tempoAtaque, tempoDecaimento, nivelSustentacao, tempoLiberacao);
      somSintetizador.amp(envelope); 
      somSintetizador.start(); 
      somAtivo = true;
    }
  } catch (e) {
    somAtivo = false;
  }
  
  for (var i = 0; i < colunas; i++) {
    fazenda[i] = [];
    for (var j = 0; j < linhas; j++) {
      fazenda[i][j] = { 
        estado: "vazio", 
        umidade: 100, 
        crescimento: 0 
      };
    }
  }

  btnMute = createButton('MUTAR MUSICA');
  btnMute.mousePressed(alternarMute);

  btnComprarSemente = createButton('+1 SEMENTE (R$70)'); 
  btnComprarSemente.mousePressed(comprarSemente);

  btnComprarLote = createButton('+5 SEMENTES (R$350)'); 
  btnComprarLote.mousePressed(comprarLoteSementes);

  btnRegar = createButton('REGAR TUDO (R$500)');
  btnRegar.mousePressed(regarTudo);

  btnVender = createButton('VENDER SAFRA');
  btnVender.mousePressed(venderSafra);

  btnDormir = createButton('PASSAR O DIA');
  btnDormir.mousePressed(passarDia); 
  
  btnComecar = createButton('INICIAR MISSAO');
  btnComecar.mousePressed(iniciarJogo);

  btnRecomecarLateral = createButton('RECOMECAR');
  btnRecomecarLateral.mousePressed(reiniciarJogo);
  
  btnRecomecarFim = createButton('RECOMECAR JOGO');
  btnRecomecarFim.mousePressed(reiniciarJogo);

  btnRecords = createButton('VER RECORDES');
  btnRecords.mousePressed(function() { 
    mudarEstado("RECORDS"); 
  });

  btnVoltarMenu = createButton('VOLTAR AO MENU');
  btnVoltarMenu.mousePressed(function() { 
    mudarEstado("TUTORIAL"); 
  });

  btnOpcaoA = createButton('ESCOLHER [ A ]');
  btnOpcaoA.mousePressed(function() { responderInteracao('a'); });

  btnOpcaoB = createButton('ESCOLHER [ B ]');
  btnOpcaoB.mousePressed(function() { responderInteracao('b'); });

  posicionarBotoes();
  carregarMissoes(); // Carrega a primeira fase de missoes na inicializacao
  mudarEstado("TUTORIAL");
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calcularEscala();
  posicionarBotoes();
}

function calcularEscala() {
  var proporcaoTela = windowWidth / windowHeight;
  var proporcaoBase = LARGURA_BASE / ALTURA_BASE;

  if (proporcaoTela < proporcaoBase) {
    escala = windowWidth / LARGURA_BASE;
  } else {
    escala = windowHeight / ALTURA_BASE;
  }
  
  margemX = (windowWidth - (LARGURA_BASE * escala)) / 2;
  margemY = (windowHeight - (ALTURA_BASE * escala)) / 2;
}

function posicionarBotoes() {
  function aplicarEscalaBotao(btn, x, y, w, h) {
    btn.position(margemX + (x * escala), margemY + (y * escala));
    btn.size(w * escala, h * escala);
    
    btn.style('font-size', Math.max(9, 11 * escala) + 'px'); 
    btn.style('line-height', '1.0');
    btn.style('padding', '1px');
    btn.style('word-wrap', 'break-word');
    btn.style('white-space', 'normal'); 
  }

  // BOTÕES DA LATERAL
  aplicarEscalaBotao(btnMute, 595, 365, 170, 25);
  aplicarEscalaBotao(btnComprarSemente, 595, 395, 170, 25);
  aplicarEscalaBotao(btnComprarLote, 595, 425, 170, 25); 
  aplicarEscalaBotao(btnRegar, 595, 455, 170, 25);
  aplicarEscalaBotao(btnVender, 595, 485, 82, 25);
  aplicarEscalaBotao(btnDormir, 683, 485, 82, 25);
  aplicarEscalaBotao(btnRecomecarLateral, 595, 515, 170, 25);
  
  // BOTÕES CENTRAIS
  aplicarEscalaBotao(btnComecar, 300, 420, 180, 40);
  aplicarEscalaBotao(btnRecomecarFim, 300, 420, 180, 40);
  aplicarEscalaBotao(btnRecords, 300, 475, 180, 40);
  aplicarEscalaBotao(btnVoltarMenu, 300, 475, 180, 40);

  // BOTÕES DE DECISÃO
  aplicarEscalaBotao(btnOpcaoA, 160, 400, 200, 45);
  aplicarEscalaBotao(btnOpcaoB, 420, 400, 200, 45);
}

function mudarEstado(novoEstado) {
  ESTADO = novoEstado;
  msgErroNarrativa = ""; 
  
  btnRegar.hide(); 
  btnVender.hide(); 
  btnDormir.hide(); 
  btnMute.hide();
  btnComprarSemente.hide(); 
  btnComprarLote.hide(); 
  btnComecar.hide(); 
  btnRecomecarLateral.hide();
  btnRecomecarFim.hide(); 
  btnRecords.hide(); 
  btnVoltarMenu.hide();
  btnOpcaoA.hide();
  btnOpcaoB.hide();

  if (ESTADO === "TUTORIAL") {
    btnComecar.show(); 
    btnRecords.show();
  } else if (ESTADO === "JOGANDO") {
    btnRegar.show(); 
    btnVender.show(); 
    btnDormir.show();
    btnMute.show(); 
    btnComprarSemente.show(); 
    btnComprarLote.show(); 
    btnRecomecarLateral.show();
  } else if (ESTADO === "FIM") {
    btnRecomecarFim.show(); 
    btnRecords.show();
  } else if (ESTADO === "RECORDS") {
    btnVoltarMenu.show();
  } else if (ESTADO === "QUIZ" || ESTADO === "NARRATIVA" || ESTADO === "GEADA") {
    btnOpcaoA.show();
    btnOpcaoB.show();
  }
}

function iniciarJogo() {
  userStartAudio(); 
  mudarEstado("JOGANDO");
}

function reiniciarJogo() {
  if (dia > recordDias) recordDias = dia;
  if (respostasCorretas > recordRespostas) recordRespostas = respostasCorretas;
  if (dinheiro > recordDinheiro) recordDinheiro = dinheiro;

  dinheiro = 1200; 
  sustentabilidade = 75; 
  aguaReserva = 50; // MODO HARD: Reinicia com apenas 50%
  dia = 1; 
  sementes = 8; 
  colheitaEstoque = 0; 
  respostasCorretas = 0; 
  precoMercadoOntem = 240; 
  precoMercadoHoje = 240; 
  taxaRegaDrone = 15; 
  nivelAntena = 0; 
  bonusSustentabilidadeColheita = 1; 
  statusQuiz = ""; 
  statusGeada = "";
  poolNarrativas = [0, 1, 1, 1, 2, 3]; 
  feedbackJanela = "Jogo reiniciado! Configure seus sistemas e inicie a missao.";
  
  // RESET MISSÕES
  nivelMissao = 0;
  carregarMissoes();

  for (var i = 0; i < colunas; i++) {
    for (var j = 0; j < linhas; j++) {
      fazenda[i][j].estado = "vazio";
      fazenda[i][j].umidade = 100;
      fazenda[i][j].crescimento = 0;
    }
  }
  
  mudarEstado("TUTORIAL"); 
}

// ============================================================================
// 3. LOOP PRINCIPAL E RENDERIZAÇÃO
// ============================================================================

function draw() {
  background(15, 20, 18); 

  var mx = (mouseX - margemX) / escala;
  var my = (mouseY - margemY) / escala;

  push();
  translate(margemX, margemY);
  scale(escala);

  fill(210, 235, 210); 
  noStroke();
  rect(0, 0, LARGURA_BASE, ALTURA_BASE);

  if (ESTADO === "TUTORIAL") {
    telaTutorial();
  } else if (ESTADO === "JOGANDO") {
    tocarTrilhaSonora();
    gerenciarRegaAutomatica(mx, my); 
    desenharCampos();
    desenharInterfaceLateral();
    desenharDroneSombra(mx, my);
  } else if (ESTADO === "QUIZ") {
    telaQuizFlipped();
  } else if (ESTADO === "NARRATIVA") {
    telaNarrativaVisual();
  } else if (ESTADO === "GEADA") {
    telaGeada();
  } else if (ESTADO === "RECORDS") {
    telaRecords();
  } else if (ESTADO === "FIM") {
    telaFimDeJogo();
  }
  
  pop();
}

// ============================================================================
// 4. MECÂNICAS E GAMEPLAY
// ============================================================================

function comprarSemente() {
  if (ESTADO !== "JOGANDO") return;
  
  if (dinheiro >= 70) {
    dinheiro -= 70; 
    sementes++;
    feedbackJanela = "Semente adquirida! -R$ 70 debitados do caixa.";
  } else { 
    feedbackJanela = "Saldo insuficiente para comprar uma semente."; 
  }
}

function comprarLoteSementes() {
  if (ESTADO !== "JOGANDO") return;
  
  if (dinheiro >= 350) {
    dinheiro -= 350; 
    sementes += 5;
    feedbackJanela = "Lote de 5 sementes adquirido! -R$ 350 debitados.";
  } else { 
    feedbackJanela = "Saldo insuficiente para o lote de sementes."; 
  }
}

function alternarMute() {
  if (!somAtivo) return;
  
  mutado = !mutado;
  if (mutado) {
    btnMute.html('DESMUTAR MUSICA');
  } else {
    btnMute.html('MUTAR MUSICA');
  }
}

function tocarTrilhaSonora() {
  if (somAtivo && !mutado && frameCount % 45 === 0) {
    try {
      var freqNota = notasMelodia[notaPasso]; 
      somSintetizador.freq(freqNota);
      envelope.play(somSintetizador);
      notaPasso = (notaPasso + 1) % notasMelodia.length;
    } catch (e) {}
  }
}

function gerenciarRegaAutomatica(mx, my) {
  // LIMITADOR DE FRAMES: Drone umedece num ritmo normal
  if (frameCount % 15 !== 0) return;

  var gridX = Math.floor((mx - 40) / tamanhoTile);
  var gridY = Math.floor((my - 140) / tamanhoTile);

  if (gridX >= 0 && gridX < colunas && gridY >= 0 && gridY < linhas) {
    var t = fazenda[gridX][gridY];
    
    // Rega apenas se nao estiver saturado de agua
    if (t.umidade < 100) {
      if (aguaReserva >= 2) { // MODO HARD: Exige 2 unidades de água por vez
        t.umidade += taxaRegaDrone;
        
        // Impede que a umidade estoure o limite de 100% e bugue as cores
        if (t.umidade > 100) t.umidade = 100;
        
        aguaReserva -= 2; // MODO HARD: Gasta o dobro de água
        feedbackJanela = "Drone ativo. Umidificando talhao com eficiencia de " + taxaRegaDrone + "%.";
        
        atualizarMissao("DRONE", 1); 
        
      } else { 
        feedbackJanela = "Caixa d'agua do drone quase vazia! Ative o 'Regar Tudo' ou espere o dia passar."; 
      }
    }
  }
}

function regarTudo() {
  if (ESTADO !== "JOGANDO") return;
  
  var custoAgua = 500; 
  var regouAlgum = false; 

  if (dinheiro >= custoAgua) {
    for (var i = 0; i < colunas; i++) {
      for (var j = 0; j < linhas; j++) {
        if (fazenda[i][j].umidade < 100) {
          fazenda[i][j].umidade = 100;
          regouAlgum = true;
        }
      }
    }

    if (regouAlgum || aguaReserva < 100) { 
      dinheiro -= custoAgua; 
      aguaReserva = 100; 
      feedbackJanela = "Irrigacao completa ativada! Lavouras e drone 100% abastecidos. (-R$ 500)"; 
      atualizarMissao("REGAR_TUDO", 1);
    } else { 
      feedbackJanela = "Tudo ja esta umido e o drone esta cheio. Nao jogue dinheiro fora!"; 
    }
  } else {
    feedbackJanela = "ALERTA: Voce precisa de R$ 500 para usar a irrigacao total!";
  }
}

function passarDia() {
  if (dinheiro < taxaManutencao) {
    feedbackJanela = "FALENCIA: Saldo insuficiente para taxa operacional!";
    mudarEstado("FIM");
    return; 
  }

  dinheiro -= taxaManutencao;
  dia++; 
  
  atualizarMissao("DIA", dia); 
  
  // MODO HARD: A recarga natural caiu de 20 para apenas 10 por dia
  if(aguaReserva < 100) aguaReserva += 10; 
  if(aguaReserva > 100) aguaReserva = 100;
  
  precoMercadoOntem = precoMercadoHoje; 
  precoMercadoHoje = Math.round(random(180, 360)); 
  
  for (var i = 0; i < colunas; i++) {
    for (var j = 0; j < linhas; j++) {
      var t = fazenda[i][j];
      t.umidade -= Math.round(random(15, 35)); 
      if (t.umidade < 0) t.umidade = 0;
      
      if (t.estado === "plantado") {
        if (t.umidade > 35) {
          t.crescimento += 34; 
          if (t.crescimento >= 100) t.estado = "pronto";
        } else {
          t.estado = "vazio"; 
          sustentabilidade -= 5;
          feedbackJanela = "Perda de safra detectada por estresse hidrico.";
        }
      }
    }
  }

  tempoEstadoEntrada = millis(); 
  statusQuiz = ""; 
  statusGeada = ""; 

  if (_validarGameOver()) return;

  if (poolNarrativas.length === 0) {
    poolNarrativas = [0, 1, 1, 1, 2, 3]; 
  }

  if (dia > 2 && random(100) < 12) { 
    mudarEstado("GEADA"); 
  } else if (random(100) < 55) { 
    var indiceSorteado = Math.floor(random(poolNarrativas.length));
    tipoNarrativa = poolNarrativas[indiceSorteado];
    poolNarrativas.splice(indiceSorteado, 1); 
    mudarEstado("NARRATIVA"); 
  } else if (dia > 1) { 
    indiceQuiz = (indiceQuiz + 1) % bancoQuiz.length; 
    mudarEstado("QUIZ"); 
  }
}

function venderSafra() {
  if (colheitaEstoque > 0) {
    var multiplicador = 1.0;
    
    if (sustentabilidade >= 80) { 
      multiplicador = 1.2; 
      feedbackJanela = "Venda Ecologica! Selo sustentabilidade concedido (+20% lucro)."; 
    } else if (sustentabilidade < 40) { 
      multiplicador = 0.7; 
      feedbackJanela = "Produto desvalorizado pela baixa qualidade ambiental (-30%)."; 
    } else { 
      feedbackJanela = "Venda efetuada com sucesso!"; 
    }

    var lucroGerado = Math.round(colheitaEstoque * precoMercadoHoje * multiplicador);
    dinheiro += lucroGerado;
    colheitaEstoque = 0; 
    sustentabilidade += 2;
    
    atualizarMissao("LUCRO", lucroGerado);
  } else { 
    feedbackJanela = "Nao ha sacas armazenadas no estoque para comercializar."; 
  }
}

function _validarGameOver() {
  if (sustentabilidade <= 15 || (dinheiro <= 0 && sementes === 0 && colheitaEstoque === 0)) {
    if (dia > recordDias) recordDias = dia;
    if (respostasCorretas > recordRespostas) recordRespostas = respostasCorretas; 
    if (dinheiro > recordDinheiro) recordDinheiro = dinheiro;
    mudarEstado("FIM"); 
    return true;
  }
  return false;
}

// ============================================================================
// 5. TELAS VISUAIS
// ============================================================================

function desenharCampos() {
  push();
  translate(40, 140);
  for (var i = 0; i < colunas; i++) {
    for (var j = 0; j < linhas; j++) {
      var tile = fazenda[i][j];
      
      var rSolo = map(tile.umidade, 0, 100, 210, 80);
      var gSolo = map(tile.umidade, 0, 100, 180, 55);
      var bSolo = map(tile.umidade, 0, 100, 140, 30);
      
      fill(rSolo, gSolo, bSolo); 
      stroke(60, 40, 20); 
      strokeWeight(2);
      rect(i * tamanhoTile, j * tamanhoTile, tamanhoTile, tamanhoTile, 4);
      
      if (tile.estado === "plantado") {
        fill(40, 180, 40); 
        noStroke();
        var tamanhoPlanta = map(tile.crescimento, 0, 100, 8, 45);
        ellipse(i * tamanhoTile + 42, j * tamanhoTile + 42, tamanhoPlanta, tamanhoPlanta);
      } else if (tile.estado === "pronto") {
        fill(255, 215, 0); 
        stroke(255); 
        strokeWeight(1);
        rect(i * tamanhoTile + 22, j * tamanhoTile + 22, 40, 40, 8);
        fill(0); 
        textSize(10); 
        textStyle(BOLD); 
        textAlign(CENTER, CENTER);
        text("PRONTO", i * tamanhoTile + 42, j * tamanhoTile + 42);
      }

      if (tile.umidade < 40) {
        fill(255, 0, 0, 180); 
        noStroke();
        rect(i * tamanhoTile + 2, j * tamanhoTile + 2, tamanhoTile - 4, 15);
        fill(255); 
        textSize(9); 
        textStyle(NORMAL); 
        textAlign(CENTER, CENTER);
        text("URGENTE: SECO", i * tamanhoTile + 42, j * tamanhoTile + 10);
      }
    }
  }
  pop();
}

function desenharInterfaceLateral() {
  fill(40, 50, 45); 
  noStroke();
  rect(580, 0, 200, ALTURA_BASE);
  
  // --- TÍTULO ---
  fill(255); 
  textStyle(BOLD); 
  textSize(15); 
  textAlign(CENTER);
  text("AGRINHO VALLEY", 680, 30);
  stroke(255, 40); 
  line(590, 42, 770, 42); 
  noStroke();

  // --- 1. QUADRO DE MISSÕES (SISTEMA DINÂMICO) ---
  textAlign(LEFT);
  fill(0, 255, 150);
  textSize(12);
  textStyle(BOLD);
  var concluidasVisual = missoesConcluidas > 3 ? 3 : missoesConcluidas;
  text("MISSOES Nv." + (nivelMissao + 1) + " (" + concluidasVisual + "/3)", 595, 60);

  var yMissao = 78;
  textSize(11);
  textStyle(NORMAL);
  
  for (var m = 0; m < missoes.length; m++) {
    if (missoes[m].concluida) {
      fill(100, 255, 100); 
      text("✓ " + missoes[m].texto, 595, yMissao, 175, 20);
    } else {
      fill(190); 
      text("☐ " + missoes[m].texto + "\n    (" + missoes[m].progresso + "/" + missoes[m].meta + ")", 595, yMissao, 175, 30);
    }
    yMissao += 26; 
  }

  // --- 2. STATUS GERAIS ---
  var yStatus = 160; 
  
  textStyle(NORMAL); 
  textSize(12); 
  fill(220);
  text("Dia Atual: " + dia, 595, yStatus);
  text("Caixa: R$ " + dinheiro, 595, yStatus + 18);
  text("Sementes: " + sementes, 595, yStatus + 36);
  text("Estoque: " + colheitaEstoque + " sc", 595, yStatus + 54);
  
  fill(255, 235, 150); 
  textStyle(BOLD);
  text("Preco/Saca: R$ " + precoMercadoHoje, 595, yStatus + 74); 

  var variacao = 0;
  if (precoMercadoOntem > 0) {
     variacao = (precoMercadoHoje - precoMercadoOntem) / precoMercadoOntem * 100;
  }
  
  var textoVariacao = "Ontem: R$ " + precoMercadoOntem + " ";
  if (variacao > 0) {
      fill(100, 255, 100); 
      textoVariacao += "▲ (+" + variacao.toFixed(1) + "%)";
  } else if (variacao < 0) {
      fill(255, 100, 100); 
      textoVariacao += "▼ (" + variacao.toFixed(1) + "%)";
  } else {
      fill(150, 150, 150); 
      textoVariacao += "■ (0.0%)";
  }
  
  textSize(10);
  textStyle(NORMAL);
  text(textoVariacao, 595, yStatus + 88);
  
  textSize(12); 
  fill(220);
  text("Volume H2O Drone:", 595, yStatus + 108); 
  fill(50); 
  rect(595, yStatus + 114, 165, 10, 3);
  fill(30, 144, 255); 
  rect(595, yStatus + 114, map(aguaReserva, 0, 100, 0, 165), 10, 3);
  
  text("Sustentabilidade: " + Math.round(sustentabilidade) + "%", 595, yStatus + 138);
  fill(50); 
  rect(595, yStatus + 144, 165, 10, 3);
  if (sustentabilidade > 50) { 
    fill(40, 180, 40); 
  } else { 
    fill(220, 50, 50); 
  }
  rect(595, yStatus + 144, map(sustentabilidade, 0, 100, 0, 165), 10, 3);

  // --- 3. TERMINAL DO DRONE ---
  fill(25); 
  rect(30, 20, 520, 90, 5);
  stroke(0, 255, 0, 100); 
  strokeWeight(1); 
  noFill(); 
  rect(32, 22, 516, 86, 5); 
  noStroke();
  fill(0, 255, 0); 
  textSize(12); 
  textStyle(BOLD);
  text("DRONE TELEMETRIA // OPERACIONAL", 45, 45);
  fill(255); 
  textStyle(NORMAL);
  text(feedbackJanela, 45, 75, 480, 40);
}

function desenharDroneSombra(x, y) {
  if (x > 550 || y > 450) return; 
  
  fill(0, 50); 
  noStroke(); 
  ellipse(x, y + 25, 35, 12);
  stroke(30); 
  strokeWeight(3);
  line(x - 20, y - 20, x + 20, y + 20); 
  line(x + 20, y - 20, x - 20, y + 20);
  
  noStroke(); 
  fill(0, 200, 255);
  ellipse(x - 20, y - 20, 18, 6); 
  ellipse(x + 20, y - 20, 18, 6);
  ellipse(x - 20, y + 20, 18, 6); 
  ellipse(x + 20, y + 20, 18, 6);
  
  fill(240); 
  stroke(50); 
  strokeWeight(1); 
  ellipse(x, y, 16, 16); 
  fill(0, 255, 0); 
  noStroke(); 
  ellipse(x, y, 6, 6);
}

function telaTutorial() {
  fill(35, 45, 40); 
  rect(0, 0, LARGURA_BASE, ALTURA_BASE);
  fill(255); 
  textAlign(CENTER); 
  textStyle(BOLD); 
  textSize(24);
  text("DIRETRIZES: TECNOLOGIA AGRINHO 2026", LARGURA_BASE/2, 80);
  stroke(255, 40); 
  line(100, 110, 680, 110); 
  noStroke();
  
  textStyle(NORMAL); 
  textSize(15); 
  textAlign(LEFT);
  var txt = "Parabens! Voce assumiu o comando de um drone de monitoramento sustentavel.\n\n" +
            "1. MERCADO E CAPITAL: Sementes agora custam dinheiro. Venda a safra na alta do mercado!\n" +
            "2. PLANTAR: Clique no solo umido gastando uma semente do seu estoque.\n" +
            "3. REGAR TUDO: O Drone umedece o solo ao passar por cima. Se a seca apertar, use a funcao Regar Tudo (R$ 500).\n" + 
            "4. MANUTENCAO: Passar o dia custa R$ 25 de taxa operacional.";
  text(txt, 100, 140, 580, 320);
}

function telaQuizFlipped() {
  fill(25, 75, 120); 
  rect(0, 0, LARGURA_BASE, ALTURA_BASE);
  fill(255); 
  textAlign(CENTER, TOP); 
  textStyle(BOLD); 
  textSize(20);
  text("AUDITORIA INTERNA ADAPAR", LARGURA_BASE/2, 40);
  
  textStyle(NORMAL); 
  textSize(16); 
  textAlign(CENTER, TOP); 
  fill(255);
  text(bancoQuiz[indiceQuiz].q, 100, 80, 580, 100); 
  
  stroke(255, 30); 
  line(100, 180, 680, 180); 
  noStroke();
  
  fill(120, 255, 120); 
  textSize(13); 
  textStyle(BOLD);
  text("ACERTO PADRAO: +R$ 250 e +5% Sustentabilidade", LARGURA_BASE/2, 185);
  
  fill(255, 120, 120);
  text("ERRO PADRAO: -12% / INFRACOES GRAVES: -45%", LARGURA_BASE/2, 225);
  
  fill(240, 240, 100); 
  textSize(14); 
  textStyle(BOLD); 
  
  text("Opcao [A]:\n" + bancoQuiz[indiceQuiz].a, 160, 270, 200, 120);
  text("Opcao [B]:\n" + bancoQuiz[indiceQuiz].b, 420, 270, 200, 120);

  if (statusQuiz !== "") {
    if (statusQuiz.includes("EXATA")) {
      fill(100, 255, 100);
    } else {
      fill(255, 100, 100);
    }
    textSize(18); 
    textStyle(BOLD); 
    text(statusQuiz, LARGURA_BASE/2, 470);
  }
}

function telaNarrativaVisual() {
  fill(40, 30, 50); 
  rect(0, 0, LARGURA_BASE, ALTURA_BASE);
  fill(255); 
  textAlign(CENTER, TOP); 
  textStyle(BOLD); 
  textSize(18);
  text("DECISAO DE IMPACTO E UPGRADES TECNOLOGICOS", LARGURA_BASE/2, 50);
  stroke(255, 30); 
  line(100, 90, 680, 90); 
  noStroke();

  textSize(15); 
  textStyle(NORMAL); 
  fill(230);
  
  var textoDescricao = "";
  if (tipoNarrativa === 0) {
    textoDescricao = "Uma praga ameaca a regiao do Vale. Como deseja conduzir o manejo defensivo?";
  } else if (tipoNarrativa === 1) {
    textoDescricao = "Uma central de tecnologia satelital tem melhorias disponiveis para o seu Drone.";
  } else if (tipoNarrativa === 2) {
    textoDescricao = "Voce foi visitado por um empreendedor de risco! Ele quer lhe fazer uma proposta.";
  } else if (tipoNarrativa === 3) {
    textoDescricao = "Sua fazenda chamou atencao! Voce recebeu duas propostas de apoio tecnico.";
  }
  text(textoDescricao, 100, 120, 580, 100);

  textAlign(CENTER, TOP); 
  fill(240); 
  
  if (tipoNarrativa === 0) {
    text("Opcao [A] - Usar defensivos quimicos agressivos\n(Ganha R$ 400 / Perde -20 Sustentabilidade)", 100, 220, 580, 80);
    text("Opcao [B] - Adotar defensivo biologico integrado\n(Sustentabilidade +10 / Ganho de resiliencia nas colheitas)", 100, 300, 580, 80);
  } else if (tipoNarrativa === 1) {
    if (nivelAntena === 0) {
      text("Opcao [A] - Comprar Antena Conectada V1\n(Custo: R$ 400 / Taxa de rega sobe para 30%)", 100, 220, 580, 80);
      text("Opcao [B] - Recusar upgrade por enquanto", 100, 300, 580, 80);
    } else if (nivelAntena === 1) {
      text("Opcao [A] - Comprar Modulo Aspersao V2\n(Custo: R$ 750 / Taxa de rega sobe para 50%)", 100, 220, 580, 80);
      text("Opcao [B] - Manter equipamento atual", 100, 300, 580, 80);
    } else {
      text("SISTEMA DE TELEMETRIA NO NIVEL MAXIMO!", 100, 220, 580, 80);
      text("Opcao [B] - Voltar a missao", 100, 300, 580, 80);
    }
  } else if (tipoNarrativa === 2) {
    text("Opcao [A] - Expandir Cooperativismo de Tilapia\n(Custo: R$ 300 / Ganha +15% Sustentabilidade e bonus)", 100, 220, 580, 80);
    text("Opcao [B] - Importar Pitaya Indigena dos Emirados\n(Custo: R$ 500 / Promessa comercial de alto risco)", 100, 300, 580, 80);
  } else if (tipoNarrativa === 3) {
    text("Opcao [A] - Aceitar parceria com o IDR-Parana\n(+20 Sustentabilidade, praticas seguras)", 100, 220, 580, 80);
    text("Opcao [B] - Assinar contrato com AgroFacilPR S.A.\n(Promessa de lucro com quimicos / Alto Risco)", 100, 300, 580, 80);
  }

  if (msgErroNarrativa !== "") {
    fill(255, 80, 80);
    textSize(16);
    textStyle(BOLD);
    text(msgErroNarrativa, LARGURA_BASE/2, 470);
  }
}

function telaGeada() {
  fill(25, 5, 5); 
  rect(0, 0, LARGURA_BASE, ALTURA_BASE);
  
  if (frameCount % 40 < 20) {
    fill(255, 0, 0);
  } else {
    fill(150, 0, 0);
  }
  
  textAlign(CENTER, TOP); 
  textStyle(BOLD); 
  textSize(24);
  text("AVISO: GEADA NEGRA SE APROXIMANDO", LARGURA_BASE/2, 45);
  stroke(255, 0, 0, 60); 
  line(100, 85, 680, 85); 
  noStroke();
  
  fill(220); 
  textSize(14); 
  textStyle(NORMAL); 
  textAlign(CENTER, TOP);
  var contextualizacao = "Diferente da geada branca, a geada negra nao gera gelo visual sobre a planta. O ar esta extremamente seco e o vento frio e cortante faz com que a seiva interna congele, matando os tecidos vegetais por dentro.";
  text(contextualizacao, 100, 110, 580, 110);
  stroke(255, 255, 255, 30); 
  line(100, 225, 680, 225); 
  noStroke();
  
  fill(255, 215, 0); 
  textStyle(BOLD); 
  textSize(16);
  text("COMO A GEADA NEGRA REALMENTE DESTROI OS CULTIVOS?", LARGURA_BASE/2, 245);
  
  fill(255); 
  textSize(15);
  text("Opcao [A]: Congelamento interno da seiva celular provocado pelo frio extremo e ar seco.", 100, 285, 580, 50);
  text("Opcao [B]: Chuva de cristais negros de granizo que esmagam mecanicamente as folhas.", 100, 345, 580, 50);
  
  if (statusGeada !== "") {
    if (statusGeada.includes("UNICO")) {
      fill(100, 255, 100);
    } else {
      fill(255, 50, 50);
    }
    textSize(18); 
    textStyle(BOLD); 
    text(statusGeada, 100, 470, 580, 80);
  }
}

function telaRecords() {
  fill(20, 25, 35); 
  rect(0, 0, LARGURA_BASE, ALTURA_BASE);
  fill(0, 255, 150); 
  textAlign(CENTER); 
  textStyle(BOLD); 
  textSize(26);
  text("HISTORICO DE RECORDES", LARGURA_BASE/2, 80);
  stroke(0, 255, 150, 50); 
  line(100, 110, 680, 110); 
  noStroke();
  
  textStyle(NORMAL); 
  textSize(18); 
  textAlign(LEFT); 
  fill(240);
  text("• Maior Tempo em Operacao: " + recordDias + " dias", 180, 180);
  text("• Respostas Corretas: " + recordRespostas, 180, 230);
  text("• Maior Capital Acumulado: R$ " + recordDinheiro, 180, 280);
  
  textAlign(CENTER); 
  textSize(13); 
  fill(120, 150, 140);
  text("Atualizados automaticamente ao perder ou reiniciar o jogo.", LARGURA_BASE/2, 360);
}

function telaFimDeJogo() {
  fill(15, 15, 15); 
  rect(0, 0, LARGURA_BASE, ALTURA_BASE);
  fill(255, 50, 50); 
  textAlign(CENTER); 
  textStyle(BOLD); 
  textSize(28);
  text("FIM DA JORNADA", LARGURA_BASE/2, ALTURA_BASE/2 - 80);
  
  fill(240); 
  textSize(16); 
  textStyle(NORMAL);
  text("A propriedade nao conseguiu equilibrar producao e preservacao.", LARGURA_BASE/2, ALTURA_BASE/2 - 20);
  text("Sustentabilidade Final: " + Math.round(sustentabilidade) + "%", LARGURA_BASE/2, ALTURA_BASE/2 + 20);
  
  fill(255, 215, 0); 
  text("Dinheiro Final: R$ " + Math.round(dinheiro), LARGURA_BASE/2, ALTURA_BASE/2 + 60);
  fill(100, 200, 255); 
  text("Dias em Operacao: " + dia, LARGURA_BASE/2, ALTURA_BASE/2 + 100);
}

// ============================================================================
// 6. EVENTOS, INTERAÇÕES E FUNÇÕES DE MISSÃO
// ============================================================================

function mousePressed() {
  if (ESTADO !== "JOGANDO") return;

  var mx = (mouseX - margemX) / escala;
  var my = (mouseY - margemY) / escala;

  var gridX = Math.floor((mx - 40) / tamanhoTile);
  var gridY = Math.floor((my - 140) / tamanhoTile);

  if (gridX >= 0 && gridX < colunas && gridY >= 0 && gridY < linhas) {
    var t = fazenda[gridX][gridY];
    
    if (t.estado === "vazio" && t.umidade >= 50) {
      if (sementes > 0) {
        t.estado = "plantado"; 
        t.crescimento = 0; 
        sementes--;
        feedbackJanela = "Semente plantada no talhao.";
        
        atualizarMissao("PLANTAR", 1); 
        
      } else { 
        feedbackJanela = "Sem sementes no inventario."; 
      }
    } else if (t.estado === "pronto") {
      t.estado = "vazio"; 
      colheitaEstoque++; 
      sustentabilidade += bonusSustentabilidadeColheita; 
      feedbackJanela = "Graos colhidos e armazenados.";
      
      atualizarMissao("COLHER", 1);
    }
  }
}

function keyPressed() {
  var tecla = key.toLowerCase();
  if (tecla === 'a' || tecla === 'b') {
    responderInteracao(tecla);
  }
}

function responderInteracao(tecla) {
  if (millis() - tempoEstadoEntrada < 500) return; 
  
  if (ESTADO === "NARRATIVA" || ESTADO === "GEADA") {
    processarDecisoesEEventos(tecla);
  }
  
  if (ESTADO === "QUIZ") {
    if (statusQuiz !== "") return; 

    btnOpcaoA.hide();
    btnOpcaoB.hide();

    var q = bancoQuiz[indiceQuiz];
    
    if (tecla === q.res) {
      if (q.q.includes("escoar e exportar")) {
        dinheiro += 700; 
        statusQuiz = "EXATA! Parabens pelo lucro do porto! (+R$ 700)";
      } else { 
        dinheiro += 250; 
        statusQuiz = "EXATA! (+R$ 250 / +5% Sustentabilidade)"; 
      }
      sustentabilidade += 5; 
      respostasCorretas++; 
      
      if (sustentabilidade > 100) {
        sustentabilidade = 100;
      }
      feedbackJanela = "Certificacao homologada com sucesso!";
      
      atualizarMissao("QUIZ", 1); // Atualiza missao de acertar perguntas

    } else {
      if (q.tipo === "fiscalizacao") {
        sustentabilidade -= 45; 
        statusQuiz = "INFRACAO GRAVE: -45% Sustentabilidade";
        feedbackJanela = "ALERTA: Crime ambiental/falsa rotulacao detectado.";
      } else {
        sustentabilidade -= 12; 
        statusQuiz = "INCORRETA! (-12% Sustentabilidade)";
        feedbackJanela = "Infracao detectada!";
      }
    }
    
    setTimeout(function() { 
      mudarEstado("JOGANDO"); 
      statusQuiz = ""; 
      _validarGameOver(); 
    }, 2500); 
  }
}

function processarDecisoesEEventos(tecla) {
  if (ESTADO === "NARRATIVA") {
    var continuou = false;
    msgErroNarrativa = ""; 

    if (tipoNarrativa === 0) {
      if (tecla === 'a') { 
        dinheiro += 400; 
        sustentabilidade -= 20; 
        feedbackJanela = "Quimicos aplicados. Solo fragilizado."; 
        continuou = true;
      } else if (tecla === 'b') { 
        sustentabilidade += 10; 
        bonusSustentabilidadeColheita = 2; 
        feedbackJanela = "Manejo biologico ativo!"; 
        continuou = true;
      }
    } else if (tipoNarrativa === 1) {
      if (nivelAntena === 0) {
        if (tecla === 'a') {
          if (dinheiro >= 400) {
            dinheiro -= 400; 
            taxaRegaDrone = 30; 
            nivelAntena = 1; 
            feedbackJanela = "Upgrade V1 instalado! Taxa de rega agora e 30%."; 
            continuou = true;
          } else {
            msgErroNarrativa = "ALERTA: Saldo insuficiente para Antena V1!";
          }
        } else if (tecla === 'b') { 
          feedbackJanela = "Upgrade recusado por enquanto."; 
          continuou = true; 
        }
      } else if (nivelAntena === 1) {
        if (tecla === 'a') {
          if (dinheiro >= 750) {
            dinheiro -= 750; 
            taxaRegaDrone = 50; 
            nivelAntena = 2; 
            feedbackJanela = "Upgrade V2 MAX instalado! Taxa de rega agora e 50%."; 
            continuou = true;
          } else {
            msgErroNarrativa = "ALERTA: Saldo insuficiente para Aspersao V2!";
          }
        } else if (tecla === 'b') { 
          feedbackJanela = "Equipamento atual mantido."; 
          continuou = true; 
        }
      } else { 
        if (tecla === 'b') {
          feedbackJanela = "Missao retomada.";
          continuou = true;
        } 
      }
    } else if (tipoNarrativa === 2) { 
      if (tecla === 'a') {
        if (dinheiro >= 300) {
          dinheiro -= 300; 
          sustentabilidade += 15; 
          bonusSustentabilidadeColheita += 1; 
          feedbackJanela = "Cooperativa de Tilapia fortalecida!"; 
        } else {
          feedbackJanela = "Proposta da Cooperativa cancelada por falta de fundos.";
        }
        continuou = true; 
      } else if (tecla === 'b') {
        if (dinheiro >= 500) {
          dinheiro -= 500; 
          sustentabilidade -= 10; 
          feedbackJanela = "Prejuizo! Pitayas nao toleraram o clima."; 
        } else {
          feedbackJanela = "Importacao de Pitayas cancelada por falta de fundos.";
        }
        continuou = true; 
      }
    } else if (tipoNarrativa === 3) {
      if (tecla === 'a') { 
        sustentabilidade += 20; 
        feedbackJanela = "Parceria IDR-Parana ativada!"; 
        continuou = true;
      } else if (tecla === 'b') { 
        dinheiro -= (dinheiro * 0.8); 
        sustentabilidade -= 60; 
        feedbackJanela = "GOLPE! AgroFacilPR roubou os fundos."; 
        continuou = true;
      }
    }
    
    if (continuou) {
      if (sustentabilidade > 100) sustentabilidade = 100;
      btnOpcaoA.hide();
      btnOpcaoB.hide();
      mudarEstado("JOGANDO"); 
      _validarGameOver();
    }
  }

  if (ESTADO === "GEADA") {
    if (statusGeada !== "") return; 
    
    btnOpcaoA.hide();
    btnOpcaoB.hide();

    if (tecla === 'a') {
      statusGeada = "VOCE FOI O UNICO QUE NAO FOI ATINGIDO!"; 
      feedbackJanela = "Lavoura escapou da geada negra.";
    } else if (tecla === 'b') {
      statusGeada = "RESPOSTA INCORRETA! Lavoura destruida."; 
      feedbackJanela = "Desastre climatico total.";
      sementes = 0; 
      sustentabilidade -= 15;
      
      for (var i = 0; i < colunas; i++) {
        for (var j = 0; j < linhas; j++) {
          fazenda[i][j].estado = "vazio"; 
          fazenda[i][j].crescimento = 0;
        }
      }
    }
    
    setTimeout(function() { 
      mudarEstado("JOGANDO"); 
      statusGeada = ""; 
      _validarGameOver(); 
    }, 3500);
  }
}

// --- SISTEMA DINÂMICO DE MISSÕES EM FASES ---

function carregarMissoes() {
  missoesConcluidas = 0;
  
  if (nivelMissao === 0) {
    missoes = [
      { tipo: "PLANTAR", texto: "Plante 8 sementes", meta: 8, progresso: 0, concluida: false },
      { tipo: "DRONE", texto: "Drone umidificar 5x", meta: 5, progresso: 0, concluida: false },
      { tipo: "DIA", texto: "Sobreviva 10 dias", meta: 10, progresso: dia, concluida: false }
    ];
  } else if (nivelMissao === 1) {
    missoes = [
      { tipo: "PLANTAR", texto: "Plante 15 sementes", meta: 15, progresso: 0, concluida: false },
      { tipo: "QUIZ", texto: "Acerte 10 perguntas", meta: 10, progresso: 0, concluida: false },
      { tipo: "DIA", texto: "Sobreviva 20 dias", meta: 20, progresso: dia, concluida: false }
    ];
  } else if (nivelMissao === 2) {
    missoes = [
      { tipo: "COLHER", texto: "Colha 15 safras", meta: 15, progresso: 0, concluida: false },
      { tipo: "QUIZ", texto: "Acerte 10 perguntas", meta: 10, progresso: 0, concluida: false },
      { tipo: "DIA", texto: "Sobreviva 30 dias", meta: 30, progresso: dia, concluida: false }
    ];
  } else if (nivelMissao === 3) {
    missoes = [
      { tipo: "LUCRO", texto: "Lucro R$ 5k (Nesta fase)", meta: 5000, progresso: 0, concluida: false },
      { tipo: "QUIZ", texto: "Acerte 10 perguntas", meta: 10, progresso: 0, concluida: false },
      { tipo: "DIA", texto: "Sobreviva 40 dias", meta: 40, progresso: dia, concluida: false }
    ];
  } else if (nivelMissao === 4) {
    missoes = [
      { tipo: "REGAR_TUDO", texto: "Use Regar Tudo 2x", meta: 2, progresso: 0, concluida: false },
      { tipo: "QUIZ", texto: "Acerte 10 perguntas", meta: 10, progresso: 0, concluida: false },
      { tipo: "DIA", texto: "Sobreviva 50 dias", meta: 50, progresso: dia, concluida: false }
    ];
  } else {
    missoes = [
      { tipo: "FIM", texto: "Mestre do Agrinho!", meta: 1, progresso: 1, concluida: true },
      { tipo: "FIM", texto: "Todas as Fases Concluidas", meta: 1, progresso: 1, concluida: true },
      { tipo: "FIM", texto: "Continue Produzindo", meta: 1, progresso: 1, concluida: true }
    ];
    missoesConcluidas = 3;
  }

  // Trava de segurança: Se ao carregar a fase o dia já for maior que a meta, completa automaticamente
  for (var i = 0; i < missoes.length; i++) {
     if (missoes[i].tipo === "DIA") {
        if (dia >= missoes[i].meta) {
           missoes[i].progresso = missoes[i].meta;
           missoes[i].concluida = true;
           missoesConcluidas++;
        } else {
           missoes[i].progresso = dia;
        }
     }
  }
}

function atualizarMissao(tipo, valor) {
  for (var i = 0; i < missoes.length; i++) {
    if (missoes[i].tipo === tipo && !missoes[i].concluida) {
      
      if (tipo === "DIA") {
         missoes[i].progresso = valor; 
      } else {
         missoes[i].progresso += valor; 
      }

      if (missoes[i].progresso >= missoes[i].meta) {
         missoes[i].progresso = missoes[i].meta;
         missoes[i].concluida = true;
         missoesConcluidas++;
         
         feedbackJanela = "MISSAO CONCLUIDA: " + missoes[i].texto + "! (+ R$ 300)";
         dinheiro += 300; 
      }
    }
  }
  
  // Verifica se o jogador completou as 3 missoes da fase atual
  if (missoesConcluidas === 3 && nivelMissao < 4) {
     missoesConcluidas = 4; // Trava para nao disparar multiplos timers
     setTimeout(function() {
       nivelMissao++;
       carregarMissoes();
       feedbackJanela = "PARABENS! NOVO NIVEL DE MISSOES DESBLOQUEADO!";
     }, 3000); // Espera 3 segundos para o jogador ver que completou tudo antes de trocar
  }
}