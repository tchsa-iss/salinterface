/*
* @Author: Daniel Roach
* @Date:   2017-12-20 12:19:12
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2017-12-28 17:02:46
*/
var Constant = require('../../constants');
var Networking = require('../../Network/NetworkRequest.js');
var UI = require('../../UI/UI.js');

function LogsInterface() {
	this.services = Constant.SERVICES;
}

LogsInterface.prototype.show = function(employees) {
	if (employees === this.services.all) {
		return this.all();
	}
}

LogsInterface.prototype.appLogs = function() {
	var appLog = new Networking();
	appLog.request("admin/employees/all", function(error, json) {
		if (!error) {
			$('#employees-table').show();
			$('#employees-table').DataTable( {
    			data: json,
    			"scrollX": true,
			    columns: [
			        { data: 'Username' },
			        { data: 'FirstName' },
			        { data: 'MiddleName' },
			        { data: 'LastName' },
			        { data: 'PhoneNumber' },
			        { data: 'CellPhoneNumber' },
			        { data: 'Job Title' },
			        { data: 'Reporting Unit' },
			        { data: 'Email' },
			        { data: 'SupervisorID' },
			        { data: 'LastLoginDate' },
			        { data: 'Active' }
			    ]
			});
			return;
		}
		UI.flashMessage(Constants.ERROR.TYPE.major, error, '#dashboard-main');
	});
	appLog.execute();
}

LogsInterface.prototype.fiscal = function() {

}

LogsInterface.prototype.clinic = function() {

}

LogsInterface.prototype.behaviorHealth = function() {

}

LogsInterface.prototype.substanceAbuse = function() {

}

module.exports = new LogsInterface();