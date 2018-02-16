/*
* @Author: iss_roachd
* @Date:   2017-12-01 11:30:20
* @Last Modified by:   Daniel Roach
* @Last Modified time: 2018-02-16 12:34:57
*/

var Constants = require('../constants.js');
var InterfaceError = require('../Error/Error.js');
var Notification = require('../Notification/Notification.js');
var UI = require('../UI/UI.js');
var Utils = require('../Utils/Utils.js');
var Modal = require('./Modal/user.modal.js');
var Networking = require('../Network/NetworkRequest.js');

function UserInterface(user) {
	this.user = user;
	this.dispatch = new Notification();
	this.userError = Constants.ERROR.USER;
	this.currentSelectedMenu = null;
	this.salHead = null;
	this.currentSal = null;
}

UserInterface.prototype.subscribe = function(eventName, callback, context) {
	this.dispatch.subscribe(eventName, callback, context);
};

UserInterface.prototype.unsubscribe = function(eventName, callback) {

};

UserInterface.prototype.add = function(tableName, config, ready) {
	var isModal = Utils.isModal(config);
	if (isModal) {
		var modal = new Modal(tableName, config, this[config.handler].bind(this));
		modal[config.prep](function(error) {
			ready(error, Constants.ERROR.TYPE.critical);
		});
	}
}

UserInterface.prototype.modify = function(tableName, config, ready) {
	var error = this.__checkModalConfigRequirements(config, tableName);
	var isModal = Utils.isModal(config);
	if (error) {
		ready(error, Constants.ERROR.TYPE.critical);
		return;
	}
	if (isModal) {
		var modal = new Modal(tableName, config, this[config.handler].bind(this));
		modal[config.prep](function(error) {
			ready(error, Constants.ERROR.TYPE.critical);
		});
	}
}

UserInterface.prototype.delete = function(tableName, config, ready) {
	var error = this.__checkModalConfigRequirements(config, tableName);
	var isModal = Utils.isModal(config);
	if (error) {
		ready(error, Constants.ERROR.TYPE.critical);
		return;
	}
	if (isModal) {
		var modal = new Modal(tableName, config, this[config.handler].bind(this));
		modal[config.prep](function(error) {
			ready(error, Constants.ERROR.TYPE.critical);
		});
	}
}

UserInterface.prototype.submit = function(tableName, config, ready) {
	var error = this.__checkModalConfigRequirements(config, tableName);
	var isModal = Utils.isModal(config);
	if (error) {
		ready(error, Constants.ERROR.TYPE.critical);
		return;
	}
	if (isModal) {
		var modal = new Modal(tableName, config, this[config.handler].bind(this));
		modal[config.prep](function(error) {
			ready(error, Constants.ERROR.TYPE.critical);
		});
	}
	else {
		this[config.handler](tableName, config, ready);
	}
}

UserInterface.prototype.updateUserSalStatus = function(tableName, data, callback) {
	var userSalId = this.currentSal.ID;
	var progressView = $(data.progressView);
	var postCloseUserSal = new Networking();
	var post = 'user//close/sal/' + userSalId;
	postCloseUserSal.request(post, function(error, response) {
		progressView.hide('fade', 200, function() {
			var progressBar = $(this);
			progressBar.find('.progress-bar').css("width", "0%");
		});
		if (error) {
			callback(true, Constants.ERROR.TYPE.critical, error);
			return;
		}
		callback(false, Constants.STATUS.TYPE.success, response.message);

	});
	progressView.show('blind', 200);
	UI.runProgress(progressView, function() {
		postCloseUserSal.execute('POST');
	});
}

UserInterface.prototype.salSubmitHandler = function(modal) {
	//check if user agreed to terms and conditions then submit for approval
	
	var accepted = modal.modalElement.find('#user-agreement-checkbox').prop('checked');
	if (!accepted) {
		UI.flashMessage(Constants.ERROR.TYPE.critical, "You Must Accept The Terms And Conditions Before A SAL Can Be Submitted", modal.modalElement, 3000);
		return;
	}
	var sal = this.currentSal;
	sal.EntryStatusID = modal.formStatusChange;
	var json = JSON.stringify(sal)
	var submitSal = new Networking();
	submitSal.request('user/submit/sal', function(error, response) {
		if(error) {
			UI.flashMessage(Constants.ERROR.TYPE.critical, error, modal.modalElement, 1000);
			return;
		}
		modal.dismiss();
		UI.closeSalView(modal.closeView, function() {
				UI.flashMessage(Constants.STATUS.TYPE.success, this.message, this.view, 2500);
		}.bind({view: this.salHead, message: response.message}));

	}.bind(this), json);
	submitSal.execute('POST');
}

