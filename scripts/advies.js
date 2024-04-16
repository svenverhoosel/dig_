if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

Digipolis.Advies = {
    //*********************************Variables*****************************
    _formInitialized: false,
    _rlambda: [],

    //*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);
        CClearPartners.General.Form.ShowDocumentTab("tab_opstart");
        this.AttachEvents(context);
        this.LoadForm(context);
    },

    AttachEvents: function () {
        // Only add events once
        if (this._formInitialized) return;

        CClearPartners.General.Form.AddOnChange("dig_contactcomeldpuntrumodo", Digipolis.Advies.OnChange.CoMeldpunt);
        CClearPartners.General.Form.AddOnChange("dig_vlaamseenergielening", Digipolis.Advies.OnChange.EnergieleningFieldVisibility);
        CClearPartners.General.Form.AddOnChange("dig_gentseenergielening", Digipolis.Advies.OnChange.EnergieleningFieldVisibility);
        CClearPartners.General.Form.AddOnChange("dig_energielening", Digipolis.Advies.OnChange.EnergieleningFieldVisibility);
        CClearPartners.General.Form.AddOnChange("dig_mijnverbouwlening", Digipolis.Advies.OnChange.EnergieleningFieldVisibility);

        this._formInitialized = true;
    },

    //*********************************Functions*****************************

    LoadForm: function (context) {
        this.OnChange.CoMeldpunt();
        this.OnChange.Type(context);
        this.OnChange.EnergieleningFieldVisibility(context);
    },
    OnChange: {
        Type: function (context) {
            var formContext = CClearPartners.General.Form.GetFormContext();
            //get dig type
            var dig_type = formContext.getAttribute("dig_type").getValue();
            //check the type           
            switch (dig_type) {
                case 1:
                    //bouwadvies
                    CClearPartners.General.Form.SetTabVisible("tab_toelichtingta", false);
                    CClearPartners.General.Form.SetTabVisible("tab_energieleningen", false);
                    CClearPartners.General.Form.SetTabVisible("tab_wooncode", false);
                    //CClearPartners.General.Form.SetFieldVisible("dig_vervolgplanklant", false);
                    //CClearPartners.General.Form.SetFieldVisible("dig_doorverwijzenfarys", false);
                    //CClearPartners.General.Form.SetFieldVisible("dig_samenvattingadvies", false);
                    CClearPartners.General.Form.SetFieldVisible("dig_aandachtspuntenvoorverslagba", true);
                    CClearPartners.General.Form.SetFieldVisible("dig_aandachtspuntenvoorverslagra", false);
                    CClearPartners.General.Form.SetFieldVisible("dig_datumverslagba", true);
                    CClearPartners.General.Form.SetFieldVisible("dig_datumverslagra", false);
                    CClearPartners.General.Form.SetFieldVisible("dig_ambitieklant",true);
                    CClearPartners.General.Form.SetFieldVisible("dig_vervolgplanklant",false);
                    CClearPartners.General.Form.SetTabVisible("tab_renovatieverslagvhp", false);
                    break;
                case 2:
                    //renovatieadvies
                    CClearPartners.General.Form.SetTabVisible("tab_toelichtingta", false);
                    CClearPartners.General.Form.SetTabVisible("tab_energieleningen", false);
                    CClearPartners.General.Form.SetTabVisible("tab_wooncode", false);
                    //formContext.ui.tabs.get("tab_renovatieverslag", false);
                    CClearPartners.General.Form.SetTabVisible("tab_renovatieverslagvhp", false);
                    CClearPartners.General.Form.SetFieldVisible("dig_samenvattingbouwadvies", false);
                    CClearPartners.General.Form.SetFieldVisible("dig_datumverslagra", true);
                    CClearPartners.General.Form.SetFieldVisible("dig_datumverslagba", false);
                    CClearPartners.General.Form.SetFieldVisible("dig_aandachtspuntenvoorverslagra", true);
                    CClearPartners.General.Form.SetFieldVisible("dig_aandachtspuntenvoorverslagba", false);
                    CClearPartners.General.Form.SetFieldVisible("dig_ambitieklant",false);
                    break;
                case 3:
                    //financiëladvies
                    CClearPartners.General.Form.SetTabVisible("tab_toelichtingta",false);
                    CClearPartners.General.Form.SetTabVisible("tab_energieleningen",false);
                    CClearPartners.General.Form.SetTabVisible("tab_veiligheid",false);
                    CClearPartners.General.Form.SetTabVisible("tab_gebouwschil",false);
                    CClearPartners.General.Form.SetTabVisible("tab_technieken",false);
                    CClearPartners.General.Form.SetTabVisible("tab_klimaatadaptatie",false);
                    CClearPartners.General.Form.SetTabVisible("tab_renovatieverslag",false);
                    CClearPartners.General.Form.SetTabVisible("tab_renovatieverslagvhp",false);
                    CClearPartners.General.Form.SetTabVisible("tab_wooncode",false);
                    //formContext.ui.tabs.get("tab_opvolging", false);
                    CClearPartners.General.Form.SetFieldVisible("dig_samenvattingbouwadvies", false);
                    break;
                case 4:
                    //technischadvies
                    CClearPartners.General.Form.SetTabVisible("tab_toelichtingta", true);
                    CClearPartners.General.Form.SetTabVisible("tab_veiligheid", false);
                    CClearPartners.General.Form.SetTabVisible("tab_gebouwschil", false);
                    CClearPartners.General.Form.SetTabVisible("tab_technieken", false);
                    CClearPartners.General.Form.SetTabVisible("tab_klimaatadaptatie", false);
                    CClearPartners.General.Form.SetTabVisible("tab_renovatieverslag", false);
                    CClearPartners.General.Form.SetTabVisible("tab_renovatieverslagvhp", false);
                    CClearPartners.General.Form.SetTabVisible("tab_wooncode", false);
                    //CClearPartners.General.Form.SetTabVisible("tab_opvolging", false);
                    CClearPartners.General.Form.SetFieldVisible("dig_samenvattingbouwadvies", false);
                    break;
                case 6:
                    //RA verhuurderspunt
                    CClearPartners.General.Form.SetTabVisible("tab_wooncode", true);
                    CClearPartners.General.Form.SetTabVisible("tab_toelichtingta", false);
                    CClearPartners.General.Form.SetTabVisible("tab_energieleningen", false);
                    CClearPartners.General.Form.SetTabVisible("tab_veiligheid", false);
                    CClearPartners.General.Form.SetTabVisible("tab_gebouwschil", false);
                    CClearPartners.General.Form.SetTabVisible("tab_technieken", false);
                    CClearPartners.General.Form.SetTabVisible("tab_klimaatadaptatie", false);
                    CClearPartners.General.Form.SetTabVisible("tab_renovatieverslag", false);
                    CClearPartners.General.Form.SetTabVisible("tab_renovatieverslagvhp", true);

                    //CClearPartners.General.Form.SetTabVisible("tab_opvolging", false);
                    CClearPartners.General.Form.SetFieldVisible("dig_samenvattingbouwadvies", false);
                    CClearPartners.General.Form.SetFieldVisible("dig_datumverslagra", true);
                    break;
                default:
                    break;
            }
        },
        CoMeldpunt: function (args) {
            var dig_contactcomeldpuntrumodo = CClearPartners.General.Form.GetValue("dig_contactcomeldpuntrumodo");

            var displaybeschrijving = function () {
                if (dig_contactcomeldpuntrumodo == 1) {
                    CClearPartners.General.Form.SetRequired("dig_beschrijvingcogevaar", true);
                    CClearPartners.General.Form.SetFieldVisible("dig_beschrijvingcogevaar", true);
                } else {
                    CClearPartners.General.Form.SetRequired("dig_beschrijvingcogevaar", false);
                    CClearPartners.General.Form.SetFieldVisible("dig_beschrijvingcogevaar", false);
                }
            };

            if (args != null && dig_contactcomeldpuntrumodo == 1) {
                var resetvalue = function () {
                    CClearPartners.General.Form.SetValue("dig_contactcomeldpuntrumodo", 0);
                };

                var title = "Hebt u bevestiging gevraagd bij de klant?";
                var message = "Klant wil gecontacteerd worden door CO-meldpunt RUMODO 09/2667608 voor CO-gevaar";
                var buttons = [
                    new Alert.Button("Ja", displaybeschrijving, true),
                    new Alert.Button("Nee", resetvalue)
                ];

                Alert.show(title, message, buttons, "QUESTION", 600, 250, Xrm.Utility.getGlobalContext().getClientUrl(), true);
            } else {
                displaybeschrijving();
            }
        },
        EnergieleningFieldVisibility: function (executionContext) {
            
            var vlaamseEnergielening = CClearPartners.General.Form.GetValue("dig_vlaamseenergielening");
            CClearPartners.General.Form.SetFieldVisible("dig_aanvraagdatumvlaamseenergielening",vlaamseEnergielening);
            CClearPartners.General.Form.SetFieldVisible("dig_beslissingvlaamseenergielening",vlaamseEnergielening);
            CClearPartners.General.Form.SetFieldVisible("dig_beslissingsdatumvlaamseenergielening",vlaamseEnergielening);
            CClearPartners.General.Form.SetFieldVisible("dig_goedgekeurdeingrepenvlaamselening",vlaamseEnergielening);
            CClearPartners.General.Form.SetFieldVisible("dig_rentesubsidietoegekendvlaamse",vlaamseEnergielening);                        
            CClearPartners.General.Form.SetFieldVisible("dig_premiefluviusstortenopleningvlaams",vlaamseEnergielening);
            
            var gentseEnergielening = CClearPartners.General.Form.GetValue("dig_gentseenergielening");
            CClearPartners.General.Form.SetFieldVisible("dig_aanvraagdatumgentseenergielening",gentseEnergielening);
            CClearPartners.General.Form.SetFieldVisible("dig_beslissinggensteenergielening",gentseEnergielening);
            CClearPartners.General.Form.SetFieldVisible("dig_beslissingsdatumgentseenergielening",gentseEnergielening);
            CClearPartners.General.Form.SetFieldVisible("dig_goedgekeurdeingrepengentselening",gentseEnergielening);
            CClearPartners.General.Form.SetFieldVisible("dig_rentesubsidietoegekendgentse",gentseEnergielening);
            CClearPartners.General.Form.SetFieldVisible("dig_premiefluviusstortenopgentselening",gentseEnergielening);

            var energieLening = CClearPartners.General.Form.GetValue("dig_energielening");
            CClearPartners.General.Form.SetFieldVisible("dig_aanvraagdatumenergieleningplus",energieLening);
            CClearPartners.General.Form.SetFieldVisible("dig_bbslissingenergielening",energieLening);
            CClearPartners.General.Form.SetFieldVisible("dig_beslissingsdatumenergielening",energieLening);
            CClearPartners.General.Form.SetFieldVisible("dig_goedgekeurdeingrepenenergielening",energieLening);
            CClearPartners.General.Form.SetFieldVisible("dig_rentesubsidietoegekendenergielening",energieLening);
            CClearPartners.General.Form.SetFieldVisible("dig_premiefluviusstortenopenergielening",energieLening);
            
            //Mijn Verbouwlening
            var mijnVerbouwLening = CClearPartners.General.Form.GetValue("dig_mijnverbouwlening");
            CClearPartners.General.Form.SetFieldVisible("dig_aanvraagdatummijnverbouwlening",mijnVerbouwLening);
            CClearPartners.General.Form.SetFieldVisible("dig_beslissingmijnverbouwlening",mijnVerbouwLening);
            CClearPartners.General.Form.SetFieldVisible("dig_beslissingsdatummijnverbouwlening",mijnVerbouwLening);
            CClearPartners.General.Form.SetFieldVisible("dig_goedgekeurdeingrepenmijnverbouwlening2",mijnVerbouwLening);
            CClearPartners.General.Form.SetFieldVisible("dig_premiestortenopmijnverbouwlening",mijnVerbouwLening);           
        }
    },

