/*
* @Author: Daniel Roach
* @Date:   2017-12-20 12:19:12
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-01-02 11:01:38
*/
var Constants = require('../../constants');
var Networking = require('../../Network/NetworkRequest.js');
var UI = require('../../UI/UI.js');

function LogsInterface() {
	this.LOGS = Constants.LOGTYPES.AVAILABLE;
	this.currentLog = null;
}

LogsInterface.prototype.show = function(type) {
	var available = this.LOGS.indexOf(type);
	if (available > -1) {
		return this.getLog(type);
	}
}

LogsInterface.prototype.getLog = function(type) {
	var requestName = 'admin/logs/' + type;
	var log = new Networking();
	log.request(requestName, function(error, json) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, '#dashboard-main', 500);
		}
		if (this.currentLog) {
			this.currentLog.destroy();
		}
		setTimeout(function() {
			this.currentLog = $('#log-content-table').DataTable({
				data: json,
				"scrollX": true,
				columns :[
					{data: "message"},
					{data: "channel"},
					{data: "extra.user"},
					{data: "datetime.date"},
					{data: "extra.uid"},
					{data: "level"},
					{data: "level_name"}
				]
			});
		}.bind(this), 200);
	}.bind(this));
	log.execute();
}

module.exports = new LogsInterface();