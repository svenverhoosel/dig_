if (typeof (CClearPartners) == "undefined")
{
	CClearPartners = {};
}
if (typeof (CClearPartners.Email) == "undefined")
{
	CClearPartners.Email = {};
}
CClearPartners.Email.Form = function ()
{
    
	try
	{
		//*******************************Event Handlers**************************
		var formInitialized = false;
        var _defaultDuration = 0;
		var onLoad = function (executionContext)
		{
			CClearPartners.General.Form.SetFormContext(executionContext);
			var formContext = CClearPartners.General.Form.GetFormContext();
			// Init form state
			if (formContext.ui.getFormType() == 1)
            {
                CClearPartners.Form.General.SetValue("actualstart",new Date());
                var minutes = _defaultDuration;
                var enddate = new Date(new Date().getTime() + minutes * 60000);
                CClearPartners.Form.General.SetValue("actualend",enddate);
                setDefaultDuration();
            }
			setSender();
			// Only add events once
			if (formInitialized) return;
			formInitialized = true;
            
            
			// Hide description field && show WYSIWYG editor (when UI is available)
			var visible = formContext.ui !== null;
			CClearPartners.Form.General.SetSectionVisible("Email", "email_description", visible);
			CClearPartners.Form.General.SetSectionVisible("Email", "email_defaultdescription", !visible);
			
            CClearPartners.Form.General.AddOnChange("actualstart", CClearPartners.Email.Form.CalculateDuration);
            CClearPartners.Form.General.AddOnChange("actualend", CClearPartners.Email.Form.CalculateDuration);

			const toField = formContext.getAttribute("to");
			toField.addOnChange(removeQueueFromReceivers);
			toField.fireOnChange();
		};
		var disableAutoSave = function (crmContext)
		{
			var eventArgs = crmContext.getEventArgs();
			if (eventArgs.getSaveMode() == 70)
			{ //Autosave
				eventArgs.preventDefault();
			}
		};
		var onChange = {
			
		};
		//****************************Private Functions***************************   
		var setSender = function (businessUnit)
		{
			var formContext = CClearPartners.General.Form.GetFormContext();
			var formType = formContext.ui.getFormType();
			var userId = formContext.context.getUserId();
			var fromValue = formContext.getAttribute("from").getValue();
			var directioncode = formContext.getAttribute("directioncode").getValue();
			var statuscode = formContext.getAttribute("statuscode").getValue();
			var regardingobjectid = formContext.getAttribute("regardingobjectid").getValue();
			if (formType === 1 || (formType === 2 && fromValue !== null && fromValue.length > 0 && fromValue[0].id === userId && directioncode === true && statuscode === 1))
			{
				var getOutgoingQueue = function (businessUnit)
				{
					var isQueueSet = false;
					var setQueueCaseType = (regardingobjectid) => {
						return new Promise((resolve, reject) => {
							if (regardingobjectid !== null && regardingobjectid.length > 0 && regardingobjectid[0].entityType === "incident")
							{
								var incidentid = regardingobjectid[0].id;
								Xrm.WebApi.online.retrieveRecord("incident", incidentid, "?$select=casetypecode").then(

								function success(result)
								{
									var casetypecode = result.casetypecode;
									var casetypecode_formatted = result["casetypecode@OData.Community.Display.V1.FormattedValue"];
									var parameterPrefix = "Email_Outgoing_CaseType_Queue_";
									Xrm.WebApi.online.retrieveMultipleRecords("ccp_parameter", "?$select=ccp_name,ccp_value&$filter=startswith(ccp_name,'" + parameterPrefix + "')").then(

									function success(results)
									{
										var isSet = false;
										for (var i = 0; i < results.entities.length; i++)
										{
											var ccp_name = results.entities[i].ccp_name;
											var ccp_value = results.entities[i].ccp_value;
											if (ccp_name == parameterPrefix + casetypecode_formatted)
											{
												setQueue(ccp_value).then(result => resolve(result));
												isSet = true;
												break;
											}
										}
										if (!isSet) resolve(false);
									},

									function (error)
									{
										reject(error);
									});
								},

								function (error)
								{
									reject(error);
								});
							}
							else
							{
								resolve(false);
							}
						});
					};
					var setQueueBusinessunit = function (isQueueSet, businessUnit)
					{
						if (isQueueSet) return;
						var defaultQ = null;
						var isSet = false;
						var config = "Email_Outgoing_Queue_" + businessUnit.replace(/ /g, "");
						Xrm.WebApi.online.retrieveMultipleRecords("ccp_parameter", "?$select=ccp_name,ccp_value&$filter=startswith(ccp_name,'Email_Outgoing_Queue_')").then(

						function success(results)
						{
							for (var i = 0; i < results.entities.length; i++)
							{
								var ccp_name = results.entities[i]["ccp_name"];
								var ccp_value = results.entities[i]["ccp_value"];
								if (ccp_name == config)
								{
									setQueue(ccp_value).then(result => resolve(result));
									isSet = true;
									break;
								}
								else if (ccp_name == "Email_Outgoing_Queue_Default") defaultQ = ccp_value;
							}
							if (isSet === false) setQueue(defaultQ);
						},

						function (error)
						{
							Xrm.Utility.alertDialog(error.message);
						});
					};
					setQueueCaseType(regardingobjectid)
						.then(isQueueSet => setQueueBusinessunit(isQueueSet, businessUnit))
						.
					catch (err => console.error(err));
				};
			}
			var setQueue = (queue) => {
				return new Promise((resolve, reject) => {
					if (queue !== null)
					{
						Xrm.WebApi.online.retrieveMultipleRecords("queue", "?$select=name,queueid&$filter=name eq '" + queue + "'").then(

						function success(results)
						{
							for (var i = 0; i < results.entities.length; i++)
							{
								var name = results.entities[i]["name"];
								var queueid = results.entities[i]["queueid"];
								CClearPartners.Form.General.SetLookupValue("from", queueid, name, "queue", false);
								resolve(true);
								break;
							}
						},

						function (error)
						{
							reject(error);
						});
					}
					else
					{
						resolve(false);
					}
				});
			};
			Xrm.WebApi.online.retrieveRecord("systemuser", userId.replace("{", "").replace("}", "").toLowerCase(), "?$select=_businessunitid_value").then(

			function success(result)
			{
				var _businessunitid_value = result["_businessunitid_value"];
				var _businessunitid_value_formatted = result["_businessunitid_value@OData.Community.Display.V1.FormattedValue"];
				var _businessunitid_value_lookuplogicalname = result["_businessunitid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
				getOutgoingQueue(_businessunitid_value_formatted);
			},

			function (error)
			{
				Xrm.Utility.alertDialog(error.message);
			});
		};
		
		var setDefaultDuration = function ()
		{
			// if form type = create
			if ( CClearPartners.General.Form.GetFormContext().ui.getFormType() == 1) CClearPartners.General.Form.SetValue("actualdurationminutes", _defaultDuration);
		};
		var calculateDuration = function ()
		{
            var formContext = CClearPartners.General.Form.GetFormContext();
			var actualStartObj = formContext.getAttribute("actualstart");
			var actualEndObj = formContext.getAttribute("actualend");
			var durationinMinutesObj = formContext.getAttribute("actualdurationminutes");
			if (actualStartObj !== null && actualEndObj !== null && durationinMinutesObj !== null)
			{
				var actualStart = actualStartObj.getValue();
				var actualEnd = actualEndObj.getValue();
				if (actualStart !== null && actualEnd !== null)
				{
					var dateDifference = Math.abs(actualEnd - actualStart);
					var durationInMinutes = Math.floor((dateDifference / 1000) / 60);
					durationinMinutesObj.setValue(durationInMinutes);
				}
			}
		};
		const getQueue = function (queueNames, callback) {
			// const that = this;
	
			for (var index = 0; index < queueNames.length; index++) {
				const queueName = queueNames[index];
				queueNames[index] = "'" + queueName + "'";
			}
	
			const joinQueues = queueNames.join(",");
					
			var req = new XMLHttpRequest();
			req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/queues?$select=name,queueid&$filter=(Microsoft.Dynamics.CRM.In(PropertyName='name',PropertyValues=[" + joinQueues + "]))", true);
			req.setRequestHeader("OData-MaxVersion", "4.0");
			req.setRequestHeader("OData-Version", "4.0");
			req.setRequestHeader("Accept", "application/json");
			req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
			req.setRequestHeader("Prefer", "odata.include-annotations=*");
			req.onreadystatechange = function () {
				if (this.readyState === 4) {
					req.onreadystatechange = null;
					if (this.status === 200) {
						const results = JSON.parse(this.response);
						if (results && results.value) {
							const result = results.value;
	
							// for (let index = 0; index < result.length; index++) {
							//     const _queue = result[index];
							//     that._queues[_queue.name] = _queue.queueid;
							// }
	
							callback(result);
						}
					} else {
						Xrm.Utility.alertDialog(this.statusText);
					}
				}
			};
			req.send();
		};
		const removeQueueFromReceivers = function (executionContext) {
			const formContext = executionContext.getFormContext();    
			const statecode = formContext.getAttribute("statecode").getValue();
			if (statecode !== 0) return;
			//open
			
			const toAttribute = formContext.getAttribute("to");
			const toValue = toAttribute.getValue();
	
			if (toValue && toValue.length > 0) {
				getQueue(["Verhuurderspunt@stad.gent", "kot@stad.gent"], function (queues) {
					if (queues && queues.length > 0) {
						for (let index = 0; index < toValue.length; index++) {
							const to = toValue[index];
	
							if (to.entityType === "queue") {
								const filteredQueues = queues.filter(function(queue){
									return queue.queueid.toLowerCase().indexOf(to.id.replace(/[{}]/g, '').toLowerCase()) !== -1;
								});
	
								if (filteredQueues.length > 0) {
									toValue.splice(index, 1);
								}
							}
						}
	
						toAttribute.setValue(toValue);
					}
				}); 
			}
		};
		return {
			OnLoad: onLoad,
			DisableAutoSave: disableAutoSave,
            CalculateDuration: calculateDuration
		};
	}
	catch (err)
	{}
}();
CClearPartners.Email.Ribbon = function ()
{
	var attachSpDocuments = function (primaryControl)
	{
        var emailid = primaryControl.data.entity.getId();
		var regardingobjectid = primaryControl.getAttribute("regardingobjectid").getValue()[0].id;
		if (primaryControl.getAttribute("regardingobjectid").getValue()[0].entityType == "dig_offerte")
		{
        
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/dig_offertes(" + regardingobjectid.slice(1,-1) + ")?$select=_dig_caseid_value", false);
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
                        var dig_caseid = result["_dig_caseid_value"]; // Lookup
                        if(dig_caseid != null)  regardingobjectid = dig_caseid;
                    } else {
                        // Do Nothing
                    }
                }
            };
            req.send();
                
        

		}
		var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();
		var customParameters = encodeURIComponent("emailid=" + emailid + "&regardingobjectid=" + regardingobjectid);
		var callback = function ()
		{
			primaryControl.getControl("attachmentsGrid").refresh();
		};
		Alert.showWebResource("dig_/getspdocs/index.html?Data=" + customParameters, 420, 500, "Selecteer bestand", null, serverUrl, false, 10);
		CClearPartners.Form.General.RegisterAlertCallback("callback", callback);
	};
	var attachSpDocumentsVorigeCase = function (primaryControl)
	{
		var emailid = primaryControl.data.entity.getId();
		var regardingobjectid = primaryControl.getAttribute("regardingobjectid").getValue()[0].id;
		if (primaryControl.getAttribute("regardingobjectid").getValue()[0].entityType == "dig_offerte")
		{
        
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/dig_offertes(" + regardingobjectid.slice(1,-1) + ")?$select=_dig_caseid_value", false);
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
                        var dig_caseid = result["_dig_caseid_value"]; // Lookup
                        if(dig_caseid != null)  regardingobjectid = dig_caseid;
                        
                        
                        
                        
                        var req = new XMLHttpRequest();
                        req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/incidents(" + dig_caseid + ")?$select=_dig_vorigecaseid_value", false);
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
                                    var dig_vorigecaseid = result["_dig_vorigecaseid_value"]; // Lookup
                                    if (dig_vorigecaseid != null) regardingobjectid = dig_vorigecaseid;
                                } else {
                                    // Do Nothing
                                }
                            }
                        };
                        req.send();  
                    } else {
                        // Do Nothing
                    }
                }
            };
            req.send();

		}
		var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();
		var customParameters = encodeURIComponent("emailid=" + emailid + "&regardingobjectid=" + regardingobjectid);
		var callback = function ()
		{
			primaryControl.getControl("attachmentsGrid").refresh();
		};
		Alert.showWebResource("dig_/getspdocs/index.html?Data=" + customParameters, 420, 500, "Selecteer bestand", null, serverUrl, false, 10);
		CClearPartners.Form.General.RegisterAlertCallback("callback", callback);
	};
	var enableAttachSpDocuments = function (primaryControl)
	{
		if (primaryControl.getAttribute("regardingobjectid") != null)
		{
			var regardingobjectid = primaryControl.getAttribute("regardingobjectid").getValue();
			if (regardingobjectid != null && (regardingobjectid[0].entityType == "incident" || regardingobjectid[0].entityType == "dig_offerte")) return true;
		}
		return false;
	};
	var enableAttachSpDocumentsVorigeCase = function (primaryControl)
	{
		var returnvalue = false;
		if (primaryControl.getAttribute("regardingobjectid") != null)
		{
			var regardingobjectid = primaryControl.getAttribute("regardingobjectid").getValue();
			if (regardingobjectid != null && (regardingobjectid[0].entityType == "incident" || regardingobjectid[0].entityType == "dig_offerte"))
			{
				var incidentid = regardingobjectid[0].id;
				if (primaryControl.getAttribute("regardingobjectid").getValue()[0].entityType == "dig_offerte")
				{
                
                
                    var req = new XMLHttpRequest();
                    req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/dig_offertes(" + incidentid.slice(1,-1) + ")?$select=_dig_caseid_value", false);
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
                                var dig_caseid = result["_dig_caseid_value"]; // Lookup
                                if(dig_caseid != null)  incidentid = dig_caseid;
                            } else {
                                // Do Nothing
                            }
                        }
                    };
                    req.send();              
				}
                
                
                
                    var req = new XMLHttpRequest();
                    req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/incidents(" + incidentid + ")?$select=_dig_vorigecaseid_value", false);
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
                                var dig_vorigecaseid = result["_dig_vorigecaseid_value"]; // Lookup
                                if (dig_vorigecaseid != null) returnvalue = true;
                            } else {
                                // Do Nothing
                            }
                        }
                    };
                    req.send();  
			}
		}
		return returnvalue;
	};
	var _documentDownloads = null;
	var enableAttachSpDocumentsDownloads = function (primaryControl)
	{
		if (_documentDownloads == null)
		{
			var url = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v8.2/dig_downloadses?$select=dig_name&$filter=statuscode eq 1 &$orderby=dig_name asc";
			var req = new XMLHttpRequest();
			req.open("GET", url, false);
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
						var results = JSON.parse(this.response);
						console.log(" - DocumentsDownloads: #" + results.value.length);
						_documentDownloads = [];
						for (var i = 0; i < results.value.length; i++)
						{
							_documentDownloads.push(results.value[i]);
						}
					}
					else
					{
						console.log("enableAttachSpDocumentsDownloads ERROR: " + this.statusText);
					}
				}
			};
			req.send();
		}
		
		return (_documentDownloads != null && _documentDownloads.length > 0);
	};
	var populateDownloads = function (commandProperties)
	{
		if (_documentDownloads != null)
		{
			var xml = "";
			for (var i = 0; i < _documentDownloads.length; i++)
			{
				var name = _documentDownloads[i]["dig_name"];
				var value = _documentDownloads[i]["dig_downloadsid"];
				// Make sure to have valid names
				if (name != null)
				{
					console.log(' - populateDownloads - Add: ' + name);
					name = name.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/"/g, '&quot;')
						.replace(/'/g, '&apos;');
					xml += "<MenuSection Id='dig.documentdownloads.item.menusection.attach." + value + "' Sequence='" + i + "'><Controls Id='dig.documentdownloads.item.control.attach." + value + "'><Button Id='dig.documentdownloads.item.attach." + value + "' Command='dig.email.Command.Downloads' CommandValueId='" + value + "' LabelText='" + name + "' /></Controls></MenuSection>";
				}
			}
			commandProperties["PopulationXML"] = '<Menu Id="dig.documentdownloads.item.menu.attach">' + xml + '</Menu>';
		}
	};
	var attachDocumentDownloads = function (commandproperties, primaryControl)
	{
		var emailid = primaryControl.data.entity.getId();
		var serverUrl = primaryControl.context.getClientUrl();
		var customParameters = encodeURIComponent("emailid=" + emailid + "&regardingobjectid=" + commandproperties.CommandValueId);
		var callback = function ()
		{
			primaryControl.getControl("attachmentsGrid").refresh();
		};
		Alert.showWebResource("dig_/getspdocs/index.html?Data=" + customParameters, 420, 500, "Selecteer bestand", null, serverUrl, false, 10);
		CClearPartners.Form.General.RegisterAlertCallback("callback", callback);
	};
	var convertToCase = function (primaryControl)
	{
        // first save
		primaryControl.data.save().then(

		function ()
		{
			var setRegardingObjectId = function (incidentId)
			{
				var mail = {};
				mail.RegardingObjectId = {
					Id: incidentId,
					LogicalName: "incident"
				};                
                
                var req = new XMLHttpRequest();
                req.open("PATCH", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/incidents(" + primaryControl.data.entity.getId() + ")?$select=_dig_vorigecaseid_value", false);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Prefer", "odata.include-annotations=*,return=representation");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
                            var result = JSON.parse(this.response);
                            console.log(result);
                            // Columns
                            var incidentid = result["incidentid"]; // Guid                            
                            Xrm.Utility.openEntityForm("incident", incidentId);
                            
                            
                        } else {
                            // Do Nothing
                        }
                    }
                };
                req.send(JSON.stringify(mail));             


			};
			var createIncident = function (customerid, email, tel, gsm)
			{
				var incident = {};
				incident.CustomerId = {
					Id: customerid,
					LogicalName: "contact"
				};
				incident.dig_Vraag = primaryControl.getAttribute("description").getValue();
				if (email) incident.dig_email = email;
				if (tel) incident.dig_telefoon = tel;
				if (gsm) incident.dig_gsm = gsm;
				incident.CaseOriginCode = {
					Value: 101
				};
				incident.dig_originatingemail = {
					Id: primaryControl.data.entity.getId(),
					LogicalName: "email"
				};               
                
                
                var req = new XMLHttpRequest();
                req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/incidents?$select=_dig_vorigecaseid_value", false);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Prefer", "odata.include-annotations=*,return=representation");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 201) {
                            var result = JSON.parse(this.response);
                            console.log(result);
                            // Columns
                            var incidentid = result["incidentid"]; // Guid
                            setRegardingObjectId(incidentid);
                        } else {
                            // Do Nothing
                        }
                    }
                };
                req.send(JSON.stringify(incident));
                

			};
			// Check if "from" is already a contact
			var from = primaryControl.getAttribute("from").getValue();
			var hasfrom = (from != null && from.length > 0);
			if (hasfrom && from[0].type == 2)
			{
            
                Xrm.WebApi.retrieveRecord("contact", from[0].id.slice(1,-1), "?$select=telephone1,emailaddress1,mobilephone").then(
                    function success(result) {
                        console.log(result);
                        // Columns
                        var contactid = result["contactid"]; // Guid
                        var telephone1 = result["telephone1"]; // Text
                        var emailaddress1 = result["emailaddress1"]; // Text
                        var mobilephone = result["mobilephone"]; // Text
                        createIncident(contactid, emailaddress1, telephone1, mobilephone);
                    },
                    function(error) {
                       // Do Nothing
                    }
                );


			}
			else
			{
				var email = (hasfrom && from[0].type == 9206) ? from[0].name : null; // when unknown sender, get the email address 
				// get the anonymous customer
                
                
                Xrm.WebApi.retrieveMultipleRecords("contact", "?$select=telephone1,emailaddress1,mobilephone").then(
                    function success(results) {
                        console.log(results);
                        if(results.entities.length > 0){                       
                            createIncident(results.entities[0]["contactid"], results.entities[0]["emailaddress1"], null, null);                            
                        }
                    },
                    function(error) {
                        // Do Nothing
                    }
                );                                
                

			}
		},

		function (error)
		{ /* do nothing */
		});
	};
	var checkAttachmentsSize = function ()
	{

		return true;
	};
	return {
		attachSpDocuments: attachSpDocuments,
		attachSpDocumentsVorigeCase: attachSpDocumentsVorigeCase,
		enableAttachSpDocuments: enableAttachSpDocuments,
		enableAttachSpDocumentsVorigeCase: enableAttachSpDocumentsVorigeCase,
		enableAttachSpDocumentsDownloads: enableAttachSpDocumentsDownloads,
		populateDownloads: populateDownloads,
		attachDocumentDownloads: attachDocumentDownloads,
		convertToCase: convertToCase,
		CheckAttachmentsSize: checkAttachmentsSize
	};
}();