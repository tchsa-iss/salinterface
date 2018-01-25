/*
* @Author: iss_roachd
* @Date:   2017-12-01 11:30:20
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-01-10 16:58:06
*/

var Constants = require('../constants.js');
var InterfaceError = require('../Error/Error.js');
var Notification = require('../Notification/Notification.js');
var UI = require('../UI/UI.js');
var TeamInterface = require('./Team/interface.team.js');

function UserInterface(user) {
	this.user = user;
	this.dispatch = new Notification();
	this.userError = Constants.ERROR.USER;
	this.currentSelectedMenu = null;
	this.teamInterface = new TeamInterface(user.UserID);
}

UserInterface.prototype.subscribe = function(eventName, callback, context) {
	this.dispatch.subscribe(eventName, callback, context);
};

UserInterface.prototype.unsubscribe = function(eventName, callback) {

};



UserInterface.prototype.toggleSalMenu =  function(target, typeOfAnimation, duration, callbackName) {
	if (this.currentSelectedMenu) {
		$(this.currentSelectedMenu).toggle(typeOfAnimation, duration || 300, function() {
			$(target).toggle(typeOfAnimation, duration || 300, function() {
				if (callbackName) {
					this.call(callbackName);
				}
			});
		});
	}
	else {
		$(target).toggle(typeOfAnimation, duration || 300, function() {
			if (callbackName) {
				this.call(callbackName);
			}
		});
	}
	this.currentSelectedMenu = target;
}

module.exports = UserInterface;