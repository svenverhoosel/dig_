if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

Digipolis.Scan = {
    //*********************************Variables*****************************
    _formInitialized: false,
    _OS2A: 38, // Opvolgscan type 2A -> wordt 1 type renovatiebegeleiding doelgroep
    _OS2B: 39, // Opvolgscan type 2B -> wordt 1 type opvolgscan
    _OS2C: 40, // Opvolgscan type 2C -> wordt 1 type opvolgscan
    _TB: 41, // Trajectbegeleiding

    //*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);

        this.AttachEvents();
        this.LoadForm();
    },

    AttachEvents: function () {
        // Only add events once
        if (this._formInitialized) return;

        CClearPartners.General.Form.AddOnChange("dig_energiefacturenbeschikbaar", Digipolis.Scan.OnChange.EnergiefacturenBeschikbaar);

        this._formInitialized = true;
    },

    //*********************************Functions*****************************

    LoadForm: function () {
        this.OnChange.EnergiefacturenBeschikbaar();
    },

    OnChange: {
        EnergiefacturenBeschikbaar: function () {
            var beschikbaar = CClearPartners.General.Form.GetValue("dig_energiefacturenbeschikbaar");

            CClearPartners.General.Form.SetFieldVisible("dig_energiefacturenredennietbeschikbaar", beschikbaar == 0);
        }
    },

    // used on scan main form -> tab Materiaal
    Grid : {
        RowSelected: function(context) {
            // Grid context
            context.getFormContext().getData().getEntity().attributes.forEach(function (attr) {
                var name = attr.getName();
                if (name === "dig_productid" || name === "dig_totalekost") {
                    attr.controls.forEach(function (c) {
                        c.setDisabled(true);
                    });
                }
            });
        }
    },

    Ribbon: {
        GenereerVerslag: {
            Enable: function (primaryControl) {
                var allok = false;

                var result = Digipolis.Scan.GetCaseEntity(primaryControl);

                if (result != null) {
                    allok = result.statecode == 0;
                }


                console.log("GenereerVerslag.Enable: " + allok);
                return allok;
            },
            Execute: function (primaryControl) {
                console.log("GenereerVerslag.Execute");

                if (Digipolis.Scan._case != null) {
                    const clienturl = Xrm.Utility.getGlobalContext().getClientUrl();
                    Xrm.Utility.showProgressIndicator("Genereer verslag - Even geduld... het systeem maakt het document aan en plaatst het op sharepoint.");
                    var _customerid_value_formatted = Digipolis.Scan._case["_customerid_value@OData.Community.Display.V1.FormattedValue"];
                    var parameters = {};
                    parameters.template = "Energiecentrale Eigenaarsbrief";
                    parameters.filename = "Verslag Renovatieadvies - Energiecentrale - " + _customerid_value_formatted;

                    var url = "/api/data/v9.1/incidents(" + Digipolis.Scan._case.incidentid + ")/Microsoft.Dynamics.CRM.dig_CAgenereerdocument";
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
                                primaryControl.ui.setFormNotification("Het verslag is aangemaakt.", "INFORMATION", "GenereerVerslag");
                                setTimeout(function () {
                                    primaryControl.ui.clearFormNotification("GenereerVerslag");
                                }, 20000);
                            } else {
                                primaryControl.ui.setFormNotification("Er is iets foutgelopen bij het aanmaken van het verslag.", "ERROR", "GenereerVerslag");
                                console.log("GenereerVerslag.Execute ERROR: " + this.statusText);
                            }
                            Xrm.Utility.closeProgressIndicator();
                        }
                    };
                    req.send(JSON.stringify(parameters));
                }
            }
        },
        VerstuurVerslag: {
            Enable: function (primaryControl) {
                var allok = false;

                var result = Digipolis.Scan.GetCaseEntity(primaryControl);

                if (result != null) {
                    var _dig_caseemail_value = result._dig_caseemail_value;
                    var dig_email = result.dig_email;
                    var statecode = result.statecode;

                    if (statecode == 0 && _dig_caseemail_value != null && dig_email != null) {
                        var genereerbenovatieverslag = primaryControl.getAttribute("dig_genereerverslag").getValue();
                        if (genereerbenovatieverslag == true) allok = true;
                    }
                }

                console.log("VerstuurVerslag.Enable: " + allok);
                return allok;
            },
            Execute: function (primaryControl) {
                console.log("VerstuurVerslag.Execute");

                if (Digipolis.Scan._case != null) {
                    var clienturl = Xrm.Utility.getGlobalContext().getClientUrl();
                    Xrm.Utility.showProgressIndicator("Verstuur verslag - Even geduld... het systeem maakt de e-mail aan.");
                    var url = "/api/data/v9.1/incidents(" + Digipolis.Scan._case.incidentid + ")/Microsoft.Dynamics.CRM.dig_CAemaileigenaarsbrief";
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
                                // De e-mail is verstuurd
                                primaryControl.ui.setFormNotification("De e-mail met het verslag is verzonden.", "INFORMATION", "VerstuurVerslag");
                                setTimeout(function () {
                                    primaryControl.ui.clearFormNotification("VerstuurVerslag");
                                }, 20000);
                            } else {
                                console.log("VerstuurVerslag.Execute ERROR: " + this.statusText);
                            }
                            Xrm.Utility.closeProgressIndicator();
                        }
                    };
                    req.send();
                }
            }
        },
        Akkoordverklaring: {
            Execute: function (context) {
                console.log("XDFlowtriggeren.Execute");
                Xrm.Utility.showProgressIndicator("Document Fluvius", "Even geduld... het systeem maakt het document aan.");
                var id = null;
                var dig_caseid = CClearPartners.General.Form.GetValue("dig_caseid");
                id = dig_caseid[0].id.replace('{', '').replace('}', '').toLowerCase();
                var scanId = context.data.entity.getId();

                var parameters = {};
                var entity = {};
                entity.id = scanId;
                entity.entityType = "dig_scan";
                parameters.entity = entity;

                var dig_XDFlowtriggerenRequest = {
                    entity: parameters.entity,

                    getMetadata: function () {
                        return {
                            boundParameter: "entity",
                            parameterTypes: {
                                "entity": {
                                    "typeName": "mscrm.dig_scan",
                                    "structuralProperty": 5
                                }
                            },
                            operationType: 0,
                            operationName: "dig_XDFlowtriggeren"
                        };
                    }
                };

                Xrm.WebApi.online.execute(dig_XDFlowtriggerenRequest).then(
                    function success(result) {
                        if (result.ok) {
                            //Success - No Return Data - Do Something
                        }
                    },
                    function (error) {
                        Xrm.Utility.alertDialog(error.message);
                    }
                );
                Xrm.Utility.closeProgressIndicator();
            }
        },
    },
        _case: null,
        GetCaseEntity: function (context) {
            var id = null;
            var dig_caseid = context.getAttribute("dig_caseid").getValue();

            if (dig_caseid != null && dig_caseid.length > 0)
                id = dig_caseid[0].id.replace('{', '').replace('}', '').toLowerCase();

            if (Digipolis.Scan._case == null || (id != null && Digipolis.Scan._case.incidentid != id)) {
                if (id == null) {
                    Digipolis.Scan._case = null;
                } else {
                    console.log("GetCaseEntity " + id);
                    var url = "/api/data/v9.1/incidents(" + id + ")?$select=statecode,_customerid_value,_dig_caseemail_value,dig_email,casetypecode";
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
                                Digipolis.Scan._case = JSON.parse(this.response);
                            } else {
                                console.log("GetCaseEntity ERROR: " + this.statusText);
                            }
                        }
                    };
                    req.send();
                }
            }

            return Digipolis.Scan._case;
        }
    
};