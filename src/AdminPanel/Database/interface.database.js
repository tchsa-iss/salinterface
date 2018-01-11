/*
* @Author: Daniel Roach
* @Date:   2017-12-20 12:18:11
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-01-05 17:33:36
*/

var Constants = require('../../constants');
var Networking = require('../../Network/NetworkRequest.js');
var UI = require('../../UI/UI.js');
var Utils = require('../../Utils/Utils.js');

function DatabaseInterface() {
	this.LOGS = Constants.LOGTYPES.AVAILABLE;
	this.currentLog = null;
	this.serviceUnitsInit = false;
}

DatabaseInterface.prototype.get = function(request, callback) {
	var get = new Networking();
	get.request(request, function(error, json, id) {
		callback(error, json, id);
	});
	get.execute();
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
		if (!Utils.dataTableExists('#service-units-table')) {
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
		}
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
		if (Utils.dataTableExists('#user-roles-table')) return;
		var table = $('#user-roles-table').DataTable( {
			data: json,
			"scrollX": true,
			buttons: [
        		'copy', 'excel', 'pdf'
    		],
		    columns: [
		        {data: 'Username'},
		        {data: 'FirstName'},
		        {data: 'LastName'},
		        {data: 'DisplayName'},
		        {
		        	targets: -1,
		        	data: null,
		        	defaultContent: "<button type='button' class='btn btn-danger btn-sm'><span class='glyphicon glyphicon-trash' aria-hidden='true'></span> Delete</button>"
		        }
		    ]
		});
		table.buttons().container().appendTo($('.col-sm-6:eq(0)', table.table().container()));
	});
	userRoles.execute();
}

DatabaseInterface.prototype.showUserReportingUnits = function() {
	var reportingUnits = new Networking();
	reportingUnits.request("admin/database/user/reporting/units", function(error, json) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, '#dashboard-main');
		}
		if (Utils.dataTableExists('#user-reporting-units-table')) return;
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

DatabaseInterface.prototype.showAccountCodeGroup = function(id, callback) {
	var groupTypePath = "admin/database/account/codes/type/"+id;
	var activityCode = new Networking();
	activityCode.request(groupTypePath, function(error, json) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, '#dashboard-main');
			callback(false);
		}
		if (Utils.dataTableExists('#account-codes-table')) return;
		var table = $('#account-codes-table').DataTable( {
			data: json,
			"scrollX": true,
			buttons: [
        		'copy', 'excel', 'pdf'
    		],
		    columns: [
		        { data: 'Code' },
		        { data: 'Group' },
		        { data: 'GroupDesc' },
		        { data: 'Billable' },
		        { data: 'Name' },
		        { data: 'Description' },
		        { data: 'Active'},
		    ]
		});
		table.buttons().container().appendTo($('.col-sm-6:eq(0)', table.table().container()));
		var tbody = table.table().body();
		$(tbody).on('click', 'tr',{table:table}, UI.selectSingleTableRow);
		callback(true);
	});
	activityCode.execute();
}

DatabaseInterface.prototype.addReportingUnit = function(userID) {
	addReportingUnit = new Networking();
	addReportingUnit.request("admin/database/user/reporting/unit", function(error, response) {
		if (error) {
			//handle post error
			UI.flashMessage(Constants.ERROR.TYPE.critical, error, '#dashboard-main');
		}
		UI.flashMessage(Constants.STATUS.TYPE.success, "success", '#dashboard-main');
		var table = $('#user-reporting-units-table').DataTable();
		table.rows.add(response).draw();
	});
}

DatabaseInterface.prototype.addNewUserRole = function(data, callback) {
	var json = JSON.stringify(data);
	addRole = new Networking();
	addRole.request("admin/database/user/role", function(error, response) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.critical, error, '#create-user-role-modal', 500);
			callback(false);
			return;
		}
		var table = $('#user-roles-table').DataTable();
		table.row.add(response.add).draw();
		// call success message
		callback(true);
	},json);
	addRole.execute('POST');
}

DatabaseInterface.prototype.projects = function() {

}

DatabaseInterface.prototype.activityCodes = function() {
	var activityCodes = new Networking();
	activityCodes.request("admin/database/sal/activity/codes", function(error, json) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, '#dashboard-main');
		}
		$('#activity-codes-table').DataTable( {
			data: json,
			"scrollX": true,
		    columns: [
		        { data: 'FirstName' },
		        { data: 'LastName' },
		        { data: 'activityCodes' }
		    ]
		});
	});
	activityCodes.execute();
}

module.exports = new DatabaseInterface();