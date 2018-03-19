var playerPic;
var player;
var allPokeBalls = []; 
var pokemon1 = [];
var pokemonImage1;
var pokemonImage2;
var lugiaLeft;
var lugiaRight;
var allPokemon = [];
var gameLevel = 1;
/*
var allPokemon1 = [];//all level 1 pokemon (pikachu)
var allPokemon2 = [];//level 2 pokemon - Charmander
*/
var lugia;
let attacks = [];
var timer = 0;
var gameState = "start";
var score = 0;

function preload(){
	playerPic = loadImage("images/trainer1.png");
	ball = loadImage("images/pokeball.png");
	pokemonImage1 = loadImage("images/pikachu.png");
	pokemonImage2 = loadImage("images/pokemonSprites/charmander.png");
	lugiaLeft = loadImage("images/lugialeft.png");
	lugiaRight = loadImage("images/lugiaright.png");
}
//PROBLEMS: INVADER SCORE DOES NOT UPDATE FOR LEVEL 2	
function loadPokemon(level){
	let startingXPos = 120;
	let startingYPos = 125;
	if (level === 3){
		lugia = new Pokemon(200,200,3);
	}
	else{
		for (let i = 0; i < 5; i ++){
			for (let j = 0; j < 7; j++){
				if (level === 1){
					var pokemon = new Pokemon(startingXPos, startingYPos, 1);
					allPokemon.push(pokemon);
				}
				else if (level === 2){
					var pokemon = new Pokemon(startingXPos, startingYPos, 2);
					allPokemon.push(pokemon);
				}
				startingXPos += 40;	
			}
			startingXPos = 120;
			startingYPos += 27;
		}
	}
	
	
}
function setup(){
	createCanvas(500,500);
	background(0);
	loadPokemon(gameLevel);
	/*
	loadPokemon(1);
	loadPokemon(2);
	loadPokemon(3);
	*/
	player = new Player();
	imageMode(CENTER);

}

function keyPressed(){
	if (keyCode === 32){
		player.throwBall();
	}
}
function draw(){
	background(0);
	if (gameState === "start"){
		gamePlay();
	}
	else{
		gameEnd();
	}
}
function gameEnd(){
	textSize(40);
	text("GAME OVER", 200, 200);
	text("Score: ", 200, 240);
	text(score, 340, 240);
}
function playLevel(level){
	if (level === 1){
		allPokemon.forEach(function(pokemon){
			pokemon.display();
			//pokemon.move();
			pokemon.checkHits();
		});
		for(let i = 0; i < allPokemon.length; i ++){
			if (allPokemon[i].numHits >= allPokemon[i].level){
				allPokemon.splice(i,1);
				score += 1;
				i --;
			}
		}
	}
	else if (level === 2){

		allPokemon.forEach(function(pokemon){
			pokemon.display();
			pokemon.checkHits();
		});
		for(let i = 0; i < allPokemon.length; i ++){
			if (allPokemon[i].numHits >= allPokemon[i].level){
				allPokemon.splice(i,1);
				score += 1;
				i --;
			}
		}
	}
	else {
		lugia.moveAndDisplay();
		lugia.checkHits();
	}

}
function gamePlay(){
	textSize(20);
	fill(200,200,200);
	text('Invader Score', 10, 30);
	text(player.numHits, 10, 50);
	text('Player Score', 370, 30);
	text(score, 400, 50);
	player.display();
	player.move();
	player.checkHits();


	if (allPokemon.length <=0 ){
		gameLevel++;
		loadPokemon(gameLevel);
	}
	playLevel(gameLevel);

	// HEREEEEEEEEEE
	/*
	if (allPokemon.length > 0){
		playLevel(1);
	}
	else if (allPokemon1.length === 0){
		playLevel(2);
	}
	else if (allPokemon2.length === 0){
		playLevel(3);
	}
	*/
	
	// removing balls that have gone out of bounds
	for(let i = 0; i < allPokeBalls.length; i ++){
		if (allPokeBalls[i].yPos <= 0){
			allPokeBalls.splice(i, 1);
			i--;
		}
		else{
			allPokeBalls[i].moveAndDisplay();
		}
	}	
	
	//removing attacks that hit the player
	for(let i = 0; i < attacks.length; i++){
        if(attacks[i].y > 500 || dist(attacks[i].x, attacks[i].y, player.xPos, player.yPos) < 25 ){
            attacks.splice(i,1);
            i--;
        }

        else{
            attacks[i].display();
        }
    }

    if (player.numHits === 20){
    	gameState = "end";
    }
}