UserInterface.prototype.salDeleteHandler = function(modal) {
	//newtork call to delete entry
	//delete table entry
	
	var entry = modal.selectedRow.data();
	var json = JSON.stringify(entry);
	var postDelete = new Networking();
	postDelete.request('user/delete/sal/entry', function(error, response){
		if(error) {
			UI.flashMessage(Constants.ERROR.TYPE.critical, error, modal.modalElement, 1000);
			return;
		}
		var table = modal.getTable().DataTable();
		var row = table.row( { selected: true } );
		table.row(row).remove().draw();
		modal.removeAllClickHandlers();
		modal.dismiss();
	},json);
	postDelete.execute('POST');
}

UserInterface.prototype.salEditEntrySubmitHandler = function(modal) {
	var salData = this.__getSalDataElements(modal);
	var table = modal.getTable().DataTable();

	var postData = {
		formId: 1,
		entryStatusCode: salData.status.data,
		reportingUnit: salData.reportingUnit.data,
		sub: salData.sub && salData.sub.data || 0,
		location: salData.locationCode.data,
		accountCode: salData.accountCode.data,
		project: salData.project && salData.project.data || 0,
		group: salData.group && salData.group.data || 0,
		timeSpent: salData.timeSpent,
		prepTime: salData.timePrep,
		timeOfDay: "",
		clientName: "",
		description: salData.description,
		sal: this.currentSal,
		entry: modal.selectedRow.data()
	}

	var json = JSON.stringify(postData);
	var editEntry = new Networking();
	editEntry.request('user/edit/sal/entry', function(error, response) {
		console.log(response);
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.critical, error, modal.modalElement, 2000);
			return;
		}
		var entry = response;
		var table = modal.getTable().DataTable();
		var row = table.row( { selected: true } );
		console.log(row);
		row.data(entry).draw();
		modal.removeAllClickHandlers();
		modal.dismiss();
	}.bind(this), json);
	editEntry.execute('POST');
}

UserInterface.prototype.salAddEntrySubmitHandler = function(modal) {
	var salData = this.__getSalDataElements(modal);
	var table = modal.getTable().DataTable();

	var postData = {
		formId: 1,
		entryStatusCode: salData.status.data,
		reportingUnit: salData.reportingUnit.data,
		sub: salData.sub && salData.sub.data || 0,
		location: salData.locationCode.data,
		accountCode: salData.accountCode.data,
		project: salData.project && salData.project.data || 0,
		group: salData.group && salData.group.data || 0,
		timeSpent: salData.timeSpent,
		prepTime: salData.timePrep,
		timeOfDay: "",
		clientName: "",
		description: salData.description,
		sal: this.currentSal
	}
	var json = JSON.stringify(postData);
	var createEntry = new Networking();
	createEntry.request('user/create/sal/entry', function(error, response) {
		console.log(response);
		if (error) {
			modal.modalElement.animate({ scrollTop: 0 }, 'fast');
			UI.flashMessage(Constants.ERROR.TYPE.critical, "A Required Field Was Not Filled Out", modal.modalElement, 4000);
			return;
		}
		var entry = response;
		var table = modal.getTable().DataTable();
		table.row.add(entry).draw();
		modal.removeAllClickHandlers();
		modal.dismiss();
	}.bind(this), json);
	createEntry.execute('POST');
}

UserInterface.prototype.salReOpenHandler = function(modal) {
	var sal = this.currentSal;
	sal.EntryStatusID = modal.formStatusChange;
	var now = 0;
	console.log(sal);
	var json = JSON.stringify(sal);
	var message = modal.modalElement.find('#re-open-message');
	var progressContainer = modal.modalElement.find('#re-open-progress');
	var progress = progressContainer.find('.progress-bar');
	message.hide();
	progressContainer.show('blind', 200);

	var reOpenSal = new Networking();
	reOpenSal.request('user/reopen/sal/entry', function(error, response) {
		now = 100;
		progress.css("width", now + "%");
		if(error) {
			UI.flashMessage(Constants.ERROR.TYPE.critical, error, modal.modalElement, 1000);
			return;
		}
		modal.dismiss();

		UI.closeSalView(modal.closeView, function() {
				UI.flashMessage(Constants.STATUS.TYPE.success, this.message, this.view, 2500);
		}.bind({view: this.salHead, message: response.message}));

	}.bind(this), json);

	var progressContext = setInterval(function() {
		if (now >= 60) {
			clearInterval(progressContext);
			reOpenSal.execute('POST');
		}
		progress.css("width", now + "%");
		now = now + 5;
	}, 50);

}

