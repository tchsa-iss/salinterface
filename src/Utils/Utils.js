/*
* @Author: Daniel Roach
* @Date:   2018-01-04 16:15:47
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-02-16 11:03:27
*/

var Utils = function() {

}
Utils.clearDataTable = function(table) {

}

Utils.dataTableExists = function(target) {
	if (!$.fn.DataTable.isDataTable(target)) {
  		return false
	}
	return true;
}

Utils.destroyOldTable = function(tableName) {
	var oldTable = $(tableName).DataTable();
	  var tbody = oldTable.table().body();
	  tbody.remove();
	  oldTable.destroy();
}

Utils.combineTwoStrings = function(string1, string2) {
	return string1 + ' ' + string2;
}

Utils.isModal = function(config) {
	if (!config) {
		return false;
	}
	if (typeof config !== 'object') {
		return false;
	}
	if (config.isModal && config.isModal === true) {
		return true;
	}
	return false;
}

Utils.requiresRowSelect = function(config) {
	if (!config) {
		return false;
	}
	if (typeof config !== 'object') {
		return false;
	}
	if (config.select && config.select === true) {
		return true;
	}
	return false;
}

Utils.createSelect = function(select, name, data, selected) {
	var option = $('<option>' + name + '</option>');
	if (selected) {
		option = $('<option selected active>' + name + '</option>');
	}
	option.data({data: data});
	select.append(option);
}

Utils.convertDateToReadableFormat = function(date) {
	var newDate = new Date(date.replace(/-/g, '\/').replace(/T.+/, ''));

	// request a weekday along with a long date
	var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	return newDate.toLocaleString('en-us', options);
}

Utils.getCurrentDate = function(dateObj) {
	var dateObj = dateObj || new Date();

	var month = dateObj.getUTCMonth() + 1; //months from 1-12
	var day = dateObj.getUTCDate();
	var year = dateObj.getUTCFullYear();
	return month + "-" + day + "-" + year;
}

Utils.convertMinutesToHours = function(time) {
	if (time < 1) {
	    return "0:00";
	}
	var hours = Math.floor(time / 60);
	var minutes = (time % 60);
	if (minutes === 0) {
		return hours + ":" + "00";
	}
	return hours + ":" + minutes;
}

Utils.secondsToHMS = function(seconds) {
	try {
		if(seconds <0) 
			seconds = 0;

		var h = Math.floor(seconds/3600);
		var m = Math.floor(seconds/60)%60;
		var s = (seconds%60);


		if (s >= 30 && s <= 59)
		{
			m = m + 1;
	//Check to make sure min is not over 60
	//If it is then add an hour
	}

	if (m > 59) {
		h = h + 1;
		m = 0
	}

	if (m < 10) m = '0'+m;
	if (s < 10) s = '0'+s;
	if (h == 0) h = "0";

	if(isNaN(h) || isNaN(m) || isNaN(s)) throw "no";
	return h+":"+m;
	} catch(err) {
		return "0:00";
	}
}

module.exports = Utils;