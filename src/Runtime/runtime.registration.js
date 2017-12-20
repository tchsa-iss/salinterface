/*
* @Author: iss_roachd
* @Date:   2017-12-12 10:34:58
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2017-12-19 15:35:17
*/

var RegistrationError = require('../Error/Error.js');
var Networking = require('../Network/NetworkRequest.js');
var UI = require('../UI/UI.js');
function RegistrationApi() {
	this.networking = new Networking();
	this.ui = UI;
}

RegistrationApi.prototype.registerUser = function(event, data) {
	event.preventDefault();
	this.__showSpinner();
	var form = this.__getUserFormData();
	if (form.errors.length > 0) {
		this.__hideSpinner();
		this.__formRequirementErrors(form.errors);
		this.ui.scrollToTop();
		return;
	}
	var json = JSON.stringify(form.registrationData);
	this.networking.request('register', function(error, jsonResponse) {
		if (error) {
			this.userCreateError(error);
			return;
		}
		this.userCreatedSuccess(jsonResponse);
	}.bind(this), json);
	this.networking.execute('POST');
}

RegistrationApi.prototype.userCreatedSuccess = function(json) {
	var messageSuccess = this.ui.createHeadingWithSubHeader("Success: ", json.message, '2');
	var messageWell =  this.ui.createWellWithContent(messageSuccess, 1);
	var buttonLink = $('<a href="/" class="btn btn-primary btn-lg active" role="button">Click Here For Your Dashboard</a>');
	messageWell.append(buttonLink);
	var message = messageWell.append(messageWell);
	$('.container').empty();
	$('.container').append(message);
	this.__hideSpinner();
}

RegistrationApi.prototype.userCreateError = function(error) {
	var errrorMessage = this.ui.createAlert(1, error);
	$('.container').prepend(errrorMessage);
	this.__hideSpinner();
	this.ui.scrollToTop();
}

RegistrationApi.prototype.__getUserFormData = function() {
	var errorElements = [];
	var registrationData = {};
	var inputs = $('#user-form *').filter(':input');
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		if (input.name === 'jobTitle' || input.name === 'serviceUnit') {
			var valid = this.checkFormRequirements(input);
			if (!valid) {
				errorElements.push(input.name);
			}
			else {
				var selectedInput = input[input.selectedIndex];
				registrationData[input.name] = selectedInput.value;
			}
		}
		else {
			if (input.type !== 'submit') {
				registrationData[input.name] = input.value;
			}
		}
	}
	return {
		errors: errorElements,
		registrationData: registrationData
	}
}

RegistrationApi.prototype.__formRequirementErrors = function(errorElements) {
	if(errorElements.length > 0) {
		$('#form-error').empty();
		$('#form-error').append("<strong>Form Error</strong>");
		for (var i = 0; i < errorElements.length; i++) {
			if (errorElements[i] === 'jobTitle') {
				$('#form-error').append('<li id="job-title-error">Please Select A Job Title</li>');
			}
			if (errorElements[i] === 'serviceUnit') {
				$('#form-error').append('<li id="service-unit-error">Please Select A Service Unit</li>');
			}
		}
		$('#flash-message-box').show();
		return;
	}
}

RegistrationApi.prototype.__showSpinner = function() {
	this.ui.showSpinnerOverlay('#registering-user-loading');
}
RegistrationApi.prototype.__hideSpinner = function() {
	this.ui.hideSpinnerOverlay('#registering-user-loading');
}

RegistrationApi.prototype.checkFormRequirements = function(input) {
	if (input !== null && input.selectedIndex !== 0) {
		return true;
	}
	return false;
}

RegistrationApi.prototype.flashMessage = function(type, messages) {
	
}

var exists = (typeof window["registrationApi"] !== "undefined");
if (!exists) {
	window.registrationApi = new RegistrationApi();
}