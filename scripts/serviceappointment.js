if (typeof (CClearPartners) == "undefined")
{
	CClearPartners = {};
}
CClearPartners.serviceappointment = {
	//*********************************Variables*****************************
	originalstatus: -1,
	currentresource: null,
	currentstart : null,
	currentend : null,
	//*******************************Event Handlers**************************
	Form_Onload: function (context)
	{
		CClearPartners.General.Form.SetFormContext(context);
		this.AttachEvents();
		this.LoadForm();
		this.HideAkkoordVerklaringToevoegen();
	},
	AttachEvents: function ()
	{
		CClearPartners.General.Form.AddOnChange("statuscode", CClearPartners.serviceappointment.OnChange.StatusCodeChanged);
		CClearPartners.General.Form.AddOnChange("actualstart", CClearPartners.serviceappointment.OnChange.ActualStart);
		CClearPartners.General.Form.AddOnChange("actualend", CClearPartners.serviceappointment.OnChange.ActualEnd);
		CClearPartners.General.Form.AddOnChange("scheduledstart", CClearPartners.serviceappointment.OnChange.ScheduledStart);
		CClearPartners.General.Form.AddOnChange("scheduledend", CClearPartners.serviceappointment.OnChange.ScheduledEnd);
		CClearPartners.General.Form.AddOnChange("serviceid", CClearPartners.serviceappointment.OnChange.ServiceId);
		// resources onchange event is not working when using the "scheduling" button -> using polling mechanism
		CClearPartners.General.Form.AddOnChange("resources", CClearPartners.serviceappointment.OnChange.Resources);
        	CClearPartners.General.Form.AddOnChange("dig_kantoorbafa", CClearPartners.serviceappointment.OnChange.dig_kantoorbafa);
		CClearPartners.serviceappointment.PollForResourceChange(true);
	},
	//*********************************Functions*****************************
	LoadForm: function ()
	{
		var formContext = CClearPartners.General.Form.GetFormContext();
		if (formContext.ui.getFormType() == 1)
		{
			CClearPartners.serviceappointment.SetDefaultsForCase();
			formContext.getAttribute("scheduledstart").fireOnChange();
			formContext.getAttribute("scheduledend").fireOnChange();
        }
        originalstatus = CClearPartners.General.Form.GetValue("statuscode");
	},
	HideAkkoordVerklaringToevoegen: function ()
	{
		var regarding = CClearPartners.General.Form.GetValue("regardingobjectid");
		if (regarding === null) return;
		var incidentid = regarding[0].id.replace(/[{}]/g, '').toLowerCase();
		Xrm.WebApi.online.retrieveRecord("incident", incidentid, "?$select=casetypecode").then(

		function success(result)
		{
			var casetypecode = result["casetypecode"];
			// casetypecode renovatiebegeleiding
			if (casetypecode == 41)
			{
				CClearPartners.General.Form.SetRequired("dig_akkoordverklaringrenovatiebegeleidingtoev", true);
				CClearPartners.General.Form.SetFieldVisible("dig_akkoordverklaringrenovatiebegeleidingtoev", true);
			}
			else
			{
				CClearPartners.General.Form.SetRequired("dig_akkoordverklaringrenovatiebegeleidingtoev", false);
				CClearPartners.General.Form.SetFieldVisible("dig_akkoordverklaringrenovatiebegeleidingtoev", false);
			}
		},

		function (error)
		{
			Xrm.Utility.alertDialog(error.message);
		});
	},
    GentKnaptOpException: function()
        {
            //get case
            var regardingobjectid = CClearPartners.General.Form.GetFormContext().getAttribute("regardingobjectid").getValue()[0].id;
            // get casetype
            if(regardingobjectid != null){
                new Promise(function(resolve, reject) {
                    Xrm.WebApi.retrieveRecord("incident", regardingobjectid.replace('{', '').replace('}', '').toLowerCase(), "?$select=casetypecode").then(
                        function success(result) {
                            console.log(result);
                            // Columns
                            var casetypecode = result["casetypecode"]; // Choice
                            resolve(casetypecode);
                        },
                        function(error) {
                            console.log(error.message);
                            reject(error.message);
                        }
                    );
                }).then( result => {
					var businessunitid = null;
					var name = null;
                    if((result != null) && (result == 32 || result == 41)){
                        businessunitid = "fce0461b-b92b-e511-80ce-0050569270d7"; //MAW
                        name = "MAW";

                    }else{
                        businessunitid = "d2b39358-4b5f-e911-80e3-005056935251"; //GKO
                        name = "Gent Knapt Op";
                    }
					CClearPartners.Form.SetLookupValue("dig_behandelendedienstid", businessunitid, name, "businessunit");
                });
            }
    },
	SetDefaultsForCase: function ()
	{
		var formContext = CClearPartners.General.Form.GetFormContext();
		var param = formContext.data.attributes;
		var caseId = param.get("parameter_originatingcaseid").getValue();
		var appDate = param["parameter_AppointmentDate"];
		if (caseId != null)
		{
			var req = new XMLHttpRequest();
			req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/incidents(" + caseId.replace(/[{}]/g, '').toLowerCase() + ")?$select=casetypecode,_customerid_value,title,dig_typeafspraak", false);
			req.setRequestHeader("OData-MaxVersion", "4.0");
			req.setRequestHeader("OData-Version", "4.0");
			req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
			req.setRequestHeader("Accept", "application/json");
			req.setRequestHeader("Prefer", "odata.include-annotations=*");
			req.onreadystatechange = function () {
				if (this.readyState === 4) {
					req.onreadystatechange = null;
					if (this.status === 200) {
						var result = JSON.parse(this.response);
						console.log(result);
						// Columns
						var casetypecode = result["casetypecode"]; // Choice
						var casetypecode_formatted = result["casetypecode@OData.Community.Display.V1.FormattedValue"];
						var customerid = result["_customerid_value"]; // Customer
						var customerid_formatted = result["_customerid_value@OData.Community.Display.V1.FormattedValue"];
						var customerid_lookuplogicalname = result["_customerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
						var title = result["title"]; // Text
						var dig_typeafspraak = result["dig_typeafspraak"]; // Choice

						title = title != null ? title : "";
						
						//var duration = 30;
						if (casetypecode != null) {
							if (dig_typeafspraak != null && dig_typeafspraak.value == 2) {
								casetypecode_formatted = "Digitaal advies";
							}
							Xrm.WebApi.online.retrieveMultipleRecords("service", "?$select=serviceid,duration,name&$filter=startswith(name, '" + casetypecode_formatted + "')").then(
								function success(results2) {
									console.log(results2);
									for (var i = 0; i < results2.entities.length; i++) {
										var result = results2.entities[i];
										// Columns
										var serviceid = result["serviceid"]; // Guid
										var duration = result["duration"]; // Whole Number
										var name = result["name"]; // Text

										//duration = service.Duration;
										CClearPartners.General.Form.SetLookupValue("serviceid", serviceid, name, "service", true);
										CClearPartners.General.Form.SetDisabled("serviceid", true);
										// Always set a default scheduled time
										var today = new Date();
										var tomorrowstart = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 8, 0, 0);
										var tomorrowend = new Date(tomorrowstart.getTime() + duration * 60000);
										CClearPartners.General.Form.SetValue("scheduledstart", tomorrowstart);
										CClearPartners.General.Form.SetValue("scheduledend", tomorrowend);
										CClearPartners.General.Form.SetValue("scheduleddurationminutes", duration);
										// Refresh buttons
										setTimeout(function () {
											formContext.ui.refreshRibbon();
										}, 1000);
									}
								},
								function (error) {
									console.log(error.message);
								}
							);
						}
						CClearPartners.General.Form.SetLookupValue("regardingobjectid", caseId, title, "incident", false);
						CClearPartners.General.Form.SetDisabled("regardingobjectid", true);
						if (customerid != null) {
							CClearPartners.General.Form.SetLookupValue("customers", customerid.replace(/[{}]/g, '').toLowerCase(), customerid_formatted, customerid_lookuplogicalname, false);
							CClearPartners.General.Form.SetDisabled("customers", true);
						}
						
					} else {
						console.log(this.responseText);
					}
				}
			};
			req.send();
			//Dependabot will resolve any conflicts with this PR as long as you don't alter it yourself. You can also trigger a rebase manually by commenting @dependabot rebase.




		}
		if (appDate != null)
		{
			var scheduledStartObj = formContext.getAttribute("scheduledstart");
			var scheduledEndObj = formContext.getAttribute("scheduledend");
			if (scheduledStartObj != null)
			{
				var scheduledStart = scheduledStartObj.getValue();
				var newScheduledStart = new Date(appDate);
				newScheduledStart.setHours(scheduledStart.getHours());
				newScheduledStart.setMinutes(scheduledStart.getMinutes());
				scheduledStartObj.setValue(newScheduledStart);
			}
			if (scheduledEndObj != null)
			{
				var scheduledEnd = scheduledEndObj.getValue();
				var newScheduledEnd = new Date(appDate);
				newScheduledEnd.setHours(scheduledEnd.getHours());
				newScheduledEnd.setMinutes(scheduledEnd.getMinutes());
				scheduledEndObj.setValue(newScheduledEnd);
			}
		}
	},
	OnChange: {
		ServiceId: function ()
		{
			CClearPartners.serviceappointment.SetServiceParameters();
		},
		Resources: function ()
		{
			var attr_behandelendedienstid = CClearPartners.General.Form.GetFormContext().getAttribute("dig_behandelendedienstid");
			var resources = CClearPartners.General.Form.GetValue("resources");
			if (resources != null && resources.length > 0 && resources[0].entityType == "systemuser")
			{
				// Set status "Geboekt"
				var statuscode = CClearPartners.General.Form.GetValue("statuscode");
				if (statuscode != 4 && statuscode != 914380001) CClearPartners.General.Form.SetValue("statuscode", 914380001);
				if (attr_behandelendedienstid != null)
				{
					var userid = resources[0].id.replace('{', '').replace('}', '').toLowerCase();
					var url = "/api/data/v8.2/systemusers(" + userid + ")?$select=_businessunitid_value,dig_adviseurenergent,dig_adviseurmaw,dig_adviseurregent";
					var req = new XMLHttpRequest();
					req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + url, true);
					req.setRequestHeader("OData-MaxVersion", "4.0");
					req.setRequestHeader("OData-Version", "4.0");
					req.setRequestHeader("Accept", "application/json");
					req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
					req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
					req.onreadystatechange = function ()
					{
						if (this.readyState === 4)
						{
							req.onreadystatechange = null;
							if (this.status === 200)
							{
								var result = JSON.parse(this.response);
								var dig_adviseurenergent = result["dig_adviseurenergent"];
								var dig_adviseurmaw = result["dig_adviseurmaw"];
								var dig_adviseurregent = result["dig_adviseurregent"];
								var _businessunitid_value = result["_businessunitid_value"];
								var _businessunitid_value_formatted = result["_businessunitid_value@OData.Community.Display.V1.FormattedValue"];
								var _businessunitid_value_lookuplogicalname = result["_businessunitid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
								var count = 0;
								if (dig_adviseurenergent == true) count += 1;
								if (dig_adviseurmaw == true) count += 1;
								if (dig_adviseurregent == true) count += 1;
								if (count > 1) console.log("OnChange.Resources: ignore dig_behandelendedienstid update (multiple teams)");
								else {
                                    //als bu = GKO
                                    if(_businessunitid_value == "d2b39358-4b5f-e911-80e3-005056935251") //GKO
                                    {
                                        // function uitzondering voor GKO
                                         CClearPartners.serviceappointment.GentKnaptOpException();

                                    }else{
										CClearPartners.General.Form.SetLookupValue("dig_behandelendedienstid",_businessunitid_value,_businessunitid_value_formatted,_businessunitid_value_lookuplogicalname);
                                    }                                              
                                }
                            }
							else
							{
								console.log("OnChange.Resources ERROR: " + this.statusText);
							}
						}
					};
					req.send();
				}
			}
			else
			{
				CClearPartners.serviceappointment.PollForResourceChange(true);
			}
		},
		StatusCodeChanged: function ()
		{
			var status = CClearPartners.General.Form.GetValue("statuscode");
			var regardingobjectid = CClearPartners.General.Form.GetValue("regardingobjectid");
			if (status != null && regardingobjectid != null)
			{
				if (status == 4 && regardingobjectid[0].entityType == "incident")
				{
					//Check of case een e-mailadres heeft
					var req = new XMLHttpRequest();
					req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/incidents(" + regardingobjectid[0].id.replace(/[{}]/g, '').toLowerCase() + ")", false);
					req.setRequestHeader("OData-MaxVersion", "4.0");
					req.setRequestHeader("OData-Version", "4.0");
					req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
					req.setRequestHeader("Accept", "application/json");
					req.setRequestHeader("Prefer", "odata.include-annotations=*");
					req.onreadystatechange = function () {
						if (this.readyState === 4) {
							req.onreadystatechange = null;
							if (this.status === 200) {
								var result3 = JSON.parse(this.response);
								console.log(result3);
								// Columns
								var dig_email = result3["dig_email"]; // Guid
								if (dig_email == null) {
									var x = window.confirm("Er is geen geen e-mailadres gevonden voor de gerelateerde klant. Bent u zeker dat u wil doorgaan met deze actie?");
									if (x == false) CClearPartners.General.Form.SetValue("statuscode", originalstatus, false);
								}
							} else {
								console.log(this.responseText);
							}
						}
					};
					req.send();
				}
				else if (status != 4)
				{
					originalstatus = status;
					// close without save when canceled
					if (status == 9 || status == 10 || status == 803160000 || status == 914380000)
					{
						var attributes = CClearPartners.General.Form.GetFormContext().data.entity.attributes.get();
						for (var i in attributes)
						{
							attributes[i].setSubmitMode("never");
						}
						CClearPartners.General.Form.GetFormContext().ui.close();
					}
				}
			}
		},
		ScheduledStart: function ()
		{
			var formContext = CClearPartners.General.Form.GetFormContext();

			var actualStartObj = formContext.getAttribute("actualstart");
			var scheduledStartObj = formContext.getAttribute("scheduledstart");
			if (scheduledStartObj != null && actualStartObj != null)
			{ 
				CClearPartners.General.Form.SetValue("actualstart", CClearPartners.General.Form.GetValue("scheduledstart"));
				
			}
		},
		ScheduledEnd: function ()
		{
			var formContext = CClearPartners.General.Form.GetFormContext();
			var actualEndObj = formContext.getAttribute("actualend");
			var scheduledEndObj = formContext.getAttribute("scheduledend");
			if (scheduledEndObj != null && actualEndObj != null)
			{ 
				CClearPartners.General.Form.SetValue("actualend", CClearPartners.General.Form.GetValue("scheduledend"));
			}
		},
		ActualStart: function ()
		{
			CClearPartners.serviceappointment.CalculateDuration();
		},
		ActualEnd: function ()
		{
			CClearPartners.serviceappointment.CalculateDuration();
		},
        dig_kantoorbafa: function(){
            var formContext = CClearPartners.General.Form.GetFormContext();
            
			var kantoorbafa = formContext.getAttribute("dig_kantoorbafa");
            
            //914380003 == "Adres klant"
            if(kantoorbafa.getValue() == 914380003){                
                var caseId = formContext.getAttribute("regardingobjectid").getValue()[0].id;            
                Xrm.WebApi.online.retrieveRecord("incident", caseId, "?$select=_dig_wooneenheid_value").then(
                    function success(result) {
                        var _dig_wooneenheid_value_formatted = result["_dig_wooneenheid_value@OData.Community.Display.V1.FormattedValue"];
                        formContext.getAttribute("location").setValue(_dig_wooneenheid_value_formatted);
                    },
                    function(error) {
                        Xrm.Utility.alertDialog(error.message);
                    }
                );                      
            }else{
                var kantoorbafaText = kantoorbafa.getText();            
                formContext.getAttribute("location").setValue(kantoorbafaText);
            }                      
        }        
	},
	Ribbon: {
		
	},
	
	PollForResourceChange: function (initPoll)
	{
		// poll for changed values of resource, or scheduledstart or scheduledend

		var formContext = CClearPartners.General.Form.GetFormContext();
		var attrResources = formContext.getAttribute("resources");
		var resources = attrResources.getValue();
		var hasResource = (resources != null && resources.length > 0 && resources[0].entityType == "systemuser");
		var startObj = formContext.getAttribute("scheduledstart");
		var scheduledstart = JSON.stringify(startObj.getValue());
		var endObj = formContext.getAttribute("scheduledend");
		var scheduledend = JSON.stringify(endObj.getValue());
		if (initPoll) 
		{
			currentresource = JSON.stringify(resources);
			currentstart = scheduledstart;
			currentend = scheduledend;
		} else 
		{
			if (hasResource && currentresource !== JSON.stringify(resources)) 
			{
				// There is a change: trigger!
				console.log("PollForResourceChange: fireOnChange");
				currentresource = JSON.stringify(resources);
				attrResources.fireOnChange();
			}
			if (scheduledstart !== null && currentstart !== scheduledstart) 
			{
				console.log("ScheduledStart: fireOnChange");
				currentstart = scheduledstart;
				startObj.fireOnChange();
			}
			if (scheduledend !== null && currentend !== scheduledend) 
			{
				console.log("ScheduledEnd: fireOnChange");
				currentend = scheduledend;
				endObj.fireOnChange();
			}
		}
		setTimeout(CClearPartners.serviceappointment.PollForResourceChange, 1000);

	},
	SetServiceParameters: function ()
	{
		var caseId = CClearPartners.General.Form.GetValue("regardingobjectid");
		var serviceid = CClearPartners.General.Form.GetValue("serviceid");
		if (caseId != null && caseId.length > 0)
		{
			var id = caseId[0].id.replace('{', '').replace('}', '').toLowerCase();
			var url = "/api/data/v8.2/incidents(" + id + ")?$select=title,dig_titleprefix,dig_telefoon,dig_gsm,dig_email,_dig_wooneenheid_value,description,casetypecode";
			var req = new XMLHttpRequest();
			req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + url, true);
			req.setRequestHeader("OData-MaxVersion", "4.0");
			req.setRequestHeader("OData-Version", "4.0");
			req.setRequestHeader("Accept", "application/json");
			req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
			req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
			req.onreadystatechange = function ()
			{
				if (this.readyState === 4)
				{
					req.onreadystatechange = null;
					if (this.status === 200)
					{
						var subject = "SA: ";
						var location = "";
						var result = JSON.parse(this.response);
						var title = result["title"];
						var dig_titleprefix = result["dig_titleprefix"];
						var dig_telefoon = result.dig_telefoon;
						var dig_gsm = result['dig_gsm'];
						var dig_email = result['dig_email'];
						var description = result['description'];
						var _dig_wooneenheid_value_formatted = result["_dig_wooneenheid_value@OData.Community.Display.V1.FormattedValue"];
						if (dig_titleprefix != null) subject += dig_titleprefix;
						else subject += title;
						if (dig_telefoon != null && dig_gsm != null) subject += " (" + dig_telefoon + "; " + dig_gsm + ")";
						else if (dig_telefoon != null) subject += " (" + dig_telefoon + ")";
						else if (dig_gsm != null) subject += " (" + dig_gsm + ")";
						if (description == null) description = "";
						if (dig_email != null) description = "Email: " + dig_email + "\n" + description;
						if (dig_telefoon != null) description = "Tel.: " + dig_telefoon + "\n" + description;
						if (dig_gsm != null) description = "GSM: " + dig_gsm + "\n" + description;
						if (serviceid != null && serviceid.length > 0 && serviceid[0].name.toLowerCase() == "digitaal advies")
						{
							location = "Digitaal advies";
							description = "Adres: " + _dig_wooneenheid_value_formatted + "\n" + description;
						}
						else
						{
							location = _dig_wooneenheid_value_formatted;
						}
						CClearPartners.General.Form.SetValue("subject", subject);
						CClearPartners.General.Form.SetValue("location", location);
						CClearPartners.General.Form.SetValue("description", description);
					}
					else
					{
						console.log("SetServiceParameters ERROR: " + this.statusText);
					}
				}
			};
			req.send();
		}
	},
	CalculateDuration: function ()
	{
		var formContext = CClearPartners.General.Form.GetFormContext();
		var actualStartObj = formContext.getAttribute("actualstart");
		var actualEndObj = formContext.getAttribute("actualend");
		var durationinMinutesObj = formContext.getAttribute("actualdurationminutes");
		if (actualStartObj != null && actualEndObj != null && durationinMinutesObj != null)
		{
			var actualStart = actualStartObj.getValue();
			var actualEnd = actualEndObj.getValue();
			if (actualStart != null && actualEnd != null)
			{
				var dateDifference = Math.abs(actualEnd - actualStart);
				var durationInMinutes = Math.floor((dateDifference / 1000) / 60);
				durationinMinutesObj.setValue(durationInMinutes);
			}
		}
	},
	AkkoordVerklaring: function ()
	{}
};
