/*
* @Author: iss_roachd
* @Date:   2017-12-19 10:34:42
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-01-02 09:33:36
*/

var Constants = require('../constants.js');

function UI() {
	//this.jqueryApi =  window.$;

};

// defualt postion is top
UI.prototype.flashMessage = function(errorType, errorMsg, elementID, duration) {
	var type = Constants.ERROR.TYPE;
	var duration = duration || 300;
	var flashMessage = null;
	if (errorType === type.critical) {
		flashMessage = $('<div class="alert alert-danger" role="alert" style="display:none">'+ errorMsg +'</div>');
	}
	else if (errorType === type.major) {
		flashMessage = $('<div class="alert alert-warning" role="alert" style="display:none">'+ errorMsg +'</div>');
	}
	else if (errorType === type.minor) {

	}
	else if (errorType === type.warning) {

	}
	else if (errorType === type.info) {

	}
	else {

	}

	$(elementID).prepend(flashMessage);
	flashMessage.show('blind');
	setTimeout(function() {
		flashMessage.hide('blind', duration, function() {
			$(flashMessage).remove();
		});

	}.bind(flashMessage), 2000);
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

module.exports = new UI();