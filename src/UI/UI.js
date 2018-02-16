/*
* @Author: iss_roachd
* @Date:   2017-12-19 10:34:42
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-02-16 12:35:53
*/

var Constants = require('../constants.js');
var Utils = require('../Utils/Utils.js');

function UI() {
	//this.jqueryApi =  window.$;
};

// defualt postion is top
UI.prototype.flashMessage = function(type, errorMsg, elementID, duration) {
	//var type = Constants.ERROR.TYPE;
	var duration = duration || 300;
	var flashMessage = $('<div class="alert '+type+'" role="alert" style="display:none">'+ errorMsg +'</div>');

	$(elementID).prepend(flashMessage);
	flashMessage.show('blind');
	setTimeout(function() {
		flashMessage.hide('blind', 300, function() {
			$(flashMessage).remove();
		});

	}.bind(flashMessage), duration);
}

UI.prototype.scrollToTop = function(thisElementTop, position) {
	var element = thisElementTop || ".body";
	var position = position || 0;
	window.scrollTo(0, 0);
}

UI.prototype.showSpinnerOverlay = function(element) {
	$(element).addClass("loading").show();
}
UI.prototype.hideSpinnerOverlay = function(element) {
	$(element).removeClass("loading").hide();
}

UI.prototype.createWellWithContent = function(contentElement, size) {
	if (size === 1) {
		return $('<div class="well well-lg"></div>').append(contentElement);
	}
	if( size === 2) {
		return $('<div class="well well-lg"></div>').append(contentElement);
	}
	return null;
}

UI.prototype.createHeadingWithSubHeader = function(content, subContent, size) {
	var header = "<h" + size + ">" + content + "<small>" + subContent + "</small></h" + size +"/>"
	var headerElement = $(header);
	if (!headerElement) {
		return null;
	}
	return headerElement;
}

UI.prototype.createAlert = function(type, message) {
	var div = $('<div></div>').text(message);
	if (type === 1) {
		div.addClass("alert alert-danger alert-dismissible text-center");
		var closeButton = $('<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>').append($('<span aria-hidden="true">&times;</span>'));
		div.append(closeButton);
	}
	if (type === 2) {
		div.addClass("alert alert-danger");
	}
	return div;
}

UI.prototype.isSelected = function(table) {
	if (table.rows('.info').data().length < 1) {
		return false;
	}
	return true;
}

UI.prototype.tableRowIsSelected = function(tableName) {
	var table = $(tableName).DataTable();
	if (table.rows('.info').data().length < 1) {
		return false;
	}
	return true;
}

UI.prototype.selectSingleTableRow = function(event) {
	if ($(this).hasClass('info')) {
    	$(this).removeClass('info');
    }
    else {
        event.data.table.$('tr.info').removeClass('info');
        $(this).addClass('info');
    }
}

UI.prototype.closeSalView = function(view, done) {
	if (view === 'open') {
		$('#open-sals-panel').hide();
		$('#sal-open-table-container').hide();
		//done();
		// $('#sal-open-table-container').hide('blind', 500, function() {
		// 	$('#open-sals-panel').hide('blind', 600, done);
		// });
	}
	if (view === 'pending') {
		$('#pending-sals-panel').hide();
		$('#sal-pending-table-container').hide();
		//done();
	}
	if (view === 'approved') {
		//$('#pending-sals-panel').hide();
		$('#member-sal-approved-table-container').hide();
	}
	if (view === 'closed') {
		
	}
	if (view === 'corrections') {
		$('#member-sal-correction-table-container').hide();
	}
	if (view === 'approvals') {
		$('#member-sal-approval-table-container').hide();
		$('#member-time-compare').hide();
		$('#panel-approval-sals').hide();
	}
	done();
}

UI.prototype.checkForTimePanel = function(container) {
	var timePanel = $(container).find('.sal-time-compare');
	if (timePanel.length === 0) {
		return false;
	}
	return timePanel;
}

UI.prototype.updateTimePanelColors = function(memberPanel, timeIpsPanel, isOff) {
	var member = memberPanel.find('.panel-heading');
	var timeIps = timeIpsPanel.find('.panel-heading');
	if (isOff) {
		memberPanel.css({"border-color": "#d9534f"});
		timeIpsPanel.css({"border-color": "#d9534f"});
		member.css({"background-color": "rgb(217,83,79)"});  //removeClass("time-entries-danger").addClass( "time-entries-danger" );
		timeIps.css({"background-color": "rgb(217,83,79)"}); //removeClass("time-entries-danger").addClass( "time-entries-danger" );
		return;
	}
	memberPanel.css({"border-color": "#337ab7"});
	timeIpsPanel.css({"border-color": "#337ab7"});
	member.css({"background-color": "rgb(51, 122, 183)"});
	timeIps.css({"background-color": "rgb(51, 122, 183)"});
}

UI.prototype.updateUserTimeComparePanel = function(entries, timePanel, timeIPSTime) {
	var memberTimePanel = timePanel.find('.member-time');
	var timeIpsTimePanel = timePanel.find('.timeips-time');
	var memberTimeMinutes = memberTimePanel.find('p[name="minutes"]');
	var memberTimeHours = memberTimePanel.find('p[name="hours"]');
	var timeIpsTimeMinutes =  timeIpsTimePanel.find('p[name="minutes"]');
	var timeIpsTimeHours = timeIpsTimePanel.find('p[name="hours"]');
	var memberData = memberTimeMinutes.data();
	memberData.minutes.time = 0;
	//memberData.minutes.time;
	for (var i = 0; i < entries.length; i++) {
		var entry = entries[i];
		memberData.minutes.time += entry.TimeSpent;
	}
	var offset = timeIPSTime.minutes - memberData.minutes.time;
	var timeError = false;

	if (offset > 1 || offset < -1) {
		timeError = true;
	}
	this.updateTimePanelColors(memberTimePanel, timeIpsTimePanel, timeError);

	memberTimeMinutes.text(memberData.minutes.time);
	memberTimeHours.text(Utils.convertMinutesToHours(memberData.minutes.time));
	timeIpsTimeMinutes.text(timeIPSTime.minutes);
	timeIpsTimeHours.text(timeIPSTime.hours);
}


UI.prototype.runProgress = function(progressView, done) {
	var progressBar = progressView.find('.progress-bar');
	var now = 0;
	var progressContext = setInterval(function() {
		// if (now === 75) {
		// 	done();
		// }
		if(now >= 100) {
			clearInterval(progressContext);
			done();
		}
		progressBar.css("width", now + "%");
		now = now + 5;
	}, 50);
}

module.exports = new UI();