UserInterface.prototype.__checkModalConfigRequirements = function(config, tableName) {
	if (Utils.requiresRowSelect(config)) {
		if (!UI.tableRowIsSelected(tableName)) {
			return "Please Select At Least One Row";
		}
	}
	return null;
}

UserInterface.prototype.toggleSalMenu =  function(data, typeOfAnimation, duration, fuctionRef, args) {
	$(data.closeView).hide();
	if (this.currentSelectedMenu) {
		$(this.currentSelectedMenu).toggle(typeOfAnimation, duration || 300, function() {
			var that = this;
			$(data.target).toggle(typeOfAnimation, duration || 300, function() {
				if (fuctionRef) {
					that[fuctionRef](args);
				}
			});
		}.bind(this));
	}
	else {
		$(data.target).toggle(typeOfAnimation, duration || 300, function() {
			if (fuctionRef) {
				this[fuctionRef](args);
			}
		}.bind(this));
	}
	this.currentSelectedMenu = data.target;
}

UserInterface.prototype.setupCalenderRange = function(config) {
	config.elements.forEach(function(inputElement) {
		 $(inputElement).datepicker({showButtonPanel: true});
	});
	
	var submitElement = $(config.rangeDiv).find(':submit');
	submitElement.on( "click", function() {
		var fromDate = $(config.elements[0]).datepicker({ dateFormat: 'yy-mm-dd' }).val();
		var toDate = $(config.elements[1]).datepicker({ dateFormat: 'yy-mm-dd' }).val();
		this.getSalsForDateRange(fromDate, toDate, config);
		event.preventDefault(); // avoid to execute the actual submit of the form.
	}.bind(this, config));
}

UserInterface.prototype.updateSalEntryTable = function(entries) {

} 

UserInterface.prototype.updateSalHead = function() {
	this.salHead = $(this.currentSelectedMenu).find('.page-header').next();
}

UserInterface.prototype.updateSalPanel = function(sals, panel, tableName) {
	panel.empty();
	if (sals.length === 0) {
		var div = $("<p class='text-center'>No Sals Found For This Date Or Range</p>");
		panel.append(div);
		return;
	}
	for (var i = 0; i < sals.length; i++) {
		var sal = sals[i];
		sal.tableName = tableName;
		var date = Utils.convertDateToReadableFormat(sal.Date);
		var div = $("<button class='btn btn-default'>"+ date + "</button>");
		div.data( "sal", sal );
		if (sal.EntryStatusID === 3) {
			div.on("click", this.getApprovedSalEntries.bind(this, div));
		}
		else {
			div.on("click", this.getSalEntries.bind(this, div));
		}
		panel.append(div);
	}
}

UserInterface.prototype.loadSalsByStatus = function(data) {
	this.updateSalHead();
	//var spinner = $(data.view).find('.loading-spinner-now').show();
	var tableName = data.tableName;
	var status = data.status;
	var panel = $(data.panel);
	var get = 'user/sals/by/status/' + this.user.UserID + "/" + status;
	//var get = 'user/sals/by/status/' + "50" + "/" + status;
	var getUserSals = new Networking()
	getUserSals.request(get, function(error, response) {
		//spinner.hide('blind', 300);
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, this.salHead);
		}
		var sals = response;
		this.updateSalPanel(sals, panel, tableName);
	}.bind(this));
	getUserSals.execute();
}

