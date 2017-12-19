/*
* @Author: iss_roachd
* @Date:   2017-12-01 12:42:08
* @Last Modified by:   iss_roachd
* @Last Modified time: 2017-12-02 19:31:34
*/

var UserInterface = require('../User/interface.js');

var exists = (typeof window["UserInterface"] !== "undefined");
if (!exists) {
	window.UserInterface = UserInterface;
}