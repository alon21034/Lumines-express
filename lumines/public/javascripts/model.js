var WIDTH = 30;
var COLUMN = 16;
var RAW = 12;
var TYPE_RED = 1;
var TYPE_BLUE = 2;
var TYPE_EMPTY = 0;
var TIMEOUT = 100;
var HEIGHT_OFFSET = 90;
var ONE_ROUND_TIME = 7200;

var Game = function() {
	this.reset();
}

Game.prototype.reset = function() {
	this.status = true;
	this.map = new Map();
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

Game.prototype.update = function(dt) {
	this.map.update(dt);
	this.bar.update(dt);
	this.timer += dt;
	if (this.timer >= 90000) {
		this.gameOver(TIMEOUT);
	}
};

Game.prototype.gameOver = function(type) {
	console.log("gameover type: " + type);
	console.log("score: " + this.score);
	this.status = false;
}

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

var Map = function() {
	this.height = new Array(COLUMN);
	this.grid = new Array(COLUMN);
	for (var i = 0 ; i < COLUMN ; ++i) {
		this.height[i] = 0;
		this.grid[i] = new Array(RAW);
		for (var j = 0 ; j < RAW ; ++j) {
			this.grid[i][j] = TYPE_EMPTY;
		}
	}
}

Map.prototype.update = function() {

}

Map.prototype.render = function() {
	for (var i = 0 ; i < COLUMN ; ++i) {
		for (var j = 0 ; j < RAW ; ++j) {
			if (this.grid[i][j] == TYPE_RED) {
				ctx.fillStyle = "#FF0000";
			} else if (this.grid[i][j] == TYPE_BLUE) {
				ctx.fillStyle = "#0000FF";
			} else {
				ctx.fillStyle = "#888888";
			}
			ctx.fillRect(i*WIDTH, HEIGHT_OFFSET + j*WIDTH, WIDTH, WIDTH);
		}
	}
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
	ctx.fillRect(this.x-1, HEIGHT_OFFSET, 2, WIDTH*RAW);
}