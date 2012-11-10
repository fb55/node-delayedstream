var Stream = require("stream");

var DelayedStream = module.exports = function(){
	this._chunks = [];
	this._emitChunks = false;
	this._ended = false;
};

require("util").inherits(DelayedStream, Stream);

DelayedStream.prototype.write = function(c){
	if(this._emitChunks){
		this.emit("data", c);
	} else {
		this._chunks.push(c);
	}
};

DelayedStream.prototype.end = function(c){
	if(this._emitChunks){
		if(c) this.emit("data", c);
		this.emit("end");
	} else {
		this._ended = true;
	}
};

DelayedStream.prototype.pipe = function(dest){
	Stream.prototype.pipe.apply(this, arguments);

	this._emitChunks = true;

	for(var i = 0, l = this._chunks.length; i < l; i++){
		this.emit("data", this._chunks[i]);
	}
	this._chunks = null; //dereference the chunks

	if(this._ended) this.emit("end");
};

DelayedStream.prototype.writable = true;
DelayedStream.prototype.readable = true;

module.exports = DelayedStream;