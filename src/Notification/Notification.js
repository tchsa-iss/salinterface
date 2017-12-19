/*
* @Author: iss_roachd
* @Date:   2017-12-01 17:02:38
* @Last Modified by:   iss_roachd
* @Last Modified time: 2017-12-02 09:28:58
*/

/**
 *
 * @constructor Notification
 */
function Notification () {
	this._events = {};
	this._publishOnce = {};
	this.eventsLog = [];
}

/**
 * @memberOf Notification
 * @param {string} eventName
 * @param argX - argument to pass to callback
 * @param argY - argument to pass to callback
 * @param argZ - argument to pass to callback
 * @returns {boolean} notifcation published
 */
Notification.prototype.publishOnce = function (eventName, argX, argY, argZ) {  // argX,Y,Z replaced by arguments below to capture additional arguments, which are concatenated to the arguments array from subscribe method
	this.eventsLog.push(eventName);
	if (!this._events[eventName]) return false;
	if (this._publishOnce[eventName]) return false;

	var subscribers = this._events[eventName];
	var iterCallback, iterContext;
	for (var i = 0; i < subscribers.length; i++) {
		iterCallback = subscribers[i].callback;
		iterContext = subscribers[i].context;
		var iterArguments = subscribers[i].arguments;
		iterCallback.apply(iterContext, iterArguments.concat(Array.prototype.slice.call(arguments, 1)));
	}
	this._publishOnce[eventName] = true;
};

/**
 * @memberOf Notification
 * @param {string} eventName
 * @param argX - argument to pass to callback
 * @param argY - argument to pass to callback
 * @param argZ - argument to pass to callback
 * @returns {boolean} argument published
 */
Notification.prototype.publishOnceForArgument = function (eventName, argX, argY, argZ) {  // argX,Y,Z replaced by arguments below to capture additional arguments, which are concatenated to the arguments array from subscribe method
	this.eventsLog.push(eventName);
	if (!this._events[eventName]) return false;

	try {
		if (this._publishOnce[eventName][argX]) return false;
	} catch (e) {
		this._publishOnce[eventName] = {argX: false};
	}

	var subscribers = this._events[eventName];
	var iterCallback, iterContext;
	for (var i = 0; i < subscribers.length; i++) {
		iterCallback = subscribers[i].callback;
		iterContext = subscribers[i].context;
		var iterArguments = subscribers[i].arguments;
		iterCallback.apply(iterContext, iterArguments.concat(Array.prototype.slice.call(arguments, 1)));
	}
	try {
		this._publishOnce[eventName][argX] = true;
	}	catch (e) {
		this._publishOnce[eventName] = {argX: true};
	}
};

/**
 * @memberOf Notification
 * @param {string} eventName
 * @param argX - argument to pass to callback
 * @param argY - argument to pass to callback
 * @param argZ - argument to pass to callback
 * @returns {boolean} event callaback does not exists
 */
Notification.prototype.publish = function (eventName, argX, argY, argZ) {  // argX,Y,Z replaced by arguments below to capture additional arguments, which are concatenated to the arguments array from subscribe method
	this.eventsLog.push(eventName);
	if (!this._events[eventName]) {
		return false;
	}
	var subscribers = this._events[eventName];
	var iterCallback, iterContext;
	for (var i = 0; i < subscribers.length; i++) {
		iterCallback = subscribers[i].callback;
		iterContext = subscribers[i].context;
		var iterArguments = subscribers[i].arguments;
		iterCallback.apply(iterContext, iterArguments.concat(Array.prototype.slice.call(arguments, 1)));
	}
};

/**
 * @memberOf Notification
 * @param {string} eventName
 * @callback callback~refFunc
 * @param {object} context - scope of function reference
 * @param arg1 - argument to pass to callback
 * @param arg2 - argument to pass to callback
 * @param arg3 - argument to pass to callback
 */
Notification.prototype.subscribe = function (eventName, callback, context, arg1, arg2, arg3) {  // arg1,2,3 replaced by arguments below to capture additional arguments (e.g. arg4, arg5, etc.)
	context = context || null;
	if (typeof eventName !== 'string') return;
	this._events[eventName] = this._events[eventName] || [];
	this._events[eventName].push({
		callback: callback,
		context: context,
		arguments: Array.prototype.slice.call(arguments, 3) || []
	});
};

/**
 * @memberOf Notification
 * @param {string} eventName
 * @callback callback~refFunc
 * @returns {boolean} no callback reference for vpaid event
 */
Notification.prototype.unsubscribe = function (eventName, callback) {
	var subscribers = this._events[eventName];
	if (!subscribers) return false;
	for (var i = 0; i < subscribers.length; i++) {
		if (subscribers[i].callback === callback) {
			subscribers.splice(i, 1);
		}
	}
};

Notification.instance = null;
/**
 * @memberOf Notification
 * Singleton getInstance definition
 * @return singleton class
 */
Notification.singleton = function () {
	if (this.instance === null) {
		this.instance = new Notification();
	}
	return this.instance;
};

module.exports = Notification;
