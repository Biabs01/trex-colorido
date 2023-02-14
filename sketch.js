var PLAY = 1;
var END = 0;
var estadoDeJogo = PLAY;

var planoDeFundo, planoDeFundoImagem;
var sol, solImagem;

var trex, trex_correndo, trex_colidindo;
var chao, chaoImagem, chaoInvisivel;

var nuvens, nuvemImagem, grupoNuvens;
var obstaculos, obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6, grupoCactos;
var pontos;
var gameOverImg, restartImg;
var jumpSom, dieSom, checkPointSom; 

function preload() {
  trex_correndo = loadAnimation("trex_1.png", "trex_2.png", "trex_3.png");
  trex_colidindo = loadAnimation("trex_collided.png");
  
  chaoImagem = loadImage("ground.png");
  planoDeFundoImagem = loadImage("backgroundImg.png");
  solImagem = loadImage("sun.png");
  
  nuvemImagem = loadImage("cloud.png");
  
  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSom = loadSound("jump.mp3");
  checkPointSom = loadSound("checkPoint.mp3");
  dieSom = loadSound("die.mp3");

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  //criando o sol
  sol = createSprite(width-50, 100, 10, 10);
  sol.addAnimation("sol", solImagem);
  sol.scale = 0.08;
  
  //criando o trex
  trex = createSprite(50, height-70, 20, 50);
  trex.addAnimation("correndo", trex_correndo);
  trex.addAnimation("colidiu", trex_colidindo);
  trex.setCollider("circle", 0, 0,350);
  trex.scale = 0.08;
  trex.x = 50;
  
  //criando o chao
  chao = createSprite(width/2, height, width, 2);
  chao.addImage("chao", chaoImagem);
  chao.x = chao.width/2;

  //criando chao invísivel
  chaoInvisivel = createSprite(width/2, height - 10, width, 125);
  chaoInvisivel.visible = false;

  gameOver = createSprite(width/2, height/2 - 50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);
  restart.scale = 0.1;
  restart.visible = false;

  grupoCactos = new Group();
  grupoNuvens = new Group();

  pontos = 0;

}

function draw() {
  background(planoDeFundoImagem);
  textSize(20);
  fill("black");
  text("Pontuação: " + pontos, 30, 50);

  if(estadoDeJogo === PLAY){
    pontos = pontos + Math.round(getFrameRate()/60);
    if(pontos > 0 && pontos % 100 === 0){
      checkPointSom.play();
    }

    chao.velocityX = -(6 + 3*pontos/100);
   
    if (chao.x < 0){
      chao.x = chao.width/2; 
    }

    if(touches.length > 0 || keyDown("space") && trex.y >= height-120)
    {
      trex.velocityY = -10;
      jumpSom.play();
      touches = [];
    }

    trex.velocityY = trex.velocityY + 0.5;

    criarNuvens();
    criarObstaculos();

    if(grupoCactos.isTouching(trex)){
      estadoDeJogo = END;
      dieSom.play();
    }
  }
  else if(estadoDeJogo === END){
    chao.velocityX = 0;
    
    gameOver.visible = true;
    restart.visible = true;

    grupoCactos.setVelocityXEach(0);
    grupoNuvens.setVelocityXEach(0);

    grupoCactos.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);
    
    trex.velocityY = 0;
    trex.changeAnimation("colidiu", trex_colidindo);

    if(touches.length > 0 || keyDown("space")){
      reset();
      touches = [];
    }
  }

  trex.collide(chaoInvisivel);
  
  drawSprites();
}

function criarNuvens(){
  if(frameCount % 60 === 0) {
    nuvens = createSprite(width+20, height-300, 40, 10);
    nuvens.addImage(nuvemImagem);
    nuvens.y = Math.round(random(100, 220));
    nuvens.scale = 0.5;
    nuvens.velocityX = -3;

    nuvens.lifetime = 300;

    nuvens.depth = trex.depth;
    trex.depth = trex.depth + 1;

    grupoNuvens.add(nuvens);
  }
}

function criarObstaculos(){
  if(frameCount % 60 === 0) {
    obstaculos = createSprite(600, height-95, 10, 40);
    obstaculos.velocityX = -(6 + 3*pontos/100);

    var aleatorio = Math.round(random(1,6));
    switch(aleatorio) {
      case 1: obstaculos.addImage(obstaculo1);
      break;
      case 2: obstaculos.addImage(obstaculo2);
      break;
      case 3: obstaculos.addImage(obstaculo3);
      break;
      case 4: obstaculos.addImage(obstaculo4);
      break;
      default: break;
    }

    obstaculos.scale = 0.3;
    obstaculos.lifetime = 300;
    obstaculos.depth = trex.depth;
    trex.depth = trex.depth + 1;

    grupoCactos.add(obstaculos);
  }
}

function reset(){
  estadoDeJogo = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  grupoCactos.destroyEach();
  grupoNuvens.destroyEach();

  trex.changeAnimation("correndo", trex_correndo);
  pontos = 0;
}