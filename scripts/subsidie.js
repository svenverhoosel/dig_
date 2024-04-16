if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

Digipolis.Subsidie = {
    //*********************************Variables*****************************
    _formInitialized: false,

    //*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);

        this.AttachEvents();
        this.LoadForm();
    },

    AttachEvents: function () {
        // Only add events once
        if (this._formInitialized) return;

        CClearPartners.General.Form.AddOnChange("dig_bereel", Digipolis.Subsidie.OnChange.BeReel);
        CClearPartners.General.Form.AddOnChange("dig_benovatiebegeleiding", Digipolis.Subsidie.OnChange.BenovatieBegeleiding);
        CClearPartners.General.Form.AddOnChange("dig_huurenisolatiepremiefluvius", Digipolis.Subsidie.OnChange.HuurEnIsolatiePremie);
        //CClearPartners.General.Form.AddOnChange("dig_investeringsprojectelena", Digipolis.Subsidie.OnChange.Elena);
        //CClearPartners.General.Form.AddOnChange("dig_supernova", Digipolis.Subsidie.OnChange.Supernova);
        CClearPartners.General.Form.AddOnChange("dig_onderhoudverwarmingsinstallatie", Digipolis.Subsidie.OnChange.OnderhoudVerwarmingsinstallatie);
        CClearPartners.General.Form.AddOnChange("dig_mijnverbouwbegeleidingpv", Digipolis.Subsidie.OnChange.MijnVerbouwBegeleidingPV);
        CClearPartners.General.Form.AddOnChange("dig_supra", Digipolis.Subsidie.OnChange.Supra);

        //CClearPartners.General.Form.AddOnChange("dig_veaenergielening", Digipolis.Subsidie.OnChange.VEA);
        CClearPartners.General.Form.AddOnChange("dig_opvolgscantype2abcfluvius", Digipolis.Subsidie.OnChange.Opvolgscan);

        CClearPartners.General.Form.AddOnChange("dig_benovatieprocedureeandisafgesloten", Digipolis.Subsidie.OnChange.BenovatieProcedureEandisAfgesloten);


        CClearPartners.General.Form.AddOnChange("dig_dak", Digipolis.Subsidie.OnChange.Dak);
        CClearPartners.General.Form.AddOnChange("dig_spouwmuur", Digipolis.Subsidie.OnChange.Spouwmuur);
        CClearPartners.General.Form.AddOnChange("dig_ramen", Digipolis.Subsidie.OnChange.Ramen);
        CClearPartners.General.Form.AddOnChange("dig_mvbpvingevulddoorcoach", Digipolis.Subsidie.OnChange.DatumMVBPVIngevuldDoorCoach);

        this._formInitialized = true;
    },

    //*********************************Functions*****************************

    LoadForm: function () {
        // Set external reference
        Xrm.Page.Digipolis = Digipolis;

        this.OnChange.BeReel();
        this.OnChange.BenovatieBegeleiding();
        this.OnChange.HuurEnIsolatiePremie();
        //this.OnChange.Elena();
        //this.OnChange.Supernova();
        this.OnChange.Supra();
        //this.OnChange.VEA();
        this.OnChange.BenovatieProcedureEandisAfgesloten();
        this.OnChange.Opvolgscan();

        this.OnChange.Dak();
        this.OnChange.Spouwmuur();
        this.OnChange.Ramen();
        this.OnChange.MijnVerbouwBegeleidingPV();
        this.OnChange.OnderhoudVerwarmingsinstallatie();
        this.OnChange.DatumMVBPVIngevuldDoorCoach();
    },

    OnChange: {
        BeReel: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_bereel");
            CClearPartners.General.Form.SetTabVisible("tab_bereel", (ischecked == true));
        },
        BenovatieBegeleiding: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_benovatiebegeleiding");
            var isEmptyDate = CClearPartners.General.Form.GetValue("dig_benovatiedatum") == null;
            CClearPartners.General.Form.SetTabVisible("tab_benovatie", (ischecked == true));
             var formContext = CClearPartners.General.Form.GetFormContext();
            if (formContext.getAttribute("dig_benovatiedatum") != null) formContext.getAttribute("dig_benovatiedatum").setRequiredLevel((ischecked == true) ? "required" : "none");

            if (ischecked && isEmptyDate) {
                CClearPartners.General.Form.SetValue("dig_benovatiedatum", new Date());
            }else if(ischecked && isEmptyDate == false){
                CClearPartners.General.Form.SetValue("dig_benovatiedatum", CClearPartners.General.Form.GetValue("dig_benovatiedatum"));
            }else if(ischecked == false){
                CClearPartners.General.Form.SetValue("dig_benovatiedatum", null);
            }

        },
        HuurEnIsolatiePremie: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_huurenisolatiepremiefluvius");
            var iban = CClearPartners.General.Form.GetValue("dig_rekeningnummereigenaar");
            CClearPartners.General.Form.SetTabVisible("tab_huurenisolatiepremie", (ischecked == true));
            if (ischecked == false) {
                CClearPartners.General.Form.SetValue("dig_rekeningnummereigenaar", null);
            }
        },
        /* Elena: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_investeringsprojectelena");
            CClearPartners.General.Form.SetTabVisible("tab_elena", (ischecked == true));
        }, */
        /* Supernova: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_supernova");
            CClearPartners.General.Form.SetTabVisible("tab_supernova", (ischecked == true));
        }, */
        Supra: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_supra");
            CClearPartners.General.Form.SetTabVisible("tab_supra", (ischecked == true));
        },
        OnderhoudVerwarmingsinstallatie: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_onderhoudverwarmingsinstallatie");
            var isEmptyDate = CClearPartners.General.Form.GetValue("dig_datumonderhoudverwarmingsketelaangevinkt") == null;
            CClearPartners.General.Form.SetTabVisible("tab_onderhoudverwarmingsinstallatie", (ischecked == true));


            if (ischecked && isEmptyDate) {
                CClearPartners.General.Form.SetValue("dig_datumonderhoudverwarmingsketelaangevinkt", new Date());
            }
            else if(ischecked == false){
                CClearPartners.General.Form.SetValue("dig_datumonderhoudverwarmingsketelaangevinkt", null);
            }
        },
        MijnVerbouwBegeleidingPV: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_mijnverbouwbegeleidingpv");
            var isEmptyDate = CClearPartners.General.Form.GetValue("dig_datummvbpvaangevinkt") == null;
            CClearPartners.General.Form.SetTabVisible("tab_mijnverbouwbegeleidingpv", (ischecked == true));

            if (ischecked && isEmptyDate) {
                CClearPartners.General.Form.SetValue("dig_datummvbpvaangevinkt", new Date());
            }
            else if(ischecked == false){
                CClearPartners.General.Form.SetValue("dig_datummvbpvaangevinkt", null);
            }
        },
        DatumMVBPVIngevuldDoorCoach: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_mvbpvingevulddoorcoach");
            var isEmptyDate = CClearPartners.General.Form.GetValue("dig_datummvbpvingevulddoorcoach") == null;

            if (ischecked && isEmptyDate) {
                CClearPartners.General.Form.SetValue("dig_datummvbpvingevulddoorcoach", new Date());
            }
            else if(ischecked == false){
                CClearPartners.General.Form.SetValue("dig_datummvbpvingevulddoorcoach", null);
            }
        },
        /* VEA: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_veaenergielening");
            CClearPartners.General.Form.SetTabVisible("tab_os2", (ischecked == true));
        }, */
        OS2: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_os2");
            CClearPartners.General.Form.SetTabVisible("tab_os2", (ischecked == true));
        },
        BenovatieProcedureEandisAfgesloten: function (args) {
            var benovatieprocedureeandisafgesloten = CClearPartners.General.Form.GetValue("dig_benovatieprocedureafgesloten");

            // Set default benovatiedatum
            var dig_benovatiedatumafsluitenprocedure = CClearPartners.General.Form.GetValue("dig_benovatiedatumafsluitenprocedure");
            if (benovatieprocedureeandisafgesloten == true && args != null && dig_benovatiedatumafsluitenprocedure == null)
                CClearPartners.General.Form.SetValue("dig_benovatiedatumafsluitenprocedure", new Date());

            CClearPartners.General.Form.SetFieldVisible("dig_benovatiedatumafsluitenprocedure", (benovatieprocedureeandisafgesloten == true));

        },
        Opvolgscan: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_opvolgscantype2abcfluvius");
            CClearPartners.General.Form.SetTabVisible("tab_opvolgscan2", (ischecked == true));
        },
        Dak: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_dak");
            CClearPartners.General.Form.SetFieldVisible("dig_referentienummerontvangstdak", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_aanvraagdatumfluviusdak", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_geraamdbedragdak", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_aantevragenbegeleidingssubsidiedak", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_datumontvangstpremiedak", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_ontvangenpremiebedragdak", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_datumuitbetalingpremiedak", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_uitbetaaldpremiebedragdak", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_uitbetaaldaandak", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_referentienummerfactuurdak", (ischecked == true));

        },
        Spouwmuur: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_spouwmuur");
            CClearPartners.General.Form.SetFieldVisible("dig_referentienummerontvangstspouwmuur", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_aanvraagdatumfluviusspouwmuur", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_geraamdbedragspouwmuur", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_aantevragenbegeleidingssubsidiespouw", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_datumontvangstpremiespmuur", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_ontvangenpremiebedragspmuur", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_datumuitbetalingpremiespmuur", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_uitbetaaldpremiebedragspmuur", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_uitbetaaldaanspmuur", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_referentienummerfactuurspmuur", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_opmerkingenspmuur", (ischecked == true));

        },
        Ramen: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_ramen");
            CClearPartners.General.Form.SetFieldVisible("dig_referentienummerontvangstramen", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_aanvraagdatumfluviusramen", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_geraamdbedragramen", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_aantevragenbegeleidingssubsidieramen", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_datumontvangstpremieramen", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_ontvangenpremiebedragramen", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_datumuitbetalingpremieramen", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_uitbetaaldpremiebedragramen", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_uitbetaaldaanramen", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_referentienummerfactuurramen", (ischecked == true));
            CClearPartners.General.Form.SetFieldVisible("dig_opmerkingenramen", (ischecked == true));
        }
    },


    Ribbon: {
        GenereerBenovatieverslag: {
            Enable: function () {
                var allok = false;

                var result = Digipolis.Subsidie.GetCaseEntity();

                if (result != null) {
                    var statecode = result["statecode"];

                    if (statecode == 0)
                        allok = true;
                }


                console.log("GenereerBenovatieverslag.Enable: " + allok);
                return allok;
            },
            Execute: function () {
                console.log("GenereerBenovatieverslag.Execute");

                if (Digipolis.Subsidie._case != null) {
                    var clienturl = Xrm.Utility.getGlobalContext().getClientUrl();
                    Alert.show("Genereer BENOvatieverslag", "Even geduld... het systeem maakt het document aan en plaatst het op sharepoint.", null, "LOADING", 500, 250, clienturl);
                    var _customerid_value_formatted = Digipolis.Subsidie._case["_customerid_value@OData.Community.Display.V1.FormattedValue"];
                    var parameters = {};
                    parameters.template = "Energiecentrale verslag BENOvatieadvies";
                    parameters.filename = "Verslag BENOvatiebegeleiding - Energiecentrale - " + _customerid_value_formatted;
                    var url = "/api/data/v9.1/incidents(" + Digipolis.Subsidie._case.incidentid + ")/Microsoft.Dynamics.CRM.dig_CAgenereerdocument";
                    var req = new XMLHttpRequest();
                    req.open("POST", clienturl + url, true);
                    req.setRequestHeader("OData-MaxVersion", "4.0");
                    req.setRequestHeader("OData-Version", "4.0");
                    req.setRequestHeader("Accept", "application/json");
                    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    req.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            var formContext = CClearPartners.General.Form.GetFormContext();
                            req.onreadystatechange = null;
                            if (this.status === 200) {
                                // De e-mail is verstuurd
                                formContext.ui.setFormNotification("Het BENOvatieverslag is aangemaakt.", "INFORMATION", "GenereerBenovatieverslag");
                                setTimeout(function () {
                                    Xrm.Page.ui.clearFormNotification("GenereerBenovatieverslag");
                                }, 20000);
                            } else {
                                formContext.ui.setFormNotification("Er is iets foutgelopen bij het aanmaken van het verslag.", "ERROR", "GenereerBenovatieverslag");
                                console.log("GenereerBenovatieverslag.Execute ERROR: " + this.statusText);
                            }
                            Alert.hide();
                        }
                    };
                    req.send(JSON.stringify(parameters));
                }
            }
        },
        VerstuurBenovatieverslag: {
            Enable: function () {
                var allok = false;

                var result = Digipolis.Subsidie.GetCaseEntity();

                if (result != null) {
                    var _dig_caseemail_value = result["_dig_caseemail_value"];
                    var dig_email = result["dig_email"];
                    var statecode = result["statecode"];

                    if (statecode == 0 && _dig_caseemail_value != null && dig_email != null) {
                        var genereerbenovatieverslag = CClearPartners.General.Form.GetValue("dig_genereerbenovatieverslag");
                        if (genereerbenovatieverslag == true) allok = true;
                    }
                }

                console.log("VerstuurBenovatieverslag.Enable: " + allok);
                return allok;
            },
            Execute: function () {
                console.log("VerstuurBenovatieverslag.Execute");

                if (Digipolis.Subsidie._case != null) {
                    var clienturl = Xrm.Utility.getGlobalContext().getClientUrl();
                    Alert.show("Verstuur BENOvatieverslag", "Even geduld... het systeem maakt de e-mail aan.", null, "LOADING", 500, 250, clienturl);
                    var url = "/api/data/v9.1/incidents(" + Digipolis.Subsidie._case.incidentid + ")/Microsoft.Dynamics.CRM.dig_CAemailbenovatieverslag";
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
                                Xrm.Page.ui.setFormNotification("De e-mail met het BENOvatieverslag is verzonden.", "INFORMATION", "VerstuurBenovatieverslag");
                                setTimeout(function () {
                                    Xrm.Page.ui.clearFormNotification("VerstuurBenovatieverslag");
                                }, 20000);
                            } else {
                                console.log("VerstuurBenovatieverslag.Execute ERROR: " + this.statusText);
                            }
                            Alert.hide();
                        }
                    };
                    req.send();
                }
            }
        }
    },

    _case: null,
    GetCaseEntity: function () {
        var id = null;
        var dig_caseid = CClearPartners.General.Form.GetValue("dig_caseid");

        if (dig_caseid != null && dig_caseid.length > 0)
            id = dig_caseid[0].id.replace('{', '').replace('}', '').toLowerCase();

        if (Digipolis.Subsidie._case == null || (id != null && Digipolis.Subsidie._case.incidentid != id)) {
            if (id == null) {
                Digipolis.Subsidie._case = null;
            } else {
                console.log("GetCaseEntity " + id);
                var url = "/api/data/v9.1/incidents(" + id + ")?$select=statecode,_customerid_value,_dig_caseemail_value,dig_email"
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
                            Digipolis.Subsidie._case = JSON.parse(this.response);
                        } else {
                            console.log("GetCaseEntity ERROR: " + this.statusText);
                        }
                    }
                };
                req.send();
            }
        }

        return Digipolis.Subsidie._case;
    }
}