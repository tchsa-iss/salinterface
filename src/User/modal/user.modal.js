/*
* @Author: Daniel Roach
* @Date:   2018-01-29 14:17:52
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-02-16 11:54:06
*/

var Networking = require('../../Network/NetworkRequest.js');
var Utils = require('../../Utils/Utils.js');

function Modal(targetTable, config, submitHandler) {
	this.modalElement = $(config.modalName);
	this.modalElement.modal({backdrop: 'static', keyboard: false});
	this.submitElement = this.modalElement.find(':submit');
	this.submitElement.unbind();
	this.submitElement.on('click', this.submit.bind(this));
	this.submitHandler = submitHandler;
	this.table = $(targetTable);
	this.data = null;
	this.selectedRow = null;
	this.formStatusChange = config.statusChange || 1;
	this.closeView = config.closeView || "";
}

Modal.prototype.createSelect = function(select, name, data) {
	var option = $('<option>'+ employee.FirstName + ' ' + name + '</option>');
	option.data({data: data});
	select.append(option);
}

Modal.prototype.prepSalAddEntry = function(ready) {
	this.modalElement.find('.modal-title').text("Create New Sal Entry");
	this.submitElement.text("Create Entry");
	var type = {entryType: 1};
	var getFormData = new Networking();
	getFormData.request('/user/sal/form/entry/data', function(error, formData) {
		console.log(formData);
		var formSelects = this.modalElement.find('.selectpicker');
		for (var i = 0; i < formSelects.length; i++) {
			var select = $(formSelects[i]);
			select.empty();
			if (select.attr('name') === 'status') {
				select.append('<option disabled selected value> -- select a status (Required) -- </option>');
				formData.status.forEach(function(status) {
					Utils.createSelect(select, status.StatusCode + ": " + status.Description, status);
				});
			}
			if (select.attr('name') === 'reporting-unit') {
				select.append('<option disabled selected value> -- select a reporting unit (Required) -- </option>');
				formData.reportingUnits.forEach(function(unit) {
					Utils.createSelect(select, unit.Code + ": " + unit.Name, unit);
				});
			}
			if (select.attr('name') === 'sub-reporting-unit') {
				select.append('<option disabled selected value> -- Do Not Select Unless Sub Is Needed -- </option>');
				formData.subReportingUnits.forEach(function(unit) {
					Utils.createSelect(select, unit.ReportingUnitCode + ": " + unit.Description, unit);
				});
			}
			if (select.attr('name') === 'location') {
				select.append('<option disabled selected value> -- select a location (Required) -- </option>');
				formData.locationCodes.forEach(function(location) {
					Utils.createSelect(select, location.Description, location);
				});
			}
			if (select.attr('name') === 'account-code') {
				select.append('<option disabled selected value> -- select a account code (Required) -- </option>');
				formData.accountCodes.forEach(function(accountCode) {
					Utils.createSelect(select, accountCode.Code + ": " + accountCode.Name, accountCode);
				});
			}
			if (select.attr('name') === 'project') {
				select.append('<option disabled selected value> -- select a project (optional) -- </option>');
				formData.projects.forEach(function(project) {
					Utils.createSelect(select, project.Name + ": " + project.Description, project);
				});
			}
			if (select.attr('name') === 'group') {
				select.append('<option disabled selected value> -- select a group (optional) -- </option>');
				formData.groups.forEach(function(group) {
					Utils.createSelect(select, group.Name + ": " + group.Description, group);
				});
			}
			select.selectpicker('refresh');
		}
		ready(null);
	}.bind(this), type)
	getFormData.execute();
}

