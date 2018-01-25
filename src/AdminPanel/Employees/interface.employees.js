/*
* @Author: Daniel Roach
* @Date:   2017-12-20 12:18:27
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-01-11 10:37:56
*/

var Constants = require('../../constants');
var Networking = require('../../Network/NetworkRequest.js');
var UI = require('../../UI/UI.js');
var Utils = require('../../Utils/Utils.js');

function EmployeeInterface() {
	this.services = Constants.SERVICES;
}

EmployeeInterface.prototype.show = function(employees) {
	if (employees === this.services.all) {
		return this.all();
	}
}

EmployeeInterface.prototype.get = function(request, callback) {
	var get = new Networking();
	get.request(request, function(error, json, id) {
		callback(error, json, id);
	});
	get.execute();
}

EmployeeInterface.prototype.getJobTitles = function(callback) {
	var employeeTitles = new Networking();
	employeeTitles.request("admin/employees/job/titles", function(error, json) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, '#dashboard-main', 500);
			callback(false);
		}
		if (Utils.dataTableExists('#job-titles-table')) {
			 callback(true);
			 return;
		}

		var table = $('#job-titles-table').DataTable( {
			data: json,
			"scrollX": true,
			buttons: [
        		'copy', 'excel', 'pdf'
    		],
		    columns: [
		        { data: 'id' },
		        { data: 'name' },
		        { data: 'Description' },
		    ]
		});
		table.buttons().container().appendTo($('.col-sm-6:eq(0)', table.table().container()));
		var tbody = table.table().body();
		$(tbody).on('click', 'tr',{table:table}, UI.selectSingleTableRow);
		callback(true);
	});
	employeeTitles.execute();
}

EmployeeInterface.prototype.all = function() {
	var all = new Networking();
	all.request("admin/employees/all", function(error, json) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, '#dashboard-main', 500);
		}
		if (Utils.dataTableExists('#employees-table')) return;

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
		        { data: 'IsActive' }
		    ]
		});
	});
	all.execute();
}

EmployeeInterface.prototype.fiscal = function() {

}

EmployeeInterface.prototype.clinic = function() {

}

EmployeeInterface.prototype.behaviorHealth = function() {

}

EmployeeInterface.prototype.substanceAbuse = function() {

}

module.exports = new EmployeeInterface();