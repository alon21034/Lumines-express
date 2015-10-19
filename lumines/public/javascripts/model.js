var WIDTH = 30;
var COLUMN = 16;
var ROW = 12;
var TYPE_RED = 1;
var TYPE_BLUE = 0;
var TYPE_EMPTY = 2;
var TIMEOUT = 100;
var DEAD = 101;
var HEIGHT_OFFSET = 90;
var ONE_ROUND_TIME = 7200; // 7.2 sec per round
var FALLING_SPEED = 1500;

var Game = function() {
	this.reset();
}

Game.prototype.reset = function() {
	this.status = true;
	this.map = new Map(this);
	this.bar = new Bar();
	this.timer = 0;
	this.score = 0;
}

Game.prototype.start = function() {

}

Game.prototype.pause = function() {
	this.status = false;
}

Game.prototype.resume = function() {
	this.status = true;
}

Game.prototype.gameOver = function(type) {
	console.log("gameover type: " + type);
	console.log("score: " + this.score);
	this.status = false;
}

Game.prototype.handleInput = function(k) {
	this.map.handleInput(k);
}

Game.prototype.update = function(dt) {
	this.map.update(dt);
	this.bar.update(dt);
	this.timer += dt;
	if (this.timer >= 90000) {
		this.gameOver(TIMEOUT);
	}
};

Game.prototype.render = function() {
	this.renderBackground();
	this.renderScore();
	this.renderTimer();
	this.renderBoard();
}

Game.prototype.renderBackground = function() {
	ctx.fillStyle = "#EEEEEE";
	ctx.fillRect(0,0,WIDTH * 16 + 60, WIDTH * 12 + HEIGHT_OFFSET);
}

Game.prototype.renderBoard = function() {
	this.map.render();
	this.bar.render();
}

Game.prototype.renderScore = function() {
	ctx.fillStyle = "#000000";
	ctx.textAlign = "center";
	ctx.font = "24px Comic Sans MS";
	ctx.fillText("score:  " + this.score,canvas.width-90,60);
}

Game.prototype.renderTimer = function() {
	ctx.fillStyle = "#000000";
	ctx.textAlign = "center";
	ctx.font = "48px Comic Sans MS";
	ctx.fillText(Math.floor(90 - this.timer/1000),canvas.width/2,60);
}

var Map = function(game) {
	this.height = new Array(COLUMN);
	this.grid = new Array(COLUMN);
	for (var i = 0 ; i < COLUMN ; ++i) {
		this.height[i] = 0;
		this.grid[i] = new Array(ROW);
		for (var j = 0 ; j < ROW ; ++j) {
			this.grid[i][j] = TYPE_EMPTY;
		}
	}
	this.random = new RandomNumberGenerator(Date.now() % 10000);
	this.nextBrick = [];
	for (var i = 0 ; i < 5 ; ++i) {
		this.getNextBrick();
	}

	var a = this.getNextBrick();
	console.log(a);
	this.fallingBricks = [new FallingBrick([a[0], a[1]], this.onCollide, this, 5), new FallingBrick([a[2], a[3]], this.onCollide, this, 6)];
	this.fallingBrickNum = 2;
	this.game = game;
}

Map.prototype.getNextBrick = function() {
	var ret = this.nextBrick[0];
	for (var i = 0 ; i < 4 ; ++i) {
		this.nextBrick[i] = this.nextBrick[i+1];
	}
	this.nextBrick[4] = ([this.random.nextBool(), this.random.nextBool(), this.random.nextBool(), this.random.nextBool()]);
	return ret;
}

Map.prototype.onCollide = function() {

	var x1 = this.fallingBricks[0].x;
	this.grid[x1][this.height[x1] + 1] = this.fallingBricks[0].color[1];
	this.grid[x1][this.height[x1] + 2] = this.fallingBricks[0].color[0];
	this.grid[x1+1][this.height[x1+1] + 1] = this.fallingBricks[1].color[1];
	this.grid[x1+1][this.height[x1+1] + 2] = this.fallingBricks[1].color[0];
	this.height[x1]++;
	this.height[x1+1]++;


	var a = this.getNextBrick();

	this.fallingBricks[0].reset([a[0], a[1]], 5);
	this.fallingBricks[1].reset([a[2], a[3]], 6);
	this.fallingBrickNum = 2;

	// update bricks which are going to be deleted
}

Map.prototype.onGameOver = function(type) {
	this.game.gameOver(type);
}

