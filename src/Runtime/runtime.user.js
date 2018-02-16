/*
* @Author: iss_roachd
* @Date:   2017-12-01 12:42:08
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-02-16 12:18:29
*/

var Constants = require('../constants.js');
var UserInterface = require('../User/interface.js');
var UI = require('../UI/UI.js');
var Utils = require('../Utils/Utils.js');

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

UserInterface.getSalsWithOption = function(option, config) {
	var type = Constants.OPTION.QUERY;
	var today = Utils.getCurrentDate();

	if (option === type.today) {
		console.log(today);
		userInterface.getSalsForDateRange(today, today, config);
	}
	if (option === type.week) {
		var curr = new Date(); // get current date
		var now = new Date();
		var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
		var last = first + 6; // last day is the first day + 6

		var firstDayOfWeek = new Date(curr.setDate(first));
		var lastDayOfWeek = new Date(now.setDate(last));

		var weekStart = Utils.getCurrentDate(firstDayOfWeek);
		var weekEnd = Utils.getCurrentDate(lastDayOfWeek);
		console.log(weekStart, weekEnd);
		userInterface.getSalsForDateRange(weekStart, weekEnd, config);
	}
	if (option === type.month) {
		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
		var firstDayOfMonth = new Date(y, m, 1);
		var lastDayOfMonth = new Date(y, m + 1, 0);
		var monthStart = Utils.getCurrentDate(firstDayOfMonth);
		var monthEnd = Utils.getCurrentDate(lastDayOfMonth);

		console.log(monthStart, monthEnd);
		userInterface.getSalsForDateRange(monthStart, monthEnd, config);
	}
	if (option === type.range) {
		if ($(config.rangeDiv).is(":visible")) {
			$(config.rangeDiv).hide('blind', 100);
			return;
		}
		userInterface.setupCalenderRange(config);
		$(config.rangeDiv).show('bounce', 500);
	}
}

UserInterface.presentModal = function(tableName, config, errorView) {
	switch(config.type) {
		case "add":
			userInterface.add(tableName, config, function(error, type) {
				if (error) {
					UI.flashMessage(type, error, errorView, 2500);
					return;
				}
				$(config.modalName).modal("show");
			});
			break;
		case "modify":
			userInterface.modify(tableName, config, function(error, type) {
				if (error) {
					UI.flashMessage(type, error, errorView, 2500);
					return;
				}
				if (Utils.isModal(config)) {
					$(config.modalName).modal("show");
					console.log("modal show");
				}
				//$(config.modalName).modal("show");
			});
			break;
		case "delete":
			userInterface.delete(tableName, config, function(error, type) {
				if (error) {
					UI.flashMessage(type, error, errorView, 2500);
					return;
				}
				$(config.modalName).modal("show");
			});
			break;
		case "submit":
			userInterface.submit(tableName, config, function(error, type, message, messageLocation) {
			if (error) {
				UI.flashMessage(type, message, errorView, 2500);
				return;
			}
			if (Utils.isModal(config)) {
				$(config.modalName).modal("show");
			}
		});
		break;
	}
}

UserInterface.setupListeners = function() {
	$(".nav-sidebar a").on("click", function() {
	  $(".nav").find(".active").removeClass("active");
	  $(this).parent().addClass("active");
	});
}

// UserInterface.setupSalEntryListeners = function() {
// 	var salDatePickerButton = $('#open-sals-date-picker');
// 	salDatePickerButton.datepicker({
// 		defaultDate: "+1w",
//           changeMonth: true,
//           numberOfMonths: 2
// 	});
// 	// from = $( "#from" )
//  //        .datepicker({
//  //          defaultDate: "+1w",
//  //          changeMonth: true,
//  //          numberOfMonths: 3
//  //        })
//  //        .on( "change", function() {
//  //          to.datepicker( "option", "minDate", getDate( this ) );
//  //        }),
//  //      to = $( "#to" ).datepicker({
//  //        defaultDate: "+1w",
//  //        changeMonth: true,
//  //        numberOfMonths: 3
//  //      })
//  //      .on( "change", function() {
//  //        from.datepicker( "option", "maxDate", getDate( this ) );
//  //      });
// }

UserInterface.setupListeners();