class Player{
	constructor(){
		this.xPos = 250;
		this.yPos = 450;
		this.speed = 5;
		this.pic = playerPic;
		this.numHits = 0;
	}

	display(){
		playerPic.resize(50,50);
		image(this.pic, this.xPos, this.yPos);
	}

	move(){
		if (keyIsDown(65) && this.xPos>0) this.xPos -= this.speed; // A <--
		if (keyIsDown(68) && this.xPos<width) this.xPos += this.speed; // D -->
		
	}

	throwBall(){
		let ball = new Ball(this.xPos, this.yPos);
		allPokeBalls.push(ball);	
	}

	checkHits(){
		for(let i = 0; i < attacks.length; i ++){
			if (dist(attacks[i].x, attacks[i].y, this.xPos, this.yPos) < 25){
				this.numHits += 1;
			}
		}
	}


}

class Ball {
	constructor(xPos, yPos){
		this.xPos = xPos;
		this.yPos = yPos;
		this.ySpeed = 1;
	}	

	moveAndDisplay(){
		image(ball, this.xPos, this.yPos, 15, 15);
		this.yPos -= this.ySpeed;
	}

}

class Pokemon {
	//level indicates how many balls needs to hit the pokemon in order for it to be caught
	constructor(xPos, yPos, level){
		this.x = xPos;
		this.y = yPos;
		this.status = 1// 1 means alive, 0 means dead
		//this.image = img;
		this.level = level;
		this.numHits = 0;
		this.numRight = 0;//how many times the pokemon moved right
		this.numLeft = 0;//how many times the pokemon moved left

		//POINT B:
		

	}
	display(){
		if (this.level === 1){
			image(pokemonImage1, this.x, this.y, 40, 50);
		}
		else if (this.level === 2){
			image(pokemonImage2, this.x, this.y, 40, 50);
		}
		let test = Math.floor(random(600));
		if (test == 333){
            this.attack();
        }


	}
	//level 3 pokemon moves depending on players move
	moveAndDisplay(){
		// randomly move up and down, keep reassigning new end points (yPos)
		if (this.y < player.xPos){
			this.y += 3;
		}
		else{
			this.y -= 3;
		}

		// go right
		if (this.x < player.xPos){
			this.x += 3;
			image(lugiaRight, this.x, this.y, 90, 90);
		}
		//go left
		else if (this.x === player.xPos){
			this.y -= 3;
		}
		else{
			this.x -= 3;
			image(lugiaLeft, this.x, this.y, 90, 90);
		}

		let test = Math.floor(random(600));
		if (test == 333){
            this.attack();
        }
		
	}
	
	checkHits(){
		for(let i = 0; i < allPokeBalls.length; i ++){
			if (this.level === 3){
				if (dist(allPokeBalls[i].xPos, allPokeBalls[i].yPos, this.x, this.y) <= 53){
					this.numHits += 1;
					allPokeBalls.splice(i, 1);
					i --;
				}
			}
			else{
				if (dist(allPokeBalls[i].xPos, allPokeBalls[i].yPos, this.x, this.y) < 30){
					this.numHits += 1;
					allPokeBalls.splice(i, 1);
					i --;
				}
			}
			
		}
	}
	attack(){
		let a = new Attack(this.x, this.y);
		attacks.push(a);
	}
}
class Attack {
    constructor(xPos, yPos){
        this.x = xPos;
        this.y = yPos;
        this.ySpeed = 2;
    }   
    display(){
        fill(255,255,random(255));
        ellipse(this.x, this.y+10, 10, 10)
        this.y += this.ySpeed;
    }
}
