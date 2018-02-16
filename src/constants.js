/*
* @Author: iss_roachd
* @Date:   2017-12-02 09:49:07
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-02-06 13:32:34
*/


var CONSTANTS = {

};
CONSTANTS.VERSION = '0.0.9';

// look at this fixed defaults override in previous version;
CONSTANTS.DEFAULTS = {
	name: 'eSalWebAppJS',
};

CONSTANTS.MODAL = {
	addSupervisor: 1,
	assignSupervisor: 2,
	removeEmployeeSupervisor: 3
};

CONSTANTS.OPTION = {
	QUERY: {
		today: 0,
		week: 1,
		month: 2,
		range: 3
	}
};

CONSTANTS.EVENT = {
	userMessage: "UserMessage",
	submit: {
		open: "SalOpenSubmit",
		pending: "SalPendingSubmit",
		approved: "SalApprovedSubmit",
		closed: "SalClosed",
		corrections: "SalCorrectionSubmit"
	}
};

CONSTANTS.SERVICES = {
	all: 1,
	fiscal: 2,
	clinic: 3,
	behviorHealth: 4,
	substanceAbuse: 5
},
CONSTANTS.LOGTYPES = {
	AVAILABLE: [
		'app-logs',
		'sal-api-logs',
		'timeips-api-logs'
	]
},

CONSTANTS.STATUS = {
	TYPE: {
		successPrimary : 'alert-primary',
		successSecodary: 'alert-secondary',
		successInfo: 'alert-info',
		success: 'alert-success'
	}
}

CONSTANTS.ERROR = {
	TYPE: {
		critical: 'alert-danger',
		major: 'alert-warning',
		info: 'alert-info'
	},
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
		},
		RESPONSE_ERROR: {
			name: "ERROR SERVER SIDE",
			code: 407,
			desc: "there was a error in server side php"
		}
	}
};
module.exports = CONSTANTS;
