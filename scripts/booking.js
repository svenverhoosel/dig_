if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

Digipolis.booking = {
    //*********************************Variables*****************************
    originalstatus: -1,

    //*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);
        this.AttachEvents();
        this.LoadForm();
    },

    AttachEvents: function () {
        CClearPartners.Form.General.AddOnChange("statuscode", Digipolis.booking.OnChange.StatusCodeChanged);
        CClearPartners.Form.General.AddOnChange("actualstart", Digipolis.booking.OnChange.ActualStart);
        CClearPartners.Form.General.AddOnChange("actualend", Digipolis.booking.OnChange.ActualEnd);

        CClearPartners.Form.General.AddOnChange("scheduledstart", Digipolis.booking.OnChange.ScheduledStart);
        CClearPartners.Form.General.AddOnChange("scheduledend", Digipolis.booking.OnChange.ScheduledEnd);

        CClearPartners.Form.General.AddOnChange("serviceid", Digipolis.booking.OnChange.ServiceId);
    },

    //*********************************Functions*****************************

    LoadForm: function () {
        var formContext = CClearPartners.General.Form.GetFormContext();
        if (formContext.ui.getFormType() == 1) {
            Digipolis.booking.SetDefaultsForCase();

            formContext.getAttribute("scheduledstart").fireOnChange();
            formContext.getAttribute("scheduledend").fireOnChange();
        }
        originalstatus = CClearPartners.General.Form.GetValue("statuscode");

    },

    SetDefaultsForCase: function () {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var clientUrl = Xrm.Utility.getGlobalContext().getClientUrl();
        var param = formContext.data.attributes;
        var caseId = param["parameter_OriginatingCase"];
        var appDate = param["parameter_AppointmentDate"];

        if (caseId != null) {
            //SOAP method gebruikt om request te doen zodat het label voor optionset CaseTypeCode mee in de response zit
            var cols = ["customerid", "title", "casetypecode", "dig_typeafspraak"];
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/incidents(" + caseId.replace(/[{}]/g, "").toLowerCase() + ")?$select=casetypecode,_customerid_value,title,dig_typeafspraak", false);
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

                        if (retrievedCase.attributes['casetypecode'] != null) {
                            // Columns
                            var incidentid = result["incidentid"]; // Guid
                            var casetypecode = result["casetypecode"]; // Choice
                            var casetypecode_formatted = result["casetypecode@OData.Community.Display.V1.FormattedValue"];
                            var customerid = result["_customerid_value"]; // Customer
                            var customerid_formatted = result["_customerid_value@OData.Community.Display.V1.FormattedValue"];
                            var customerid_lookuplogicalname = result["_customerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                            var title = result["title"]; // Text
                            var dig_typeafspraak = result["dig_typeafspraak"]; // Choice
                            var dig_typeafspraak_formatted = result["dig_typeafspraak@OData.Community.Display.V1.FormattedValue"];

                            var title = retrievedCase.attributes['title'] != null ? retrievedCase.attributes['title'].value : "";

                            var casetypecodeName = casetypecode_formatted;
                            var dig_typeafspraak = dig_typeafspraak;

                            if (dig_typeafspraak != null && dig_typeafspraak.value == 2)
                                casetypecodeName = "Digitaal advies";

                            var url = "/api/data/v9.1/msdyn_requirementgroups?$select=msdyn_name,msdyn_requirementgroupid&$filter=startswith(msdyn_name,'" + casetypecodeName + "')";
                            var req2 = new XMLHttpRequest();
                            req2.open("GET", clientUrl + url, true);
                            req2.setRequestHeader("OData-MaxVersion", "4.0");
                            req2setRequestHeader("OData-Version", "4.0");
                            req2.setRequestHeader("Accept", "application/json");
                            req2.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                            req2.setRequestHeader("Prefer", "odata.include-annotations=\"*\",odata.maxpagesize=1");
                            req2.onreadystatechange = function () {
                                if (this.readyState === 4) {
                                    req2.onreadystatechange = null;
                                    if (this.status === 200) {
                                        var results = JSON.parse(this.response);
                                        for (var i = 0; i < results.value.length; i++) {
                                            var msdyn_name = results.value[i]["msdyn_name"];
                                            var msdyn_requirementgroupid = results.value[i]["msdyn_requirementgroupid"];

                                            Xrm.WebApi.online.retrieveMultipleRecords("service", "?$filter=startswith(name,'" + casetypecodeName + "')").then(
                                                function success(resultss) {
                                                    console.log(resultss);
                                                    if (resultss.entities.length > 0) {
                                                        var service = resultss.entities[0];
                                                        //duration = service.Duration;
                                                        CClearPartners.Form.General.SetLookupValue("serviceid", service["serviceid"], service['name'], "service", true);
                                                    }
                                                },
                                                function (error) {
                                                    console.log(error.message);
                                                }
                                            );
                                            
                                        }
                                    } else {
                                        Xrm.Utility.alertDialog(this.statusText);
                                    }
                                }
                            };
                            req2.send();
                        } else {
                            console.log(this.responseText);
                        }
                    }
                };
                req.send();
            }

            
            CClearPartners.Form.General.SetLookupValue("regardingobjectid", caseId, title, "incident", false);
            if (retrievedCase.attributes['customerid'] != null) CClearPartners.Form.General.SetLookupValue("customers", retrievedCase.attributes['customerid'].id, retrievedCase.attributes['customerid'].name, retrievedCase.attributes['customerid'].logicalName, false);
            
        }


        if (appDate != null) {
            var scheduledStartObj = formContext.getAttribute("scheduledstart");
            var scheduledEndObj = formContext.getAttribute("scheduledend");

            if (scheduledStartObj != null) {
                var scheduledStart = scheduledStartObj.getValue();
                var newScheduledStart = new Date(appDate);
                newScheduledStart.setHours(scheduledStart.getHours());
                newScheduledStart.setMinutes(scheduledStart.getMinutes());
                scheduledStartObj.setValue(newScheduledStart);
            }

            if (scheduledEndObj != null) {
                var scheduledEnd = scheduledEndObj.getValue();
                var newScheduledEnd = new Date(appDate);
                newScheduledEnd.setHours(scheduledEnd.getHours());
                newScheduledEnd.setMinutes(scheduledEnd.getMinutes());
                scheduledEndObj.setValue(newScheduledEnd);
            }
        }
    },


    OnChange: {
        ServiceId: function () {
            Digipolis.booking.SetServiceParameters();
        },
        StatusCodeChanged: function () {
            var formContext = CClearPartners.General.Form.GetFormContext();
            var statusObj = formContext.getAttribute("statuscode");
            var regardingobjectidObj = formContext.getAttribute("regardingobjectid");
            if (statusObj != null && regardingobjectidObj != null && regardingobjectidObj.getValue() != null) {
                if (statusObj.getValue() == 4 && regardingobjectidObj.getValue()[0].typename == "incident") {
                    //Check of case een e-mailadres heeft
                    //deprecated call
                    var req = new XMLHttpRequest();
                    req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/incidents("+regardingobjectidObj.getValue()[0].id.replace(/[{}]/g, "").toLowerCase()+")", false);
                    req.setRequestHeader("OData-MaxVersion", "4.0");
                    req.setRequestHeader("OData-Version", "4.0");
                    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    req.setRequestHeader("Accept", "application/json");
                    req.setRequestHeader("Prefer", "odata.include-annotations=*");
                    req.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            req.onreadystatechange = null;
                            if (this.status === 200) {
                                var result2 = JSON.parse(this.response);
                                // Columns
                                if (result2["dig_email"] == null) {
                                    var x = window.confirm("Er is geen geen e-mailadres gevonden voor de gerelateerde klant. Bent u zeker dat u wil doorgaan met deze actie?");
                                    if (x == false)
                                        statusObj.setValue(originalstatus);
                                }
                            } else {
                                console.log(this.responseText);
                            }
                        }
                    };
                    req.send();
                    
                } else if (statusObj.getValue() != 4) {
                    originalstatus = statusObj.getValue();
                }
            }
        },
        ScheduledStart: function () {
            var formContext = CClearPartners.General.Form.GetFormContext();
            var actualStartObj = formContext.getAttribute("actualstart");
            var scheduledStartObj = formContext.getAttribute("scheduledstart");

            if (scheduledStartObj != null && actualStartObj != null && (actualStartObj.getValue() == null || formContext.ui.getFormType() == 1)) {
                var scheduledStart = scheduledStartObj.getValue();
                actualStartObj.setValue(scheduledStart);
                actualStartObj.fireOnChange();
            }
        },
        ScheduledEnd: function () {
            var formContext = CClearPartners.General.Form.GetFormContext();
            var actualEndObj = formContext.getAttribute("actualend");
            var scheduledEndObj = formContext.getAttribute("scheduledend");

            if (scheduledEndObj != null && actualEndObj != null && (actualEndObj.getValue() == null || formContext.ui.getFormType() == 1)) {
                var scheduledEnd = scheduledEndObj.getValue();
                actualEndObj.setValue(scheduledEnd);
                actualEndObj.fireOnChange();
            }
        },
        ActualStart: function () {
            Digipolis.booking.CalculateDuration();
        },
        ActualEnd: function () {
            Digipolis.booking.CalculateDuration();
        }
    },

    SetServiceParameters: function () {
        var caseId = CClearPartners.Form.General.GetValue("regardingobjectid");
        var serviceid = CClearPartners.Form.General.GetValue("serviceid");

        if (caseId != null && caseId.length > 0) {
            var id = caseId[0].id.replace('{', '').replace('}', '').toLowerCase();
            var url = "/api/data/v8.2/incidents(" + id + ")?$select=dig_titleprefix,dig_telefoon,dig_gsm,dig_email,_dig_wooneenheid_value,description,casetypecode";
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + url, true);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var subject = "SA: ";
                        var location = "";

                        var result = JSON.parse(this.response);
                        var dig_titleprefix = result["dig_titleprefix"];
                        var dig_telefoon = result['dig_telefoon'];
                        var dig_gsm = result['dig_gsm'];
                        var dig_email = result['dig_email'];
                        var description = result['description'];
                        var _dig_wooneenheid_value_formatted = result["_dig_wooneenheid_value@OData.Community.Display.V1.FormattedValue"];

                        if (dig_titleprefix != null) subject += dig_titleprefix;

                        if (dig_telefoon != null && dig_gsm != null) subject += " (" + dig_telefoon + "; " + dig_gsm + ")";
                        else if (dig_telefoon != null) subject += " (" + dig_telefoon + ")";
                        else if (dig_gsm != null) subject += " (" + dig_gsm + ")";


                        if (description == null) description = "";
                        if (dig_email != null) description = "Email: " + dig_email + "\n" + description;
                        if (dig_telefoon != null) description = "Tel.: " + dig_telefoon + "\n" + description;
                        if (dig_gsm != null) description = "GSM: " + dig_gsm + "\n" + description;

                        if (serviceid != null && serviceid.length > 0 && serviceid[0].name.toLowerCase() == "digitaal advies") {
                            location = "Digitaal advies";
                            description = "Adres: " + _dig_wooneenheid_value_formatted + "\n" + description;
                        } else {
                            location = _dig_wooneenheid_value_formatted;
                        }

                        CClearPartners.Form.General.SetValue("subject", subject);
                        CClearPartners.Form.General.SetValue("location", location);
                        CClearPartners.Form.General.SetValue("description", description);
                    } else {
                        console.log("SetServiceParameters ERROR: " + this.statusText);
                    }
                }
            };
            req.send();
        }
    },

    CalculateDuration: function () {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var actualStartObj = formContext.getAttribute("actualstart");
        var actualEndObj = formContext.getAttribute("actualend");
        var durationinMinutesObj = formContext.getAttribute("actualdurationminutes");

        if (actualStartObj != null && actualEndObj != null && durationinMinutesObj != null) {
            var actualStart = actualStartObj.getValue();
            var actualEnd = actualEndObj.getValue();
            if (actualStart != null && actualEnd != null) {
                var dateDifference = Math.abs(actualEnd - actualStart);
                var durationInMinutes = Math.floor((dateDifference / 1000) / 60);
                durationinMinutesObj.setValue(durationInMinutes);
            }
        }
    },
}