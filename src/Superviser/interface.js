/*
* @Author: iss_roachd
* @Date:   2017-12-02 18:05:52
* @Last Modified by:   iss_roachd
* @Last Modified time: 2017-12-02 19:38:16
*/

var Constants = require('../constants.js');
var InterfaceError = require('../Error/Error.js');
var Notification = require('../Notification/Notification.js');


function SuperviserInterface(user) {
	this.user = user;
	this.dispatch = new Notification();
	this.userError = Constants.ERROR.USER;
}

SuperviserInterface.init = function(username) {
	if (!username) {
		var error = this.userError.NO_USER;
		return new InterfaceError(error.name, error.code, error.desc);
	}
	$.ajax({

	});
};

SuperviserInterface.prototype.subscribe = function(eventName, callback, context) {
	this.dispatch.subscribe(eventName, callback, context);
};

SuperviserInterface.prototype.unsubscribe = function(eventName, callback) {

};

module.exports = SuperviserInterface;