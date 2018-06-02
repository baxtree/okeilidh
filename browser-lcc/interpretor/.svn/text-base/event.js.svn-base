var EventEmitter = function () {
};
EventEmitter.prototype.on = function (name, callback) {
	if (!this._listeners) {
		this._listeners = {};
	}
	if (!this._listeners[name]) {
		this._listeners[name] = [];
	}
	var f = function (e) {
		callback.apply(this, e);
	};
	this._listeners[name].push(f);
};

EventEmitter.prototype.emit = function (name) {
	var params = new Array();
	for (var i = 1; i < arguments.length; i++) {
		params.push(arguments[i]);
	}
	if (!this._listeners) {
		this._listeners = {};
	}
	if (!this._listeners[name]) {
		return;
	}
	var i = this._listeners[name].length;
	while (i--) {
		this._listeners[name][i](params);
	}
};

EventEmitter.prototype.removeListener = function (name, callback) {
	if (!this._listeners) {
		this._listeners = {};
	}
	if (!this._listeners[name]) {
		return;
	}
	var i = this._listeners[name].length;
	while (i--) {
		var f = function (e) {
			callback.apply(this, e);
		};
		if (this._listeners[name][i].toString() === f.toString()) { //This may be changed in the future.
			this._listeners[name].splice(i, 1);
		}
	}
};

EventEmitter.prototype.removeAllListeners = function (name) {
	if (!this._listeners) {
		this._listeners = {};
	}
	if (!this._listeners[name]) {
		return;
	}
	delete this._listeners[name];
};

EventEmitter.prototype.listeners = function (name) {
	if (!this._listeners) {
		this._listeners = {};
	}
	if (!this._listeners[name]) {
		return;
	} 
	return this._listeners[name];
}; 
/* Test
var emitter = new EventEmitter();
emitter.on("start", callback);
function callback(a, b, c) {
	alert(a + b + c);
}
emitter.on("start", callback1);
function callback1(a, b, c) {
	alert(a * b * c);
}
emitter.emit("start", 2, 3, 4);
emitter.removeListener("start", callback1);
emitter.emit("start", 2, 3, 4);
*/