UserInterface.prototype.getApprovedSalEntries = function(entry) {
	var sal = $(entry).data().sal;
	//var spinner = this.salHead.find('.sal-loading').show('blind', 100);
	var getEntries = new Networking();

	getEntries.request('/user/sal/entries/' + sal.ID, function(error, entries) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, this.salHead, 1000);
			var table = $(sal.tableName).DataTable();
			$(sal.tableName + "-container").show('blind', 300); // this is bad! need to change this
			return;
		}
		if ($.fn.DataTable.isDataTable(sal.tableName)) {
			Utils.destroyOldTable(sal.tableName);
		}
		var table = $(sal.tableName).DataTable( {
			data: entries,
			"scrollX": true,
			scrollY: true,
			select: true,
			buttons: [
        		'copy',
        		{
        			extend: 'excel',
        			text: "Export SAL Entries",
        			action: this.downloadSalEntryExcelForm.bind(this),
        			filename: function() {
        				return this.currentSal.Date;
        			}.bind(this),
        			title: null,
        			header: false
        		},
        		'pdf'
    		],
		    columns: [
		        { data: 'SalEntryID' },
		        { data: 'FormName' },
		        { data: 'EntryStatusCode'},
		        { 
		        	data: 'Reporting Unit',
		        	render: function ( data, type, row ) {
       					 return row.ReportingUnitCode +' '+ row.ReportingUnitAbbrev;
    				}
		    	},
		        { data: 'SubReportingUnitID' },
		        { data: 'Location' },
		        { 
		        	data: 'ActivityCode',
		        	render: function(data, type, row) {
		        		return row.ActivityCode + ' ' + row.ActivityName;
		        	}
		    	},
				{ data: 'ProjectNumberID' },
				{ data: 'GroupNumber' },
				{ data: 'TimeSpent' },
				{ data: 'PrepTime' },
				{ data: 'Description' },
				{ data: 'CreateDate'}
		    ]
		});
		//table.sal = sal;
		//this.salEntryTable = table;
		this.currentSal = sal;
		table.buttons().container().appendTo($('.col-sm-6:eq(0)', table.table().container()));
		// var exportButton = $(table.buttons()[1].node);
		// var url = "user/export/sal/entries/" + sal.ID;
		// var anchor = $('<a href=""></a>');
  //      	anchor.attr("href", url);
		// $(exportButton).wrap(anchor);
		var tbody = table.table().body();
		$(tbody).on('click', 'tr',{table:table}, UI.selectSingleTableRow);
		$(sal.tableName + "-container").show('blind', 300); // this is bad! need to change this
	}.bind(this), sal);
	getEntries.execute();
}

UserInterface.prototype.getSalEntries = function(entry) {
	var sal = $(entry).data().sal;
	var get = '/user/sal/entries/' + sal.ID;
	//var spinner = this.salHead.find('.sal-loading').show('blind', 100);
	var getEntries = new Networking();
	if (sal.EntryStatusID === 5) {
		//send response to custom handler
		this.currentSal = sal;
		getEntries.request(get, this.handleErrorSalEntries.bind(this));
		getEntries.execute();
		return;
	}
	getEntries.request(get, function(error, entries) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, this.salHead, 1000);
			var table = $(sal.tableName).DataTable();
			$(sal.tableName + "-container").show('blind', 300); // this is bad! need to change this
			return;
		}
		if ($.fn.DataTable.isDataTable(sal.tableName)) {
		  	Utils.destroyOldTable(sal.tableName);
		}
		var table = $(sal.tableName).DataTable( {
			data: entries,
			"scrollX": true,
			scrollY: true,
			select: true,
			buttons: [
        		'copy',
        		{
        			extend: 'excel',
        			filename: function() {
        				return this.currentSal.Date;
        			}.bind(this),
        		},
        		'pdf'
    		],
		    columns: [
		        { data: 'SalEntryID' },
		        { data: 'FormName' },
		        { data: 'EntryStatusCode'},
		        { 
		        	data: 'Reporting Unit',
		        	render: function ( data, type, row ) {
       					 return row.ReportingUnitCode +' '+ row.ReportingUnitAbbrev;
    				}
		    	},
		        { data: 'SubReportingUnitID' },
		        { data: 'Location' },
		        { 
		        	data: 'ActivityCode',
		        	render: function(data, type, row) {
		        		return row.ActivityCode + ' ' + row.ActivityName;
		        	}
		    	},
				{ data: 'ProjectNumberID' },
				{ data: 'GroupNumber' },
				{ data: 'TimeSpent' },
				{ data: 'PrepTime' },
				{ data: 'Description' },
				{ data: 'CreateDate'}
		    ]
		});

		this.currentSal = sal;
		this.getUserSalTime(sal, entries);
		table.buttons().container().appendTo($('.col-sm-6:eq(0)', table.table().container()));
		var tbody = table.table().body();
		$(tbody).on('click', 'tr',{table:table}, UI.selectSingleTableRow);
		$(sal.tableName + "-container").show('blind', 300); // this is bad! need to change this
	}.bind(this), sal);
	getEntries.execute();
}

