if (typeof (CClearPartners) == "undefined") {
    CClearPartners = {};
}

if (typeof (CClearPartners.Offerte) == "undefined") {
    CClearPartners.Offerte = {};
}

CClearPartners.Offerte.Form = function () {
    //*******************************Event Handlers**************************
    var formInitialized = false;
    var onLoad = function (context) {
        CClearPartners.General.Form.SetFormContext(context);
        // Init form state
        setDefaults();
        //initCustomLookups();
        setFormState();
        onChange.Verwarming();
        onChange.Sanitair();
        onChange.Dakisolatie();
        onChange.DakvernieuwingHellend();
        onChange.DakvernieuwingPlat();
        onChange.Gevelisolatie();
        onChange.Spouwmuurisolatie();
        onChange.Vloerisolatie();
        onChange.Hoogbouw();
        onChange.Asbest();
        
        // Only add events once
        if (formInitialized) return;
        CClearPartners.Form.General.AddOnChange("dig_techniekenverwarming", onChange.Verwarming);
        CClearPartners.Form.General.AddOnChange("dig_techniekensanitair", onChange.Sanitair);
        CClearPartners.Form.General.AddOnChange("dig_dakisolatie", onChange.Dakisolatie);
        CClearPartners.Form.General.AddOnChange("dig_dakvernieuwinghellend", onChange.DakvernieuwingHellend);
        CClearPartners.Form.General.AddOnChange("dig_dakvernieuwingplat", onChange.DakvernieuwingPlat);
        CClearPartners.Form.General.AddOnChange("dig_gevelisolatie", onChange.Gevelisolatie);
        CClearPartners.Form.General.AddOnChange("dig_spouwmuurisolatie", onChange.Spouwmuurisolatie);
        CClearPartners.Form.General.AddOnChange("dig_vloerisolatie", onChange.Vloerisolatie);
        CClearPartners.Form.General.AddOnChange("dig_anderespecshoogbouw", onChange.Hoogbouw);
        CClearPartners.Form.General.AddOnChange("dig_anderespecsasbest", onChange.Asbest);
        CClearPartners.Form.General.AddOnChange("ccp_nietweerhoudenofferte", onChange.EmailActionAannemer);

        formInitialized = true;
    };

    var onSave = function (context) {
    };

    var onChange = {
        Verwarming: function () {
            var val = CClearPartners.Form.General.GetValue("dig_techniekenverwarming");
            CClearPartners.Form.General.SetSectionVisible("tab_Filter", "section_techniekenverwarming", val);
            // reset values 
            if (!val) {
                CClearPartners.Form.General.SetValue("dig_verwarminggas", false);
                CClearPartners.Form.General.SetValue("dig_verwarmingwarmtepomp", false);
                CClearPartners.Form.General.SetValue("dig_verwarminghybride", false);
                CClearPartners.Form.General.SetValue("dig_verwarmingvloer", false);
                CClearPartners.Form.General.SetValue("dig_verwarmingwand", false);
            }
        },
        Sanitair: function () {
            var val = CClearPartners.Form.General.GetValue("dig_techniekensanitair");
            CClearPartners.Form.General.SetSectionVisible("tab_Filter", "section_techniekensanitair", val);
            // reset values 
            if (!val) {
                CClearPartners.Form.General.SetValue("dig_verwarmingsanitairgas", false);
                CClearPartners.Form.General.SetValue("dig_verwarmingzonneboiler", false);
                CClearPartners.Form.General.SetValue("dig_verwarmingsanitairwarmtepomp", false);
            }
        },
        Dakisolatie: function () {
            var val = CClearPartners.Form.General.GetValue("dig_dakisolatie");
            CClearPartners.Form.General.SetSectionVisible("tab_Filter", "section_DakisolatieDetail", val);
            // reset values 
            if (!val) {
                CClearPartners.Form.General.SetValue("dig_dakisolatiebioecologisch", false);
                CClearPartners.Form.General.SetValue("dig_dakisolatiemineralewol", false);
                CClearPartners.Form.General.SetValue("dig_dakisolatiekunststof", false);
                CClearPartners.Form.General.SetValue("dig_dakisolatieandere", false);
            }
        },
        DakvernieuwingHellend: function () {
            var val = CClearPartners.Form.General.GetValue("dig_dakvernieuwinghellend");
            CClearPartners.Form.General.SetSectionVisible("tab_Filter", "section_DakvernieuwingHellendDetail", val);
            // reset values 
            if (!val) {
                CClearPartners.Form.General.SetValue("dig_dakvernieuwingtraditioneel", false);
                CClearPartners.Form.General.SetValue("dig_dakvernieuwingsarkingmethode", false);
                CClearPartners.Form.General.SetValue("dig_dakvernieuwinguitdikkennaarbuiten", false);
                CClearPartners.Form.General.SetValue("dig_dakvernieuwingplaatsingdakvensters", false);
            }
        },
        DakvernieuwingPlat: function () {
            var val = CClearPartners.Form.General.GetValue("dig_dakvernieuwingplat");
            CClearPartners.Form.General.SetSectionVisible("tab_Filter", "section_DakvernieuwingPlatDetail", val);
            // reset values 
            if (!val) {
                CClearPartners.Form.General.SetValue("dig_dakvernieuwingbioecologisch", false);
                CClearPartners.Form.General.SetValue("dig_dakvernieuwingmineralewol", false);
                CClearPartners.Form.General.SetValue("dig_dakvernieuwingkunststof", false);
                CClearPartners.Form.General.SetValue("dig_dakvernieuwingandere", false);
            }
        },
        Gevelisolatie: function () {
            var val = CClearPartners.Form.General.GetValue("dig_gevelisolatie");
            CClearPartners.Form.General.SetSectionVisible("tab_Filter", "section_Gevelisolatie1", val);
            CClearPartners.Form.General.SetSectionVisible("tab_Filter", "section_Gevelisolatie2", val);
            // reset values 
            if (!val) {
                CClearPartners.Form.General.SetValue("dig_gevelisolatiebioecologisch", false);
                CClearPartners.Form.General.SetValue("dig_gevelisolatiemineralewol", false);
                CClearPartners.Form.General.SetValue("dig_gevelisolatiekunststof", false);
                CClearPartners.Form.General.SetValue("dig_gevelisolatiecrepi", false);
                CClearPartners.Form.General.SetValue("dig_gevelisolatiehout", false);
                CClearPartners.Form.General.SetValue("dig_gevelisolatieandere", false);
            }
        },
        Spouwmuurisolatie: function () {
            var val = CClearPartners.Form.General.GetValue("dig_spouwmuurisolatie");
            CClearPartners.Form.General.SetSectionVisible("tab_Filter", "section_SpouwmuurisolatieDetail", val);
            // reset values 
            if (!val) {
                CClearPartners.Form.General.SetValue("dig_spouwmuurisolatiemineralewol", false);
                CClearPartners.Form.General.SetValue("dig_spouwmuurisolatiekunststof", false);
            }
        },
        Vloerisolatie: function () {
            var val = CClearPartners.Form.General.GetValue("dig_vloerisolatie");
            CClearPartners.Form.General.SetSectionVisible("tab_Filter", "section_VloerisolatieDetail", val);
            // reset values 
            if (!val) {
                CClearPartners.Form.General.SetValue("dig_vloerisolatieisolerendechape", false);
                CClearPartners.Form.General.SetValue("dig_vloerisolatiekunststofplaten", false);
                CClearPartners.Form.General.SetValue("dig_vloerisolatiegespotenkunststof", false);
            }
        },
        Hoogbouw: function () {
            var val = CClearPartners.Form.General.GetValue("dig_anderespecshoogbouw");
            CClearPartners.Form.General.SetSectionVisible("tab_Filter", "section_anderespecshoogbouw", val);
            // reset values 
            if (!val) {
                CClearPartners.Form.General.SetValue("dig_anderespecshoogbouwminimumaantal", null);
            }
        },
        Asbest: function () {
            var val = CClearPartners.Form.General.GetValue("dig_anderespecsasbest");
            CClearPartners.Form.General.SetSectionVisible("tab_Filter", "section_anderespecsasbest", val);
            // reset values 
            if (!val) {
                CClearPartners.Form.General.SetValue("dig_anderespecsasbestgehecht", false);
                CClearPartners.Form.General.SetValue("dig_anderespecsasbestlos", false);
            }
        },
        EmailActionAannemer: function () {
            var nietweerhoudenofferte = CClearPartners.Form.General.GetValue("ccp_nietweerhoudenofferte");
            var formContext = CClearPartners.General.Form.GetFormContext(); 
            if (nietweerhoudenofferte) {
                Alert.show("Email naar aannemer", "Even geduld... het systeem maakt de e-mail aan.", null, "LOADING", 500, 250, Xrm.Utility.getGlobalContext().getClientUrl());
                //call action
                var req = new XMLHttpRequest();
                req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/dig_offertes(" + formContext.data.entity.getId().replace('{', '').replace('}', '') + ")/Microsoft.Dynamics.CRM.dig_OFemailnietweerhoudenofferte", true);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
                            var results = JSON.parse(this.response);
                            //init the destination after succesfull
                            var entityFormOptions = {};
                            entityFormOptions["entityName"] = "email";
                            entityFormOptions["entityId"] = results.emailid;

                            // Open the form.
                            Xrm.Navigation.openForm(entityFormOptions).then(
                                function (success) {
                                    console.log(success);
                                    Alert.hide();
                                },
                                function (error) {
                                    console.log(error);
                                    Alert.hide();
                                });

                        } else {
                            Xrm.Utility.alertDialog(this.statusText);
                        }
                    }
                };
                req.send();
            }
        }

    };

    //****************************Private Functions***************************
    var setDefaults = function () {
        if (CClearPartners.General.Form.GetFormType() == 1) {
            CClearPartners.Form.General.SetValue("dig_datumaanvraag", new Date());
        }
    };

    var setFormState = function (string, find, replace) {
        var hoofdofferte = CClearPartners.Form.General.GetValue("dig_hoofdofferte");

        var isHoofdofferte = (hoofdofferte == null);
        var isActiveHoofdofferte = (isHoofdofferte && CClearPartners.General.Form.GetFormType() == 2);

        CClearPartners.Form.General.SetSectionVisible("tab_General", "section_HoofdOfferte", isHoofdofferte);
        CClearPartners.Form.General.SetSectionVisible("tab_General", "section_OfferteDetail", !isHoofdofferte);
        CClearPartners.Form.General.SetTabVisible("tab_Filter", isHoofdofferte);
        CClearPartners.Form.General.SetTabVisible("tab_aannemers", isHoofdofferte);
        CClearPartners.Form.General.SetTabVisible("tab_offertevraag", isHoofdofferte);
        CClearPartners.Form.General.SetTabVisible("tab_offertesaannemers", isHoofdofferte && !isActiveHoofdofferte);
        CClearPartners.Form.General.SetTabVisible("tab_documenten", true);
    };

    
    return {
        OnLoad: onLoad,
        OnSave: onSave
    };
}();

