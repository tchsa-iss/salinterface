/*
* @Author: iss_roachd
* @Date:   2017-12-19 10:34:42
* @Last Modified by:   iss_roachd
* @Last Modified time: 2017-12-19 11:23:22
*/

function UI() {
	this.jqueryApi =  $;

};

// defualt postion is top
UI.prototype.flashMessage = function(possition, type, contentElement, parentElement) {
	if (type) {
		this.jqueryApi(contentElement).addClass(type);
	}
	if (possition) {

	}
	this.jqueryApi(parentElement).append(contentElement);
}

UI.prototype.showSpinnerOverlay = function(element) {
	this.jqueryApi(element).addClass("loading").show();
}
UI.prototype.hideSpinnerOverlay = function(element) {
	this.jqueryApi(element).removeClass("loading").hide();
}

UI.prototype.createWellWithContent = function(contentElement, size) {
	if (size === 1) {
		return this.jqueryApi('<div class="well well-lg"></div>').append(contentElement);
	}
	if( size === 2) {
		return this.jqueryApi('<div class="well well-lg"></div>').append(contentElement);
	}
	return null;
}

UI.prototype.createHeadingWithSubHeader = function(content, subContent, size) {
	var header = "<h" + size + ">" + content + "<small>" + subContent + "</small></h" + size +"/>"
	var headerElement = this.jqueryApi(header);
	if (!headerElement) {
		return null;
	}
	return headerElement;
}

module.exports = new UI();