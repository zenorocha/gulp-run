var events = require('events');
var util = require('util');

var LineBufferedStream = require('./line-buffered-stream')


/// Logger
/// ==================================================
/// This inherits `LineBufferedStream`. We don't really *need* line buffering anymore, but I
/// did the work already, so why not...

/// var logger = new Logger(verbosity)
/// --------------------------------------------------
/// Creates a new logger with the given verbosity.

var Logger = module.exports = function (verbosity) {
	this.stream = new LineBufferedStream();
	this.verbosity = verbosity;

	this.stream.on('error', function (error) {
		this.emit.apply(this, arguments)
	}.bind(this));
}


Logger.prototype = Object.create(new events.EventEmitter());


/// Logger.prototype.write(level, chunk, [encoding], [callback])
/// --------------------------------------------------
/// Write a chunk to the stream at the given level.
/// If the level is greater than the logger's verbosity, nothing is written.

Logger.prototype.write = function (level, chunk, encoding, callback) {
	if (level <= this.verbosity) {
		this.stream.write(chunk, encoding, callback);
	} else {
		if (typeof arguments[2] === 'function') callback = arguments[2];
		if (typeof callback === 'function') process.nextTick(callback);
	}
};


/// Logger.prototype.log(level, message, [...])
/// --------------------------------------------------
/// Logs a formatted message at the given level, like `console.log(message, [...])`.

Logger.prototype.log = function (level, message) {
	var message_parts = Array.prototype.slice.call(arguments, 1);
	message = util.format.apply(util, message_parts);
	this.write(level, message + '\n');
};
