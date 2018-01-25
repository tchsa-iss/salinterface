/*
* @Author: iss_roachd
* @Date:   2017-12-02 18:05:52
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-01-25 12:42:51
*/

var Constants = require('../constants.js');
var InterfaceError = require('../Error/Error.js');
var Notification = require('../Notification/Notification.js');
var Networking = require('../Network/NetworkRequest.js');
var Modal = require('./Modal/interface.modal.js');
var UI = require('../UI/UI.js');
var Utils = require('../Utils/Utils.js');

function SupervisorInterface(user) {
	this.user = user;
	this.dispatch = new Notification();
	//this.modal = new Modal();
	this.currentModal = null;
	this.userError = Constants.ERROR.USER;
	this.employeesTable = null;
	this.supervisorsTable = null;
	this.teamMembersTable = null;
	this.employeesMessageHead = '#employees-container';
	this.supervisorsMessageHead = '#supervisors-container';
	this.teamMessageHead = '#team-content-container';
}

SupervisorInterface.prototype.subscribe = function(eventName, callback, context) {
	this.dispatch.subscribe(eventName, callback, context);
};

SupervisorInterface.prototype.unsubscribe = function(eventName, callback) {

};

SupervisorInterface.prototype.prepModal = function(targetTable, modalData, ready) {
	//this.currentModal = new Modal();
	var type = Constants.MODAL;
	switch (modalData.prep) {
		case type.addSupervisor:
			var modal = new Modal(targetTable, modalData, this.handleAddSupervisorSubmit)
			modal.prepAddSupervisor(function(error) {
				ready();
			})
		break;
		case type.assignSupervisor:
			var modal = new Modal(targetTable, modalData, this.handleAddSupervisorToMember);
			modal.prepAssignSupervisor(function(error) {
				ready();
			});
		break;
		case type.removeEmployeeSupervisor:
			// if (!this.isValidChange(targetTable, 'SupervisorID', ['0'])) {
			// 	var message = "Employee does not have a supervisor to remove";
			// 	UI.flashMessage(Constants.ERROR.TYPE.critical, message, this.employeesMessageHead, 1000);
			// 	return
			// }
			var modal = new Modal(targetTable, modalData, this.handleRemoveSupervisor);
			modal.prepRemoveSupervisor(function(error) {
				if (error) {
					UI.flashMessage(Constants.ERROR.TYPE.critical, error, '#employees-container', 1000);
					return;
				}
				ready();
			})
		break;
	}
}

SupervisorInterface.prototype.handleRemoveSupervisor = function(modal) {
	var supervisorId = modal.getBootstrapSelectId();
	var post = 'user/super/remove/employee/supervisor';
	var row = modal.selectedRow.data();
	var removeSupervisorData = {
		supervisorId: supervisorId,
		userId: row.UserID
	};
	var json = JSON.stringify(removeSupervisorData);
	var removeSupervisor = new Networking();
	removeSupervisor.request(post, function(error, response) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, modal.errorElement, 500);
			return;
		}
		var row = modal.selectedRow;
		var data = row.data();
		var table = modal.getTable().DataTable();
		data.SupervisorID = response.value;
		table.row(row).data(data).draw();
		modal.dismiss();
		/******************* fix *************/
		var container = '#employees-container';
		UI.flashMessage(Constants.STATUS.TYPE.success, response.message, container, 1000);
	}, json);
	removeSupervisor.execute('POST');
}

SupervisorInterface.prototype.handleAddSupervisorToMember = function(modal) {
	var supervisorId = modal.getBootstrapSelectId();
	var post = 'user/super/assign/employee/supervisor';
	var row = modal.selectedRow.data();
	var assignSupervisorData = {
		supervisorId: supervisorId,
		userId: row.UserID
	};
	var json = JSON.stringify(assignSupervisorData);
	var assignSupervisor = new Networking();
	assignSupervisor.request(post, function(error, response) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, modal.errorElement, 500);
			return;
		}
		// var row = modal.selectedRow;
		// var data = row.data();
		// var table = modal.getTable().DataTable();
		// data.SupervisorID = supervisorId;
		// table.row(row).data(data).draw();
		modal.removeAllClickHandlers();
		modal.dismiss();
		/******************* fix *************/
		var container = '#employees-container';
		UI.flashMessage(Constants.STATUS.TYPE.success, response.message, container, 1000);
	}, json);
	assignSupervisor.execute('POST');
}


SupervisorInterface.prototype.handleAddSupervisorSubmit = function(modal) {
	var id = modal.getBootstrapSelectId();
	var post = 'user/super/add/supervisors/'+id;
	var createSupervisor = new Networking();
	createSupervisor.request(post, function(error, supervisor) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, modal.errorElement, 500);
			return;
		}
		supervisor.Name = supervisor.FirstName + ' ' + supervisor.LastName;
		var table = modal.getTable().DataTable();
		table.row.add(supervisor).draw();
		modal.dismiss();
	})
	createSupervisor.execute('POST');
}

SupervisorInterface.prototype.add = function(target, errorView) {
	var error = false;
	var table = $(target).DataTable();
	if (!UI.isSelected(table)) {
		var message = "Please Select At Least One Row";
		UI.flashMessage(Constants.ERROR.TYPE.major, message, errorView, 500);
		error = true;
	}
	return error;
}

