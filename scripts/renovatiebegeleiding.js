var caseTypeCodeEqual = false;
var caseTypeLoaded = false;

if (typeof (Digipolis) == "undefined")
{
	Digipolis = {};
}
Digipolis.Renovatiebegeleiding = {
	//*********************************Variables*****************************
	_formInitialized: false,
	//*******************************Event Handlers**************************
	Form_Onload: function (context)
	{
		CClearPartners.General.Form.SetFormContext(context);
		this.AttachEvents();
		this.LoadForm(context);
	},
	AttachEvents: function (context)
	{
		// Only add events once
		if (this._formInitialized) return;
		CClearPartners.General.Form.AddOnChange("dig_hulpbijpremieaanvraag", Digipolis.Renovatiebegeleiding.OnChange.HulpBijPremieAanvraag);
		CClearPartners.General.Form.AddOnChange("dig_renovatietrajectid", Digipolis.Renovatiebegeleiding.OnChange.RenovatietrajectCheck);
		CClearPartners.General.Form.AddOnChange("dig_tacaseid", Digipolis.Renovatiebegeleiding.OnChange.TACase);
		this._formInitialized = true;
	},
	//*********************************Functions*****************************
	LoadForm: function (context)
	{
		// Set external reference
		CClearPartners.General.Form.ShowDocumentTab("tab_opstart");
		function getCustomParam(context)
		{
			var formcontext = context.getFormContext();
			if (formcontext.context.getQueryStringParameters().setfocus_tab != null && formcontext.context.getQueryStringParameters().setfocus_tab != 'undefined')
			{
				var setFocusTab = formcontext.context.getQueryStringParameters().setfocus_tab;
				console.log(setFocusTab);
				var tabObj = formcontext.ui.tabs.get(setFocusTab);
                if(tabObj != null){
                    tabObj.setFocus();
                }
			}
		}
		getCustomParam(context);
		Digipolis.Renovatiebegeleiding.OnChange.HulpBijPremieAanvraag(context);
		Digipolis.Renovatiebegeleiding.OnChange.RenovatietrajectCheck();
	},
	OnChange: {
		HulpBijPremieAanvraag: function (executionContext)
		{
			var dig_hulpbijpremieaanvraag = CClearPartners.General.Form.GetValue("dig_hulpbijpremieaanvraag");
			if (dig_hulpbijpremieaanvraag == true)
			{
				// Retrieve TA values
				Digipolis.Renovatiebegeleiding.SetTACaseMessage(executionContext);
			}
			//formContext.getControl("dig_tacaseid").setVisible(dig_hulpbijpremieaanvraag);
		},
		TACase: function (executionContext)
		{
			Digipolis.Renovatiebegeleiding.SetTACaseMessage(executionContext);
		},
		RenovatietrajectCheck: function ()
		{
			var hasRenovatietrajectRef = CClearPartners.General.Form.GetValue("dig_renovatietrajectid") != null;
			CClearPartners.General.Form.SetTabVisible("tab_verhuurderspunt", hasRenovatietrajectRef);
		}
	},
	Ribbon: {
		EmailOffertevraagKlant: {
			Enable: function ()
			{
				var allok = false;
				Digipolis.GeneralCase.GetCaseEntity("dig_caseid").then((result) => {
                    if (result != null)
                    {
                        var _dig_caseemail_value = result["_dig_caseemail_value"];
                        var dig_email = result["dig_email"];
                        var statecode = result["statecode"];
                        if (statecode == 0 && _dig_caseemail_value != null && dig_email != null) allok = true;
                    }
                    console.log("EmailOffertevraagKlant.Enable: " + allok);
                    return allok;
                });
			},
			Execute: function (primaryControl)
			{
				console.log("EmailOffertevraagKlant.Execute");
				if (Digipolis.Renovatiebegeleiding._case != null)
				{
					Alert.show("Offertevraag naar klant", "Even geduld... het systeem maakt de e-mail aan.", null, "LOADING", 500, 250, Xrm.Utility.getGlobalContext().getClientUrl());
					var url = "/api/data/v9.1/incidents(" + Digipolis.Renovatiebegeleiding._case.incidentid + ")/Microsoft.Dynamics.CRM.dig_CAemailoffertevraagvoorstelnaarklant";
					var req = new XMLHttpRequest();
					req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + url, true);
					req.setRequestHeader("OData-MaxVersion", "4.0");
					req.setRequestHeader("OData-Version", "4.0");
					req.setRequestHeader("Accept", "application/json");
					req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
					req.onreadystatechange = function ()
					{
						if (this.readyState === 4)
						{
							req.onreadystatechange = null;
							if (this.status === 200)
							{
								var results = JSON.parse(this.response);
								var pageInput = {
									pageType: "entityrecord",
									entityName: "email",
									entityId: results.emailid
								};
								var navigationOptions = {
									target: 2,
									height: {
										value: 80,
										unit: "%"
									},
									width: {
										value: 70,
										unit: "%"
									},
									position: 1
								};
								Xrm.Navigation.navigateTo(pageInput, navigationOptions);
							}
							else
							{
								console.log("EmailOffertevraagKlant.Execute ERROR: " + this.statusText);
							}
							Alert.hide();
						}
					};
					req.send();
				}
			}
		},
		GenereerVerslag: {
			Enable: function ()
			{
				var allok = false;
				var result = Digipolis.GeneralCase.GetCaseEntity("dig_caseid").then((result) => {
                    if (result != null) {
                        var statecode = result["statecode"];
                        if (statecode == 0) allok = true;
                    }
                    console.log("GenereerVerslag.Enable: " + allok);
                    return allok;
                });
			},
			Execute: function (primaryControl)
			{
				console.log("GenereerVerslag.Execute");
				if (Digipolis.Renovatiebegeleiding._case != null)
				{
					var clienturl = Xrm.Utility.getGlobalContext().getClientUrl();
					Alert.show("Genereer verslag", "Even geduld... het systeem maakt het document aan en plaatst het op sharepoint.", null, "LOADING", 500, 250, clienturl);
					var _customerid_value_formatted = Digipolis.Renovatiebegeleiding._case["_customerid_value@OData.Community.Display.V1.FormattedValue"];
					var parameters = {};
					parameters.template = "Energiecentrale Eigenaarsbrief";
					parameters.filename = "Verslag Renovatiebegeleiding - Energiecentrale - " + _customerid_value_formatted;
					var url = "/api/data/v9.1/incidents(" + Digipolis.Renovatiebegeleiding._case.incidentid + ")/Microsoft.Dynamics.CRM.dig_CAgenereerdocument";
					var req = new XMLHttpRequest();
					req.open("POST", clienturl + url, true);
					req.setRequestHeader("OData-MaxVersion", "4.0");
					req.setRequestHeader("OData-Version", "4.0");
					req.setRequestHeader("Accept", "application/json");
					req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
					req.onreadystatechange = function ()
					{
						if (this.readyState === 4)
						{
							req.onreadystatechange = null;
							if (this.status === 200)
							{
								primaryControl.ui.setFormNotification("Het verslag is aangemaakt.", "INFORMATION", "GenereerVerslag");
								setTimeout(function ()
								{
									primaryControl.ui.clearFormNotification("GenereerVerslag");
								}, 20000);
							}
							else
							{
								primaryControl.ui.setFormNotification("Er is iets foutgelopen bij het aanmaken van het verslag.", "ERROR", "GenereerVerslag");
								console.log("GenereerVerslag.Execute ERROR: " + this.statusText);
							}
							Alert.hide();
						}
					};
					req.send(JSON.stringify(parameters));
				}
			}
		},
		VerstuurVerslag: {
			Enable: function ()
			{
				var allok = false;
				var result = Digipolis.GeneralCase.GetCaseEntity("dig_caseid").then((result) => {
                if (result != null)
                    {
                        var _dig_caseemail_value = result["_dig_caseemail_value"];
                        var dig_email = result["dig_email"];
                        var statecode = result["statecode"];
                        if (statecode == 0 && _dig_caseemail_value != null && dig_email != null)
                        {
                            var genereerbenovatieverslag = CClearPartners.General.Form.GetValue("dig_genereerverslag");
                            if (genereerbenovatieverslag == true) allok = true;
                        }
                    }
                    console.log("VerstuurVerslag.Enable: " + allok);
                    return allok;
                });
			},
			Execute: function (primaryControl)
			{
				console.log("VerstuurVerslag.Execute");
				if (Digipolis.Renovatiebegeleiding._case != null)
				{
					var clienturl = Xrm.Utility.getGlobalContext().getClientUrl();
					Alert.show("Verstuur verslag", "Even geduld... het systeem maakt de e-mail aan.", null, "LOADING", 500, 250, clienturl);
					var url = "/api/data/v9.1/incidents(" + Digipolis.Renovatiebegeleiding._case.incidentid + ")/Microsoft.Dynamics.CRM.dig_CAemaileigenaarsbrief";
					var req = new XMLHttpRequest();
					req.open("POST", clienturl + url, true);
					req.setRequestHeader("OData-MaxVersion", "4.0");
					req.setRequestHeader("OData-Version", "4.0");
					req.setRequestHeader("Accept", "application/json");
					req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
					req.onreadystatechange = function ()
					{
						if (this.readyState === 4)
						{
							req.onreadystatechange = null;
							if (this.status === 200)
							{
								// De e-mail is verstuurd
								primaryControl.ui.setFormNotification("De e-mail met het verslag is verzonden.", "INFORMATION", "VerstuurVerslag");
								setTimeout(function ()
								{
									primaryControl.ui.clearFormNotification("VerstuurVerslag");
								}, 20000);
							}
							else
							{
								console.log("VerstuurVerslag.Execute ERROR: " + this.statusText);
							}
							Alert.hide();
						}
					};
					req.send();
				}
			}
		},
		MailWerfAanmaken: {
			Execute: function (primaryControl)
			{
				Alert.show("Mailwerf", "Even geduld... het systeem maakt de e-mail aan.", null, "LOADING", 500, 250, Xrm.Utility.getGlobalContext().getClientUrl());
				var Id = (primaryControl.data.entity.getId().replace('{', '').replace('}', '')).toLowerCase();
				var caseIdRaw = CClearPartners.General.Form.GetValue("dig_caseid");
				var caseId = (caseIdRaw[0].id.replace('{', '').replace('}', '')).toLowerCase();
				var data = {
					"Incident": {
						"incidentid": caseId,
						"@odata.type": "Microsoft.Dynamics.CRM.incident"
					}
				};
				var req = new XMLHttpRequest();
				req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/incidents(" + caseId + ")/Microsoft.Dynamics.CRM.dig_RBwerfbezoekemail", true);
				req.setRequestHeader("OData-MaxVersion", "4.0");
				req.setRequestHeader("OData-Version", "4.0");
				req.setRequestHeader("Accept", "application/json");
				req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
				req.onreadystatechange = function ()
				{
					if (this.readyState === 4)
					{
						req.onreadystatechange = null;
						if (this.status === 200)
						{
							var results = JSON.parse(this.response);
							console.log(results);
							//init the destination after succesfull
							var entityFormOptions = {};
							entityFormOptions["entityName"] = "email";
							entityFormOptions["entityId"] = results.emailId;
							// Open the form.
							Xrm.Navigation.openForm(entityFormOptions).then(

							function (success)
							{
								console.log(success);
								Alert.hide();
							},

							function (error)
							{
								console.log(error);
								Alert.hide();
							});
						}
						else
						{
							Xrm.Utility.alertDialog(this.statusText);
							Alert.hide();
						}
					}
				};
				req.send(JSON.stringify(data));
			}
		},
        EnableAkkoordVerklaringHoedanigheid: function (primaryControl, hoedanigheid){ 
            return Digipolis.GeneralCase.IsHoedanigHeid(primaryControl, hoedanigheid);
        },
	},
	_case: null,
	SetTACaseMessage: function (executionContext)
	{
		var formContext = executionContext.getFormContext();
		var dig_tacaseid = CClearPartners.General.Form.GetValue("dig_tacaseid");
		if (dig_tacaseid == null || dig_tacaseid.length == 0)
		{
			CClearPartners.General.Form.SetSectionVisible("tab_opvolging", "section_meldingpremieaanvraag", false);
		}
		else
		{
			var id = dig_tacaseid[0].id.replace('{', '').replace('}', '').toLowerCase();
			var url = "/api/data/v9.1/incidents(" + id + ")";
			var expand = "dig_incident_dig_advies_caseid($select=dig_dossiernummerenergielening,dig_dossiernummergentseenergielening,dig_dossiernummervlaamseenergielening,dig_naambegunstigdeenergielening,dig_naambegunstigdegentseenergielening,dig_naambegunstigdevlaamseenergielening,dig_premiefluviusstortenopenergielening,dig_premiefluviusstortenopgentselening,dig_premiefluviusstortenopleningvlaams)";
			var req = new XMLHttpRequest();
			req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + url + "?$expand=" + expand, true);
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
						var incidentid = result["incidentid"];
						for (var a = 0; a < result.dig_incident_dig_advies_caseid.length; a++)
						{
							var dig_dossiernummerenergielening = result.dig_incident_dig_advies_caseid[a]["dig_dossiernummerenergielening"];
							var dig_dossiernummergentseenergielening = result.dig_incident_dig_advies_caseid[a]["dig_dossiernummergentseenergielening"];
							var dig_dossiernummervlaamseenergielening = result.dig_incident_dig_advies_caseid[a]["dig_dossiernummervlaamseenergielening"];
							//var dig_naambegunstigdeenergielening = result.dig_incident_dig_advies_caseid[a]["dig_naambegunstigdeenergielening"];
							var dig_naambegunstigdeenergielening_formatted = result.dig_incident_dig_advies_caseid[a]["dig_naambegunstigdeenergielening@OData.Community.Display.V1.FormattedValue"];
							//var dig_naambegunstigdegentseenergielening = result.dig_incident_dig_advies_caseid[a]["dig_naambegunstigdegentseenergielening"];
							var dig_naambegunstigdegentseenergielening_formatted = result.dig_incident_dig_advies_caseid[a]["dig_naambegunstigdegentseenergielening@OData.Community.Display.V1.FormattedValue"];
							//var dig_naambegunstigdevlaamseenergielening = result.dig_incident_dig_advies_caseid[a]["dig_naambegunstigdevlaamseenergielening"];
							var dig_naambegunstigdevlaamseenergielening_formatted = result.dig_incident_dig_advies_caseid[a]["dig_naambegunstigdevlaamseenergielening@OData.Community.Display.V1.FormattedValue"];
							var dig_premiefluviusstortenopenergielening = result.dig_incident_dig_advies_caseid[a]["dig_premiefluviusstortenopenergielening"];
							//var dig_premiefluviusstortenopenergielening_formatted = result.dig_incident_dig_advies_caseid[a]["dig_premiefluviusstortenopenergielening@OData.Community.Display.V1.FormattedValue"];
							var dig_premiefluviusstortenopgentselening = result.dig_incident_dig_advies_caseid[a]["dig_premiefluviusstortenopgentselening"];
							//var dig_premiefluviusstortenopgentselening_formatted = result.dig_incident_dig_advies_caseid[a]["dig_premiefluviusstortenopgentselening@OData.Community.Display.V1.FormattedValue"];
							var dig_premiefluviusstortenopleningvlaams = result.dig_incident_dig_advies_caseid[a]["dig_premiefluviusstortenopleningvlaams"];
							//var dig_premiefluviusstortenopleningvlaams_formatted = result.dig_incident_dig_advies_caseid[a]["dig_premiefluviusstortenopleningvlaams@OData.Community.Display.V1.FormattedValue"];
							var message = "";
							if (dig_premiefluviusstortenopleningvlaams)
							{
								message += "- Premie storten op Vlaamse lening";
								if (dig_naambegunstigdevlaamseenergielening_formatted != null) message += " van " + dig_naambegunstigdevlaamseenergielening_formatted;
								if (dig_dossiernummervlaamseenergielening != null) message += " (" + dig_dossiernummervlaamseenergielening + ")";
								message += "\n";
							}
							if (dig_premiefluviusstortenopgentselening)
							{
								message += "- Premie storten op Gentse lening";
								if (dig_naambegunstigdegentseenergielening_formatted != null) message += " van " + dig_naambegunstigdegentseenergielening_formatted;
								if (dig_dossiernummergentseenergielening != null) message += " (" + dig_dossiernummergentseenergielening + ")";
								message += "\n";
							}
							if (dig_premiefluviusstortenopenergielening)
							{
								message += "- Premie storten op energielening+";
								if (dig_naambegunstigdeenergielening_formatted != null) message += " van " + dig_naambegunstigdeenergielening_formatted;
								if (dig_dossiernummerenergielening != null) message += " (" + dig_dossiernummerenergielening + ")";
								message += "\n";
							}
							if (message != "")
							{
								message = "Check case Technisch leningsadvies voor meer details\n" + message;
								var descriptionCtrl = formContext.getControl("WebResource_premiedescription");
								var src = descriptionCtrl.getSrc();
								src = src.substring(0, src.toLowerCase().indexOf("?data=")) + "?data=" + encodeURIComponent(message);
								descriptionCtrl.setSrc(src);
								// Get web resource URL
								CClearPartners.General.Form.SetSectionVisible("tab_opvolging", "section_meldingpremieaanvraag", true);
							}
							else
							{
								CClearPartners.General.Form.SetSectionVisible("tab_opvolging", "section_meldingpremieaanvraag", false);
							}
						}
					}
					else
					{
						console.log("ERROR OnChange.HulpBijPremieAanvraag: " + this.statusText);
					}
				}
			};
			req.send();
		}
	},
	AkkoordVerklaring: function (primaryControl, smartflowname, emailtemplate, createemail)
	{
        // check checkbox collectief op case
        var caseId = primaryControl.getAttribute("dig_caseid").getValue()[0].id.replace(/[{}]/g,'');
        Xrm.WebApi.online.retrieveMultipleRecords("incident", "?$select=dig_iscollectief&$filter=incidentid eq " + caseId).then(
            function success(results) {
                if (results.entities.length > 0) {
                    var dig_iscollectief = results.entities[0]["dig_iscollectief"];
                    if(dig_iscollectief) {
                        smartflowname = "Akkoordverklaring renovatiebegeleiding collectief";
                    }
                    // Xrm.Utility.showProgressIndicator("Akkoordverklaring document wordt aangemaakt");
                    var alertStrings = { confirmButtonLabel: "OK", text: "Akkoordverklaring document wordt aangemaakt.", title: "" };
                    var alertOptions = { height: 120, width: 260 };
                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                        function (success) {
                            console.log("Alert dialog closed");
                        },
                        function (error) {
                            console.log(error.message);
                        }
                    );

					var name = primaryControl.getAttribute("dig_name").getValue();
					var entityName = primaryControl.data.entity.getEntityName();
					var entityid = primaryControl.data.entity.getId().replace(/[{}]/g, '').toLowerCase();
					var globalContext = Xrm.Utility.getGlobalContext();
					var modifyingUser = globalContext.userSettings.userId.replace(/[{}]/g, '').toLowerCase();
					//Call smartflow
					Digipolis.Experlogix.RunSmartFlow(smartflowname, entityid)
					.then((executionid) => {
					    // Success logic
						var input = JSON.stringify(
						{
							"entityid": entityid,
							"executionid": executionid,
							"emailtemplate": emailtemplate,
							"createemail": createemail,
							"modifyinguser": modifyingUser
						});
						// retrieve power autmate endpoint Url
						var queryUrl = "?$select=value&$expand=EnvironmentVariableDefinitionId($select=environmentvariabledefinitionid)&$filter=(EnvironmentVariableDefinitionId/schemaname eq 'dig_XDCreateXpertdoctemplateEndpointUrl')";
						Xrm.WebApi.online.retrieveMultipleRecords("environmentvariablevalue", queryUrl).then(
	
						function success(results)
						{
							for (var i = 0; i < results.entities.length; i++)
							{
								var endpointUrl = results.entities[i]["value"];
								// Call power automate
								var req = new XMLHttpRequest();
								req.open("POST", endpointUrl, true);
								req.setRequestHeader('Content-Type', 'application/json');
								req.onreadystatechange = function ()
								{
									if (this.readyState === 4)
									{
										req.onreadystatechange = null;
										if (this.status === 200)
										{
											primaryControl.data.refresh(true).then(() => {
												primaryControl.ui.tabs.get("tab_documenten").setFocus();
											}, () => {
												console.log("An error has happened");
											});
										}
										else if (this.status === 400 || this.status === 502)
										{
											var result = this.response;
											alert("Error" + result);
										}
									}
								};
								req.send(input);
							}
						},
						function (error)
						{
							Xrm.Utility.alertDialog(error.message);
						});

					})
					.catch(error => {
					    console.error("Error in RunSmartFlow:", error);
					})
					.finally(() => {
					     // Logic you want no matter if it is succes of error
					});
                }
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );
	},
    VerstuurAkkoordVerklaring: function (primaryControl){
        return Digipolis.GeneralCase.VerstuurAkkoordVerklaring(primaryControl);
    },
};