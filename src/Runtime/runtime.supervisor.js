/*
* @Author: iss_roachd
* @Date:   2017-12-01 12:42:22
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-01-19 17:53:24
*/
var SupervisorInterface = require('../Supervisor/interface.js');

var exists = (typeof window["SupervisorInterface"] !== "undefined");
if (!exists) {
	window.SupervisorInterface = SupervisorInterface;
}

if (!window.currentUser) {
	// hmmm we didn't get a user variable passed to the page
 	console.log("no bueno");
}
else {
	window.supervisorInterface = new SupervisorInterface(window.currentUser);
}

SupervisorInterface.setupListeners = function() {
	$('#supervisors-container').on('show.bs.collapse', function (event) {
  		SupervisorInterface.showSupervisorsTable();
	})
	$('#employees-container').on('show.bs.collapse', function () {
  		SupervisorInterface.showEmployeesTable();
	})
	$('#team-content-container').on('show.bs.collapse', function () {
  		SupervisorInterface.showTeamTable();
	})
}

SupervisorInterface.showSupervisorsTable = function() {
	console.log("show supervisors-container tables");
	supervisorInterface.getAllSupervisors('#supervisors-table');
}

SupervisorInterface.showEmployeesTable = function() {
	console.log("show employees-container tables");
	supervisorInterface.getAllEmployees('#employees-table');
}

SupervisorInterface.showTeamTable = function() {
	console.log("show team-container tables");
	supervisorInterface.getAllTeamMembers('#team-member-table');
}

SupervisorInterface.showModal = function(view) {
	$(view).modal("show");
}

SupervisorInterface.onClick = function(target, action, errorView) {
	var error = null;
	function isError(error) {

	}
	function showModal(view) {
		$(view).modal("show");
	}
	switch(action.type) {
		case "add":
			if(action.select && action.select === true) {
				var error = supervisorInterface.add(target, errorView);
				if(error) {
					return;
				}
			}
			supervisorInterface.prepModal(target, action, function(error) {
				if (error) {
					isError();
					return;
				}
				showModal(action.modalName);
			});
			break;
		case "modify":
			error = supervisorInterface.modify(target, errorView);
			break;
		case "delete":
			var error = supervisorInterface.delete(target, errorView);
			if(error) {
				return;
			}
			if (action.isModal) {
				supervisorInterface.prepModal(target, action, function(error) {
					if (error) {
						isError();
						return;
					}
					showModal(action.modalName);
				});
			}
			else {
				supervisorInterface.deleteSupervisor(target);
			}
			break
	}
}

SupervisorInterface.setupListeners();