UserInterface.prototype.getUserSalTime = function(sal, entries) {
	var timePanel = UI.checkForTimePanel(sal.tableName + "-container");
	if (!timePanel) {
		return;
	}
	var data = {date: sal.Date};
	var getTimeIpsTime = new Networking();
	getTimeIpsTime.request('user/sal/timeips/time', function(error, response) {
		if (error) {
			// tell user timeips time could be retrieved
			
		}
		var timeIpsTime = response;
		var normalTime = timeIpsTime[0];
		var benifitTime = timeIpsTime[1];
		var holidayTime = timeIpsTime[2];
		var timeStart = normalTime.totalTimeIn;
		var endTime = normalTime.totalTimeOut + benifitTime.totalBenifitTime + holidayTime.totalHolidayTimeTime;
		var timeWorked = endTime - timeStart;
		var time = Utils.secondsToHMS(timeWorked);
		var minutes = Math.round(timeWorked / 60);
		UI.updateUserTimeComparePanel(entries, timePanel, {hours: time, minutes: minutes});
	}, data);
	getTimeIpsTime.execute();
}

UserInterface.prototype.handleErrorSalEntries = function(error, entries) {
	var sal = this.currentSal;
	if (error) {
		UI.flashMessage(Constants.ERROR.TYPE.major, error, this.salHead, 1000);
		var table = $(sal.tableName).DataTable();
		$(sal.tableName + "-container").show('blind', 300); // this is bad! need to change this
		return;
	}
	if ($.fn.DataTable.isDataTable(sal.tableName)) {
	  Utils.destroyOldTable(sal.tableName);
	}
	var table = $(sal.tableName).DataTable( {
		data: entries,
		"scrollX": true,
		scrollY: true,
		select: true,
		buttons: [
    		'copy',
    		{
    			extend: 'excel',
    			filename: function() {
    				return this.currentSal.Date;
    			}.bind(this),
    		},
    		'pdf'
		],
	    columns: [
	        { data: 'SalEntryID' },
	        { data: 'FormName' },
	        { data: 'EntryStatusCode'},
	        { 
	        	data: 'Reporting Unit',
	        	render: function ( data, type, row ) {
   					 return row.ReportingUnitCode +' '+ row.ReportingUnitAbbrev;
				}
	    	},
	        { data: 'SubReportingUnitID' },
	        { data: 'Location' },
	        { 
	        	data: 'ActivityCode',
	        	render: function(data, type, row) {
	        		return row.ActivityCode + ' ' + row.ActivityName;
	        	}
	    	},
			{ data: 'ProjectNumberID' },
			{ data: 'GroupNumber' },
			{ data: 'TimeSpent' },
			{ data: 'PrepTime' },
			{ data: 'Description' },
			{ data: 'CreateDate'}
	    ]
	});
	this.updateUserSalErrorPanel(null, entries);
	this.currentSal = sal;
	table.buttons().container().appendTo($('.col-sm-6:eq(0)', table.table().container()));
	var tbody = table.table().body();
	$(tbody).on('click', 'tr',{table:table}, UI.selectSingleTableRow);
	$(sal.tableName + "-container").show('blind', 300); // this is bad! need to change this
}

UserInterface.prototype.updateUserSalErrorPanel = function(view, entries) {
	var correctionView = $('#sal-entry-corrections').find('#correction-sal-error-message');
	var entryView = correctionView.find('.list-group');
	entryView.empty();
	for(var i = 0; i < entries.length; i++) {
		var entry = entries[i];
		if (entry.Error === 1) {
			var errorEntry = $("<li class='list-group-item'>Entry ID: " + entry.SalEntryID + " Message: " + entry.ErrorMessage + "</li>");
			entryView.append(errorEntry);
		}
	}
}

