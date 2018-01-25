/*
* @Author: iss_roachd
* @Date:   2017-12-01 12:42:08
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-01-23 17:56:38
*/

var UserInterface = require('../User/interface.js');

var exists = (typeof window["UserInterface"] !== "undefined");
if (!exists) {
	window.UserInterface = UserInterface;
}

if (!window.currentUser) {
	// hmmm we didn't get a user variable passed to the page
 	console.log("no bueno");
}
else {
	window.userInterface = new UserInterface(window.currentUser);
}

// Class level methods
UserInterface.toggleTarget = function(target, typeOfAnimation, duration, callbackName) {
	$(target).toggle(typeOfAnimation, duration || 300, function() {
		if (callbackName) {
			if (typeof UserInterface[callbackName] === "function") { 
	    		// safe to use the function
	    		UserInterface[callbackName]();
			}
		}
	});
}

UserInterface.showOpenSals = function(target) {

}

UserInterface.setupListeners = function() {
	$(".nav-sidebar a").on("click", function() {
	  $(".nav").find(".active").removeClass("active");
	  $(this).parent().addClass("active");
	});
}

UserInterface.setupListeners();
