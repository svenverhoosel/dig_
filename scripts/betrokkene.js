if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

Digipolis.dig_betrokkene = {
    //*********************************Variables*****************************
    //*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);
        this.AttachEvents();
        this.LoadForm();
    },

    AttachEvents: function () {
        CClearPartners.General.Form.AddOnChange("dig_betrokkene", Digipolis.dig_betrokkene.OnChange.Betrokkene);
    },

    //*********************************Functions*****************************

    LoadForm: function () {
    },

    OnChange: {
        Betrokkene: function () {
            var betrokkene = CClearPartners.General.Form.GetValue("dig_betrokkene");
            if (betrokkene !== null && betrokkene.length > 0) {
                var id = betrokkene[0].id.replace('{', '').replace('}', '').toLowerCase();
                var type = betrokkene[0].entityType;
                if (type == "contact") {
                    Xrm.WebApi.online.retrieveRecord("contact", id, "?$select=emailaddress1,mobilephone,telephone1").then(
                        function success(result) {
                            var emailaddress1 = result["emailaddress1"];
                            var mobilephone = result["mobilephone"];
                            var telephone1 = result["telephone1"];
                            if (emailaddress1 !== null && emailaddress1.trim()) CClearPartners.General.Form.SetValue("dig_email", emailaddress1);
                            if (telephone1 !== null && telephone1.trim()) CClearPartners.General.Form.SetValue("dig_telefoon", telephone1);
                            if (mobilephone !== null && mobilephone.trim()) CClearPartners.General.Form.SetValue("dig_gsm", mobilephone);
                        },
                        function (error) {
                            Xrm.Utility.alertDialog(error.message);
                        }
                    );
                }
            }
        }

    },
    Ribbon: {
        VerstuurEmail: {
            Execute: function (objecttype, objectid, selecteditemids) {
                var clienturl = Xrm.Utility.getGlobalContext().getClientUrl();
                Alert.show("E-mail aanmaken", "Even geduld... het systeem maakt de e-mail aan en voegt de geselecteerde betrokkenen toe.", null, "LOADING", 500, 250, clienturl);

                var parameters = {};
                parameters.objecttype = objecttype;
                parameters.objectid = objectid;
                parameters.selecteditemids = selecteditemids.join();

                var req = new XMLHttpRequest();
                req.open("POST", clienturl + "/api/data/v8.2/dig_BEEmailaanmaken", true);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
                            var results = JSON.parse(this.response);
                            console.log("VerstuurEmail.Execute: open email " + results.emailid);
                            Xrm.Utility.openEntityForm("email", results.emailid, null);
                        } else {
                            console.log('ERROR VerstuurEmail.Execute: ' + this.statusText);
                        }
                        Alert.hide();
                    }
                };
                req.send(JSON.stringify(parameters));
            }
        },
        AddNew: {
            Execute: function (control, logicalname, entityid) {
                // First open Contact search; then address search; then quick create
                var title = control.getAttribute("title").getValue();

                var callback = function (id, name, type) {
                    console.log('AddBetrokkene callback: ' + id);
                    if (id != null) {
                        var entityFormOptions = {
                            entityName: "dig_betrokkene",
                            useQuickCreateForm: true
                        };

                        var formParameters = {
                            //dig_betrokkene: "{" + id.toUpperCase() + "}",
                            dig_betrokkene: id.replace('{', '').replace('}', '').toLowerCase(),
                            dig_betrokkenename: name,
                            dig_betrokkenetype: type,
                            dig_caseid: entityid.replace('{', '').replace('}', '').toLowerCase(),
                            dig_caseidname: title,
                            dig_caseidtype: logicalname
                        };

                        var openBetrokkenForm = function (email, tel, gsm, huisnummer) {
                            if (email != null) formParameters.dig_email = email;
                            if (tel != null) formParameters.dig_telefoon = tel;
                            if (gsm != null) formParameters.dig_gsm = gsm;
                            if (huisnummer != null) formParameters.dig_huisnummer = huisnummer;
                            // Open with a small delay (prevent issue with quick create load)
                            setTimeout(function () {
                                console.log('AddBetrokkene open Quick Create');

                                Xrm.Navigation.openForm(entityFormOptions, formParameters).then(function () {
                                    control.ui.controls.get("grdBetrokkenen").refresh();
                                }, function () {
                                    control.ui.controls.get("grdBetrokkenen").refresh();
                                });

                            }, 500);
                        };

                        // Get huisnummer
                        var logicalName;
                        var entityId;
                        var filter;

                        if (type == "contact") {
                            logicalName = "contact";
                            entityId = id.replace('{', '').replace('}', '').toLowerCase();
                            filter = "?$select=emailaddress1,ves_gsmnummernummer,address1_line2,ves_telefoonnummernummers";
                        } else {
                            logicalName = "account";
                            entityId = id.replace('{', '').replace('}', '').toLowerCase();
                            filter = "?$select=emailaddress1,address1_line2,telephone1,telephone2";
                        }


                        Xrm.WebApi.online.retrieveRecord(logicalName, entityId, filter).then(
                            function success(result) {
                                console.log(result);
                                // Columns
                                var email = result["emailaddress1"]; // Text
                                var tel = (result["ves_telefoonnummernummers"] != null) ? result["ves_telefoonnummernummers"] : result["telephone1"];
                                var gsm = (result["ves_gsmnummernummer"] != null) ? result["ves_gsmnummernummer"] : result["telephone2"];
                                var huisnummer = result["address1_line2"];
                                openBetrokkenForm(email, tel, gsm, huisnummer);
                            },
                            function (error) {
                                console.log(error.message);
                                console.log("ERROR in GetHuisnummer" + this.statusText);
                                openBetrokkenForm();
                            }
                        );
                    }
                };

                var clienturl = Xrm.Utility.getGlobalContext().getClientUrl();
                var customParameters = "SearchFor=customer";
                
                //don't allow search in magda
                customParameters += "&allowmagdasearch=0";
                customParameters = encodeURIComponent(customParameters);
                
                var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
                Alert.showWebResource("ves_/zoekklant/zoeken.html?Data=" + customParameters, 1200, height, "Zoek betrokkene", null, clienturl, false, 10);
                CClearPartners.General.Form.RegisterAlertCallback("zoekklantCallback", callback);
            }
        },
        AddViaWooneenheid: {
            Enable: function (control, logicalname, id) {
                var ok = false;

                if (logicalname == "incident" && id != null) {
                    var _case = Digipolis.dig_betrokkene.GetCaseEntity(id);
                    ok = (_case._dig_wooneenheid_value != null);
                }

                console.log('AddViaWooneenheid.Enable: ' + ok);

                return ok;
            },

            Execute: function (control, logicalname, id) {
                var clienturl = Xrm.Utility.getGlobalContext().getClientUrl();
                id = id.replace('{', '').replace('}', '').toLowerCase();

                var _case = Digipolis.dig_betrokkene.GetCaseEntity(id);
                var adres = _case["_dig_wooneenheid_value@OData.Community.Display.V1.FormattedValue"];
                Alert.show("Betrokkenen toevoegen", "Betrokkenen van wooneenheid '" + adres + "' worden toegevoegd...", null, "LOADING", 500, 250, clienturl, true);

                // Call action and refresh...
                var req = new XMLHttpRequest();
                req.open("POST", clienturl + "/api/data/v9.1/incidents(" + id + ")/Microsoft.Dynamics.CRM.dig_CABetrokkenenviawooneenheidtoevoegen", true);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        Alert.hide();
                        if (this.status === 204) {
                            //Success - No Return Data - Refresh grid
                            var grid = control.getControl("grdBetrokkenen");
                            if (grid != null) grid.refresh();
                            else console.log('WARN AddViaWooneenheid.Execute: grdBetrokkenen not available for refresh');
                        } else {
                            console.log('ERROR AddViaWooneenheid.Execute: ' + this.statusText);
                        }
                    }
                };
                req.send();
            }
        },
        AddViaAddress: {
            Enable: function (control, logicalname, id) {
                var ok = true;
                console.log('AddViaAddress.Enable: ' + ok);
                return ok;
            },
            Execute: function (control, logicalname, id) {
                var clientUrl = Xrm.Utility.getGlobalContext().getClientUrl();
                var tasks = [];
                id = id.replace('{', '').replace('}', '').toLowerCase();

                Alert.show("Betrokkenen toevoegen", "De betrokkenen voor de geselecteerde adressen worden toegevoegd...", null, "LOADING", 500, 250, clientUrl, true);

                var createWooneenheid = function (w, callback) {
                    var entity = {
                        dig_straat: w.straat,
                        dig_huisnummer: w.huisnummer,
                        dig_busnummer: w.busnummer,
                        dig_postcode: w.postcode,
                        dig_gemeente: w.gemeente,
                        dig_vestaid: w.id,
                        dig_verdiepinglokaal: null,
                        dig_gebouw: null,
                        dig_crabx: w.ves_crabx,
                        dig_craby: w.ves_craby,
                        dig_grabid: w.id
                    };

                    //Call voor coordinaten van adres
                    var execute_ccp_AddressGetById_Request = {
                        // Parameters
                        AddressId: w.id, // Edm.String

                        getMetadata: function () {
                            return {
                                boundParameter: null,
                                parameterTypes: {
                                    AddressId: { typeName: "Edm.String", structuralProperty: 1 }
                                },
                                operationType: 0, operationName: "ccp_AddressGetById"
                            };
                        }
                    };

                    Xrm.WebApi.execute(execute_ccp_AddressGetById_Request).then(
                        function success(response) {
                            if (response.ok) { return response.json(); }
                        }
                    ).then(function (responseBody) {
                        var result = responseBody;

                        // Return Type: mscrm.ccp_AddressGetByIdResponse
                        // Output Parameters
                        var jsonresult = result["JsonResult"]; // Edm.String
                        let resultJson = JSON.parse(jsonresult);

                        if (resultJson.Coordinates != null) {
                            //Xrm page will be replaced with deprecation project :-$
                            entity.dig_crabx = resultJson.Coordinates[0].toString().replace(".", ",");
                            entity.dig_craby = resultJson.Coordinates[1].toString().replace(".", ",");
                        }
                        
                        var req = new XMLHttpRequest();
                        req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/dig_wooneenheids", true);
                        req.setRequestHeader("OData-MaxVersion", "4.0");
                        req.setRequestHeader("OData-Version", "4.0");
                        req.setRequestHeader("Accept", "application/json");
                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req.onreadystatechange = function () {
                            if (this.readyState === 4) {
                                req.onreadystatechange = null;
                                if (this.status === 204) {
                                    var uri = this.getResponseHeader("OData-EntityId");
                                    var regExp = /\(([^)]+)\)/;
                                    var matches = regExp.exec(uri);
                                    var newEntityId = matches[1];
                                    createBetrokkene(newEntityId, callback);
                                } else {
                                    console.log('ERROR AddViaAddress.Execute createWooneenheid: ' + this.statusText);
                                }
                            }
                        };
                        req.send(JSON.stringify(entity));
                        
                    }).catch(function (error) {
                        console.log(error.message);
                    });	                  
                };

                var createBetrokkene = function (w, callback) {
                    console.log('  AddViaAddress.Execute createBetrokkene for wooneenheid [' + w + ']');

                    var entity = {};
                    entity["dig_caseid@odata.bind"] = "/incidents(" + id + ")";
                    entity["dig_wooneenheidid@odata.bind"] = "/dig_wooneenheids(" + w + ")";

                    var req = new XMLHttpRequest();
                    req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/dig_betrokkenes", true);
                    req.setRequestHeader("OData-MaxVersion", "4.0");
                    req.setRequestHeader("OData-Version", "4.0");
                    req.setRequestHeader("Accept", "application/json");
                    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    req.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            req.onreadystatechange = null;
                            if (this.status === 204) {
                                var uri = this.getResponseHeader("OData-EntityId");
                                var regExp = /\(([^)]+)\)/;
                                var matches = regExp.exec(uri);
                                var newEntityId = matches[1];
                                callback();
                            } else {
                                console.log('ERROR AddViaAddress.Execute createBetrokkene: ' + this.statusText);
                            }
                        }
                    };
                    req.send(JSON.stringify(entity));
                };

                var addFilterToString = function (param, value) {
                    if (value) { return param + " eq '" + value + "'"; }
                    else { return param + " eq null"; }
                };

                var processNewBetrokkene = function (w) {
                    var deferred = $.Deferred();

                    var select = "/api/data/v9.1/dig_wooneenheids?$select=dig_wooneenheidid&$filter=";
                    select += addFilterToString("dig_gemeente", w.gemeente);
                    select += " and " + addFilterToString("dig_huisnummer", w.huisnummer);
                    select += " and " + addFilterToString("dig_postcode", w.postcode);
                    select += " and " + addFilterToString("dig_straat", w.straat);
                    select += " and " + addFilterToString("dig_busnummer", w.busnummer);
        
                    var req = new XMLHttpRequest();
                    req.open("GET", clientUrl + select, true);
                    req.setRequestHeader("OData-MaxVersion", "4.0");
                    req.setRequestHeader("OData-Version", "4.0");
                    req.setRequestHeader("Accept", "application/json");
                    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\",odata.maxpagesize=1");
                    req.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            req.onreadystatechange = null;
                            if (this.status === 200) {
                                var results = JSON.parse(this.response);
                                if (results.value.length > 0) {
                                    // exists
                                    var dig_wooneenheidid = results.value[0]["dig_wooneenheidid"];
                                    createBetrokkene(dig_wooneenheidid, deferred.resolve);
                                } else {
                                    // create
                                    createWooneenheid(w, deferred.resolve);
                                }
                            } else {
                                console.log('ERROR AddViaAddress.Execute processNewBetrokkene: ' + this.statusText);
                            }
                        }
                    };
                    req.send();

                    return deferred.promise();
                };

                var callback = function (selection) {
                    if (!selection) { return; }
                
                    for (var i = 0; i < selection.length; i++) {
                        tasks.push(processNewBetrokkene(selection[i]));
                    }

                    // wait for all tasks
                    console.log('AddViaAddress.Execute wait for #' + tasks.length + ' tasks');
                    $.when.apply($, tasks).then(function () {
                        console.log('AddViaAddress.Execute finished');
                        Alert.hide();
                        var grid = control.getControl("grdBetrokkenen");
                        if (grid != null) grid.refresh();
                    });
                };

                var customParameters = "multiselect=true&postcode=9000";
                var url = "/ccp_/zoekadres/zoeken.html?Data=" + encodeURIComponent(customParameters);

                var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
                Alert.showWebResource(url, 1200, height, "Zoek adres", null, clientUrl, false, 10);

                CClearPartners.General.Form.RegisterAlertCallback("zoekadresCallback", callback);
            }
        },
        CreateCase: {
            _BetrokkeneCases: [],
            Enable: function (control, logicalname, id, selectedids) {
                var ok = false;
                var clientUrl = Xrm.Utility.getGlobalContext().getClientUrl();
                id = id.replace('{', '').replace('}', '').toLowerCase();

                if (selectedids != null && selectedids.length > 0) {
                    for (var i = 0; i < selectedids.length; i++) {
                        var b = selectedids[i];

                        if (Digipolis.dig_betrokkene.Ribbon.CreateCase._BetrokkeneCases[b] == null) {
                            var req = new XMLHttpRequest();
                            req.open("GET", clientUrl + "/api/data/v9.1/dig_betrokkenes(" + b + ")?$select=_dig_childcaseid_value,_dig_wooneenheidid_value,_dig_betrokkene_value", false);
                            req.setRequestHeader("OData-MaxVersion", "4.0");
                            req.setRequestHeader("OData-Version", "4.0");
                            req.setRequestHeader("Accept", "application/json");
                            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                            req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                            req.onreadystatechange = function () {
                                if (this.readyState === 4) {
                                    req.onreadystatechange = null;
                                    if (this.status === 200) {
                                        var result = JSON.parse(this.response);
                                        var _dig_childcaseid_value = result["_dig_childcaseid_value"];
                                        var _dig_wooneenheidid_value = result["_dig_wooneenheidid_value"];
                                        var _dig_betrokkene_value = result["_dig_betrokkene_value"];
                                        var _dig_childcaseid_value_formatted = result["_dig_childcaseid_value@OData.Community.Display.V1.FormattedValue"];
                                        var _dig_childcaseid_value_lookuplogicalname = result["_dig_childcaseid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];

                                        if (_dig_childcaseid_value == null && _dig_betrokkene_value != null)
                                            // No case available: enable
                                            Digipolis.dig_betrokkene.Ribbon.CreateCase._BetrokkeneCases[b] = false;
                                        else
                                            // there is already a case: disable
                                            Digipolis.dig_betrokkene.Ribbon.CreateCase._BetrokkeneCases[b] = result;

                                    } else {
                                        console.log('ERROR CreateCase.Enable: ' + this.statusText);
                                    }
                                }
                            };
                            req.send();
                        }

                        if (Digipolis.dig_betrokkene.Ribbon.CreateCase._BetrokkeneCases[b] == false) {
                            // there is no case id
                            ok = true;
                        }
                    }
                } else if (logicalname == "dig_betrokkene") {
                    var _dig_childcaseid_value = control.getAttribute("dig_childcaseid").getValue();
                    var _dig_betrokkene_value = control.getAttribute("dig_betrokkene").getValue();

                    if (_dig_childcaseid_value == null && _dig_betrokkene_value != null) {
                        // No case available: enable
                        Digipolis.dig_betrokkene.Ribbon.CreateCase._BetrokkeneCases[id] = false;
                        ok = true;
                    } else {
                        // there is already a case: disable
                        Digipolis.dig_betrokkene.Ribbon.CreateCase._BetrokkeneCases[id] = _dig_childcaseid_value;
                    }
                }

                console.log('CreateCase.Enable: ' + ok);
                return ok;
            },
            Execute: function (control, logicalname, id, selectedids, caseType) {
                var clientUrl =Xrm.Utility.getGlobalContext().getClientUrl();
                id = id.replace('{', '').replace('}', '').toLowerCase();

                Alert.show("Betrokkene cases aanmaken", "De cases voor de geselecteerde betrokkenen worden aangemaakt...", null, "LOADING", 500, 250, clientUrl, true);

                var createCase = function (betrokkeneId) {
                    var deferred = $.Deferred();
                    
                    var parameters = {};
                    parameters.CaseType = caseType;
                                     

                    console.log('  CreateCase.Execute [' + betrokkeneId + '] start...');
                    var req = new XMLHttpRequest();
                    req.open("POST", clientUrl + "/api/data/v9.1/dig_betrokkenes(" + betrokkeneId + ")/Microsoft.Dynamics.CRM.dig_BTCreatecase", true);
                    req.setRequestHeader("OData-MaxVersion", "4.0");
                    req.setRequestHeader("OData-Version", "4.0");
                    req.setRequestHeader("Accept", "application/json");
                    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    req.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            //req.onreadystatechange = null;
                            if (this.status === 204) {
                                console.log('  CreateCase.Execute [' + betrokkeneId + '] succeeded');
                                //Success - No Return Data - Do Something
                                deferred.resolve();
                            } else {
                                console.log('ERROR CreateCase.Execute [' + betrokkeneId + ']: ' + this.statusText);
                                deferred.reject(this.statusText);
                            }
                        }
                    };
                    req.send(JSON.stringify(parameters));

                    return deferred.promise();
                };

                if (logicalname == "dig_betrokkene")
                    selectedids = [id];

                var tasks = [];
                for (var i = 0; i < selectedids.length; i++) {
                    var b = selectedids[i];

                    // create if not exists yet (== false)
                    if (Digipolis.dig_betrokkene.Ribbon.CreateCase._BetrokkeneCases[b] == false) {
                        tasks.push(createCase(b));
                    }
                }

                // wait for all tasks
                console.log('CreateCase.Execute wait for #' + tasks.length + ' tasks');
                $.when.apply($, tasks).then(function () {
                    console.log('CreateCase.Execute finished');
                    Alert.hide();
                    var grid = control.getControl("grdBetrokkenen");
                    if (grid != null) grid.refresh();
                    else control.data.entity.refresh();
                });
            }
        }
    },


    CustomLookups: {
        Vesta: function (a) {
            var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();

            var field = a.attributes.LogicalName;
            var account = CClearPartners.General.Form.GetValue(field);
            var entityid = (account == null) ? null : account[0].id;
            var searchfor = "customer";

            var callback = function (id, name, type) {
            
               if (id) {
                    CClearPartners.General.Form.SetLookupValue(field, id, name, type);
                }
            };

            var customParameters = encodeURIComponent("SearchFor=" + searchfor + "&EntityId=" + entityid);
            var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
            Alert.showWebResource("ves_/zoekklant/zoeken.html?Data=" + customParameters, 1200, height, "Zoek betrokkene", null, serverUrl, false, 10);

            CClearPartners.General.Form.RegisterAlertCallback("zoekklantCallback", callback);
        },
    },

    _case: null,
    GetCaseEntity: function (id) {
        id = id.replace('{', '').replace('}', '').toLowerCase();

        if (Digipolis.dig_betrokkene._case == null || (id != null && Digipolis.dig_betrokkene._case.incidentid != id)) {
            if (id == null) {
                Digipolis.dig_betrokkene._case = null;
            } else {
                console.log("GetCaseEntity " + id);
                var url = "/api/data/v9.1/incidents(" + id + ")?$select=_dig_wooneenheid_value";
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
                            Digipolis.dig_betrokkene._case = JSON.parse(this.response);
                        } else {
                            console.log("GetCaseEntity ERROR: " + this.statusText);
                        }
                    }
                };
                req.send();
            }
        }

        return Digipolis.dig_betrokkene._case;
    },
};