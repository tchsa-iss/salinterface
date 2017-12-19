/*
* @Author: iss_roachd
* @Date:   2017-12-01 12:41:51
* @Last Modified by:   iss_roachd
* @Last Modified time: 2017-12-01 12:48:25
*/

var AdminInterface = require('../AdminPanel/interface.js');

var exists = (typeof window["AdminInterface"] !== "undefined");
if (!exists) {
	window.AdminInterface = AdminInterface;
}

