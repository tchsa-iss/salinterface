/*
* @Author: Daniel Roach
* @Date:   2017-12-20 12:18:11
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-01-02 17:21:47
*/

var Constants = require('../../constants');
var Networking = require('../../Network/NetworkRequest.js');
var UI = require('../../UI/UI.js');

function DatabaseInterface() {
	this.LOGS = Constants.LOGTYPES.AVAILABLE;
	this.currentLog = null;
	this.serviceUnitsInit = false;
}

DatabaseInterface.prototype.showSubMenu = function(menu, done) {
	$(menu).toggle('blind', 200, done);
}

DatabaseInterface.prototype.showServiceUnits = function() {
	if (this.serviceUnitsInit) return;
	var serviceUnits = new Networking();
	serviceUnits.request("admin/database/service/units", function(error, json) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, '#dashboard-main');
		}
		$('#service-units-table').DataTable( {
			data: json,
			"scrollX": true,
		    columns: [
		        { data: 'id' },
		        { data: 'name' },
		        { data: 'UnitAbbrev' },
		        { data: 'Code' },
		        { data: 'IsActive' },
		        { data: 'Description' },
		    ]
		});
		this.serviceUnitsInit = true;
	}.bind(this));
	serviceUnits.execute();
}

DatabaseInterface.prototype.showAllUserRoles = function() {
	var userRoles = new Networking();
	userRoles.request("admin/database/user/roles", function(error, json) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, '#dashboard-main');
		}
		$('#user-roles-table').DataTable( {
			data: json,
			"scrollX": true,
		    columns: [
		        { data: 'Username' },
		        { data: 'FirstName' },
		        { data: 'LastName' },
		        { data: 'DisplayName' }
		    ]
		});
	});
	userRoles.execute();
}

DatabaseInterface.prototype.showUserReportingUnits = function() {
	var reportingUnits = new Networking();
	reportingUnits.request("admin/database/user/reporting/units", function(error, json) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, '#dashboard-main');
		}
		$('#user-reporting-units-table').DataTable( {
			data: json,
			"scrollX": true,
		    columns: [
		        { data: 'FirstName' },
		        { data: 'LastName' },
		        { data: 'ReportingUnits' }
		    ]
		});
	});
	reportingUnits.execute();
}

DatabaseInterface.prototype.addReportingUnit = function($userID) {

}

DatabaseInterface.prototype.projects = function() {

}

DatabaseInterface.prototype.activityCodes = function() {

}

module.exports = new DatabaseInterface();