SupervisorInterface.prototype.modify = function(target, errorView) {
	var error = null;
	var table = $(target).DataTable();
	if (!UI.isSelected(table)) {
		var message = "Please Select At Least One Row To Modify";
		UI.flashMessage(Constants.ERROR.TYPE.major, message, errorView, 500);
		error = true;
	}
	return error;
}

SupervisorInterface.prototype.delete = function(target, errorView) {
	var error = null;
	var table = $(target).DataTable();
	if (!UI.isSelected(table)) {
		var message = "Please Select At Least One Row To Delete";
		UI.flashMessage(Constants.ERROR.TYPE.critical, message, errorView, 500);
		error = true;
		return error;
	}
}

SupervisorInterface.prototype.isValidChange = function(tableName, column, rules) {
	var valid = true;
	var table = $(tableName).DataTable();
	var columnData = table.row( { selected: true } ).data();
	rules.forEach(function(rule) {
		var invalid = columnData[column];
		if (invalid === rule) {
			valid = false;
			return
		}
	});
	return valid;
}

SupervisorInterface.prototype.deleteSupervisor = function(tableName) {
	var table = $(tableName).DataTable();
	var row = table.row( { selected: true } );
	var data = row.data();
	var name = data.FirstName + ' ' + data.LastName;
	var message = $("<h4>You are about to delete "+"<u><stong>"+name +"</stong></u>"+"  as a supervisor</h4>");

	$('#alert-delete-supervisor-message').append(message);

	$('#submit-supervisor-delete').on('click', function() {
		var deleteSup = new Networking();
		var post = 'user/super/delete/supervisor/' + data.ID;
		deleteSup.request(post, function(error, response) {
			if (error) {
				UI.flashMessage(Constants.ERROR.TYPE.major, error, this.supervisorsMessageHead, 1000);
				return;
			}
			$('#alert-delete-supervisor').hide('blind', 300);
			message.remove();
			table.row(row).remove().draw();
		});

		deleteSup.execute('POST');

	}.bind(this, {table:table, row: row, message: message}));

	$('#alert-delete-supervisor').show('blind', 300);
}

SupervisorInterface.prototype.getAllSupervisors = function(tableName, refresh) {
	if (this.supervisorsTable) return

	$('#supervisors-loading').show();
	var allSupervisors = new Networking();
	allSupervisors.request("user/super/supervisors/all", function(error, json) {
		$('#supervisors-loading').hide();
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, this.supervisorsMessageHead, 1000);
			var table = $(tableName).DataTable();
			this.supervisorsTable = table;
			return;
		}
		// json.forEach(function(supervisor) {
		// 	supervisor.Name = Utils.combineTwoStrings(supervisor.FirstName, supervisor.LastName);
		// })
		var table = $(tableName).DataTable( {
			data: json,
			"scrollX": true,
			select: true,
			buttons: [
        		'copy', 'excel', 'pdf'
    		],
		    columns: [
		        { data: 'ID' },
		        { data: 'UserID' },
		        { 
		        	data: 'Name',
		        	render: function ( data, type, row ) {
       					 return row.FirstName +' '+ row.LastName;
    				}
		    	},

		        { data: 'ReportingUnit' },
		        { data: 'Code' },
		        { data: 'CreateDate' },
		        { data: 'IsActive' },
		    ]
		});
		this.supervisorsTable = table;
		table.buttons().container().appendTo($('.col-sm-6:eq(0)', table.table().container()));
		var tbody = table.table().body();
		$(tbody).on('click', 'tr',{table:table}, UI.selectSingleTableRow);
	}.bind(this));
	allSupervisors.execute();
}

SupervisorInterface.prototype.getAllEmployees = function(tableName) {
	if (this.employeesTable) return;
	$('#employees-loading').show();
	var allEmployees = new Networking();
	allEmployees.request("user/super/employees/all", function(error, json) {
		$('#employees-loading').hide();
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, this.employeesMessageHead);
		}
		var table = $(tableName).DataTable( {
			data: json,
			"scrollX": true,
			scrollY: '50vh',
			select: true,
		    columns: [
		    	{ 	data: 'UserID',
		    		"visible": false,
		    		"searchable": false
		    	},
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
		this.employeesTable = table;
		table.buttons().container().appendTo($('.col-sm-6:eq(0)', table.table().container()));
		var tbody = table.table().body();
		$(tbody).on('click', 'tr',{table:table}, UI.selectSingleTableRow);
	}.bind(this));
	allEmployees.execute();
}

SupervisorInterface.prototype.getAllTeamMembers = function(tableName) {
	if (this.teamMembersTable) return;
	$('#team-members-loading').show();
	var get = 'user/supervisor/team/members/' + this.user.SupervisorID;
	var allTeamMembers = new Networking();
	allTeamMembers.request(get, function(error, json) {
		$('#team-members-loading').hide();
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, this.teamMessageHead);
		}
		var table = $(tableName).DataTable( {
			data: json,
			"scrollX": true,
			select: true,
		    columns: [
		    	{ 	data: 'UserID',
		    		"visible": false,
		    		"searchable": false
		    	},
		    	{ data: 'Username'},
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
		this.teamMembersTable = table;
		table.buttons().container().appendTo($('.col-sm-6:eq(0)', table.table().container()));
		var tbody = table.table().body();
		$(tbody).on('click', 'tr',{table:table}, UI.selectSingleTableRow);
	}.bind(this));
	allTeamMembers.execute();
}

module.exports = SupervisorInterface;