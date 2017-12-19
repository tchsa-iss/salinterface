/*
* @Author: iss_roachd
* @Date:   2017-12-01 11:56:27
* @Last Modified by:   iss_roachd
* @Last Modified time: 2017-12-01 12:38:39
*/

var UserInterface = require('../User/interface.js');

function UserManager(username) {
	//this.notification = new 
	UserInterface.initUser(function(error, user) {
		if (error) {
			this.error(error);
			return;
		}
		this.user = new UserInterface(user);
		// this.notification.publish('UserLoaded');
	});
};

UserManager.prototype.getUser = function() {
	return this.user;
};

UserManager.prototype.Error = function(error) {
	// log error
	// publish error
	// this.notification.publish('error', );
};

UserManager.prototype.subscribe = function(event, callback, context) {

};

UserManager.prototype.unsubscribe = function(event) {

};