/*
Genereer Verslag moet bovenstaande xpertdoc smartflow aanroepen en het document in de SharePoint folder van de case plaatsen (idem als bij het andere Verslag VHP).
*/

    Ribbon: {
        GenereerVerslag: {
            Enable: function (primaryControl) {
                return !Digipolis.GeneralCase.IsCaseType(primaryControl, 36);
            },
            Execute: function (primaryControl) {
                var templateName = "";
                var fieldCheck = true;
                var incidentId = primaryControl.getAttribute("dig_caseid").getValue()[0].id.replace(/[{}]/g, '').toLowerCase();
                Digipolis.Advies.Ribbon.CheckCollectief(incidentId, function(checkCollectiefResult) {
                    var isCollectief = checkCollectiefResult[0];
                    var hoedanigheid = checkCollectiefResult[1];

                    var type = primaryControl.getAttribute("dig_type").getValue();
                    if (type == 1) {
                        templateName = "Verslag Bouwadvies";
                    }
                    if (type == 2) {
                        // check collectief
                        if(isCollectief && hoedanigheid == "2f480e1c-9d1b-e811-80d7-005056933a48") {
                            templateName = "Verslag Renovatieadvies Collectief Syndicus";
                        }
                        else if(isCollectief && hoedanigheid != "2f480e1c-9d1b-e811-80d7-005056933a48") {
                            templateName = "Verslag Renovatieadvies Collectief";
                        }
                        else if(!isCollectief) {
                            templateName = "Verslag Renovatieadvies";
                        }
                        else console.log("Error geen template gevonden.");
                        // check fields 
                        var fetchData = {
                            dig_adviesid: primaryControl.data.entity.getId().replace(/[{}]/g,'').toLowerCase()
                        };
                        var fetchXml = [
                        "<fetch>",
                        "  <entity name='dig_wooneenheid'>",
                        "    <attribute name='dig_groottegebouw' />",
                        "    <attribute name='dig_typewoning' />",
                        "    <attribute name='dig_bouwjaarwoning' />",
                        "    <attribute name='dig_typebebouwing' />",
                        "    <link-entity name='incident' from='dig_wooneenheid' to='dig_wooneenheidid' link-type='inner'>",
                        "      <link-entity name='dig_advies' from='dig_caseid' to='incidentid' link-type='inner'>",
                        "        <filter>",
                        "          <condition attribute='dig_adviesid' operator='eq' value='", fetchData.dig_adviesid, "'/>",
                        "        </filter>",
                        "      </link-entity>",
                        "    </link-entity>",
                        "  </entity>",
                        "</fetch>",
                            ].join("");

                        var req = new XMLHttpRequest();
                        req.open("GET", primaryControl.context.getClientUrl() + "/api/data/v9.0/dig_wooneenheids?fetchXml=" + encodeURIComponent(fetchXml) , false);
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
                                    if (results.value.length > 0) {
                                        var errorMessage = "";
                                        var grooteGebouw = results.value[0]["dig_groottegebouw"];
                                        var typeWoning = results.value[0]["dig_typewoning"];
                                        var bouwJaarWoning = results.value[0]["dig_bouwjaarwoning"];
                                        var typeBebouwing = results.value[0]["dig_typebebouwing"];

                                        if(typeWoning != null && typeWoning == 9){
                                            if(bouwJaarWoning == null){
                                                errorMessage = "Bouwjaar is niet ingevuld. Gelieve deze eerst in te vullen op de Wooneenheid";
                                            }
                                        }else if(grooteGebouw == null || typeWoning == null || bouwJaarWoning == null || typeBebouwing == null) {
                                            errorMessage = "Type Wooneenheid of Type Bebouwing of Groote gebouw of Bouwjaar is niet ingevuld. Gelieve deze eerst in te vullen op de Wooneenheid";
                                        }

                                        if(errorMessage != ""){
                                            var alertStrings = { confirmButtonLabel: "OK", text: errorMessage, title: "" };
                                            var alertOptions = { height: 120, width: 260 };
                                            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                                function (success) {
                                                    console.log("Alert dialog closed");
                                                },
                                                function (error) {
                                                    console.log(error.message);
                                                }
                                            );
                                            fieldCheck = false;
                                        }
                                    }
                                } else {
                                    Xrm.Utility.alertDialog(this.statusText);
                                }
                            }
                        };
                        req.send();
                    }
                    if(type == 6){ // Renovatieadvies verhuurderspunt
                        templateName = "Verslag Renovatieadvies Verhuurderspunt";
                    }
                    if(fieldCheck) {
                        Xrm.Utility.showProgressIndicator(templateName + " wordt gemaakt.");
                        var sys_proc_user = "";
                        
                        // get sys_proc_user id
                        var req = new XMLHttpRequest();
                        req.open("GET", primaryControl.context.getClientUrl() + "/api/data/v9.1/ccp_parameters?$select=ccp_value&$filter=ccp_name eq 'Sys_Azure_stedontw-crm_proc'", false);
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
                                    if (results.value.length > 0) {
                                        sys_proc_user = results.value[0]["ccp_value"];
                                    }
                                } else {
                                    Xrm.Utility.alertDialog(this.statusText);
                                }
                            }
                        };
                        req.send();

                        //Run smartflow
                        Digipolis.Experlogix.RunSmartFlow(templateName, incidentId)
                        .then(() => {
                            // Success logic
                            Xrm.Utility.closeProgressIndicator();
                            primaryControl.data.refresh(true).then(() => {
                                primaryControl.ui.tabs.get("tab_documenten").setFocus();
                            }, () => {
                                console.log("An error has happened");
                            });
                        })
                        .catch(error => {
                            console.error("Error in RunSmartFlow:", error);
                            Xrm.Utility.closeProgressIndicator();
                            Xrm.Utility.alertDialog(this.statusText);
                        })
                        .finally(() => {
                             // Logic you want no matter if it is succes of error
                        });
                    }
                });
            }
        },

        VerstuurVerslag: {
            Enable: function (primaryControl) {
            
                return new Promise((resolve, reject) => {
                
                    var allok = false;

                    Digipolis.GeneralCase.GetCaseEntity("dig_caseid").then((result) => {
                        if (result != null) {
                            var _dig_caseemail_value = result["_dig_caseemail_value"];
                            var dig_email = result["dig_email"];
                            var statecode = result["statecode"];
                            var caseTypeCode = result["casetypecode"];

                            if (statecode == 0 && _dig_caseemail_value != null && dig_email != null && (caseTypeCode == 32 || caseTypeCode == 33)) {
                                allok = true;
                            }
                            // Additional processing if needed
                            console.log("VerstuurVerslag.Enable: " + allok);
                            resolve(allok);
                        } else {
                            // Handle the case where result is null
                            reject(false);
                        }
                    }).catch((error) => {
                        // Handle any errors that occurred during the GetCaseEntity call
                        reject(false);
                    });
                });
            },
            EnableVHP: function (primaryControl, hoedanigheid){ 
                var casetypecode = primaryControl.getAttribute("dig_type").getValue();
                return (casetypecode == 6);
            },
            Execute: async function (primaryControl) {
                this.alertDialog("Mail met verslag wordt aangemaakt - verzend hem vanop de Tijdlijn.", "");
                var templateName = "EC - mail verslag renovatieadvies";
                var caseTypeCode = 0;
                var hoedanigheid = "";
                var incidentId = primaryControl.getAttribute("dig_caseid").getValue()[0].id.replace(/[{}]/g, '').toLowerCase();
                var modifiedById = Xrm.Utility.getGlobalContext().userSettings.userId.replace(/[{}]/g, '').toLowerCase();
                var vervolgPlanKlant = primaryControl.getAttribute("dig_vervolgplanklant").getValue();
                // retrieve case with rows
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/incidents(" + incidentId + ")?$select=casetypecode,_dig_hoedanigheid_value", false);
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
                            caseTypeCode = result["casetypecode"];
                            hoedanigheid = result["_dig_hoedanigheid_value@OData.Community.Display.V1.FormattedValue"]; 

                        } else {
                            Xrm.Utility.alertDialog(this.statusText);
                        }
                    }
                };
                req.send();

                if (hoedanigheid != "" && hoedanigheid != undefined) {
                    if (hoedanigheid == "Vereniging") {
                        templateName = "EC - mail verslag renovatieadvies vereniging";
                    }
                }
                if (caseTypeCode == 33) { //Bouwadvies
                    templateName = "EC - mail verslag bouwadvies";
                    primaryControl.getAttribute("dig_datumverslagba").setValue(new Date());
                    primaryControl.getAttribute("dig_datumverslagba").setSubmitMode("always");
                }

                if (caseTypeCode == 32) { // Renovatieadvies
                     await Digipolis.Advies.Ribbon.CheckCollectief(incidentId, function(checkCollectiefResult) {
                         var isCollectief = checkCollectiefResult[0];
                         if(isCollectief) {
                             templateName = "EC - mail verslag renovatieadvies collectief";
                         }
                         else {
                             templateName = "EC - mail verslag renovatieadvies";
                         }
                     });
                    primaryControl.getAttribute("dig_datumverslagra").setValue(new Date());
                    primaryControl.getAttribute("dig_datumverslagra").setSubmitMode("always");
                }
                if(caseTypeCode == 36){ // Renovatieadvies VHP
                    templateName = "EC - mail verslag renovatieadvies verhuurderspunt";
                }
                if(vervolgPlanKlant == 914380001) {
                    templateName = "EC - mail verslag renovatieadvies - ingrijpende energetische renovatie met architect";
                }
                if (hoedanigheid != "" && hoedanigheid != undefined) {
                    if (hoedanigheid == "Verhuurder") {
                        templateName = "EC - mail verslag renovatieadvies verhuurderspunt";
                    }
                }

                // get PA flow endpoint URL
                var flowEndopointUrl = "";
                var queryUrl = "?$select=value&$expand=EnvironmentVariableDefinitionId($select=environmentvariabledefinitionid)&$filter=(EnvironmentVariableDefinitionId/schemaname eq 'dig_AdviesverstuurverslagEndspointUrl')";
                Xrm.WebApi.online.retrieveMultipleRecords("environmentvariablevalue", queryUrl).then(
                    function success(results) {
                        for (var i = 0; i < results.entities.length; i++) {
                            flowEndopointUrl = results.entities[i]["value"];

                            // Call PA
                            var input = JSON.stringify({
                                "caseid": incidentId,
                                "modifyinguserid": modifiedById,
                                "templatename": templateName
                            });
                            var req = new XMLHttpRequest();
                            req.open("POST", flowEndopointUrl, true);
                            req.setRequestHeader('Content-Type', 'application/json');
                            req.send(input);
                        }
                        primaryControl.data.entity.save();
                    },
                    function (error) {
                        Xrm.Utility.alertDialog(error.message);
                    }
                );
            },
            alertDialog: function (text, title) {
                var alertStrings = {
                    confirmButtonLabel: "OK",
                    text: text,
                    title: title
                };
                var alertOptions = {
                    height: 120,
                    width: 260
                };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        console.log("Alert dialog closed");
                    },
                    function (error) {
                        console.log(error.message);
                    }
                );
            }
        },
        
        CheckCollectief: async function(incidentid, callback) {
            let test = await Xrm.WebApi.online.retrieveMultipleRecords("incident", "?$select=dig_iscollectief,_dig_hoedanigheid_value&$filter=incidentid eq " + incidentid).then(
                function success(results) {
                    if(results.entities.length > 0) {
                        var dig_iscollectief = results.entities[0]["dig_iscollectief"];
                        var dig_hoedanigheid = results.entities[0]["_dig_hoedanigheid_value"];
                        var result = new Array(); 
                        result[0] = dig_iscollectief;
                        result[1] = dig_hoedanigheid;
                        callback(result);
                    }
                },
                function(error) {
                    Xrm.Utility.alertDialog(error.message);
                }
            );
        }
    },
};