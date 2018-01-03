/*
* @Author: iss_roachd
* @Date:   2017-12-01 12:41:51
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-01-02 16:47:06
*/

var AdminInterface = require('../AdminPanel/interface.js');

var exists = (typeof window["AdminInterface"] !== "undefined");
if (!exists) {
	window.AdminInterface = AdminInterface;
}

AdminInterface.showServiceUnitsOnClick = function(target) {
	if (AdminInterface.checkVisibliityState(target)) {
		AdminInterface.collapseSubMenu(target);
		return;
	}
	AdminInterface.expandSubMenu(target, function() {
		AdminInterface.databaseInterface('showServiceUnits');
	});
}

AdminInterface.showUserRolesOnClick = function(target) {
	if (AdminInterface.checkVisibliityState(target)) {
		AdminInterface.collapseSubMenu(target);
		return;
	}
	AdminInterface.expandSubMenu(target, function() {
		AdminInterface.databaseInterface('showAllUserRoles');
	});
}

AdminInterface.showUserReportingUnitsOnClick = function(target) {
	if (AdminInterface.checkVisibliityState(target)) {
		AdminInterface.collapseSubMenu(target);
		return;
	}
	AdminInterface.expandSubMenu(target, function() {
		AdminInterface.databaseInterface('showUserReportingUnits');
	});
}

AdminInterface.checkVisibliityState = function(element) {
	return $(element).is(':visible');
}