Modal.prototype.prepModifySalEntry = function(ready) {
	this.modalElement.find('.modal-title').text("Edit Sal Entry");
	this.submitElement.text("Update Entry");
	var type = {entryType: 1};
	var table = this.table.DataTable();
	this.selectedRow = table.row( { selected: true } );
	var getFormData = new Networking();
	getFormData.request('/user/sal/form/entry/data', function(error, formData) {
		var data = this.selectedRow.data();
		var formSelects = this.modalElement.find('.selectpicker');
		for (var i = 0; i < formSelects.length; i++) {
			var select = $(formSelects[i]);
			select.empty();
			if (select.attr('name') === 'status') {
				//select.append('<option disabled selected value> -- select a status -- </option>');
				formData.status.forEach(function(status) {
					var isSelected = false;
					if (status.StatusCode === data.EntryStatusCode) {
						isSelected = true;
					}
					Utils.createSelect(select, status.StatusCode + ": " + status.Description, status, isSelected);
				});
			}
			if (select.attr('name') === 'reporting-unit') {
				//select.append('<option disabled selected value> -- select a reporting unit -- </option>');
				formData.reportingUnits.forEach(function(unit) {
					var isSelected = false;
					if (unit.Code === data.ReportingUnitCode) {
						isSelected = true;
					}
					Utils.createSelect(select, unit.Code + ": " + unit.Name, unit, isSelected, isSelected);
				});
			}
			if (select.attr('name') === 'location') {
				//select.append('<option disabled selected value> -- select a location -- </option>');
				formData.locationCodes.forEach(function(location) {
					var isSelected = false;
					if (location.Description === data.Location) {
						isSelected = true;
					}
					Utils.createSelect(select, location.Description, location, isSelected);
				});
			}
			if (select.attr('name') === 'account-code') {
				//select.append('<option disabled selected value> -- select a account code -- </option>');
				formData.accountCodes.forEach(function(accountCode) {
					var isSelected = false;
					if (accountCode.Code === data.ActivityCode) {
						isSelected = true;
					}
					Utils.createSelect(select, accountCode.Code + ": " + accountCode.Name, accountCode, isSelected);
				});
			}
			if (select.attr('name') === 'project') {
				select.append('<option disabled selected value> -- select a project (optional) -- </option>');
				formData.projects.forEach(function(project) {
					Utils.createSelect(select, project.Name + ": " + project.Description, project);
				});
			}
			if (select.attr('name') === 'group') {
				select.append('<option disabled selected value> -- select a group (optional) -- </option>');
				formData.groups.forEach(function(group) {
					Utils.createSelect(select, group.Name + ": " + group.Description, group);
				});
			}
			select.selectpicker('refresh');
		}
		this.modalElement.find('input[name="time-spent"]').attr('value', data.TimeSpent);
		this.modalElement.find('input[name="prep-time"]').attr('value', data.PrepTime);
		this.modalElement.find('input[name="time-of-day"]').attr('value', data.ActivityStartTime);
		this.modalElement.find('textarea[name="description"]').val(data.Description);
		ready(null);
	}.bind(this), type)
	getFormData.execute();
}
Modal.prototype.prepDeleteSalEntry = function(ready) {
	var table = this.table.DataTable();
	this.selectedRow = table.row( { selected: true } );
	ready(null);
}

Modal.prototype.prepSubmitSal = function(ready) {
	// prep is stubbed for future use
	// 
	this.modalElement.find('#user-agreement-checkbox').prop('checked', false);
	ready(null);
}

Modal.prototype.prepReOpenSal = function(ready) {
	this.modalElement.find('.modal-title').text("Re-Open SAL");
	var modalBody = this.modalElement.find('.modal-body');
	console.log("prep modal");
	modalBody.empty();

	modalBody.html(
		'<p id="re-open-message">Please Confirm Re-Open Request<p><div class="row" id="re-open-progress" style="display:none;"><div class="col-sm-12"><div class="page-header"><h3 style="color:#777;">Working....</h3></div><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"><span class="sr-only">0% Complete</span></div></div></div></div>'
		)
	// var progress = $('<div class="progress" style="display:none;"></div>')
	// var bar = $('<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>');
	// var indicator = $('<span class="sr-only">0% Complete</span>');
	// bar.append(indicator);
	// progress.append(bar);
	// modalBody.append(progress);
	ready(null);
}

Modal.prototype.addNewSalEntry = function() {

}

Modal.prototype.submit = function() {
	this.submitHandler(this);
}

Modal.prototype.removeAllClickHandlers = function() {
	//this.submitElement.off('click', this.submitContext);
	this.submitElement.unbind();
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
	var data = this.element.find("option:selected").data();
	return data.id;
}

Modal.prototype.getBootstrapSelectWith = function(target) {
	var data = target.find("option:selected").data();
	return data;
}

Modal.prototype.getElementData = function(id) {
	var el = this.element.find(id);
	if (el) {
		return el.data();
	}
	return null;
}

module.exports = Modal;
