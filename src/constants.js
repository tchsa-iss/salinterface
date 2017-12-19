/*
* @Author: iss_roachd
* @Date:   2017-12-02 09:49:07
* @Last Modified by:   iss_roachd
* @Last Modified time: 2017-12-12 10:38:47
*/


var CONSTANTS = {

};
CONSTANTS.VERSION = '1.0.0';

// look at this fixed defaults override in previous version;
CONSTANTS.DEFAULTS = {
	name: 'eSalWebAppJS',
};

CONSTANTS.NOTIFICATION_EVENTS = {
	userMessage: "UserMessage"
};

CONSTANTS.ERRORS = {
	NETWORK: {
		NO_RESPONSE: {
			name: "NO_RESPONSE",
			code: 404,
			desc: "no data returned from request"
		},
		NO_URL: {
			name: "URL_MISSING",
			code: 405,
			desc: "no url given to network request"
		},
		NO_CALLBACK: {
			name: "NO_CALLBACK",
			code: 406,
			desc: "no callback passed to network request"
		}
	}
};
module.exports = CONSTANTS;
