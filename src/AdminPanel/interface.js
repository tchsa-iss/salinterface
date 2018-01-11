/*
* @Author: iss_roachd
* @Date:   2017-12-01 12:39:17
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-01-06 17:47:27
*/

(function() {
	Array.prototype.clean = function(deleteValue) {
		for(var i = 0; i < this.length; i++) {
			if (this[i] == deleteValue) {
				this.splice(i, 1);
				i--;
			}
		}
		return this;
	}
}());

var Constants = require('../Constants.js');
var AdminErrors = require('../Error/Error.js');
var Networking = require('../Network/NetworkRequest.js');
var Notification = require('../Notification/Notification.js');
var EmployeeInterface = require('./Employees/interface.employees.js');
var DatabaseInterface = require('./Database/interface.database.js');
var LogInterface = require('./Logs/interface.logs.js');
var UI = require('../UI/UI.js');

/**
 * 
 */
function AdminInterface() {
	this.dispatch = new Notification();
	this.activeMenu = null;
	this.activeSubMenu = null;
};

/**
 * @param  {[type]}
 * @param  {Function}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
AdminInterface.prototype.subscribe = function(eventName, callback, cantext, args) {
	this.dispatch.subscribe(event, callback, context);
};

/**
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
AdminInterface.prototype.unsubscribe =function(eventName, callback) {
	return this.dispatch.unsubscribe(event)
};

AdminInterface.prototype.publish = function(eventName, args1, arg2, arg3) {

}

AdminInterface.prototype.callMethod = function(name, args, callback) {
	
}

AdminInterface.prototype.empoyeeInterface = function(method, args, callback) {
	EmployeeInterface[method](args, callback);
}

AdminInterface.prototype.logInterface = function(method, args) {
	LogInterface[method](args);
}

AdminInterface.prototype.databaseInterface = function(method, args, callback) {
	DatabaseInterface[method](args, callback);
}

AdminInterface.prototype.add = function(target, errorView) {

}

AdminInterface.prototype.modify = function(target, errorView) {
	var error = null;
	var table = $(target).DataTable();
	if (table.rows('.info').data().length < 1) {
		var message = "Please Select At Least One Row To Modify";
		UI.flashMessage(Constants.ERROR.TYPE.major, message, errorView, 500);
		error = true;
	}
	return error;
}

AdminInterface.prototype.delete = function(target, errorView) {
	var error = null;
	var table = $(target).DataTable();
	if (table.rows('.info').data().length < 1) {
		var message = "Please Select At Least One Row To Delete";
		UI.flashMessage(Constants.ERROR.TYPE.critical, message, errorView, 500);
		error = true;
	}
	return error;
}

/**
 * @return {[type]}
 */

AdminInterface.prototype.showMenuTab = function(id) {
	this.hideActiveTab(null, function() {
		$(id).show("slide", 150, function() {
			this.kickStartSubmenu(id);
		}.bind(this));

		this.activeMenu = id;
	}.bind(this));
}

AdminInterface.prototype.kickStartSubmenu = function(id) {
	if (id === '#log-menu') {
		//this.showLogs();
	}
	if (id === '#employees-menu') {

	}
}

AdminInterface.prototype.hideActiveTab = function(element, done) {
	if (this.activeMenu) {
		$(this.activeMenu).hide("fast", function() {
			if (typeof done === 'function') {
				done();
			}
		});
	}
	else {
		if (done && typeof done === 'function') {
			done();
		}
	}
}

AdminInterface.prototype.expandSubMenu = function(id, callback) {
	$(id).show('blind', 200, callback);
}

AdminInterface.prototype.collapseSubMenu = function(id, callback) {
	$(id).hide('blind', 200, callback);
}

AdminInterface.prototype.createDataTable = function(id) {
	$(id).DataTable();
}

/**
 * @param  {[type]}
 * @return {[type]}
 */
AdminInterface.prototype.__createTableWithJson = function(json) {
	//var table = $('<table id="service-units-table" class="table display" cellspacing="0"></table>');
	var	thead = $('<thead></thead>');
	var tabelRow = $('<tr></tr>');

	var jsonHeaders = json[0];
	var headerKeys = Object.keys(jsonHeaders);
	for (var i = 0; i < headerKeys.length; i++) {
		var headerName = headerKeys[i];
		var header = $("<th>" + headerName + "</th>");
		tabelRow.append(header);
	}
	
	var tbody = $('<tbody></tbody>');
	for (var i = 0; i < json.length; i++) {
		var tr = $("<tr></tr>");
		var jsonData = json[i];
		for (var ii = 0; ii < headerKeys.length; ii++) {
			var data = jsonData[headerKeys[ii]];
			if (headerKeys[ii] === 'datetime' || headerKeys[ii] === 'extra' || headerKeys[ii] === 'context') {
				data = JSON.stringify(data);
			}
			var td = $("<td>" + data + "</td>");
			tr.append(td);
		}
		tbody.append(tr);
	}
	var table = $('#log-content-table');
	thead.append(tabelRow);
	table.append(thead);
	table.append(tbody);
	return table;
};

module.exports = new AdminInterface();