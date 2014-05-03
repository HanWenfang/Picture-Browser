
function ImageQueue(w, h, s) {
	this.width = w;
	this.height = h;
	this.screen = s;

	this.originX = 0;
	this.originY = 0;

	this.images = new Array();
}

ImageQueue.prototype.push = function(image) {
	this.objects.push(image);
}

ImageQueue.prototype.draw = function() {
	for(var i=0; i < this.images.length; ++i){
		this.screen.getContext().drawImage(this.images[i], this.originX, this.originY, this.width, this.height);
		this.originX += this.width;
	}
}

function Image(binary_data) {
	this.data = binary_data;
}

function Screen() {
	this.width = window.innerWidth;
	this.height = window.innerHeight;

	// create canvas -start
	this.canvas = document.createElement("canvas");
	this.canvas.style.position = "relative";
	this.canvas.width = this.width;
	this.canvas.height = this.height;

	var body = document.getElementsByTagName("body")[0];
	var center = document.createElement("center");
	center.appendChild(this.canvas);
	body.appendChild(this.canvas);

	this.context = this.canvas.getContext("2d");

	this.imagequeue = new ImageQueue(100,100,this);
}

Screen.prototype.getContext = function() {
	return this.context;
}

Screen.prototype.getImage = function(user ,node){
	
	this.runInTheBackground = false;


	var address = "picture?user="+user+"&node="+node;
	var method = "GET";

	/*
		need to hack the binary data
	*/
	var xmlHttpRequest = null;

	if(window.XMLHttpRequest){
		xmlHttpRequest = new XMLHttpRequest();
	}


	xmlHttpRequest.open(method, address, this.runInTheBackground);
	xmlHttpRequest.send();

	if(this.runInTheBackground){
		xmlHttpRequest.onreadystatechange = function(){
			if(xmlHttpRequest.readyState == 4){
				var content = xmlHttpRequest.responseText;
				// stackoverflow.com/questions/18976327/binary-array-to-canvas
				//var blob = new Blob([content], {types: "image/jpg"});
				this.imagequeue.push(new Image(content));
			}
		}
	}else{
		var content = xmlHttpRequest.responseText;
		this.imagequeue.push(new Image(content));
	}
}

Screen.prototype.init = function() {
	this.getImage("hanwenfang", "0");
}

Screen.prototype.iterate = function() {

}

Screen.prototype.draw = function() {
	this.context.clearRect(0,0,this.width, this.height);
	this,imagequeue.draw();
}

function Client() {

	// The frequency for canvas rendering
	// Won't be used if requestAnimationFrame is available
	renderingFrequency = 24;

	// The frequency of Client physical engine iteration
	iterationFrequency = 32;

	window.requestAnimFrame = (function(callback){
		return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback){
			window.setTimeout(callback, 1000/renderingFrequency);
		};
	})();

	var screen = new Screen(iterationFrequency, renderingFrequency);

	// Start client physical engine
	var iterateGameEngine = function() {
		// in one second
		var period = 1000/iterationFrequency;
		screen.iterate();
		setTimeout(iterateGameEngine, period);
	}

	// start rendering engine
	var iterateRendering = function() {
		screen.draw();
		requestAnimFrame(iterateRendering);
	}

	function startGameThread() {
		iterateGameEngine();
	}

	function startRenderingThread() {
		iterateRendering();
	}

	function startClient() {
		startGameThread();
		startRenderingThread();
	}

	window.onload = startClient;

}























