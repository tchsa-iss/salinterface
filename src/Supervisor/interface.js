/*
* @Author: iss_roachd
* @Date:   2017-12-02 18:05:52
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-02-16 12:36:45
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

SupervisorInterface.prototype.closeMemberApprovals = function(views, callback) {
	var closeCount = 0;
	var stopCount = views.length;
	var intervalID = setInterval(function () {
		$(views[closeCount]).hide('blind', 300);

		if (++closeCount === stopCount) {
			clearInterval(intervalID);
			if (callback) {
				callback();
			}
		}
	}, 400);
}

SupervisorInterface.prototype.setupModal = function(tableName, config, ready) {
	var modal = new Modal(tableName, config, this[config.handler].bind(this));
	modal[config.prep](function(error) {
		ready(error, Constants.ERROR.TYPE.critical);
	});
}

// swap out with function above is needs to be depreciated
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
			var modal = new Modal(targetTable, modalData, this.handleRemoveSupervisor);
			modal.prepRemoveSupervisor(function(error) {
				if (error) {
					UI.flashMessage(Constants.ERROR.TYPE.critical, error, '#employees-container', 1000);
					return;
				}
				ready();
			})
		break;
		default:
		// new way of handling modal setup look at create new sal modal for reference
			try {
				var modal = new Modal(targetTable, modalData, this[modalData.handler]);
				modal[modalData.prep](function(error) {
					ready();
				});
			} catch(err) {
				console.log("bad news bears");
			}
	}
}

SupervisorInterface.prototype.loadMemberSals = function(data, callback) {
	var member = JSON.parse(data.member.dataset.info);
	var get = "user/sals/by/status/" + member.UserID + "/2";
	$(data.panelDiv).find('.panel-title').text(member.FirstName + " " + member.LastName);
	var getUserSals = new Networking();
	getUserSals.request(get, function(error, response) {
		if (error) {
			callback(error);
			return
		}
		this.updateSalPanel(response, $(data.panelEntry), data);
		callback();
	}.bind(this));
	getUserSals.execute();
}

SupervisorInterface.prototype.updateSalPanel = function(sals, panel, data) {
	panel.empty();
	if (sals.length === 0) {
		var div = $("<p class='text-center'>No SAL's Waiting For Approval </p>");
		panel.append(div);
		return;
	}
	for (var i = 0; i < sals.length; i++) {
		var sal = sals[i];
		sal.config = data;
		sal.tableName = data.tableName;
		sal.timeCompare = data.timeCompare;
		sal.containerHead = data.targetHead;
		var date = Utils.convertDateToReadableFormat(sal.Date);
		var div = $("<button class='btn btn-default'>"+ date + "</button>");
		div.data( "sal", sal );
		div.on("click", this.getSalEntriesFrom.bind(this, div));
		panel.append(div);
	}
}

SupervisorInterface.prototype.getSalEntriesFrom = function(element) {
	var sal = element.data().sal;
	var containerHead = $(sal.containerHead).find('.page-header');
	this.currentSal = sal;
	// console.log(sal);
	// $(sal.tableName + "-container").show('blind', 100);
	var getEntries = new Networking();
	getEntries.request('user/sal/entries/'+sal.ID, function(error, response) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, containerHead, 1000);
			var table = $(sal.tableName).DataTable();
			$(sal.tableName + "-container").show('blind', 300); // this is bad! need to change this
			return;
		}
		if ($.fn.DataTable.isDataTable(sal.tableName)) {
			Utils.destroyOldTable(sal.tableName);
		}
		var entries = response;
		var table = $(sal.tableName).DataTable( {
			data: entries,
			"scrollX": true,
			scrollY: true,
			select: true,
			buttons: [
        		'copy', 'excel', 'pdf'
    		],
		    columns: [
		        { data: 'SalEntryID' },
		        { data: 'FormName' },
		        { data: 'EntryStatusCode'},
		        { 
		        	data: 'Reporting Unit',
		        	render: function ( data, type, row ) {
       					 return row.ReportingUnitCode +' '+ row.ReportingUnitAbbrev;
    				}
		    	},
		        { data: 'SubReportingUnitID' },
		        { data: 'Location' },
		        { 
		        	data: 'ActivityCode',
		        	render: function(data, type, row) {
		        		return row.ActivityCode + ' ' + row.ActivityName;
		        	}
		    	},
				{ data: 'ProjectNumberID' },
				{ data: 'GroupNumber' },
				{ data: 'TimeSpent' },
				{ data: 'PrepTime' },
				{ data: 'Description' },
				{ data: 'CreateDate'}
		    ]
		});
		//table.sal = sal;
		//this.salEntryTable = table;
		// this.currentSal = sal;
		this.getUserSalTime(sal, entries);
		table.buttons().container().appendTo($('.col-sm-6:eq(0)', table.table().container()));
		var tbody = table.table().body();
		$(tbody).on('click', 'tr',{table:table}, UI.selectSingleTableRow);
		$(sal.tableName + "-container").show('blind', 300, function() {
			$(sal.timeCompare).show('blind', 300);
		}); // this is bad! need to change this
	}.bind(this));
	getEntries.execute();
}

SupervisorInterface.prototype.getUserSalTime = function(sal, entries) {
	var timePanel = UI.checkForTimePanel(sal.tableName + "-container");
	if (!timePanel) {
		return;
	}
	var data = {
		date: sal.Date,
		userId: sal.UserID
	};
	var get = "user/supervisor/team/member/timeips/time";
	var getTimeIpsTime = new Networking();
	getTimeIpsTime.request(get, function(error, response) {
		if (error) {
			// tell user timeips time could be retrieved
			
		}
		var timeIpsTime = response;
		var normalTime = timeIpsTime[0];
		var benifitTime = timeIpsTime[1];
		var holidayTime = timeIpsTime[2];
		var timeStart = normalTime.totalTimeIn;
		var endTime = normalTime.totalTimeOut + benifitTime.totalBenifitTime + holidayTime.totalHolidayTimeTime;
		var timeWorked = endTime - timeStart;
		var time = Utils.secondsToHMS(timeWorked);
		var minutes = Math.round(timeWorked / 60);
		UI.updateUserTimeComparePanel(entries, timePanel, {hours: time, minutes: minutes});
	}, data);
	getTimeIpsTime.execute();
}

SupervisorInterface.prototype.submitApprovedSalHandler = function(tableName, config, callback) {
	var post = 'user/supervisor/team/member/sal/approved/' + this.currentSal.ID || "";
	var messageHead = $(config.head).find('.page-header');
	var postApprovedSal = new Networking();
	postApprovedSal.request(post, function(error, response) {
		if (error) {
			callback(true, Constants.ERROR.TYPE.critical, error);
			return;
		}
		this.closeMemberApprovals(config.closeViews, function() {
			callback(error, Constants.STATUS.TYPE.success, response.message, messageHead);
		});
		// UI.closeSalView(config.closeView, function() {
		// 	callback(error, Constants.STATUS.TYPE.success, response.message, messageHead);
		// });
	}.bind(this));
	postApprovedSal.execute('POST');
}

SupervisorInterface.prototype.submitDenySalHandler = function(modal) {
	var data = modal.selectedRow.data();
	var errorMessage = modal.modalElement.find('#sal-error-message').val();
	data.errorMessage = errorMessage;
	data.statusChange = modal.config.statusChange;
	data.userSalId = this.currentSal.ID;
	var json = JSON.stringify(data);

	var postSalError = new Networking()
	postSalError.request('user/supervisor/team/member/sal/error', function(error, response) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, modal.errorElement, 2000);
			return;
		}
		modal.dismiss();
		UI.flashMessage(Constants.STATUS.TYPE.success, response.message, $('#supervisor-sal-approval-options'), 3000);
	}, json);
	postSalError.execute('POST');
}

SupervisorInterface.prototype.createUserSal = function(modal) {
	var data = modal.selectedRow.data();
	var dateString = modal.modalElement.find('#supervisor-create-sal-date').datepicker({dateFormat: "yy-mm-dd"}).val();
	var date = $.datepicker.formatDate( "yy-mm-dd", new Date(dateString) );
	if (!date) {
		UI.flashMessage(Constants.ERROR.TYPE.critical, "There Must Be A Date Selected", modal.errorElement, 500);
		return;
	}
	var createUserSal = {
		userId: data.UserID,
		date: date,
		entryStatusID: 1, // open sal
	};
	var json = JSON.stringify(createUserSal);
	var createNewUserSal = new Networking();
	createNewUserSal.request('user/supervisor/create/team/member/sal', function(error, response) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, modal.errorElement, 2000);
			return;
		}
		UI.flashMessage(Constants.STATUS.TYPE.success, response.message, modal.errorElement, 1000);
		modal.dismiss();
	}, json);
	createNewUserSal.execute('POST');
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
			UI.flashMessage(Constants.ERROR.TYPE.major, error, modal.errorElement, 2000);
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
			scrollY: true,
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