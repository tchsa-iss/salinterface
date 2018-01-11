/*
* @Author: iss_roachd
* @Date:   2017-12-01 12:41:51
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-01-08 14:12:49
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

AdminInterface.showProjectsOnClick = function(target) {
	if (AdminInterface.checkVisibliityState(target)) {
		AdminInterface.collapseSubMenu(target);
		return;
	}
	AdminInterface.expandSubMenu(target, function() {
		//AdminInterface.databaseInterface('showUserReportingUnits');
	});
}

AdminInterface.showActivityCodesOnClick = function(target, refresh) {
	if (AdminInterface.checkVisibliityState(target)) {
		AdminInterface.collapseSubMenu(target);
		return;
	}
	AdminInterface.expandSubMenu(target, function() {
		if($('#active-code-selections').has("button").length > 0) return;
		AdminInterface.databaseInterface('get', 'admin/database/account/code/types', function(error, codeTypes) {
			var buttonTypeGroup = $('#active-code-selections');
			codeTypes.forEach(function(type) {
				var onClickHandler = function() {
					AdminInterface.databaseInterface('showAccountCodeGroup', this.id, function(ready) {
						if (ready) {
							$('#activity-code-table-container').show('blind', 200, function() {
								$('#account-codes-options').show('slide', 200);
							});

						}
					});
				}.bind({id: type.CodeTypeID});
				var button = $('<button type="button" class="btn btn-default btn-sm">'+type.Name+'</button>');
				button.click(onClickHandler);
				buttonTypeGroup.append(button);
			})
		});
	});
}

AdminInterface.showModalTemp = function(view, request) {
	$(view).modal("show");
}

AdminInterface.onEmployeeJobTitlesClick = function(target, refresh) {
	if (AdminInterface.checkVisibliityState(target)) {
		AdminInterface.collapseSubMenu(target);
		return;
	}
	AdminInterface.empoyeeInterface('getJobTitles', function(ready) {
		if (ready) {
			AdminInterface.expandSubMenu(target, function() {
				console.log("done");
			})
		}
	});
}

AdminInterface.showModal = function(target, request) {
	var threads = 2;
	var clearOptions = function(parent) {
		while (parent.firstChild) { 
    		parent.removeChild(parent.firstChild); 
		}
		$(parent).append('<option selected="selected"></option>');
	}
	var done = function(error, data) {
		if (error) {
			// handle error
			return;
		}
		var id = this.id;
		data.forEach(function(obj) {
			if (id === 1) {
				var userSelectForm = $("#user-form-select");
				var name = obj.FirstName + " " + obj.LastName;
				userSelectForm.append('<option data-user-id='+obj.UserID +'>'+name+'</option>');
			}
			if (id === 2) {
				var userRoles = $("#user-form-roles");
				userRoles.append('<option data-role-id='+obj.ID+'>'+obj.DisplayName+'</option>');
			}
		})
		threads--;
		if (threads === 0) {
			$(target).modal("show");
		}
	}
	var userSelectElement = document.getElementById('user-form-select')
	var rolesElement = document.getElementById('user-form-roles')
	clearOptions(userSelectElement);
	clearOptions(rolesElement);
	AdminInterface.empoyeeInterface('get', 'admin/employees/all', done.bind({id:1}));
	AdminInterface.databaseInterface('get', 'admin/database/roles',done.bind({id:2}));
}

AdminInterface.onClick = function(target, action, errorView) {
	var error = null;
	switch(action.type) {
		case "add":
			error = AdminInterface.add(target, errorView);
			break;
		case "modify":
			error = AdminInterface.modify(target, errorView);
			break;
		case "delete":
			error = AdminInterface.delete(target, errorView);
			break
	}
	if (error) return;
	
	if (action.isModal) {
		this.showModalTemp(action.modal);
	}
}

AdminInterface.createUserRole = function(target) {
	var selectedUserId = $('#user-form-select').find(":selected").attr('data-user-id'); //$('#user-form-select').find(":selected").text();
	var selectedRoleId = $('#user-form-roles').find(":selected").attr('data-role-id'); //$('#user-form-roles').find(":selected").text();
	var postNewRole = {
		userId: selectedUserId,
		userRoleId: selectedRoleId
	};
	AdminInterface.databaseInterface('addNewUserRole', postNewRole, function(response) {
		if (response) {
			$(target).modal("hide");
		}
	});
}

AdminInterface.checkVisibliityState = function(element) {
	return $(element).is(':visible');
}