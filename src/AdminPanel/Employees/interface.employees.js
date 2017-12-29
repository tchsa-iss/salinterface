/*
* @Author: Daniel Roach
* @Date:   2017-12-20 12:18:27
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2017-12-28 16:30:37
*/

var Constant = require('../../constants');
var Networking = require('../../Network/NetworkRequest.js');
var UI = require('../../UI/UI.js');

function EmployeeInterface() {
	this.services = Constant.SERVICES;
}

EmployeeInterface.prototype.show = function(employees) {
	if (employees === this.services.all) {
		return this.all();
	}
}

EmployeeInterface.prototype.all = function() {
	var all = new Networking();
	all.request("admin/employees/all", function(error, json) {
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
	all.execute();
}

// EmployeeInterface.prototype.all = function() {
// 	var all = new Networking();
// 	all.request("admin/employees/all", function(error, json) {
// 		if (!error) {
// 			// var jsonArray = json.split('\n');
// 			// jsonArray.clean("");
// 			// var jsonData = jsonArray.map(JSON.parse);
// 			// setTimeout(function() {
// 			// 	var table = this.__createTableWithJson(jsonData);
// 			// 	$('#log-content-table').DataTable();
// 			// }.bind(this), 200);
// 		 // 	return;
// 		}
// 	}
// }

EmployeeInterface.prototype.fiscal = function() {

}

EmployeeInterface.prototype.clinic = function() {

}

EmployeeInterface.prototype.behaviorHealth = function() {

}

EmployeeInterface.prototype.substanceAbuse = function() {

}

module.exports = new EmployeeInterface();