/*
* @Author: Daniel Roach
* @Date:   2018-01-10 16:26:17
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-01-10 16:57:34
*/

var Constants = require('../../constants');
var Networking = require('../../Network/NetworkRequest.js');
var UI = require('../../UI/UI.js');
var Utils = require('../../Utils/Utils.js');

function TeamInterface(id) {
	this.team = null;
	this.messageHead = '#team-content-container';
	this.userId = id;
}

TeamInterface.prototype.getTeamMembers =function(tableName, refresh) {
	if (this.team) return;
	var members = new Networking();
	members.request("user/team/members", function(error, json) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, this.messageHead);
		}
		var table = $(tableName).DataTable( {
			data: json,
			"scrollX": true,
		    columns: [
		        { data: 'UserID' },
		        { data: 'name' },
		        { data: 'Phone' },
		        { data: 'Cell' },
		        { data: 'ReportingUnit' },
		    ]
		});
		this.team = table;
	}.bind(this));
	members.execute();
}

module.exports = TeamInterface;