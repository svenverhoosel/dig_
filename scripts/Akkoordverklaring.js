if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

Digipolis.Akkoordverklaring = {
    //*********************************Variables*****************************
    _formInitialized: false,

    //*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);

        this.AttachEvents();
        this.LoadForm();
    },

    Form_OnSave: function (context) {

    },

    AttachEvents: function () {
        // Only add events once
        if (this._formInitialized) return;

        CClearPartners.General.Form.AddOnChange("dig_case", Digipolis.Akkoordverklaring.OnChange.CaseId);

        this._formInitialized = true;
    },

    //*********************************Functions*****************************

    LoadForm: function () {
        this.OnChange.CaseId();
    },

    OnChange: {
        CaseId: function () {
            var dig_klant = CClearPartners.General.Form.GetValue('dig_klant');

            if (dig_klant == null || dig_klant.length == 0) {
                var dig_case = CClearPartners.General.Form.GetValue('dig_case');

                if (dig_case != null && dig_case.length > 0) {
                    var caseId = dig_case[0].id;
                    console.log(caseId);

                    Xrm.WebApi.retrieveRecord("incident", caseId).then(
                        function success(result) {
                            console.log("Retrieved values: Name: " + result.incidentid);
                            console.log(result);
                            // perform operations on record retrieval
                            if (result != null && result["_customerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"] == "contact") {
                                CClearPartners.General.Form.SetLookupValue("dig_klant", result["_customerid_value"],result["_customerid_value@OData.Community.Display.V1.FormattedValue"],  result["_customerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"]);
                            } else {
                                if (result == null) {
                                    console.log("result null");
                                    CClearPartners.General.Form.SetValue('dig_klant', null);
                                } else if (result == result["_customerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"] == "account") {
                                    console.log("customer is an account, please set the customer manually");
                                    CClearPartners.General.Form.SetValue('dig_klant', null);
                                } else {
                                    CClearPartners.General.Form.SetValue('dig_klant', null);
                                }
                            }
                        },
                        function (error) {
                            console.log(error.message);
                            // handle error conditions  
                        }

                    );
                }
            }
        }
    },


    Ribbon: {
        Create: {
            Enable: function (primaryControl) {
                var enable = false;
                var _case = Digipolis.Akkoordverklaring.GetCaseEntity(primaryControl);

                if (_case != null) {
                    var formtype = primaryControl.ui.getFormType();
                    var type = _case["casetypecode"];
                    var statecode = _case["statecode"];

                    var isOntzorging = (type == 42);
                    var isOpvolgscan = (type == 37);
                    var isOpvolgscanA = (type == 38);
                    var isOpvolgscanB = (type == 46);
                    var isEnergiescan = (type == 35);

                    if ((statecode == 0) && (formtype == 2) &&
                        (isOntzorging || isOpvolgscanA || isOpvolgscanB || isEnergiescan || isOpvolgscan)) {
                        enable = true;
                    }
                }



                console.log("Akkoordverklaring.Enable: " + enable);

                return enable;
            },
            Email: {
                Enable: function (primaryControl) {
                    var enable = false;
                    var _case = Digipolis.Akkoordverklaring.GetCaseEntity(primaryControl);

                    if (_case != null) {
                        var formtype = primaryControl.ui.getFormType();
                        var type = _case["casetypecode"];
                        var statecode = _case["statecode"];

                        var isOntzorging = (type == 42);
                        var isTrajectBegeleiding = (type == 41);

                        // TB of OZ EN editable
                        if ((statecode == 0) && (formtype == 2) &&
                            (isOntzorging || isTrajectBegeleiding)) {
                            enable = true;
                        }
                    }

                    console.log("Akkoordverklaring.Email.Enable: " + enable);

                    return enable;
                },
                Execute: function (primaryControl) {
                    var _case = Digipolis.Akkoordverklaring.GetCaseEntity(primaryControl);

                    if (_case != null) {
                        var recordId = _case.incidentid;
                        console.log("Akkoordverklaring.Email.Execute: " + recordId);
                        const clienturl = Xrm.Utility.getGlobalContext().getClientUrl();
                        
                        Xrm.Utility.showProgressIndicator("Akkoordverklaring - Even geduld... het systeem maakt de e-mail aan en genereert de akkoordverklaring.");


                        var parameters = {};
                        parameters.templatename = "EC - CA bevestiging renovatiebegeleiding";
                        parameters.attachmenttemplatename = "Energiecentrale akkoordverklaring renovatiebegeleiding";

                        var url = "/api/data/v8.2/incidents(" + recordId + ")/Microsoft.Dynamics.CRM.dig_CA_InstantiateTemplate";
                        var req = new XMLHttpRequest();
                        req.open("POST", clienturl + url, true);
                        req.setRequestHeader("OData-MaxVersion", "4.0");
                        req.setRequestHeader("OData-Version", "4.0");
                        req.setRequestHeader("Accept", "application/json");
                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req.onreadystatechange = function () {
                            if (this.readyState === 4) {
                                req.onreadystatechange = null;
                                if (this.status === 200) {
                                    var results = JSON.parse(this.response);
                                    console.log("Akkoordverklaring.Email.Execute: open email " + results.emailid);
                                    Xrm.Utility.openEntityForm("email", results.emailid, null);
                                } else {
                                    console.log("ERROR Akkoordverklaring.Email.Execute: " + this.statusText);
                                }
                                Xrm.Utility.closeProgressIndicator();
                            }
                        };
                        req.send(JSON.stringify(parameters));
                    }
                }
            },
            GeplaatsteMaterialen: {
                Enable: function (primaryControl) {
                    var enable = false;
                    var _case = Digipolis.Akkoordverklaring.GetCaseEntity(primaryControl);

                    if (_case != null) {
                        var formtype = primaryControl.ui.getFormType();
                        var type = _case["casetypecode"];
                        var statecode = _case["statecode"];

                        var isOpvolgscanA = (type == 38);
                        var isOpvolgscan = (type == 37);
                        var isOpvolgscanB = (type == 46);
                        var isEnergiescan = (type == 35);

                        // TB of OZ EN editable
                        if ((statecode == 0) && (formtype == 2) &&
                            (isOpvolgscanA || isOpvolgscanB || isEnergiescan || isOpvolgscan)) {
                            enable = true;
                        }
                    }

                    console.log("Akkoordverklaring.GeplaatsteMaterialen.Enable: " + enable);

                    return enable;
                },
                Execute: function (primaryControl) {
                    var _case = Digipolis.Akkoordverklaring.GetCaseEntity(primaryControl);

                    if (_case != null) {
                        var recordId = _case.incidentid;
                        console.log("Akkoordverklaring.GeplaatsteMaterialen.Execute: " + recordId);
                        const clienturl = Xrm.Utility.getGlobalContext().getClientUrl();
                           
                        Xrm.Utility.showProgressIndicator("Akkoordverklaring - Even geduld... het systeem maakt de akkoordverklaring voor de geplaatste materialen aan.");

                        var parameters = {};
                        parameters.templatename = "CA - Akkoordverklaring Geplaatste Materialen";

                        var req = new XMLHttpRequest();
                        req.open("POST", clienturl + "/api/data/v9.1/incidents(" + recordId + ")/Microsoft.Dynamics.CRM.dig_CACreateakkoordverklaring", true);
                        req.setRequestHeader("OData-MaxVersion", "4.0");
                        req.setRequestHeader("OData-Version", "4.0");
                        req.setRequestHeader("Accept", "application/json");
                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req.onreadystatechange = function () {
                            if (this.readyState === 4) {
                                req.onreadystatechange = null;
                                if (this.status === 200) {
                                    var results = JSON.parse(this.response);
                                    console.log("Akkoordverklaring.GeplaatsteMaterialen.Execute: open akkoordverklaring " + results.id);
                                    Xrm.Utility.openEntityForm("dig_akkoordverklaring", results.id, null);
                                } else {
                                    console.log("ERROR Akkoordverklaring.GeplaatsteMaterialen.Execute: " + this.statusText);
                                }
                                Xrm.Utility.closeProgressIndicator();
                            }
                        };
                        req.send(JSON.stringify(parameters));
                    }
                }
            },
            Plaatsbezoek: {
                Enable: function (primaryControl) {
                    var enable = false;
                    var _case = Digipolis.Akkoordverklaring.GetCaseEntity(primaryControl);

                    if (_case != null) {
                        var formtype = primaryControl.ui.getFormType();
                        var type = _case["casetypecode"];
                        var statecode = _case["statecode"];

                        var isOpvolgscanA = (type == 38);
                        var isOpvolgscan = (type == 37);
                        var isOpvolgscanB = (type == 46);
                        var isEnergiescan = (type == 35);

                        // TB of OZ EN editable
                        if ((statecode == 0) && (formtype == 2) &&
                            (isOpvolgscanA || isOpvolgscanB || isEnergiescan || isOpvolgscan)) {
                            enable = true;
                        }
                    }

                    console.log("Akkoordverklaring.Plaatsbezoek.Enable: " + enable);

                    return enable;
                },
                Execute: function (vervolgScan, primaryControl) {
                    var _case = Digipolis.Akkoordverklaring.GetCaseEntity(primaryControl);

                    if (_case != null) {
                        var recordId = _case.incidentid;
                        console.log("Akkoordverklaring.Plaatsbezoek.Execute: " + recordId);
                        const clienturl = Xrm.Utility.getGlobalContext().getClientUrl();
                        
                        Xrm.Utility.showProgressIndicator("Akkoordverklaring - Even geduld... het systeem maakt de akkoordverklaring voor een plaatsbezoek aan.");

                        var parameters = {};
                        parameters.templatename = "CA - Akkoordverklaring Plaatsbezoek";
                        
                        var url = "dig_CACreateakkoordverklaring";
                        if(vervolgScan){
                            
                            url = "dig_CACreateakkoordverklaringopvolgscan";
                        }

                        var req = new XMLHttpRequest();
                        req.open("POST", clienturl + "/api/data/v9.1/incidents(" + recordId + ")/Microsoft.Dynamics.CRM." + url, true);
                        req.setRequestHeader("OData-MaxVersion", "4.0");
                        req.setRequestHeader("OData-Version", "4.0");
                        req.setRequestHeader("Accept", "application/json");
                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req.onreadystatechange = function () {
                            if (this.readyState === 4) {
                                req.onreadystatechange = null;
                                if (this.status === 200) {
                                    var results = JSON.parse(this.response);
                                    console.log("Akkoordverklaring.Plaatsbezoek.Execute: open akkoordverklaring " + results.id);
                                    Xrm.Utility.openEntityForm("dig_akkoordverklaring", results.id, null);
                                } else {
                                    console.log("ERROR Akkoordverklaring.Plaatsbezoek.Execute: " + this.statusText);
                                }
                                Xrm.Utility.closeProgressIndicator();;
                            }
                        };
                        req.send(JSON.stringify(parameters));
                    }
                }
            }
        },
        Akkoordverklaring: {
            Execute: function (primaryControl) {
                var akkoordverklaringId = primaryControl.data.entity.getId().replace(/[{}]/g, '').toLowerCase();
                Xrm.Utility.showProgressIndicator("Document Fluvius Even geduld... het systeem maakt het document aan.");


                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/ccp_parameters?$select=ccp_value&$filter=ccp_name eq 'Sys_Azure_stedontw-crm_proc'", false);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
                            var results = JSON.parse(this.response);
                            for (var i = 0; i < results.value.length; i++) {
                            }
                        } else {
                            Xrm.Utility.alertDialog(this.statusText);
                            Xrm.Utility.closeProgressIndicator();
                        }
                    }
                };
                req.send();
                var templateName = "Akkoordverklaringen";
                // Run Experlogic script

                Digipolis.Experlogix.RunSmartFlow(templateName, akkoordverklaringId)
                .then(() => {
                    //Succes Logic
                    Xrm.Utility.closeProgressIndicator();

                    //init the destination after succesfull
                    var entityType;
                    var entityId;
                   if(primaryControl.getAttribute("dig_scanid").getValue() != null){
                        entityType = primaryControl.getAttribute("dig_scanid").getValue()[0].entityType;
                        entityId = primaryControl.getAttribute("dig_scanid").getValue();
                    }else if (primaryControl.getAttribute("dig_opvolgscanid").getValue() != null){
                        entityType = primaryControl.getAttribute("dig_opvolgscanid").getValue()[0].entityType;
                        entityId = primaryControl.getAttribute("dig_opvolgscanid").getValue();
                    }
                    var entityFormOptions = {};
                    entityFormOptions["entityName"] = entityType;
                    var dig_scanid = entityId;
                    entityFormOptions["entityId"] = dig_scanid[0].id;

                    var parameters = {};
                    Xrm.Navigation.openForm(entityFormOptions, parameters).then(
                        function (success) {
                            console.log(success);
                        },
                        function (error) {
                            console.log(error);
                        }
                    );

                    Xrm.Utility.closeProgressIndicator();
                })
                .catch(error => {
                    console.error("Error in RunSmartFlow:", error);
                })
                .finally(() => {
                    Xrm.Utility.closeProgressIndicator();
                });
            }
        },
    },

    _case: null,
    GetCaseEntity: function (context) {
        var id = null;
        var entityName = context.data.entity.getEntityName();

        if (entityName == "incident") {
            id = context.data.entity.getId().replace('{', '').replace('}', '').toLowerCase();
        } else {
            var dig_caseid = context.getAttribute("dig_caseid").getValue();

            if (dig_caseid != null && dig_caseid.length > 0)
                id = dig_caseid[0].id.replace('{', '').replace('}', '').toLowerCase();
        }

        if (Digipolis.Akkoordverklaring._case == null || (id != null && Digipolis.Akkoordverklaring._case.incidentid != id)) {
            if (id == null) {
                Digipolis.Akkoordverklaring._case = null;
            } else {
                console.log("GetCaseEntity " + id);
                var url = "/api/data/v9.1/incidents(" + id + ")?$select=statecode,casetypecode";
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + url, false);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
                            Digipolis.Akkoordverklaring._case = JSON.parse(this.response);
                        } else {
                            console.log("GetCaseEntity ERROR: " + this.statusText);
                        }
                    }
                };
                req.send();
            }
        }

        return Digipolis.Akkoordverklaring._case;
    }
};