CClearPartners.Offerte.Ribbon = function () {

    var offerteUitsturen = function (primaryControl) {

        var actionCreateEmail = function () {
            Alert.show("Offertevraag naar klant", "Even geduld... het systeem maakt de e-mail aan.", null, "LOADING", 500, 250, Xrm.Utility.getGlobalContext().getClientUrl());
            var Id = primaryControl.data.entity.getId().replace('{', '').replace('}', '');

            var target = {};
            target.entityType = "dig_offerte";
            target.id = Id;

            var req = {};
            req.entity = target;
            req.getMetadata = function () {
                return {
                    boundParameter: "entity",
                    parameterTypes: {
                        "entity": {
                            typeName: "mscrm.dig_offerte",
                            structuralProperty: 5
                        },
                    },
                    operationType: 0,
                    operationName: "dig_CAemailoffertevoorstelnaarklant"
                };
            };


            Xrm.WebApi.online.execute(req).then(
                function (result) {
                    result.json().then(function (results) {

                        //init the destination after succesfull
                        var entityFormOptions = {};
                        entityFormOptions["entityName"] = "email";
                        entityFormOptions["entityId"] = results.emailid;

                        // Open the form.
                        Xrm.Navigation.openForm(entityFormOptions).then(
                            function (success) {
                                console.log(success);
                            },
                            function (error) {
                                console.log(error);
                            });
                    });
                    Alert.hide();
                },
                function (error) {
                    var errMsg = error.message;
                }
            );
        };

        //getAannemers();
        actionCreateEmail();




    };

    var offertevraagAannemers = function (primaryControl) {
        //get all guids of selected rows and give them to the action
        var selectedRows = primaryControl.getControl("grdAannemers").getGrid().getSelectedRows();
        var getAllRows = primaryControl.getControl("grdAannemers").getGrid().getRows();
        var entityGuidsAannemers = [];
        var notSelectedAannemers = [];

        selectedRows.forEach(function (selectedRow, i) {

            var trimBracketsId = selectedRow.getData().getEntity().getId();
            entityGuidsAannemers.push(trimBracketsId);

        });

        //gets all rows, checks if row is selected
        getAllRows.forEach(function (row, i) {
            //var trimBracketsId = row.getData().getEntity().getId().replace('{', '').replace('}', '');
            var idd = row.getData().getEntity().getId();

            if (entityGuidsAannemers.length != 0 && entityGuidsAannemers.includes(idd) == false) {
                //remove row from grid
                notSelectedAannemers.push(idd);
            }

        });

        var actionOffertevraagAannemer = function (primaryControl) {
            Alert.show("Offertevraag aannemers", "Even geduld...", null, "LOADING", 500, 250, Xrm.Utility.getGlobalContext().getClientUrl());
            var Id = primaryControl.data.entity.getId().replace('{', '').replace('}', '');

            var parameters = {};
            var entity = {};
            entity.id = Id;
            entity.entityType = "dig_offerte";
            parameters.entity = entity;

            //parameters.aannemersid = JSON.stringify(entityGuidsAannemers).replace('[', '').replace(']', '');
            parameters.aannemersid = JSON.stringify(entityGuidsAannemers);
            //parameters.notselectedaannemersid = JSON.stringify(notSelectedAannemers).replace('[', '').replace(']', '');
            //.replace(/['"]+/g, '');
            parameters.notselectedaannemersid = JSON.stringify(notSelectedAannemers);
            parameters.offerteid = Id;

            var dig_OFoffertevraagnaaraannemersRequest = {
                entity: parameters.entity,
                aannemersid: parameters.aannemersid,
                notselectedaannemersid: parameters.notselectedaannemersid,
                offerteid: parameters.offerteid,

                getMetadata: function () {
                    return {
                        boundParameter: "entity",
                        parameterTypes: {
                            "entity": {
                                "typeName": "mscrm.dig_offerte",
                                "structuralProperty": 5
                            },
                            "aannemersid": {
                                "typeName": "Edm.String",
                                "structuralProperty": 1
                            },
                            "notselectedaannemersid": {
                                "typeName": "Edm.String",
                                "structuralProperty": 1
                            },
                            "offerteid": {
                                "typeName": "Edm.String",
                                "structuralProperty": 1
                            }
                        },
                        operationType: 0,
                        operationName: "dig_OFoffertevraagnaaraannemers"
                    };
                }
            };

            Xrm.WebApi.online.execute(dig_OFoffertevraagnaaraannemersRequest).then(
                function success(result) {
                    if (result.ok) {
                        //Success
                        Alert.hide();

                        //TODO navigeren naar bovenliggen case begeleiding naar tab offertes
                        //init the destination after succesfull
                        var entityFormOptions = {};
                        entityFormOptions["entityName"] = "dig_renovatiebegeleiding";
                        var dig_renovatiebegeleidingid = primaryControl.getAttribute("dig_renovatiebegeleidingid").getValue();
                        entityFormOptions["entityId"] = dig_renovatiebegeleidingid[0].id;

                        var parameters = {};
                        parameters["setfocus_tab"] = "tab_offertefase";
                        //context.ui.tabs.get("tab_offertefase").setFocus();
                        console.log(parameters.setfocus_tab);
                        Xrm.Navigation.openForm(entityFormOptions, parameters).then(
                            function (success) {
                                console.log(success);
                            },
                            function (error) {
                                console.log(error);
                            });
                    }
                },
                function (error) {
                    Alert.hide();
                    Xrm.Utility.alertDialog(error.message);
                }
            );

        };
        actionOffertevraagAannemer(primaryControl);
    };

    var setAannemersLijst = function (append, primaryControl) {
        primaryControl.ui.clearFormNotification('setAannemersLijst');

        primaryControl.data.save().then(
            function () {
                var data = {};
                data.Id = primaryControl.data.entity.getId();
                data.Append = append;
                // Create trigger plugin object
                try {
                    var record = {};
                    record.ccp_name = "SetQuoteContracterList"; // Text
                    record.ccp_input = JSON.stringify(data); // Multiline Text


                    var req = new XMLHttpRequest();
                    req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/ccp_triggers", false);
                    req.setRequestHeader("OData-MaxVersion", "4.0");
                    req.setRequestHeader("OData-Version", "4.0");
                    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    req.setRequestHeader("Accept", "application/json");
                    req.setRequestHeader("Prefer", "odata.include-annotations=*");
                    req.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            req.onreadystatechange = null;
                            if (this.status === 204) {
                                var uri = req.getResponseHeader("OData-EntityId");
                                var regExp = /\(([^)]+)\)/;
                                var matches = regExp.exec(uri);
                                var newId = matches[1];
                                console.log(newId);

                                Xrm.WebApi.online.deleteRecord("ccp_trigger", newId.replace('{', '').replace('}', '')).then(
                                    function success(result) {
                                        console.log(result);
                                    },
                                    function (error) {
                                        console.log(error.message);
                                    }
                                );

                                var subgrid = primaryControl.ui.controls.get("grdAannemers");
                                subgrid.refresh();
                                // Select tab Aannemers
                                var formcontext = CClearPartners.General.Form.GetFormContext();
                                var tabObj = formcontext.ui.tabs.get("tab_aannemers");
                                if (tabObj) tabObj.setFocus();


                            } else {
                                console.log(this.responseText);
                            }
                        }
                    };
                    req.send(JSON.stringify(record));
                } catch (error) {
                    if (error) error = error.message.replace('Error : 500: Internal Server Error: ', '');
                    primaryControl.ui.setFormNotification("Er is iets foutgelopen bij het genereren van de aannemers lijst! " + error, "ERROR", "setAannemersLijst");
                }
            },
            function () {
                /* Do Nothing */
            }
        );
    };

    var documentenKopieren = function (primaryControl) {
        var foldernaam = "";
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/ccp_parameters?$select=ccp_value&$filter=ccp_name eq 'Offerte templates foldername'", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Prefer", "odata.include-annotations=*");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                    console.log(results);
                    for (var i = 0; i < results.value.length; i++) {
                        var result = results.value[i];
                        // Columns
                        var ccp_parameterid = result["ccp_parameterid"]; // Guid
                        var ccp_value = result["ccp_value"]; // Text
                        if (results.value.length == null || results.value.length == 0) return;
                        foldernaam = ccp_value;
                    }
                } else {
                    console.log(this.responseText);
                }
            }
        };
        req.send();
        
        var id = primaryControl.data.entity.getId();
        var logicalname = primaryControl.data.entity.getEntityName();


        var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();
        var customParameters = encodeURIComponent("copy=true&id=" + id + "&logicalname=" + logicalname + "&lijstnaam=Templates&foldernaam=" + foldernaam);
        var callback = function () {
            debugger;
            var ctrl = primaryControl.getControl("attachmentsGrid");
            if (ctrl) ctrl.refresh();
        };

        Alert.showWebResource("dig_/getspdocs/index.html?Data=" + customParameters, 700, 500, "Selecteer bestand", null, serverUrl, false, 10);
        
        CClearPartners.Form.General.RegisterAlertCallback("callback", callback);
    };

    var emailOffertevraagAannemer = {
        Enable: function (primaryControl) {
            var allok = false;

            var formtype = primaryControl.ui.getFormType();

            if (formtype == 2) {
                var result = Digipolis.Renovatiebegeleiding.GetCaseEntity();

                if (result != null) {
                    var _dig_caseemail_value = result["_dig_caseemail_value"];
                    var dig_email = result["dig_email"];
                    var statecode = result["statecode"];

                    if (statecode == 0 && _dig_caseemail_value != null && dig_email != null)
                        allok = true;
                }
            }

            console.log("EmailOffertevraagAannemer.Enable: " + allok);
            return allok;
        },
        Execute: function (primaryControl) {
            console.log("EmailOffertevraagAannemer.Execute");
            Alert.show("Offertevraag naar aannemer", "Even geduld... het systeem maakt de e-mail aan.", null, "LOADING", 500, 250, Xrm.Utility.getGlobalContext().getClientUrl());

            var Id = primaryControl.data.entity.getId().replace('{', '').replace('}', '');

            var target = {};
            target.entityType = "dig_offerte";
            target.id = Id;

            var req = {};
            req.entity = target;
            req.getMetadata = function () {
                return {
                    boundParameter: "entity",
                    parameterTypes: {
                        "entity": {
                            typeName: "mscrm.dig_offerte",
                            structuralProperty: 5
                        },
                    },
                    operationType: 0,
                    operationName: "dig_OFemailoffertevraagnaaraannemer"
                };
            };

            Xrm.WebApi.online.execute(req).then(
                function (data) {
                    var e = data;
                },
                function (error) {

                    var errMsg = error.message;
                }
            );

        }
    };
    var nieuweSubofferte = {
        Enable: function (selecteditem) {
            return new Promise(function (resolve, reject) {
                var enable = false;
                Xrm.WebApi.online.retrieveRecord("dig_offerte", selecteditem, "?$select=_dig_hoofdofferte_value").then(
                    function success(result) {
                        var _dig_hoofdofferte_value = result["_dig_hoofdofferte_value"];
                        if (_dig_hoofdofferte_value == null) enable = true;
                        resolve(enable);
                    },
                    function (error) {
                        reject(this.statusText);
                    }
                );
            });
        },
        Execute: function (selecteditem, primaryControl) {
            var entityFormOptions = {};
            entityFormOptions["entityName"] = "dig_offerte";
            entityFormOptions["useQuickCreateForm"] = true;

            // Set default values for the Contact form
            var formParameters = {};
            formParameters["dig_hoofdofferte"] = selecteditem;
            formParameters["dig_hoofdoffertetype"] = "dig_offerte";
            formParameters["dig_renovatiebegeleidingid"] = "{" + primaryControl._entityReference.id.guid.toUpperCase() + "}";
            formParameters["dig_caseid"] = primaryControl.getAttribute("dig_caseid").getValue()[0].id;
            formParameters["dig_renovatiebegeleidingidtype"] = "dig_renovatiebegeleiding";            
            formParameters["dig_emailsuboffertenaannemer"] = false;                     
            
            // Open the form.
            Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
                function (success) {
                    console.log(success);
                },
                function (error) {
                    console.log(error);
                });
        }
    };
    var emailOfferteNietWeerhouden = {
        Enable: function (primaryControl) {
            var allok = false;

            var formtype = primaryControl.ui.getFormType();

            if (formtype == 2) {
                var result = Digipolis.Renovatiebegeleiding.GetCaseEntity();

                if (result != null) {
                    var _dig_caseemail_value = result["_dig_caseemail_value"];
                    var dig_email = result["dig_email"];
                    var statecode = result["statecode"];

                    if (statecode == 0 && _dig_caseemail_value != null && dig_email != null)
                        allok = true;
                }
            }

            console.log("EmailOffertevraagAannemer.Enable: " + allok);
            return allok;
        },
        Execute: function (primaryControl) {
            console.log("EmailOffertevraagAannemer.Execute");

            if (Digipolis.Renovatiebegeleiding._case != null) {
                Alert.show("Offertevraag naar aannemer", "Even geduld... het systeem maakt de e-mail aan.", null, "LOADING", 500, 250, Xrm.Utility.getGlobalContext().getClientUrl());
                var url = "/api/data/v9.1/incidents(" + Digipolis.Renovatiebegeleiding._case.incidentid + ")/Microsoft.Dynamics.CRM.dig_OFemailoffertevraagnaaraannemer";
                var req = new XMLHttpRequest();
                req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + url, true);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
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
                        } else {
                            console.log("EmailOffertevraagAannemer.Execute ERROR: " + this.statusText);
                        }
                        Alert.hide();
                    }
                };
                req.send();
            }
        }
    };

    return {
        OfferteUitsturen: offerteUitsturen,
        OffertevraagAannemers: offertevraagAannemers,
        SetAannemersLijst: setAannemersLijst,
        DocumentenKopieren: documentenKopieren,
        EmailOffertevraagAannemer: emailOffertevraagAannemer,
        EmailOfferteNietWeerhouden: emailOfferteNietWeerhouden,
        NieuweSubofferte: nieuweSubofferte
    };
}();