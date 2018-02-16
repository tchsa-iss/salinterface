/*
* @Author: Daniel Roach
* @Date:   2018-01-11 12:36:43
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-02-14 15:58:30
*/

var Networking = require('../../Network/NetworkRequest.js');

function Modal(targetTable, config, callback) {
	this.modalElement = $(config.modalName);
	this.modalElement.modal({backdrop: 'static', keyboard: false});
	if (!config.submit) {
		this.submitElement = this.modalElement.find(':submit');
		this.submitElement.unbind();
		this.submitElement.on('click', this.submit.bind(this));
		//this.submitHandler = submitHandler;
	}
	else {
		this.submitHandler = this.submit.bind(this);
		this.handler = $(config.submit).on('click', this.submitHandler);
	}
	this.submitCallback = callback;
	this.currentValue = null;
	this.errorElement = $(config.modalName);
	this.table = $(targetTable);
	this.data = null;
	this.selectedRow = null;
	this.config = config;
}

Modal.prototype.prepAddSupervisor = function(callback) {
	var allEmployees = new Networking();
	allEmployees.request("user/super/employees/all", function(error, json) {
		if (error) {
			//UI.flashMessage(Constants.ERROR.TYPE.major, error, this.employeesMessageHead);
			callback(error);
			return;
		}
		var select = $('#supervisor-create-form-select');
		select.empty();
		select.append('<option disabled selected value> -- select a employee -- </option>');
		//select.on('click', this.updateSelection.bind(this));
		json.forEach(function(employee) {
			var option = $('<option>'+ employee.FirstName + ' ' + employee.LastName + '</option>');
			option.data({id: employee.UserID});
			select.append(option);
		})
		select.selectpicker('refresh');
		callback();

	}.bind(this));
	allEmployees.execute();
}

Modal.prototype.prepApproveMemberSal = function(callback) {
	this.modalElement.find('.modal-title').text("Approval");
	this.modalElement.find(':submit').text("Approve SAL");
	var modalBody = this.modalElement.find('.modal-body');
	modalBody.empty();
	modalBody.html('<div class="well"><h4>Please Confirm</h4></div>');
	callback();
}

Modal.prototype.prepDenyMemberSal = function(callback) {
	var table = this.table.DataTable();
	this.selectedRow = table.row( { selected: true } );
	this.modalElement.find('.modal-title').text("SAL Error Correction Form");
	this.modalElement.find(':submit').text("Deny");
	var modalBody = this.modalElement.find('.modal-body');
	modalBody.empty();
	modalBody.html('<form><div class="form-group"><p>Please give a description of the error found in the sal</p><h3 style="color:#777;">Error Message</h3><textarea class="form-control" id="sal-error-message" rows="4"></textarea></div></form>');
	callback();
}

Modal.prototype.prepCreateNewUserSal = function(callback) {
	var table = this.table.DataTable();
	this.selectedRow = table.row( { selected: true } );
	var data = this.selectedRow.data();
	var employee = $('#supervisor-employee-name');
	employee.attr("placeholder", data.FirstName + " " + data.LastName);
	$('#supervisor-create-sal-date').datepicker({showButtonPanel: true});
	callback();
}

Modal.prototype.prepAssignSupervisor = function(callback) {
	var allSupervisors = new Networking();
	allSupervisors.request("user/super/supervisors/all", function(error, json) {
		if (error) {
			//UI.flashMessage(Constants.ERROR.TYPE.major, error, this.employeesMessageHead);
			callback(error);
			return;
		}
		var table = this.table.DataTable();
		this.selectedRow = table.row( { selected: true } );
		var data = this.selectedRow.data();
		var employee = $('#team-add-member-name')
		employee.attr("placeholder", data.FirstName + " " + data.LastName);
		var select = $('#member-supervisor-form-select');
		select.empty();
		select.append('<option disabled selected value> -- select a employee -- </option>');
		//select.on('click', this.updateSelection.bind(this));
		json.forEach(function(supervisor, index) {
			var option = $('<option>'+ supervisor.FirstName + ' ' + supervisor.LastName + '</option>');
			option.data({id: supervisor.ID, index: index});
			select.append(option);
		})
		select.selectpicker('refresh');
		callback();

	}.bind(this));
	allSupervisors.execute();
}

Modal.prototype.prepRemoveSupervisor = function(callback) {
	var table = this.table.DataTable();
	this.selectedRow = table.row( { selected: true } );
	var data = this.selectedRow.data();
	var getSupervisor = new Networking();
	var get = 'user/super/supervisors/' + data.UserID;
	getSupervisor.request(get, function(error, supervisors) {
		if (error) {
			//UI.flashMessage(Constants.ERROR.TYPE.major, error, this.employeesMessageHead);
			callback(error);
			return;
		}
		var table = this.table.DataTable();
		var employee = $('#employee-remove-name')
		employee.attr("placeholder", data.FirstName + " " + data.LastName);
		var select = $('#employee-remove-supervisor-select');
		select.empty();
		select.append('<option disabled selected value> -- select a supervisor -- </option>');
		supervisors.forEach(function(supervisor, index) {
			var option = $('<option>'+ supervisor.FirstName + ' ' + supervisor.LastName + '</option>');
			option.data({id: supervisor.SupervisorID, index: index});
			select.append(option);
		})
		select.selectpicker('refresh');
		callback();
	}.bind(this));
	getSupervisor.execute();
}

Modal.prototype.submit = function() {
	this.submitCallback(this);
}

Modal.prototype.removeAllClickHandlers = function() {
	this.handler.off('click', this.submitHandler);
}

Modal.prototype.getTable = function() {
	return this.table;
}

Modal.prototype.dismiss = function() {
	this.modalElement.modal('hide');
}

Modal.prototype.updateSelection = function(element) {
	this.currentValue = element;
}

Modal.prototype.getBootstrapSelectId = function(target) {
	var data = this.modalElement.find("option:selected").data();
	return data.id;
}

Modal.prototype.getElementData = function(id) {
	var el = this.modalElement.find(id);
	if (el) {
		return el.data();
	}
	return null;
}

Modal.prototype.handleAddSupervisor = function(selectPicker) {
	var selected = this.getBootstrapSelectVal(selectPicker);
	var employee = selected.val();
}

module.exports = Modal;
