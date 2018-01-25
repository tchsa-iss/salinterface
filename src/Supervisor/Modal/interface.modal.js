/*
* @Author: Daniel Roach
* @Date:   2018-01-11 12:36:43
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-01-22 16:52:09
*/

var Networking = require('../../Network/NetworkRequest.js');

function Modal(targetTable, modal, callback) {
	this.element = $(modal.modalName);
	this.submitHandler = this.submit.bind(this);
	this.handler = $(modal.submit).on('click', this.submitHandler);
	this.submitCallback = callback;
	this.currentValue = null;
	this.errorElement = $(modal.modalName);
	this.table = $(targetTable);
	this.data = null;
	this.selectedRow = null;
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
	this.element.modal('hide');
}

Modal.prototype.updateSelection = function(element) {
	this.currentValue = element;
}

Modal.prototype.getBootstrapSelectId = function(target) {
	var data = this.element.find("option:selected").data();
	return data.id;
}

Modal.prototype.getElementData = function(id) {
	var el = this.element.find(id);
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