Map.prototype.handleInput = function(keycode) {
	if (this.fallingBrickNum == 2) {
		console.log("map.handleInput" + keycode);
		switch (keycode) {
			case 37:
				this.fallingBricks[0].move(0);
				this.fallingBricks[1].move(0);
			break;
			case 38:
				var t = this.fallingBricks[0].color[0];
				this.fallingBricks[0].color[0] = this.fallingBricks[0].color[1];
				this.fallingBricks[0].color[1] = this.fallingBricks[1].color[1];
				this.fallingBricks[1].color[1] = this.fallingBricks[1].color[0];
				this.fallingBricks[1].color[0] = t;
			break;
			case 39:
				this.fallingBricks[0].move(1);
				this.fallingBricks[1].move(1);
			break;
			case 40:
				this.fallingBricks[0].down();
				this.fallingBricks[1].down();
			break;
			case 32:
				var t = this.fallingBricks[0].color[0];
				this.fallingBricks[0].color[0] = this.fallingBricks[1].color[0];
				this.fallingBricks[1].color[0] = this.fallingBricks[1].color[1];
				this.fallingBricks[1].color[1] = this.fallingBricks[0].color[1];
				this.fallingBricks[0].color[1] = t;
			break;
		}
	}
}

Map.prototype.move = function(d) {
	this.fallingBricks[0].move(d);
	this.fallingBricks[1].move(d);
}

Map.prototype.rotate = function(d) {
	
}

Map.prototype.update = function(dt) {
	this.fallingBricks[0].update(dt);
	this.fallingBricks[1].update(dt);
}

Map.prototype.render = function() {
	for (var i = 0 ; i < COLUMN ; ++i) {
		for (var j = 0 ; j < ROW ; ++j) {
			if (this.grid[i][j] == TYPE_RED) {
				ctx.fillStyle = "#FF0000";
			} else if (this.grid[i][j] == TYPE_BLUE) {
				ctx.fillStyle = "#0000FF";
			} else {
				ctx.fillStyle = "#888888";
			}
			ctx.fillRect(i*WIDTH, HEIGHT_OFFSET + (ROW - j)*WIDTH, WIDTH, WIDTH);
		}
	}
	this.fallingBricks[0].render();
	this.fallingBricks[1].render();
}

var FallingBrick = function(color, callback, map, x){

    this.display = false;
    this.x = x;
    this.y = 0;
    this.color = color;
    this.map = map;
    this.timer = 0;
    this.collideListener = callback;
}

FallingBrick.prototype.reset = function(color, x) {
	this.x = x;
	this.y = 0;
	this.timer = 0;
}

FallingBrick.prototype.checkCollisionWithMap = function() {
    if ( 2 + map.height[this.col] >= ROW) {
        this.collide();
    }
}

FallingBrick.prototype.down = function() {
	this.map.fallingBrickNum -= 1;

    this.map.height[this.col] += 2;
        if(this.map.height[this.col] >= ROW -1) {
        map.onGameOver("dead");
    } else {
        this.map.grid[this.x][this.map.height[this.x]-1] = this.color[0];
        this.map.grid[this.x][this.map.height[this.x]-2] = this.color[1];
    }

    this.map.onCollide();
}

FallingBrick.prototype.move = function(d) {
	// d == 0 : left
	this.x += (d==0)? -1 : 1;
}

FallingBrick.prototype.update = function(dt) {
	//console.log("fallingBricks.update" + dt);
	this.timer += dt;
	if (this.timer > 1000) {
		this.y += 0.1;
		this.timer -= 1000;
	}
}

FallingBrick.prototype.render = function() {
	if (this.color[0] == TYPE_RED) {
		ctx.fillStyle = "#FF0000";
	} else if (this.color[0] == TYPE_BLUE) {
		ctx.fillStyle = "#0000FF";
	}
	ctx.fillRect(this.x * WIDTH, this.y * WIDTH + HEIGHT_OFFSET, WIDTH, WIDTH);
	ctx.strokeRect(this.x * WIDTH, this.y * WIDTH + HEIGHT_OFFSET, WIDTH, WIDTH);
	if (this.color[1] == TYPE_RED) {
		ctx.fillStyle = "#FF0000";
	} else if (this.color[1] == TYPE_BLUE) {
		ctx.fillStyle = "#0000FF";
	}
	ctx.fillRect(this.x * WIDTH, (this.y+1) * WIDTH + HEIGHT_OFFSET, WIDTH, WIDTH);
	ctx.strokeRect(this.x * WIDTH, (this.y+1) * WIDTH + HEIGHT_OFFSET, WIDTH, WIDTH);
}

var Bar = function() {
	this.x = 0;
}

Bar.prototype.update = function(dt) {
	this.x += dt * WIDTH * COLUMN / ONE_ROUND_TIME;
	if (this.x > WIDTH * COLUMN) {
		this.x -= WIDTH * COLUMN;
	}
}

Bar.prototype.render = function() {
	ctx.fillStyle = "#000000";
	ctx.fillRect(this.x-1, HEIGHT_OFFSET, 2, WIDTH*ROW);
}