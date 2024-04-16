 _case = null;


if (typeof (Digipolis) == "undefined")
{
	Digipolis = {};
}
Digipolis.GeneralCase = {
	//*********************************Variables*****************************
	//*******************************Event Handlers**************************
	GetCaseEntity: async function (caseField) {
		var id = null;
		var dig_caseid = CClearPartners.General.Form.GetValue(caseField);
		if (dig_caseid != null && dig_caseid.length > 0) id = dig_caseid[0].id.replace('{', '').replace('}', '').toLowerCase();
		if (_case == null || (id != null && _case.incidentid != id))
		{
			if (id == null) {
				_case = null;
			}
			else {
				console.log("GetCaseEntity " + id);
				var url = "/api/data/v9.1/incidents(" + id + ")?$select=statecode,_dig_caseemail_value,dig_email,casetypecode,_dig_hoedanigheid_value"
				var req = new XMLHttpRequest();
				req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + url, false);
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
							_case = JSON.parse(this.response);
						}
						else
						{
							console.log("GetCaseEntity ERROR: " + this.statusText);
						}
					}
				};
				req.send();
			}
		}
		return _case;
	},
    IsCaseType: function (primaryControl, caseTypeCode) {
        if (_case != null) { return _case.casetypecode == caseTypeCode; }
            Digipolis.GeneralCase.GetCaseEntity("dig_caseid").then((res) => {
                if (res == null) { return false; }
                formContext.ui.refreshRibbon(false);
                return res.casetypecode == caseTypeCode;
            });
    },
    VerstuurAkkoordVerklaring: function (primaryControl){
        console.log("VerstuurVerklaring");
        
        var entityid = primaryControl.data.entity.getId().replace(/[{}]/g, '').toLowerCase();
        var caseId = primaryControl.getAttribute("dig_caseid").getValue()[0].id.replace(/[{}]/g,'');
        var ticketnumber = null;        
        
        //get case number
        Xrm.WebApi.retrieveRecord("incident",caseId, "?$select=ticketnumber").then(
            function success(result) {
                console.log(result);
                // Columns
                var ticketnumber = result["ticketnumber"]; // Text
                
                //Get Flow url
                Xrm.WebApi.retrieveMultipleRecords("environmentvariabledefinition", "?$select=defaultvalue&$filter=schemaname eq 'dig_RBSendAkkoordverklaringHTTP'").then(
                    function success(results) {
                        console.log(results);
                        for (var i = 0; i < results.entities.length; i++) {
                            var result = results.entities[i];
                            // Columns
                            var defaultvalue = result["defaultvalue"]; // Multiline Text
                            
                            // call flow
                            var input = JSON.stringify(
                            {
                                "entityid": entityid,
                                "casenumber":ticketnumber
                            });
                            // retrieve power autmate endpoint Url
                                // Call power automate
                                var req = new XMLHttpRequest();
                                req.open("POST", defaultvalue, true);
                                req.setRequestHeader('Content-Type', 'application/json');
                                req.onreadystatechange = function ()
                                {
                                    if (this.readyState === 4)
                                    {
                                        req.onreadystatechange = null;
                                        if (this.status === 200)
                                        {
                                            formContext.data.refresh(true).then(() => {
                                                formContext.ui.tabs.get("tab_documenten").setFocus();
                                            }, () => {
                                                console.log("An error has happened")
                                            });
                                            
                                            var alertStrings = { confirmButtonLabel: "OK", text: "Akkoordverklaring wordt verstuurd.", title: "" };
                                            var alertOptions = { height: 120, width: 260 };
                                            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                                function (success) {
                                                    console.log("Alert dialog closed");
                                                },
                                                function (error) {
                                                    console.log(error.message);
                                                }
                                            );

                                        }
                                        else if (this.status === 400 || this.status === 502 || this.status === 500)
                                        {
                                            var result = this.response;
                                            alert("Error" + result);
                                            var alertStrings = { confirmButtonLabel: "OK", text: "Er ging iets fout bij het versturen van de akkoordverklaring.", title: "" };
                                            var alertOptions = { height: 120, width: 260 };
                                            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                                function (success) {
                                                    console.log("Alert dialog closed");
                                                },
                                                function (error) {
                                                    console.log(error.message);
                                                }
                                            );

                                        }
                                    }
                                };
                                req.send(input);                           
                        }
                    },
                    function(error) {
                        console.log(error.message);
                    }
                );  
            },
            function(error) {
                console.log(error.message);
            }
        );
	},
    IsHoedanigHeid: function(executionContext, hoedanigheid) {
        if (_case != null) { return _case["_dig_hoedanigheid_value@OData.Community.Display.V1.FormattedValue"] == hoedanigheid; }
        Digipolis.GeneralCase.GetCaseEntity("dig_caseid").then((result) => {
            executionContext.ui.refreshRibbon(false);
            return (result["_dig_hoedanigheid_value@OData.Community.Display.V1.FormattedValue"] == hoedanigheid);
        }); 
    }, 
}