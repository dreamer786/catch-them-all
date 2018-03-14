
var playerPic;
var player;
var allPokeBalls = []; 
var pokemon1 = [];
var pokemonImage1;
var pokemonImage2;
var allPokemon1 = [];//all level 1 pokemon (pikachu)
var allPokemon2 = [];//level 2 pokemon - Charmander
let attacks = [];
var timer = 0;
var gameState = "start";
var score = 0;

function preload(){
	playerPic = loadImage("images/trainer1.png");
	ball = loadImage("images/pokeball.png");
	pokemonImage1 = loadImage("images/pikachu.png");
	pokemonImage2 = loadImage("images/Charmander.png");
}

function loadPokemon(level){
	let startingXPos = 120;
	let startingYPos = 125;
	for (let i = 0; i < 5; i ++){
		for (let j = 0; j < 7; j++){
			if (level === 1){
				var pokemon = new Pokemon(startingXPos, startingYPos, 1);
				allPokemon1.push(pokemon);
			}
			else if (level === 2){
				var pokemon = new Pokemon(startingXPos, startingYPos, 2);
				allPokemon2.push(pokemon);
			}
			startingXPos += 40;	
		}
		startingXPos = 120;
		startingYPos += 27;
	}
	
}
function setup(){
	createCanvas(500,500);
	background(0);
	loadPokemon(1);
	loadPokemon(2);
	player = new Player();
	/*
	let startingXPos = 120;
	let startingYPos = 125;
	for (let i = 0; i < 5; i ++){
		for (let j = 0; j < 7; j++){
			var pokemon = new Pokemon(startingXPos, startingYPos, 1);
			allPokemon1.push(pokemon);
			startingXPos += 40;	
		}
		startingXPos = 120;
		startingYPos += 27;
	}
	*/
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
	text(score, 240, 240);
}
function playLevel(level){
	if (level === 1){
		allPokemon1.forEach(function(pokemon){
			pokemon.display();
			pokemon.checkHits();
		});
		for(let i = 0; i < allPokemon1.length; i ++){
			if (allPokemon1[i].numHits === allPokemon1[i].level){
				allPokemon1.splice(i,1);
				score += 1;
				i --;
			}
		}
	}
	else if (level === 2){
		allPokemon2.forEach(function(pokemon){
			pokemon.display();
			pokemon.checkHits();
		});
		for(let i = 0; i < allPokemon2.length; i ++){
			if (allPokemon2[i].numHits === allPokemon2[i].level){
				allPokemon2.splice(i,1);
				score += 1;
				i --;
			}
		}
	}

}
function gamePlay(){
	textSize(40);
	text('Number of Hits to Player', 10, 30);
	text(player.numHits, 10, 70);
	player.display();
	player.move();
	player.checkHits();
	if (allPokemon1.length > 0){
		playLevel(1);
	}
	else{
		playLevel(2);
	}
	/*
	allPokemon1.forEach(function(pokemon){
		//comment this out
		if (timer < 500){
			timer += 1;
		}
		if (timer === 500){
			pokemon.move();
			timer = 0;
		}
		
		pokemon.display();
		pokemon.checkHits();
	});
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
	/*
	//removing pokemon that have been hit enough times
	for(let i = 0; i < allPokemon1.length; i ++){
		if (allPokemon1[i].numHits === allPokemon1[i].level){
			allPokemon1.splice(i,1);
			score += 1;
			i --;
		}
	}
	*/
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

    if (player.numHits === 10){
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
	}
	display(){
		if (this.level === 1){
			image(pokemonImage1, this.x, this.y, 40, 50);
		}
		else if (this.level === 2){
			image(pokemonImage2, this.x, this.y, 40, 50);
		}
		let test = Math.floor(random(600));
		if( test == 333 ){
            this.attack();
        }


	}
	//move right, then down, then left
	move(){
		//move right
		if (this.numRight < 3){
			this.x += 20;
			this.numRight += 1;
		}
		else if (this.numRight === 3){
			this.y += 25;
		}
		if (this.numRight === 3 && this.numLeft < 3){
			this.x -= 20;
			this.numLeft += 1;
		}
		if (this.numRight === 3 && this.numLeft === 3){
			this.numRight = 0;
			this.numLeft = 0;
		}
	}
	
	checkHits(){
		for(let i = 0; i < allPokeBalls.length; i ++){
			if (dist(allPokeBalls[i].xPos, allPokeBalls[i].yPos, this.x, this.y) < 30){
				this.numHits += 1;
				allPokeBalls.splice(i, 1);
				i --;
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
