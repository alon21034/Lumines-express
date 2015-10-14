var RandomNumberGenerator = function(seed) {
	this.P = 179426549;
	this.seed = seed;
	this.num = seed;
}

RandomNumberGenerator.prototype.nextBool = function() {
	this.num += this.seed;
	this.num %= this.P;
	x = Math.sin(this.num) * 10000;
	return (x-Math.floor(x) > 0.5)? 1:0;
}
