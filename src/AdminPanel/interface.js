/*
* @Author: iss_roachd
* @Date:   2017-12-01 12:39:17
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2017-12-22 15:31:26
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

/**
 * @param  {[type]}
 * @param  {Function}
 * @return {[type]}
 */
AdminInterface.prototype.showLogs = function(type, callback) {
	var request = new Networking();
	request.request("admin/logs/ALL", function(error, json) {
		if (!error) {
			var jsonArray = json.split('\n');
			jsonArray.clean("");
			var jsonData = jsonArray.map(JSON.parse);
			setTimeout(function() {
				var table = this.__createTableWithJson(jsonData);
				$('#log-content-table').DataTable();
			}.bind(this), 200);
			//var table = this.__createTableWithJson(jsonData);
			//table.DataTable();
			//$(table).DataTable();
			//$('#log-menu').append(table);
			// $('#log-menu').append(table);
			// setTimeout(function() {
			//$('#log-content-table').DataTable();
			// }, 1000);
		 	return;
		}
		return error.desc();
	}.bind(this));
	request.execute();
};

AdminInterface.prototype.callMethod = function(name, args, callback) {
	
}

/**
 * @return {[type]}
 */

AdminInterface.prototype.showMenuTab = function(id) {
	this.hideActiveTab(null, function() {
		$(id).show("slide", 150);
		this.activeMenu = id;
		if (id === '#log-menu') {
			this.showLogs();
		}
	}.bind(this));
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

AdminInterface.prototype.expandSubMenu = function(id) {
	this.activeSubMenu = id;
	this.createDataTable('#service-units-table');
	$(id).toggle('blind', 200);
}

AdminInterface.prototype.collapseSubMenu = function(id) {

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