UserInterface.prototype.downloadSalEntryExcelForm = function(entries) {
//this.downloadSalEntryExcelForm.bind(this, entries);

	//this is not the best solution, creates interuption of resources
	window.open('user/export/sal/entries/' + this.currentSal.ID,"_self");


	// win =  window.open('about:blank',"MHSA FORM",'fullscreen=no','width=612px','height=738px');
	// var getExcelForm = new Networking();
	// var get = 'user/export/sal/entries/' + this.currentSal.ID;
	// var head = this.salHead;
	// getExcelForm.request(get, function(error, response) {
	// 	if (error) {
	// 		UI.flashMessage(Constants.ERROR.TYPE.major, error, head);
	// 	}
	// });
	// //getExcelForm.execute('GET');
	// window.open(get);
}

UserInterface.prototype.getUserSalErrors = function(data) {
	this.updateSalHead();
	var tableName = data.tableName;
	var view = data.view // fix this later
	var status = data.status;
	var panel = $(data.panel);
	var get = 'user/sals/by/status/' + this.user.UserID + "/" + status;
	var progress = $('#sal-corrections-loading');

	var getSalCorrections = new Networking();
	getSalCorrections.request(get, function(error, response) {
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, this.salHead);
		}
		var sals = response;
		//sal.view = view;
		this.updateSalPanel(sals, panel, tableName);
		progress.hide('blind', 300);
	}.bind(this));
	getSalCorrections.execute();
}

UserInterface.prototype.getSalsForDateRange = function(from, to, setings) {
	var data = {
		fromDate: from,
		toDate: to,
		status: setings.salStatus
	};
	var getSals = new Networking()
	getSals.request("/user/sals", function(error, sals) {
		console.log(sals);
		if (error) {
			UI.flashMessage(Constants.ERROR.TYPE.major, error, this.salHead);
		}
		if (setings.usePanel) {
			this.updateSalPanel(sals, $(setings.panelEntry), setings.tableName);
			$(setings.panelDiv).show('blind', 100);
		}
		else {
			if ($(setings.panelDiv).is(":visible")) {
				$(setings.panelDiv).hide('blind', 100);
			}
			if (sals.length === 0) {
				UI.flashMessage(Constants.ERROR.TYPE.major, "No Sals Found For This Date", this.salHead, 2000);
				return;
			}
			this.getSalEntries(sals, function(error, entries) {
				if (error) {
					UI.flashMessage(Constants.ERROR.TYPE.major, error, this.salHead, 2000);
					return;
				}
				this.updateSalEntryTable(entries, setings.tableName);
			}.bind(this));
			//this.getSalEntries(sals, this.updateSalEntryTable.bind(this, config.tableName));
		}
	}.bind(this), data);
	getSals.execute();
}

UserInterface.prototype.__getSalDataElements = function(modal) {
	var statusEl = modal.modalElement.find('select[name="status"]');
	var reportingEl = modal.modalElement.find('select[name="reporting-unit"]');
	var subRuEl = modal.modalElement.find('select[name="sub-reporting-unit"]');
	var locationEl = modal.modalElement.find('select[name="location"]');
	var accountCodeEl = modal.modalElement.find('select[name="account-code"]');
	var projectEl = modal.modalElement.find('select[name="project"]');
	var groupEl = modal.modalElement.find('select[name="group"]');
	var timeSpent = modal.modalElement.find('input[name="time-spent"]').val();
	var timePrep = modal.modalElement.find('input[name="prep-time"]').val();
	var timeOfDay = modal.modalElement.find('input[name="time-of-day"]').val();
	var description = modal.modalElement.find('textarea[name="description"]').val();

	var status = modal.getBootstrapSelectWith(statusEl);
	var reportingUnit = modal.getBootstrapSelectWith(reportingEl);
	var sub =  modal.getBootstrapSelectWith(subRuEl);
	var locationCode =  modal.getBootstrapSelectWith(locationEl);
	var accountCode = modal.getBootstrapSelectWith(accountCodeEl);
	var project = modal.getBootstrapSelectWith(projectEl);
	var group = modal.getBootstrapSelectWith(groupEl);
	return {
		status: status,
		reportingUnit: reportingUnit,
		sub: sub,
		locationCode: locationCode,
		accountCode: accountCode,
		project: project,
		group: group,
		timeSpent: timeSpent,
		timePrep: timePrep,
		timeOfDay: timeOfDay,
		description: description
	}
}

module.exports = UserInterface;