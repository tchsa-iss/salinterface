/*
* @Author: iss_roachd
* @Date:   2017-12-01 12:42:22
* @Last Modified by:   iss_roachd
* @Last Modified time: 2017-12-19 10:34:49
*/
var SuperviserInterface = require('../Superviser/interface.js');

var exists = (typeof window["SuperviserInterface"] !== "undefined");
if (!exists) {
	window.SuperviserInterface = SuperviserInterface;
}

