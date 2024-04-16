// git

if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}
if (typeof (Digipolis.Case) == "undefined") {
    Digipolis.Case = {};
}
var customlookups = {};
Digipolis.Case.Form = function () {
    //*******************************Variables*******************************
    var formInitialized = false;
    var _Reg = 2; // Registratie Wonen (Woonwijzer)
    //var _Dos = 2; // Dossier Wonen
    var _RAW = 3; // Renovatie advies Wonen
    var _LS = 4; // Leegstand Wonen
    var _VP = 5; // Verhuurderspunt
    var _KAG = 6; //KotAtGent
    var _BEL = 7; //Beleid
    var _GKO = 8; //Gent knapt op
    var _RGKO = 10; //Renovatiebegeleiding Gent knapt op
    var _FA = 31; // Financieel advies
    var _RA = 32; // Renovatie advies
    var _RVP = 36; //Renovatie advies verhuurderspunt
    var _BA = 33; // Bouwadvies
    var _KA = 34; // Klein advies
    var _ES = 35; // Energiescan 
    var _WS = 36; // Waterscan
    var _OS1A = 37; // Opvolgscan type 1A
    var _OS2A = 38; // Opvolgscan type 2A -> wordt 1 type renovatiebegeleiding doelgroep
    var _OS2B = 39; // Opvolgscan type 2B -> wordt 1 type opvolgscan
    var _OS2C = 40; // Opvolgscan type 2C -> wordt 1 type opvolgscan
    var _TB = 41; // Trajectbegeleiding/Renovatiebegeleiding
    //var _OZ = 42; // Ontzorging -> obsolete
    var _IA = 44; // Isolatie advies
    var _TA = 45; // Technisch advies leningen
    var _OS1B = 46; // Opvolgscan type 1B
    //*******************************Event Handlers**************************
    var onLoad = function (context) {
        console.log("BEGIN onLoad");
        CClearPartners.General.Form.SetFormContext(context);
        var formContext = context.getFormContext();
        //make sure documents tab is always visible
        var navItem = formContext.ui.navigation.items.get("navSPDocuments");
        if(navItem != null){
            navItem.setFocus();
        }
        var mainTab =  formContext.ui.tabs.get("general");
        mainTab.setFocus();       
        
        // Set external reference
        Xrm.Page.Digipolis = Digipolis;
        // Init form state
        setDefaults(); // Should be executed first
        //customLookups.OnLoad();
        // Only whe Form Type != "Read Only" AND "Disabled"
        var formtype = formContext.ui.getFormType();
        if (formtype != 3 && formtype != 4) {
            filterCaseTypeCode();
            filterKanaal();
            filterHoedanigheid();
            filterDoelgroep();
        }
        onChange.Klant();
        onChange.Hoedanigheid();
        onChange.Origin();
        onChange.WoonEenheid();
        onChange.Type();
        //onChange.DoorverwezenNaar();
        onChange.Taal();
        onChange.Herhuisvesting();
        //onChange.VMEOverleg();
        onChange.CheckNogTeBepalen();
        // Only add events once
        if (formInitialized) return;
        CClearPartners.General.Form.AddOnChange("casetypecode", onChange.Type);
        CClearPartners.General.Form.AddOnChange("dig_aanvaardvoorrenovatiebegeleiding", onChange.Type);
        CClearPartners.General.Form.AddOnChange("dig_vervuildewoonsituatie", onChange.Type);
        CClearPartners.General.Form.AddOnChange("caseorigincode", onChange.Origin);
        CClearPartners.General.Form.AddOnChange("ownerid", onChange.OwnerId);
        CClearPartners.General.Form.AddOnChange("dig_wooneenheid", onChange.WoonEenheid);
        CClearPartners.General.Form.AddOnChange("dig_behandelendedienstid", onChange.BehandelendeDienst);
        CClearPartners.General.Form.AddOnChange("casetypecode", onChange.CheckNogTeBepalen);
        CClearPartners.General.Form.AddOnChange("dig_inkomenscategorie", onChange.PrioritaireDoelgroepEnergielening);
        CClearPartners.General.Form.AddOnChange("dig_hoedanigheid", onChange.Hoedanigheid);
        CClearPartners.General.Form.AddOnChange("dig_eigenaarsbrief", onChange.Eigenaarsbrief);
        CClearPartners.General.Form.AddOnChange("dig_premieberekening", onChange.Premieberekening);
        CClearPartners.General.Form.AddOnChange("customerid", onChange.Klant);
        CClearPartners.General.Form.AddOnChange("dig_communicatietaal", onChange.Taal);
        CClearPartners.General.Form.AddOnChange("dig_inkomenscategorie", onChange.InkomensCategorie);
        CClearPartners.General.Form.AddOnChange("dig_herhuisvesting", onChange.Herhuisvesting);
        CClearPartners.General.Form.AddOnChange("dig_syndicusid", onChange.Syndicus);
        CClearPartners.General.Form.AddOnChange("dig_syndicusbedrijfid", onChange.SyndicusBedrijf);
        CClearPartners.General.Form.AddOnChange("dig_wijkgebondenprojectid", onChange.Wijkgebondenproject);
        CClearPartners.General.Form.AddOnChange("parentcaseid", onChange.ParentCase);
        CClearPartners.General.Form.AddOnChange("dig_iscollectief", onChange.Collectief);
        CClearPartners.General.Form.AddOnChange("dig_subsidieid", onChange.SubEntities);
        CClearPartners.General.Form.AddOnChange("dig_scanid", onChange.SubEntities);
        CClearPartners.General.Form.AddOnChange("dig_opvolgscanid", onChange.SubEntities);
        CClearPartners.General.Form.AddOnChange("dig_adviesid", onChange.SubEntities);
        CClearPartners.General.Form.AddOnChange("dig_klimaatadaptatieid", onChange.SubEntities);
        CClearPartners.General.Form.AddOnChange("dig_renovatiebegeleidingid", onChange.SubEntities);
        CClearPartners.General.Form.AddOnChange("dig_resultaatid", onChange.SubEntities);
        CClearPartners.General.Form.AddOnChange("dig_renovatietrajectid", onChange.SubEntities);
        CClearPartners.General.Form.AddOnChange("dig_huurder", onChange.Huurder);
        CClearPartners.General.Form.AddOnChange("dig_doelgroepmijnverbouwbegeleiding", onChange.DoelgroepMijnverbouwBegeleiding);
        checkAkkoordverklaringOntvangenValue();
        formContext.getAttribute("customerid").setRequiredLevel("none"); // Not possible to set this system field "not required" in the configuration
        setTimeout(function () {
            formContext.getAttribute("customerid").setRequiredLevel("none");
        }, 2000);
        
        formContext.getControl("customerid").setEntityTypes(["contact", "account"]);
        
        formInitialized = true;
        // Collapse tab huisvesting -> when it is collapsed initially, the editable grid doesn't load well
        var tab = formContext.ui.tabs.get("tab_InschrijvingenBijDeSocialeHuisvestingsmaatschappij");
        if (tab) tab.setDisplayState('collapsed');

        function getCustomParam(context) {
            var formcontext = context.getFormContext();
            if (formcontext.context.getQueryStringParameters().setfocus_tab !== null && typeof (formcontext.context.getQueryStringParameters().setfocus_tab) != 'undefined') {
                var setFocusTab = formcontext.context.getQueryStringParameters().setfocus_tab;
                console.log(setFocusTab);
                var tabObj = formcontext.ui.tabs.get(setFocusTab);
                if (tabObj !== null) tabObj.setFocus();
            }
        }
        getCustomParam(context);
        console.log("END onLoad");
    };
    var onSave = function (context) {
    };
    var onChange = {
        SubEntities: function () {
            var hassubsidieid = CClearPartners.General.Form.GetValue("dig_subsidieid") !== null;
            CClearPartners.General.Form.SetTabVisible("tab_subsidies", hassubsidieid);
            var hasscan = CClearPartners.General.Form.GetValue("dig_scanid") !== null;
            CClearPartners.General.Form.SetTabVisible("tab_scan", hasscan);
            var hasopvolgscan = CClearPartners.General.Form.GetValue("dig_opvolgscanid") !== null;
            CClearPartners.General.Form.SetTabVisible("tab_opvolgscan", hasopvolgscan);
            var hasadviesid = CClearPartners.General.Form.GetValue("dig_adviesid") !== null;
            CClearPartners.General.Form.SetTabVisible("tab_advies", hasadviesid);
            var hasklimaatadaptatieid = CClearPartners.General.Form.GetValue("dig_klimaatadaptatieid") !== null;
            CClearPartners.General.Form.SetTabVisible("tab_klimaatadaptatie", hasklimaatadaptatieid);
            var hasrenovatiebegeleidingid = CClearPartners.General.Form.GetValue("dig_renovatiebegeleidingid") !== null;
            CClearPartners.General.Form.SetTabVisible("tab_renovatiebegeleiding", hasrenovatiebegeleidingid);
            var hasresultaatid = CClearPartners.General.Form.GetValue("dig_resultaatid") !== null;
            CClearPartners.General.Form.SetTabVisible("tab_resultaat", hasresultaatid);
            var hasrenovatietrajectid = CClearPartners.General.Form.GetValue("dig_renovatietrajectid") !== null;
            CClearPartners.General.Form.SetTabVisible("tab_renovatietraject", hasrenovatietrajectid);
        },
        Type: function () {
            var type = CClearPartners.General.Form.GetValue("casetypecode");
            var currentForm = getDienst();
            var formtype =  CClearPartners.General.Form.GetFormContext().ui.getFormType();
            var isContactmoment = (type == _Reg); // Default contactmoment -> != dossier
            var isOpvolgscanType1 = (type == _OS1A) || (type == _OS1B);
            var isOpvolgscanType1A = (type == _OS1A);
            var isOpvolgscanType2 = (type == _OS2A) || (type == _OS2B) || (type == _OS2C);
            var isKleinAdvies = (type == _KA);
            var isTechnischAdvies = (type == _TA);
            var isFinancieelAdvies = (type == _FA);
            var isBouwAdvies = (type == _BA);
            var isEnergiescan = (type == _ES);
            var isWaterscan = (type == _WS);
            var isRenovatieadvies = (type == _RA);
            var isRenovatieadviesVerhuurderspunt = (type == _RVP);
            var isRenovatiebegeleiding = (type == _TB);
            var showDoelgroep = ((type == _KA) || (type == _TA) || (type == _ES) || (type == _WS) || isOpvolgscanType1 || isOpvolgscanType2 || isRenovatiebegeleiding);
            var isVerhuurderspunt = (type == _VP);
            var isKotAtGent = (type == _KAG);
            var isGentKnaptOp = (type == _GKO);
            var isRenovatieBegGentKnaptOp = (type == _RGKO);
            var isBeleid = (type == _BEL);
            var isWonen = Digipolis.Case.Form.IsWonen();
            var isEnergie = (!isWonen);
            var showLocatie = (type === _Reg) || (type === _VP) || (type === _KAG) || (type === _BEL) || (type === _GKO) || (type === _RGKO);
            // Set required value for customer
            CClearPartners.General.Form.SetRequired("customerid", !isContactmoment && !isKleinAdvies);

            var vervuildewoonSelected = CClearPartners.General.Form.GetValue("dig_vervuildewoonsituatie");
            CClearPartners.General.Form.SetFieldVisible("dig_studentinternationaal", isKotAtGent);
            CClearPartners.General.Form.SetFieldVisible("dig_aanvaardvoorrenovatiebegeleiding", isGentKnaptOp);
            CClearPartners.General.Form.SetFieldVisible("dig_sociaalonderzoekopgestart", isGentKnaptOp);
            CClearPartners.General.Form.SetFieldVisible("dig_klantvaltafgko", isGentKnaptOp);
            CClearPartners.General.Form.SetFieldVisible("dig_vervuildewoonsituatie", !isVerhuurderspunt);
            CClearPartners.General.Form.SetFieldVisible("dig_aanvraaggeschikheidsonderzoek", !isVerhuurderspunt);
            CClearPartners.General.Form.SetFieldVisible("dig_woonsituatievastgestelddoor", vervuildewoonSelected);
            CClearPartners.General.Form.SetFieldVisible("dig_doelgroep", isWonen);
            CClearPartners.General.Form.SetFieldVisible("dig_kandidaathuurdersociaal", isWonen);
            CClearPartners.General.Form.SetFieldVisible("dig_studentinternationaal", isWonen);
            CClearPartners.General.Form.SetFieldVisible("dig_hoedanigheid", !isWonen);
            CClearPartners.General.Form.SetFieldVisible("dig_inkomenscategorie", !isWonen);
            CClearPartners.General.Form.SetFieldVisible("dig_opmerkingtelefoonnummer", isWonen);
            CClearPartners.General.Form.SetFieldVisible("dig_renovatiejaar", !isWonen);
            CClearPartners.General.Form.SetFieldVisible("dig_renovatiewerken", !isWonen);
            CClearPartners.General.Form.SetFieldVisible("dig_locatie", showLocatie);
            CClearPartners.General.Form.SetFieldVisible("dig_standvanzakeninternenotities", (type >= 30));
            CClearPartners.General.Form.SetFieldVisible("dig_onderwerpka", isKleinAdvies);
            CClearPartners.General.Form.SetFieldVisible("dig_typevraag", type < 30);
            //get dig_aanvaardvoorrenovatiebegeleiding optionset value -> if no, show field doorverwijzing woonwijzer
            if (isGentKnaptOp) {
                var optionValue = CClearPartners.General.Form.GetValue("dig_aanvaardvoorrenovatiebegeleiding");
                if (optionValue === 0) {
                    CClearPartners.General.Form.SetFieldVisible("dig_doorverwijzingwoonwijzer", isGentKnaptOp);
                } else {
                    CClearPartners.General.Form.SetFieldVisible("dig_doorverwijzingwoonwijzer", false);
                }
                CClearPartners.General.Form.SetFieldVisible("dig_leefloon", false);
                CClearPartners.General.Form.SetFieldVisible("dig_huishuur", false);
            }
            // Show/hide sections
            CClearPartners.General.Form.SetSectionVisible("tab_partners", "tab_partners_section_verhuurderspunt", isVerhuurderspunt);
            CClearPartners.General.Form.SetSectionVisible("tab_partners", "tab_partners_section_woonwijzer", isContactmoment || isRenovatieBegGentKnaptOp);
            CClearPartners.General.Form.SetSectionVisible("tab_partners", "tab_partners_section_contactpersoon", isContactmoment || isVerhuurderspunt || isKotAtGent || isRenovatieBegGentKnaptOp);
            CClearPartners.General.Form.SetSectionVisible("tab_wooneenheid", "tab_wooneenheid_section_huurcontract", isContactmoment || isVerhuurderspunt);
            CClearPartners.General.Form.SetSectionVisible("tab_wooneenheid", "tab_wooneenheid_section_verhuurder", isKotAtGent);
            CClearPartners.General.Form.SetSectionVisible("tab_wooneenheid", "general_section_bijzonderheden", getDienst() == "Wonen"); //isContactmoment || isVerhuurderspunt ); 
            CClearPartners.General.Form.SetSectionVisible("tab_wooneenheid", "general_section_woningkwaliteit", getDienst() == "Wonen"); //isVerhuurderspunt  || isContactmoment ); 
            CClearPartners.General.Form.SetSectionVisible("general", "general_section_opvolging", isGentKnaptOp);
            CClearPartners.General.Form.SetSectionVisible("general", "section_afspraak", !isWonen);
            CClearPartners.General.Form.SetSectionVisible("general", "general_Onderwerpen", isWonen);
            CClearPartners.General.Form.SetSectionVisible("tab_wooneenheid", "tab_wooneenheid_section_4", !isWonen);
            CClearPartners.General.Form.SetSectionVisible("tab_wooneenheid", "section_EAN", isGentKnaptOp || getDienst() == "Energie");
            CClearPartners.General.Form.SetSectionVisible("tab_wooneenheid", "tab_wooneenheid_section_epclabel", isRenovatieBegGentKnaptOp || !isWonen || isRenovatiebegeleiding);

            // Show/hide tabs
            onChange.SubEntities();
            CClearPartners.General.Form.SetTabVisible("tab_premies", isTechnischAdvies || isFinancieelAdvies);
            CClearPartners.General.Form.SetTabVisible("tab_gezinstype", isGentKnaptOp || isRenovatieBegGentKnaptOp || isContactmoment);
            CClearPartners.General.Form.SetTabVisible("tab_renovatiewerken", isRenovatieBegGentKnaptOp);
            CClearPartners.General.Form.SetTabVisible("tab_partners", isRenovatieBegGentKnaptOp || isVerhuurderspunt || isContactmoment || isKotAtGent);
            CClearPartners.General.Form.SetTabVisible("tab_inschrijvinghuisvestingsmaatschappij", isContactmoment);
            // Wat doen we met volgende?
            onChange.Collectief();
            onChange.ParentCase();
            onChange.Origin();
            // Also set iccarus field
            onChange.Origin();
            // Show warning when values are empty
            onChange.InkomensCategorie();
            checkWooneenheidValue();
            checkBehandelendeDienstValue();
            checkIfCaseTypeNogTebepalen();
            checkPrioritaireDoelgroepEnergieleningValue();
            setVorigeCase();
        },
        Origin: function () {
            var caseorigincode = CClearPartners.General.Form.GetValue("caseorigincode");
            CClearPartners.General.Form.SetSectionVisible("general", "general_section_onlineafspraken", caseorigincode == "914380004");

            var type = CClearPartners.General.Form.GetValue("casetypecode");
            if (caseorigincode == 914380000 || caseorigincode == 914380002) { // ICCARus || Gent knapt op regulier
                CClearPartners.General.Form.SetFieldVisible("dig_afgevallenomwillevan", true);
                CClearPartners.General.Form.SetFieldVisible("dig_statuswerving", true);
            } else {
                CClearPartners.General.Form.SetFieldVisible("dig_afgevallenomwillevan", false);
                CClearPartners.General.Form.SetFieldVisible("dig_statuswerving", false);
            }
        },
        InkomensCategorie: function () {
            var type = CClearPartners.General.Form.GetValue("casetypecode");
            var isTrajectBegeleiding = (type == 41);
            if (isTrajectBegeleiding) {
                // Show warning when Datum Advies is empty
                var dig_inkomenscategorie = CClearPartners.General.Form.GetValue("dig_inkomenscategorie");
                if (dig_inkomenscategorie === null) {
                     CClearPartners.General.Form.GetFormContext().ui.setFormNotification("Prioritaire doelgroep nog invullen", "WARNING", "dig_inkomenscategorie-empty");
                }
                else  CClearPartners.General.Form.GetFormContext().ui.clearFormNotification("dig_inkomenscategorie-empty");
            }
        },
        OwnerId: function () {
            var owner = CClearPartners.General.Form.GetValue("ownerid");
            if (owner !== null) {
                Xrm.WebApi.online.retrieveRecord("systemuser", owner[0].id.replace('{', '').replace('}', ''), "?$select=_dig_locatie_value").then(
                    function success(result) {
                        console.log(result);
                        // Columns
                        var systemuserid = result["systemuserid"]; // Guid
                        var dig_locatie = result["_dig_locatie_value"]; // Lookup
                        var dig_locatie_formatted = result["_dig_locatie_value@OData.Community.Display.V1.FormattedValue"];
                        var dig_locatie_lookuplogicalname = result["_dig_locatie_value@Microsoft.Dynamics.CRM.lookuplogicalname"];

                        if (result !== null && dig_locatie !== null) {
                            CClearPartners.General.Form.SetLookupValue("dig_locatie", dig_locatie.replace('{', '').replace('}', ''), dig_locatie_formatted, dig_locatie_lookuplogicalname);
                        }
                    },
                    function (error) {
                        console.log(error.message);
                    }
                );
            }
        },
        WoonEenheid: function (args) {
            var dig_wooneenheid = CClearPartners.General.Form.GetValue("dig_wooneenheid");
            CClearPartners.General.Form.SetValue("dig_opmerkingstraat", null);
            CClearPartners.General.Form.SetValue("dig_wijkgebondenprojectid", null);

            if (dig_wooneenheid !== null) {
                CClearPartners.General.Form.SetTabVisible("tab_gerelateerdecases", true);
                var id = dig_wooneenheid[0].id.replace('{', '').replace('}', '');
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/dig_wooneenheids(" + id + ")?$select=_dig_straatid_value,dig_typewoning,dig_aantalappartementen", true);
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
                            var _dig_straatid_value = result["_dig_straatid_value"];
                            var _dig_straatid_value_formatted = result["_dig_straatid_value@OData.Community.Display.V1.FormattedValue"];
                            var _dig_straatid_value_lookuplogicalname = result["_dig_straatid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                            var dig_typewoning = result["dig_typewoning"];
                            var dig_typewoning_formatted = result["dig_typewoning@OData.Community.Display.V1.FormattedValue"];
                            var isAppartement = (dig_typewoning == 10);
                            CClearPartners.General.Form.SetSectionVisible("tab_wooneenheid", "section_appartementsblok", isAppartement);
                            if (isAppartement && args !== null) {
                                var dig_aantalappartementen = result["dig_aantalappartementen"];
                                var dig_aantalwooneenheden = CClearPartners.General.Form.GetValue("dig_aantalwooneenheden");
                                if (dig_aantalwooneenheden === null && dig_aantalappartementen !== null) CClearPartners.General.Form.SetValue("dig_aantalwooneenheden", dig_aantalappartementen);
                            }
                        } else {
                            console.log("onChange.WoonEenheid ERROR: " + this.statusText);
                        }
                    }
                };
                req.send();
            } else {
                CClearPartners.General.Form.SetTabVisible("tab_gerelateerdecases", false);
            }
            setVorigeCase();
            setWijkgebondenProject(args);
            checkWooneenheidValue();
        },
        Hoedanigheid: function () {
            var currentForm = getDienst();
            var formtype =  CClearPartners.General.Form.GetFormContext().ui.getFormType();
            // show eigenaar (only on dienst milieu)
            if (currentForm == "Energie") {
                var hoedanigheid = CClearPartners.General.Form.GetValue("dig_hoedanigheid");
                var isHuurder = ((hoedanigheid !== null) && (hoedanigheid[0].name == "Huurder"));
                var isVerhuurder = ((hoedanigheid !== null) && (hoedanigheid[0].name == "Verhuurder"));
                var isContactpersoon = ((hoedanigheid !== null) && (hoedanigheid[0].name == "Contactpersoon collectief woongebouw"));
                CClearPartners.General.Form.SetFieldVisible("dig_emailadreseigenaar", isHuurder);
                CClearPartners.General.Form.SetFieldVisible("dig_telefooneigenaar", isHuurder);
                CClearPartners.General.Form.SetFieldVisible("dig_betrokkenetelefoon", isVerhuurder || isContactpersoon);
                CClearPartners.General.Form.SetFieldVisible("dig_betrokkenegsm", isHuurder || isVerhuurder || isContactpersoon);
                CClearPartners.General.Form.SetFieldVisible("dig_betrokkeneemail", isVerhuurder || isContactpersoon);
                // Clear values if not relevant
                if (!isHuurder) {
                    CClearPartners.General.Form.SetValue("dig_emailadreseigenaar", null);
                    CClearPartners.General.Form.SetValue("dig_telefooneigenaar", null);
                }
                if (!(isVerhuurder || isContactpersoon)) {
                    CClearPartners.General.Form.SetValue("dig_betrokkenetelefoon", null);
                    CClearPartners.General.Form.SetValue("dig_betrokkeneemail", null);
                }
                if (!(isHuurder || isVerhuurder || isContactpersoon)) {
                    CClearPartners.General.Form.SetValue("dig_betrokkenegsm", null);
                }
                // Set web resource disabled (setvisible doesn't work as expected on webresource)
                CClearPartners.General.Form.SetFieldVisible("dig_eigenaar", isHuurder);
                CClearPartners.General.Form.SetFieldVisible("dig_huurder", isVerhuurder);
                CClearPartners.General.Form.SetFieldVisible("dig_syndicusid", isContactpersoon);
                CClearPartners.General.Form.SetFieldVisible("dig_syndicusbedrijfid", isContactpersoon);

                if (!isHuurder) {
                    // Clear value when != huurder
                    if (formtype != 3 && formtype != 4) CClearPartners.General.Form.SetValue("dig_eigenaar", null);
                }
                if (!isVerhuurder) {
                    // Clear value when != verhuurder
                    if (formtype != 3 && formtype != 4) CClearPartners.General.Form.SetValue("dig_huurder", null);
                }
                if (!isContactpersoon) {
                    // Clear value when != verhuurder
                    if (formtype != 3 && formtype != 4) CClearPartners.General.Form.SetValue("dig_syndicusid", null);
                }
                // Hide betrokkene if none are editable/visible
                CClearPartners.General.Form.SetSectionVisible("general", "general_section_betrokkene", isHuurder || isVerhuurder || isContactpersoon);             
                
            }
        },
        BehandelendeDienst: function () {
            checkBehandelendeDienstValue();
        },
        CheckNogTeBepalen: function () {
            console.log("You're in CheckNogTeBepalen");
            checkIfCaseTypeNogTebepalen();
        },
        PrioritaireDoelgroepEnergielening: function () {
            checkPrioritaireDoelgroepEnergieleningValue();
        },
        Eigenaarsbrief: function () {
            var currentForm = getDienst();
            var formContext = CClearPartners.General.Form.GetFormContext();
            if (currentForm == "Energie" && formContext.getAttribute("dig_eigenaarsbrief").getIsDirty() && CClearPartners.General.Form.GetValue("dig_eigenaarsbrief")) {
                var value = window.confirm("Hebt u de toestemming om de eigenaar te contacteren?");
                if (value === false) {
                     CClearPartners.General.Form.SetValue("dig_eigenaarsbrief", false);
                }
            }
        },
        Premieberekening: function () {
            var formContext = CClearPartners.General.Form.GetFormContext();
            if (formContext.getAttribute("dig_premieberekening") !== null) {
                if (CClearPartners.General.Form.GetValue("dig_premieberekening") === true && CClearPartners.General.Form.GetFormContext().ui.tabs.get("tab_Documenten") !== null && CClearPartners.General.Form.GetFormContext().ui.tabs.get("tab_Documenten").getDisplayState() == "expanded") {
                     CClearPartners.General.Form.GetFormContext().ui.tabs.get("tab_Documenten").setDisplayState("collapsed");
                }
            }
        },
        Klant: function (args) {
            var formContext = CClearPartners.General.Form.GetFormContext();
            if (formContext.getAttribute("customerid") !== null) {
                var onchange = (args !== null);
                if (onchange) {
                    CClearPartners.General.Form.SetValue("dig_customeraccountid", null);
                    CClearPartners.General.Form.SetValue("dig_customercontactid", null);
                }
                var customer = CClearPartners.General.Form.GetValue("customerid");
                if (customer !== null) {
                    var id = customer[0].id.replace('{', '').replace('}', '').toLowerCase();
                    var type = customer[0].entityType;
                    if (type == "contact") {
                        var select = "address1_city,address1_line1,address1_line2,address1_line3,address1_postalcode,emailaddress1,mobilephone,telephone1,dig_waarschuwing,dig_waarschuwingweergeven";
                        var req = new XMLHttpRequest();
                        req.open("GET",Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/contacts(" + id + ")?$select=" + select, true);
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
                                    var address1_city = result["address1_city"];
                                    var address1_line1 = result["address1_line1"];
                                    var address1_line2 = result["address1_line2"];
                                    var address1_line3 = result["address1_line3"];
                                    var address1_postalcode = result["address1_postalcode"];
                                    var emailaddress1 = result["emailaddress1"];
                                    var mobilephone = result["mobilephone"];
                                    var dig_gsm = CClearPartners.General.Form.GetValue("dig_gsm");
                                    var telephone1 = result["telephone1"];
                                    var dig_telefoon = CClearPartners.General.Form.GetValue("dig_telefoon");
                                    var dig_waarschuwing = result["dig_waarschuwing"];
                                    var dig_waarschuwingweergeven = result["dig_waarschuwingweergeven"];
                                    if (onchange) {
                                        if (emailaddress1 !== null && emailaddress1.trim()) CClearPartners.General.Form.SetValue("dig_email", emailaddress1);
                                        if (telephone1 !== null && telephone1.trim() && dig_telefoon == null) CClearPartners.General.Form.SetValue("dig_telefoon", telephone1);
                                        if (mobilephone !== null && mobilephone.trim() && dig_gsm == null) CClearPartners.General.Form.SetValue("dig_gsm", mobilephone);
                                        // Try get wooneenheid
                                        setWooneenheid(address1_line1, address1_line2, address1_line3, address1_postalcode, address1_city);
                                    }

                                    var WebResource_waarschuwingklant =  CClearPartners.General.Form.GetFormContext().ui.controls.get("WebResource_waarschuwingklant");
                                    if (Digipolis.Case.Form.IsWonen() && dig_waarschuwingweergeven === true && dig_waarschuwing !== null && dig_waarschuwing !== "" && WebResource_waarschuwingklant !== null) {
                                        // Show warning section + text
                                        var src = WebResource_waarschuwingklant.getSrc();
                                        if (src.toLowerCase().indexOf("?data=") < 0) src = src + "&data=" + encodeURIComponent("WAARSCHUWING: " + dig_waarschuwing);
                                        else src = src.substring(0, src.toLowerCase().indexOf("?data=")) + "?data=" + encodeURIComponent("WAARSCHUWING: " + dig_waarschuwing);
                                        WebResource_waarschuwingklant.setSrc(null);
                                        WebResource_waarschuwingklant.setSrc(src);
                                        CClearPartners.General.Form.SetSectionVisible("general", "section_waarschuwingklant", true);
                                    } else {
                                        CClearPartners.General.Form.SetSectionVisible("general", "section_waarschuwingklant", false);
                                    }
                                } else {
                                    console.log("OnChange.Klant ERROR: " + this.statusText);
                                }
                            }
                        };
                        req.send();
                    } else if (type == "account") {}
                }
            }
        },
        Taal: function () {
            var formContext = CClearPartners.General.Form.GetFormContext();
            var taal = CClearPartners.General.Form.GetValue("dig_communicatietaal");
            // Search control with visible parent
            var anderetaal = formContext.getAttribute("dig_anderetaal");
            if (anderetaal !== null) {
                var controls = anderetaal.controls;
                controls.forEach(

                    function (ctrl) {
                        // check if parent section and parent tab is visible
                        var section = ctrl.getParent();
                        if (section !== null && section.getVisible()) {
                            var tab = section.getParent();
                            if (tab !== null && tab.getVisible()) ctrl.setVisible(taal == 5);
                        }
                    });
            }
        },
        Huurder: function () {
            var huurder = CClearPartners.General.Form.GetValue("dig_huurder");
            if (huurder !== null && huurder.length > 0) {
                var id = huurder[0].id.replace('{', '').replace('}', '').toLowerCase();
                var type = huurder[0].entityType;
                if (type == "contact") {
                    Xrm.WebApi.online.retrieveRecord("contact", id, "?$select=emailaddress1,mobilephone,telephone1").then(
                        function success(result) {
                            var emailaddress1 = result["emailaddress1"];
                            var mobilephone = result["mobilephone"];
                            var telephone1 = result["telephone1"];
                            if (emailaddress1 !== null && emailaddress1.trim()) CClearPartners.General.Form.SetValue("dig_betrokkeneemail", emailaddress1);
                            if (telephone1 !== null && telephone1.trim()) CClearPartners.General.Form.SetValue("dig_betrokkenetelefoon", telephone1);
                            if (mobilephone !== null && mobilephone.trim()) CClearPartners.General.Form.SetValue("dig_betrokkenegsm", mobilephone);
                        },
                        function (error) {
                            Xrm.Utility.alertDialog(error.message);
                        }
                    );
                }
            }
        },
        DoelgroepMijnverbouwBegeleiding: function () {
            var doelgroep = CClearPartners.General.Form.GetValue("dig_doelgroepmijnverbouwbegeleiding");
            var inkomstenCategorie = CClearPartners.General.Form.GetValue("dig_inkomenscategorie");

            if(doelgroep == null) 
            {
                CClearPartners.General.Form.SetValue("dig_inkomenscategorie", null);
            }else if(doelgroep == 914380000){ // == 1
                CClearPartners.General.Form.SetValue("dig_inkomenscategorie", 100000002);
            }else{
                CClearPartners.General.Form.SetValue("dig_inkomenscategorie", 100000001);
            }
        },
        Herhuisvesting: function () {
            var isAndere = false;
            var dig_herhuisvesting = CClearPartners.General.Form.GetValue("dig_herhuisvesting");
            if (dig_herhuisvesting !== undefined && dig_herhuisvesting !== null && dig_herhuisvesting.toString().endsWith("99")) isAndere = true;
            CClearPartners.General.Form.SetFieldVisible("dig_herhuisvestingextra", isAndere);
        },
        Syndicus: function () {
            var dig_syndicusid = CClearPartners.General.Form.GetValue("dig_syndicusid");
            if (dig_syndicusid === null || dig_syndicusid.length === 0) {
                // Clear bedrijf
                CClearPartners.General.Form.SetValue("dig_syndicusbedrijfid", null);
            } else if (dig_syndicusid[0].typename == "contact") {

                Xrm.WebApi.online.retrieveRecord("contact", dig_syndicusid[0].id.replace('{', '').replace('}', '').toLowerCase(), "?$select=_parentcustomerid_value").then(
                    function success(result) {
                        console.log(result);
                        // Columns
                        var contactid = result["contactid"]; // Guid
                        var parentcustomerid = result["_parentcustomerid_value"]; // Customer
                        var parentcustomerid_formatted = result["_parentcustomerid_value@OData.Community.Display.V1.FormattedValue"];
                        var parentcustomerid_lookuplogicalname = result["_parentcustomerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];

                        if (result !== null && parentcustomerid !== null && parentcustomerid_lookuplogicalname == "account") {
                            CClearPartners.General.Form.SetLookupValue("dig_syndicusbedrijfid", parentcustomerid, parentcustomerid_formatted, parentcustomerid_lookuplogicalname);
                        } else {
                            CClearPartners.General.Form.SetValue("dig_syndicusbedrijfid", null);
                        }
                    },
                    function (error) {
                        console.log(error.message);
                    }
                );
            } else if (dig_syndicusid[0].typename == "account") {
                CClearPartners.General.Form.SetLookupValue("dig_syndicusbedrijfid", dig_syndicusid.Id, dig_syndicusid.Name, dig_syndicusid.LogicalName);
            }
        },
        SyndicusBedrijf: function () {
            var dig_syndicusbedrijfid = CClearPartners.General.Form.GetValue("dig_syndicusbedrijfid");
        },
        Wijkgebondenproject: function () {
            var WebResource_straatopmerkingen =  CClearPartners.General.Form.GetFormContext().ui.controls.get("WebResource_opmerking1");
            if (WebResource_straatopmerkingen !== null) {
                var src = WebResource_straatopmerkingen.getSrc();
                WebResource_straatopmerkingen.setSrc(null);
                WebResource_straatopmerkingen.setSrc(src);
            }
            var WebResource_straatopmerkingen2 =  CClearPartners.General.Form.GetFormContext().ui.controls.get("WebResource_opmerking2");
            if (WebResource_straatopmerkingen2 !== null) {
                var src = WebResource_straatopmerkingen2.getSrc();
                WebResource_straatopmerkingen2.setSrc(null);
                WebResource_straatopmerkingen2.setSrc(src);
            }
        },

        ParentCase: function (args) {
            var type = CClearPartners.General.Form.GetValue("casetypecode");
            var collectief = (type == _TB || type == _RA || type == _KA || type == _RVP);
            var parentcaseid = CClearPartners.General.Form.GetValue("parentcaseid");
            var hasparentcaseid = parentcaseid !== null && parentcaseid.length > 0;
            CClearPartners.General.Form.SetFieldVisible("dig_iscollectief", collectief && !hasparentcaseid);
        },
        Collectief: function (args) {
            var type = CClearPartners.General.Form.GetValue("casetypecode");
            var collectief = (type == _TB || type == _RA || type == _RVP);
            var dig_iscollectief = (CClearPartners.General.Form.GetValue("dig_iscollectief") === true);
            CClearPartners.General.Form.SetFieldVisible("parentcaseid", collectief && !dig_iscollectief);
            CClearPartners.General.Form.SetTabVisible("tab_betrokkenen", dig_iscollectief);
        },
    };
    var grid = {
        AddBetrokkene: function () {
            console.log('BEGIN - AddBetrokkene');
            var callback = function (id, name, type) {
                console.log('AddBetrokkene callback: ' + id);
                if (id !== null) {
                    var parameters = {
                        dig_betrokkene: "{" + id.toUpperCase() + "}",
                        dig_betrokkenename: name,
                        dig_betrokkeneidtype: type
                    };
                    var openBetrokkenForm = function (email, tel, gsm, huisnummer) {
                        if (email !== null) parameters.dig_email = email;
                        if (tel !== null) parameters.dig_telefoon = tel;
                        if (gsm !== null) parameters.dig_gsm = gsm;
                        if (huisnummer !== null) parameters.dig_huisnummer = huisnummer;
                        // Open with a small delay (prevent issue with quick create load)
                        setTimeout(function () {
                            console.log('AddBetrokkene open Quick Create');
                            OpenQuickCreate("dig_betrokkene", parameters, function () {
                                 CClearPartners.General.Form.GetFormContext().ui.controls.get("grdBetrokkenen").refresh();
                            });
                        }, 500);
                    };
                    // Get huisnummer
                    var url;
                    if (type == "contact") url = "contact", id.replace('{', '').replace('}', '').toLowerCase(), "?$select=address1_line2,emailaddress1,ves_gsmnummernummer,ves_telefoonnummernummers";
                    else url = "account", id.replace('{', '').replace('}', '').toLowerCase(), "?$select=Address1_Line2,EMailAddress1,Telephone1,Telephone2";

                    Xrm.WebApi.online.retrieveRecord(url).then(
                        function success(result) {
                            var huisnummer = result["address1_line2"];
                            var email = result["emailaddress1"];
                            var gsm = (result["ves_gsmnummernummer"] !== null) ? result["ves_gsmnummernummer"] : result["telephone2"];
                            var tel = (result["ves_telefoonnummernummers"] !== null) ? result["ves_telefoonnummernummers"] : result["telephone1"];
                            openBetrokkenForm(email, tel, gsm, huisnummer);
                        },
                        function (error) {
                            Xrm.Utility.alertDialog(error.message);
                        }
                    );
                }
            };
            var serverUrl =Xrm.Utility.getGlobalContext().getClientUrl();
            var customParameters = encodeURIComponent("SearchFor=customer");
            var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
            Alert.showWebResource("ves_/zoekklant/zoeken.html?Data=" + customParameters, 1200, height, "Zoek betrokkene", null, serverUrl, false, 10);
            CClearPartners.General.Form.RegisterAlertCallback("zoekklantCallback", callback);
            console.log('END - AddBetrokkene');
        },
    };
    //****************************Private Functions***************************   
    var isWonen = function () {
        var type = CClearPartners.General.Form.GetValue("casetypecode");
        return (type == _Reg || type == _RAW || type == _LS || type == _VP || type == _KAG || type == _BEL || type == _GKO || type == _RGKO);
    };
    var onRecordSelect = function (context) {
        CClearPartners.General.Form.SetFormContext(context);
        var _formContext = context.getFormContext();
        var disableFields = ["dig_organisatiemanueel"];
        lockFields(context, disableFields);
    };
    var onBetrokkeneSelect = function (context) {
        CClearPartners.General.Form.SetFormContext(context);
        var _formContext = context.getFormContext();
        var disableFields = ["dig_wooneenheidid", "dig_childcaseid"];
        lockFields(context, disableFields);
    };
    var lockFields = function (exeContext, disableFields) {
        var _formContext = exeContext.getFormContext();
        var currentEntity = _formContext.data.entity;
        currentEntity.attributes.forEach(function (attribute, i) {
            if (disableFields.indexOf(attribute.getName()) > -1) {
                var attributeToDisable = attribute.controls.get(0);
                attributeToDisable.setDisabled(true);
            }
        });
    };
    var OpenQuickCreate = function (logicalname, parameters, callback) {
        if (Xrm.Utility.openQuickCreate) {
            var formContext = CClearPartners.General.Form.GetFormContext();
            var source = {
                entityType: "incident",
                id: formContext.data.entity.getId()
            };
            Xrm.Utility.openQuickCreate(logicalname, source, parameters).then(
                callback,

                function (error) {
                    var msg = (error.message) ? error.message : error;
                    alert(msg);
                });
        }
    };
    var setDefaults = function () {
        var type = CClearPartners.General.Form.GetValue("casetypecode");
        // Only whe Form Type = "Create"
        if ( CClearPartners.General.Form.GetFormContext().ui.getFormType() == 1) {
            var globalContext = Xrm.Utility.getGlobalContext();
            var userId = globalContext.userSettings.userId.replace('{', '').replace('}', '');
            Xrm.WebApi.online.retrieveRecord("systemuser", userId, "?$select=_businessunitid_value,dig_dienstextern").then(
                function success(result) {
                    var dig_dienstextern = result["dig_dienstextern"];
                    var _businessunitid_value = result["_businessunitid_value"];
                    var _businessunitid_value_formatted = result["_businessunitid_value@OData.Community.Display.V1.FormattedValue"];
                    var _businessunitid_value_lookuplogicalname = result["_businessunitid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                    if (dig_dienstextern) { // als extern toon dan alle casetypes, doelgroepen en hoedanigheden
                        CClearPartners.General.Form.SetValue("dig_dienstwonen", false);
                        CClearPartners.General.Form.SetValue("dig_dienstmilieu", false);
                    } else if (_businessunitid_value_formatted == "Dienst Wonen" || _businessunitid_value_formatted == "Gent Knapt Op") {
                        CClearPartners.General.Form.SetValue("dig_dienstwonen", true);
                    } else {
                        CClearPartners.General.Form.SetValue("dig_dienstmilieu", true);
                    }
                },
                function (error) {
                    Xrm.Utility.alertDialog(error.message);
                    // Default value
                    CClearPartners.General.Form.SetValue("dig_dienstmilieu", true);
                }
            );
            // Set owner location
            onChange.OwnerId(true);
            // Don't allow to change after create
            setTimeout(function () {
                CClearPartners.General.Form.SetDisabled("casetypecode", false);
            }, 500); // casetypecode won't listen at first instant...
        } else if (type === null || type === 0) {
            setTimeout(function () {
                CClearPartners.General.Form.SetDisabled("casetypecode", false);
            }, 500); // casetypecode won't listen at first instant...
        } else {
            setTimeout(function () {
                CClearPartners.General.Form.SetDisabled("casetypecode", true);
            }, 500); // casetypecode won't listen at first instant...
        }
        // Only whe Form Type != "Read Only" AND "Disabled"
        var formtype =  CClearPartners.General.Form.GetFormContext().ui.getFormType();
        if (formtype != 3 && formtype != 4) {
            var date = CClearPartners.General.Form.GetValue("dig_ontvangenop");
            if (date === null) {
                var creationDate = formtype == 1 ? new Date() : CClearPartners.General.Form.GetValue("dig_createdon");
                CClearPartners.General.Form.SetValue("dig_ontvangenop", creationDate);
            }
        }
    };
    var getDienst = function () {
        if (CClearPartners.General.Form.GetValue("dig_dienstwonen") === true) return "Wonen";
        else if (CClearPartners.General.Form.GetValue("dig_dienstmilieu") === true) return "Energie";
        else return null;
    };
    var checkWooneenheidValue = function () {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var dig_wooneenheid = formContext.getAttribute("dig_wooneenheid");
        if (dig_wooneenheid !== null) {
            // Show warning when Wooneenheid is empty	            	
            if (dig_wooneenheid.getValue() === null)  CClearPartners.General.Form.GetFormContext().ui.setFormNotification("\"Wooneenheid\" is nog niet opgegeven in deze case.", "WARNING", "dig_wooneenheid-empty");
            else  CClearPartners.General.Form.GetFormContext().ui.clearFormNotification("dig_wooneenheid-empty");
        }
    };
    var checkBehandelendeDienstValue = function () {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var dig_behandelendedienstid = formContext.getAttribute("dig_behandelendedienstid");
        if (dig_behandelendedienstid !== null) {
            // Show warning when Wooneenheid is empty	            	
            if (dig_behandelendedienstid.getValue() === null)  CClearPartners.General.Form.GetFormContext().ui.setFormNotification("\"Behandelende Dienst\" is nog niet opgegeven in deze case.", "WARNING", "dig_behandelendedienstid-empty");
            else  CClearPartners.General.Form.GetFormContext().ui.clearFormNotification("dig_behandelendedienstid-empty");
        }
    };
    var checkIfCaseTypeNogTebepalen = function () {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var casetypecode = formContext.getAttribute("casetypecode");
        console.log(casetypecode.getValue());
        if (casetypecode.getValue() == 0) {
            console.log("in true");
             CClearPartners.General.Form.GetFormContext().ui.setFormNotification("Casetype is nog niet bepaald", "WARNING", "casetypecode-empty");
        } else {
            console.log("in false");
             CClearPartners.General.Form.GetFormContext().ui.clearFormNotification("casetypecode-empty");
        }
    };
    var checkPrioritaireDoelgroepEnergieleningValue = function () {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var dig_inkomenscategorie = formContext.getAttribute("dig_inkomenscategorie");
        var casetypecode = CClearPartners.General.Form.GetValue("casetypecode");
        if (dig_inkomenscategorie.getValue() === null && casetypecode == 41)  CClearPartners.General.Form.GetFormContext().ui.setFormNotification("\"Prioritaire Doelgroep Energielening\" is nog niet opgegeven in deze case.", "WARNING", "dig_inkomenscategorie-empty");
        else  CClearPartners.General.Form.GetFormContext().ui.clearFormNotification("dig_inkomenscategorie-empty");
    };
    var checkAkkoordverklaringOntvangenValue = function () {
        //check if casetype begeleiding
        var casetype = CClearPartners.General.Form.GetValue("casetypecode");
        if (casetype == 41) {
            var formContext = CClearPartners.General.Form.GetFormContext();
            var renovatiebegeleiding = formContext.data.entity.attributes.get("dig_renovatiebegeleidingid");
            if (renovatiebegeleiding !== null && renovatiebegeleiding.getValue() !== null) {
                var dig_renovatiebegeleidingid = (renovatiebegeleiding.getValue()[0].id).replace('{', '').replace('}', '');
                //retrieve boolean value of field dig_akkoordverklaringontvangen from related begeleiding 
                Xrm.WebApi.online.retrieveRecord("dig_renovatiebegeleiding", dig_renovatiebegeleidingid, "?$select=dig_akkoordverklaringontvangen").then(

                    function success(result) {
                        var dig_akkoordverklaringontvangen = result["dig_akkoordverklaringontvangen"];
                        var dig_akkoordverklaringontvangen_formatted = result["dig_akkoordverklaringontvangen@OData.Community.Display.V1.FormattedValue"];
                        if (dig_akkoordverklaringontvangen === false) {
                             CClearPartners.General.Form.GetFormContext().ui.setFormNotification("Akkoordverklaring klant nog verkrijgen", "WARNING", "dig_renovatiebegeleidingid-empty");
                        } else {
                             CClearPartners.General.Form.GetFormContext().ui.clearFormNotification("dig_akkoordverklaringontvangen-false");
                        }
                    },

                    function (error) {
                        Xrm.Utility.alertDialog(error.message);
                    });
            }
        }
    };
    var customLookups = {
        Controls: [],
        Vesta: function (a) {
            //Team and case type should be filled in before this works
            const getCurrentCaseType = CClearPartners.General.Form.GetValue("casetypecode");
            
            if (getCurrentCaseType == null) {
                var alertStrings = { confirmButtonLabel: "Ok", text: "Gelieve eerst een case type te selecteren.", title: "Case type blanco." };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
                return;
            }
        
            var serverUrl =Xrm.Utility.getGlobalContext().getClientUrl();
            var field = "";
            if (a != "customerid") { var field = a.attributes.LogicalName; } else { field = a;} 
            var account = CClearPartners.General.Form.GetValue(field);
            var entityid = (account === null) ? null : account[0].id;
            var searchfor = ((field == "customerid") ? "customer" : ((field == "dig_eigenaar" || field == "dig_huurder" || field == "dig_syndicusid" || field == "dig_verhuurder") ? "contact" : "account"));
            var title = ((field == "customerid") ? "klant" : ((field == "dig_eigenaar" || field == "dig_huurder" || field == "dig_syndicusid" || field == "dig_verhuurder") ? "persoon" : "organisatie"));
            var callback = function (id, name, type) {
                if (id) {
                    CClearPartners.General.Form.SetLookupValue(field, id, name, type);
                }
            };

            var customParameters = "SearchFor=" + searchfor + "&EntityId=" + entityid;           
            const casetypecodesForMagdaSearch = [2, 5, 6, 8, 10];

            if (casetypecodesForMagdaSearch.indexOf(getCurrentCaseType) === -1) {
                //don't allow search in magda
                customParameters += "&allowmagdasearch=0";
            }
            
            customParameters = encodeURIComponent(customParameters);

            var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
            Alert.showWebResource("ves_/zoekklant/zoeken.html?Data=" + customParameters, 1200, height, "Zoek " + title, null, serverUrl, false, 10);
            CClearPartners.General.Form.RegisterAlertCallback("zoekklantCallback", callback);
        },
    };
    var filterCaseTypeCode = function () {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var caseTypeAttribute = formContext.getAttribute("casetypecode");
        if (caseTypeAttribute !== null) {
            var code = CClearPartners.General.Form.GetValue("casetypecode");
            var options = caseTypeAttribute.getOptions();
            var currentForm = getDienst();
            // Save all options  
            if (!window.CaseTypeOptions) {
                window.CaseTypeOptions = [];
                for (var i = 0; i < options.length; i++)
                    CaseTypeOptions.push(options[i]);
            }
            // for all controls
            for (var i = 0; i < caseTypeAttribute.controls.getLength(); i++) {
                var caseTypeControl = caseTypeAttribute.controls.get(i);
                // Clear all items 
                for (var j = 0; j < options.length; j++)
                    caseTypeControl.removeOption(options[j].value);
                // Add options depending on form
                for (var j = 0; j < CaseTypeOptions.length; j++) {
                    var option = CaseTypeOptions[j];
                    var value = option.value;
                    if (((currentForm == "Wonen") && (0 < value) && (value <= 30)) || ((currentForm == "Energie") && (30 < value) && (value <= 60)) || ((value === 0)) || ((value > 100)) || ((currentForm != "Wonen") && (currentForm != "Energie"))) {
                        caseTypeControl.addOption(option);
                    }
                }
            }
            CClearPartners.General.Form.SetValue("casetypecode", code);
        }
    };
    var filterKanaal = function () {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var caseOriginAttribute = formContext.getAttribute("caseorigincode");
        var caseOriginControl = formContext.getControl("caseorigincode");
        if (caseOriginAttribute && caseOriginControl) {
            var code = CClearPartners.General.Form.GetValue("caseorigincode");
            var options = caseOriginAttribute.getOptions();
            // Save all options  
            if (!window.CaseOriginOptions) {
                window.CaseOriginOptions = [];
                for (var i = 0; i < options.length; i++)
                    CaseOriginOptions.push(options[i]);
            }
        }
    };
    var filterHoedanigheid = function () {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var ctrl = formContext.getControl("dig_hoedanigheid");
        if (ctrl) {
            ctrl.addPreSearch(function () {
                var filter = null;
                var currentForm = getDienst();
                //create a filter xml
                if (currentForm == "Wonen") {
                    filter = "<filter type='and'>" +
                        "<condition attribute='dig_dienstwonen' operator='eq' value='1'/>" +
                        "</filter>";
                } else if (currentForm == "Energie") {
                    filter = "<filter type='and'>" +
                        "<condition attribute='dig_dienstmilieu' operator='eq' value='1'/>" +
                        "</filter>";
                }
                //add filter
                if (filter !== null) ctrl.addCustomFilter(filter);
            });
        }
    };
    var filterDoelgroep = function () {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var ctrl = formContext.getControl("dig_doelgroep");
        if (ctrl) {
            ctrl.addPreSearch(function () {
                var filter = null;
                var currentForm = getDienst();
                //create a filter xml
                if (currentForm == "Wonen") {
                    filter = "<filter type='and'>" +
                        "<condition attribute='dig_dienstwonen' operator='eq' value='1'/>" +
                        "</filter>";
                } else if (currentForm == "Energie") {
                    filter = "<filter type='and'>" +
                        "<condition attribute='dig_dienstmilieu' operator='eq' value='1'/>" +
                        "</filter>";
                }
                //add filter
                if (filter !== null) ctrl.addCustomFilter(filter);
            });
        }
    };
    var setVorigeCase = function () {
        var dig_wooneenheid = CClearPartners.General.Form.GetValue("dig_wooneenheid");
        var type = CClearPartners.General.Form.GetValue("casetypecode");
        var isOpvolgscanType1 = (type == _OS1A) || (type == _OS1B);
        var isOpvolgscanType2 = (type == _OS2A) || (type == _OS2B) || (type == _OS2C);
        if ((isOpvolgscanType1 || isOpvolgscanType2) && dig_wooneenheid !== null && dig_wooneenheid.length > 0) {
            // if opvolgscan: set vorige case to last created ES
            // Get last created case + values
            var id = dig_wooneenheid[0].id.replace('{', '').replace('}', '').toLowerCase();
            var req = new XMLHttpRequest();
            req.open("GET",Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/incidents?$select=incidentid,title&$filter=_dig_wooneenheid_value eq " + id + " and casetypecode eq 35 &$orderby=createdon desc", true);
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
                        for (var i = 0; i < results.value.length; i++) {
                            var incidentid = results.value[i]["incidentid"];
                            var title = results.value[i]["title"];
                            CClearPartners.General.Form.SetLookupValue("dig_vorigecaseid", incidentid, title, "incident");
                        }
                    } else {
                        console.log("setVorigeCase ERROR: " + this.statusText);
                    }
                }
            };
            req.send();
        } else {
            // No wooneenheid/opvolgscan: clear vorige case
            CClearPartners.General.Form.SetValue("dig_vorigecaseid", null);
        }
    };
    var setWijkgebondenProject = function (args) {
        var wooneenheidid = CClearPartners.General.Form.GetValue("dig_wooneenheid");
        if(wooneenheidid != null){
            new Promise( (resolve, reject) => {
                //Get wooneenheid
                wooneenheidid = CClearPartners.General.Form.GetValue("dig_wooneenheid")[0].id.replace("{", "").replace("}", "");
                Xrm.WebApi.retrieveMultipleRecords("dig_wooneenheid", "?$expand=dig_straatid($select=dig_straatid,dig_opmerking)&$filter=dig_wooneenheidid eq " + wooneenheidid + "").then(
                    function success(results) {
                        console.log(results);
                        var result = results.entities[0];
                        // Columns
                        var dig_wooneenheidid = result["dig_wooneenheidid"]; // Guid
                        var dig_straatid_dig_straatid = ""; // Guid
                        var dig_straatid_dig_opmerking = ""; // Multiline Text

                        // Many To One Relationships
                        if (result.hasOwnProperty("dig_straatid") && result["dig_straatid"] !== null) {
                            dig_straatid_dig_straatid = result["dig_straatid"]["dig_straatid"]; // Guid
                            dig_straatid_dig_opmerking = result["dig_straatid"]["dig_opmerking"]; // Multiline Text
                        }
                        
                        resolve({
                            straatid: dig_straatid_dig_straatid,
                            wooneenheidid: dig_wooneenheidid,
                            straatOpmerking: dig_straatid_dig_opmerking
                        })                            
                    },
                    function(error) {
                        reject(error);
                    }
                );
            }).then( result => {
                let opmerking = result.straatOpmerking;
                if(result.straatid != null){
                    //using fetchxml because of many to many relation
                    const fetchxml = "?fetchXml=" + encodeURIComponent('<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="true">' +
                    '<entity name="dig_wijkgebondenproject">' +
                    '<attribute name="dig_wijkgebondenprojectid" />' +
                    '<attribute name="dig_name" />' +
                    '<attribute name="createdon" />' +
                    '<order attribute="dig_name" descending="false" />' +
                    '<link-entity name="dig_dig_wijkgebondenproject_dig_straat" from="dig_wijkgebondenprojectid" to="dig_wijkgebondenprojectid" visible="false" intersect="true">' +
                    '<link-entity name="dig_straat" from="dig_straatid" to="dig_straatid" alias="ab">' +
                    '<filter type="and">' +
                    '<condition attribute="dig_straatid" operator="eq" uitype="dig_straat" value="' + result.straatid + '" />' +
                    '</filter>' +
                    '</link-entity>' +
                    '</link-entity>' +
                    '</entity>' +
                    '</fetch>');

                    Xrm.WebApi.retrieveMultipleRecords("dig_wijkgebondenproject", fetchxml).then(
                        function (succes) {
                          // Process the retrieved records
                          if(succes.entities.length > 0){
                            let project = succes.entities[0];
                            CClearPartners.General.Form.SetValue("dig_opmerkingstraat", opmerking);
                            CClearPartners.General.Form.SetLookupValue("dig_wijkgebondenprojectid", project.dig_wijkgebondenprojectid, project.dig_name, "dig_wijkgebondenproject", true);
                          }
                        },
                        function (error) {
                          // Handle error
                          console.log(error);
                        }
                    );
                }
            });
        }
    };
    var setWooneenheid = function (straat, huisnummer, busnummer, postcode, gemeente) {
        var dig_wooneenheid = CClearPartners.General.Form.GetValue("dig_wooneenheid");
        // Only when we have no wooneenheid set
        if (dig_wooneenheid === null || dig_wooneenheid.length === 0) {
            // Do we have an address
            if (straat !== null && straat !== "" && huisnummer !== null && huisnummer !== "" && postcode !== null && postcode !== "" && gemeente !== null && gemeente !== "") {
                var filter = "dig_straat eq '" + straat + "' and  dig_huisnummer eq '" + huisnummer + "' and (dig_postcode eq '" + postcode + "' or dig_gemeente eq '" + gemeente + "')";
                if (busnummer === null || busnummer === "") filter += " and dig_busnummer eq null";
                else filter += " and  dig_busnummer eq '" + busnummer + "'";
                var req = new XMLHttpRequest();
                req.open("GET",Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/dig_wooneenheids?$select=dig_wooneenheidid,dig_name&$filter=" + filter, true);
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
                                var dig_wooneenheidid = results.value[0]["dig_wooneenheidid"];
                                var dig_name = results.value[0]["dig_name"];
                                CClearPartners.General.Form.SetLookupValue("dig_wooneenheid", dig_wooneenheidid, dig_name, "dig_wooneenheid");
                                // Make sure custom web resource is set with the correct value
                                /*if (customlookups["dig_wooneenheid"] !== null) {
                                    for (cli in customlookups["dig_wooneenheid"]) {
                                        var scope = customlookups["dig_wooneenheid"][cli];
                                        var custvalue = scope.fieldvalue();

                                        if ((custvalue === null) || (dig_wooneenheidid != custvalue.Id))
                                            scope.fieldvalue(customer);
                                        scope.fieldvalue.notifySubscribers(); // force the value to update
                                    }
                                }*/
                            }
                        } else {
                            console.log("setWooneenheid ERROR: " + this.statusText);
                        }
                    }
                };
                req.send();
            }
        }
    };
    return {
        OnLoad: onLoad,
        OnSave: onSave,
        Grid: grid,
        CustomLookups: customLookups,
        onRecordSelect: onRecordSelect,
        onBetrokkeneSelect: onBetrokkeneSelect,
        IsWonen: isWonen
    };
}();

Digipolis.Case.Ribbon = function () {
    var createContactMomentDossier = function () {
        var formContext = CClearPartners.General.Form.GetFormContext();
        // Clear previous errors:
         formContext.ui.clearFormNotification("createContactMomentDossier");
        // Create trigger plugin object
        var record = {};
        record.ccp_input = formContext.data.entity.getId();
        record.ccp_name = "CaseCreateDossier"; // Text

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

                    // OK: output should contain new dossier
                    if ((result !== null) && (result.ccp_output !== null)) {
                        var output = result.ccp_output;
                        // first remove triggerplugin
                        Xrm.WebApi.online.deleteRecord("ccp_trigger", newId.replace('{', '').replace('}', '')).then(
                            function success(result) {
                                console.log(result);
                            },
                            function (error) {
                                console.log(error.message);
                            }
                        );
                        Xrm.Utility.openEntityForm("incident", output);
                    }
                } else {
                    console.log(this.responseText);
                     CClearPartners.General.Form.GetFormContext().ui.setFormNotification("Er is iets foutgelopen bij het aanmaken van het dossier! " + error, "ERROR", "createContactMomentDossier");
                }
            }
        };
        req.send(JSON.stringify(record));
    };

    var wooneenheidZoekenCallback = function (adresId, name, straat, huisnummer, busnummer, postcode, gemeente, land, type, id, GrabX, GrabY, verdiepinglokaal, gebouw, GrabId) {
        var setResult = function (result) {
            var formContext = CClearPartners.General.Form.GetFormContext();
            CClearPartners.Form.General.SetLookupValue("dig_wooneenheid", result.id, result.dig_name, "dig_wooneenheid");
            formContext.getAttribute("dig_wooneenheid").fireOnChange();
            // Save the changes
            //Xrm.Page.data.save();
            formContext.data.refresh(true); // make sure to refresh
        };

        var resultCallback = function (results) {
            var entity = {};
            entity.dig_straat = straat;
            entity.dig_huisnummer = huisnummer;
            entity.dig_busnummer = busnummer;
            entity.dig_postcode = postcode;
            entity.dig_gemeente = gemeente;
            entity.dig_vestaid = adresId;
            entity.dig_verdiepinglokaal = verdiepinglokaal;
            entity.dig_gebouw = gebouw;
            entity.dig_crabx = GrabX;
            entity.dig_craby = GrabY;
            entity.dig_grabid = adresId;

            if (results != null && results.entities.length > 0) {
                Xrm.WebApi.online.updateRecord("dig_wooneenheid", results.entities[0].dig_wooneenheidid, entity).then(
                    function success(result) {
                        var updatedEntityId = result.id;
                        setResult(result);
                    },
                    function (error) {
                        Xrm.Utility.alertDialog(error.message);
                    }
                );

            } else if (straat && postcode) {
                //console.log("No wooneenheid found: create new");
                Xrm.WebApi.online.createRecord("dig_wooneenheid", entity).then(
                    function success(result) {
                        var newEntityId = result.id;
                        setResult(result);
                    },
                    function (error) {
                        Xrm.Utility.alertDialog("Er is iets foutgelopen bij het aanmaken van de wooneenheid! " + error.message);
                    }
                );
            }
        };
       
        var qryverdiepinglokaal = (verdiepinglokaal == null || verdiepinglokaal == "") ? " and dig_verdiepinglokaal eq null" : " and dig_verdiepinglokaal eq '" + verdiepinglokaal + "'";
        var qrygebouw = (gebouw == null || gebouw == "") ? " and dig_gebouw eq null" : " dig_gebouw eq '" + gebouw + "'";
       
        // Optional parameters.
        var qryhuisnr = (huisnummer == null || huisnummer == "") ? " and dig_huisnummer eq null" : " and dig_huisnummer eq '" + huisnummer + "'";
        var qrybusnr = (busnummer == null || busnummer == "") ? " and dig_busnummer eq null" : " and dig_busnummer eq '" + busnummer + "'";

        Xrm.WebApi.online.retrieveMultipleRecords("dig_wooneenheid", "?$select=dig_name,dig_wooneenheidid&$filter=dig_straat eq '" + straat + "'" + qryhuisnr + qrybusnr + " and dig_postcode eq '" + postcode + "' and dig_gemeente eq '" + gemeente + "'" + qrygebouw + qryverdiepinglokaal).then(
            resultCallback,
            function (error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );       
    };
    var adresOvernemen = function () {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var attrcustomerid = formContext.getAttribute("customerid");
        if (attrcustomerid !== null && attrcustomerid.getValue() !== null) {
            var attrValue = attrcustomerid.getValue()[0];
            var id = attrValue.id;
            var type = attrValue.entityType;
            var name = attrValue.name;
            var columns = "ves_name,ves_adresid,ves_straat,ves_huisnummer,ves_busnummer,ves_postcode,ves_gemeente,ves_land,ves_grabx,ves_graby,ves_gebouw,ves_adres1verdiepinglokaal,ves_standaard";
            var resultCallback = function (results) {
                if (results !== null && results.entities.length > 0) {
                    var result = results.entities[0];
                    wooneenheidZoekenCallback(result.ves_adresid, result.ves_name, result.ves_straat, result.ves_huisnummer, result.ves_busnummer,
                        result.ves_postcode, result.ves_gemeente, result.ves_land, "", "", result.ves_grabx, result.ves_graby, result.ves_adres1verdiepinglokaal, result.ves_gebouw, "");
                } else {
                    var url =Xrm.Utility.getGlobalContext().getClientUrl();
                    Alert.show("Adres overnemen", "Er is geen adres beschikbaar voor " + name, null, "WARNING", 500, 250, url, false);
                }
            };
            if (type == "contact") {
                Xrm.WebApi.online.retrieveMultipleRecords("ves_meeradressen", "?$select=" + columns + "&$filter=_ves_persoonid_value eq " + id + "&$orderby=ves_standaard desc").then(
                    resultCallback,
                    function (error) {
                        Xrm.Utility.alertDialog(error.message);
                    }
                );
            } else if (type == "account") {

                Xrm.WebApi.online.retrieveMultipleRecords("ves_meeradressen", "?$select=" + columns + "&$filter=_ves_organisatieid_value eq " + id + "&$orderby=ves_standaard desc").then(
                    resultCallback,
                    function (error) {
                        Xrm.Utility.alertDialog(error.message);
                    }
                );

            }
        }
         CClearPartners.General.Form.GetFormContext().ui.refreshRibbon();
    };
    var resolveCaseBusy = false;
    //var resolveCaseCount = 0;
    var resolveCase = function (status, selectedcases, gridcontrol) {
        let casetypecode = CClearPartners.General.Form.GetFormContext().getAttribute("casetypecode");
        if (casetypecode != null && casetypecode.getValue() == 0){
            Xrm.Navigation.openAlertDialog("Casetype is nog niet bepaald");
            return;
        }

        // Only execute once
        if (resolveCaseBusy === false) {
            resolveCaseBusy = true;
            var url =Xrm.Utility.getGlobalContext().getClientUrl();
            Alert.show("Case afsluiten", "De case wordt afgesloten...", null, "LOADING", 500, 250, url, true);
            var input = {
                state: 1,
                status: status,
                cases: ""
            };
            if (selectedcases == null) {
                 var formContext = CClearPartners.General.Form.GetFormContext();
                input.cases = [formContext.data.entity.getId()];
            } else {
                input.cases = selectedcases;
            }
            var trigger = {};
            trigger.ccp_name = "CloseCase";
            trigger.ccp_input = JSON.stringify(input);
            var errorhandler = function (err) {
                var title = "Afsluiten case mislukt";
                var msg = err;
                if (err.indexOf("message") >= 0)
                {
                    msg1 = err.substring(err.indexOf("message") + 10, err.length);
                    msg = msg1.substring(0, err.indexOf('\\r\\n')-37);
                } else if(err.indexOf("Error : 500: : ") >= 0) {
                    msg = err.substring(err.indexOf("Error : 500: : ") + 15, err.length);
                } 
                msg = msg.toString().replaceAll('\\r\\n', '\n').replaceAll('\\r', '\n').replaceAll('\\n', '\n').replaceAll('\n', '<br />');
                var clientUrl =Xrm.Utility.getGlobalContext().getClientUrl();
                Alert.show(title, msg, null, "WARNING", 500, 300, clientUrl, true);
                // Always refresh when executed from startpage (also on errors)
                if (gridcontrol) {
                    gridcontrol.refresh();
                }
                resolveCaseBusy = false;
                //Alert.hide();
            };
            var execute = function () {
                try {
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
                                var formContext = CClearPartners.General.Form.GetFormContext();
                                if (formContext.data) {
                                    //Xrm.Page.data.setFormDirty(false);
                                    formContext.data.refresh(false);
                                } else if (gridcontrol) {
                                    gridcontrol.refresh();
                                }
                                Xrm.WebApi.online.deleteRecord("ccp_trigger", newId.replace('{', '').replace('}', '')).then(
                                    function success(result) {
                                        console.log(result);
                                    },
                                    function (error) {
                                        console.log(error.message);
                                    }
                                );
                                resolveCaseBusy = false;
                                Alert.hide();
                            } else {
                                console.log(this.responseText); 
                                if(selectedcases != null){
                                    alert("Het was niet mogelijk één of meerdere cases af te sluiten.");
                                    Alert.hide();
                                }else{
                                    errorhandler(this.responseText);
                                }
                                resolveCaseBusy = false;
                                gridcontrol.refresh();
                            }
                        }
                    };
                    req.send(JSON.stringify(trigger));
                } catch (err) {
                    errorhandler(err);
                }
            };
             var formContext = CClearPartners.General.Form.GetFormContext();
            if (formContext.data) formContext.data.save().then(execute);
            else execute();
        }
    };
    var isCaseDienstMilieu = function (caseId) {
        var isMilieu = false;
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/incidents(" + caseId.replace('{', '').replace('}', '') + ")?$select=dig_dienstmilieu,statecode", false);
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
                    var incidentid = result["incidentid"]; // Guid
                    var dig_dienstmilieu = result["dig_dienstmilieu"]; // Boolean
                    var dig_dienstmilieu_formatted = result["dig_dienstmilieu@OData.Community.Display.V1.FormattedValue"];
                    var statecode = result["statecode"]; // State
                    var statecode_formatted = result["statecode@OData.Community.Display.V1.FormattedValue"];

                    if (dig_dienstmilieu === true && statecode === 0) isMilieu = true;
                } else {
                    console.log(this.responseText);
                }
            }
        };
        req.send();
        return isMilieu;
    };
    var createServiceActivity = function (caseId) {
        //var parameters = {};
        //parameters["parameter_OriginatingCase"] = caseId;
        //Xrm.Utility.openEntityForm("serviceappointment", null, parameters);
        //Xrm.Utility.openEntityForm("bookableresourcebooking", null, parameters);		
        var entityName = "serviceappointment";
    var entityId = null;
    var entityFormOptions = {
        entityName: entityName,
        entityId: entityId,
        openInNewWindow: false
    };
    var formParameters = {};
    formParameters["parameter_originatingcaseid"] = caseId;
    Xrm.Navigation.openForm(entityFormOptions, formParameters);


    };
    var isKleinAdvies = function () {
        var type = CClearPartners.General.Form.GetValue("casetypecode");
        return (type == 34);
    };
    var kopieGegevensPlanning = function () {
         var formContext = CClearPartners.General.Form.GetFormContext();
        var customParameters = encodeURIComponent("caseid=" + formContext.data.entity.getId());
        Xrm.Utility.openWebResource("dig_/kopiegegevensplanning/kopie.html", customParameters, 600, 300);
    };
    var klantZoekenViaEid = function () {
        readeid(klantZoekenViaEidCallback);
    };
    var _createcase = function (data, casetypecode, entitycopyName) {
        if (data !== null && data.length > 0) {
            var caseId = data[0];
            Xrm.Utility.showProgressIndicator("Een ogenblik, de case wordt aangemaakt");
            Xrm.WebApi.online.retrieveMultipleRecords("ccp_entitycopy", "?$select=ccp_entitycopyid&$filter=ccp_name eq '" + entitycopyName + "'&$top=1").then(
                function success(results) {
                    if (results.entities.length > 0) {
                        var ccp_entitycopyid = results.entities[0]["ccp_entitycopyid"];
                        var caseParams = [];

                        Xrm.WebApi.online.retrieveMultipleRecords("ccp_entityfieldscopy", "?$select=_dig_entityattributeid_value&$expand=dig_entityattributeid($select=ccp_logicalname,ccp_typecode)&$filter=_ccp_entitycopyid_value eq " + ccp_entitycopyid).then(
                            function success(results) {
                                for (var i = 0; i < results.entities.length; i++) {
                                    var ccp_logicalname = results.entities[i].dig_entityattributeid.ccp_logicalname;
                                    var ccp_typecode = results.entities[i].dig_entityattributeid.ccp_typecode;
                                    if (ccp_typecode === 1 || ccp_typecode === 6) ccp_logicalname = "_" + ccp_logicalname + "_value"; //customer or lookup
                                    caseParams.push(ccp_logicalname);
                                }
                                Xrm.WebApi.online.retrieveRecord("incident", caseId, "?$select=" + caseParams.join(",") + "&$expand=dig_incident_dig_betrokkene_caseid($select=_dig_betrokkene_value,dig_eanelektriciteit,dig_eangas,dig_email,dig_gsm,_dig_hoedanigheidid_value,dig_infovia,dig_opmerkingen,dig_telefoon,_dig_wooneenheidid_value)").then(
                                    function success(result) {
                                        var entity = {};
                                        for (var i = 0; i < caseParams.length; i++) {
                                            if (result[caseParams[i]] !== null) {
                                                if (typeof result[caseParams[i]].Value !== 'undefined' && result[caseParams[i]].Value !== null) {
                                                    entity[caseParams[i].toLowerCase()] = result[caseParams[i]].Value;
                                                } else if (typeof result[caseParams[i] + "@Microsoft.Dynamics.CRM.lookuplogicalname"] !== 'undefined') {

                                                    var attribute = caseParams[i].substring(1, caseParams[i].indexOf("_value"));
                                                    var type = result[caseParams[i] + "@Microsoft.Dynamics.CRM.lookuplogicalname"];
                                                    if (attribute === "customerid") attribute += "_" + type;

                                                    entity[attribute + "@odata.bind"] = "/" + type + "s(" + result[caseParams[i]] + ")";
                                                } else {
                                                    entity[caseParams[i].toLowerCase()] = result[caseParams[i]];
                                                }
                                            }
                                        }
                                        if (casetypecode !== null) entity["casetypecode"] = casetypecode;
                                        var betrokkenen = [];
                                        for (var i = 0; i < result.dig_incident_dig_betrokkene_caseid.length; i++) {
                                            betrokkenen.push(result.dig_incident_dig_betrokkene_caseid[i]);
                                        }
                                        Xrm.WebApi.online.createRecord("incident", entity).then(
                                            function success(result) {
                                                var newEntityId = result.id;
                                                for (var i = 0; i < betrokkenen.length; i++) _createbetrokkene(betrokkenen[i], newEntityId);
                                                var entityFormOptions = {};
                                                entityFormOptions["entityName"] = "incident";
                                                entityFormOptions["entityId"] = newEntityId;
                                                Xrm.Utility.closeProgressIndicator();
                                                // Open the form.
                                                Xrm.Navigation.openForm(entityFormOptions).then(
                                                    function (success) {
                                                        console.log(success);
                                                    },
                                                    function (error) {
                                                        console.log(error);
                                                    });
                                            },
                                            function (error) {
                                                Xrm.Utility.alertDialog(error.message);
                                            }
                                        );
                                    },
                                    function (error) {
                                        Xrm.Utility.alertDialog(error.message);
                                        Xrm.Utility.closeProgressIndicator();
                                    }
                                );
                            },
                            function (error) {
                                Xrm.Utility.alertDialog(error.message);
                                Xrm.Utility.closeProgressIndicator();
                            }
                        );
                    }
                },
                function (error) {
                    Xrm.Utility.alertDialog(error.message);
                    Xrm.Utility.closeProgressIndicator();
                }
            );
        };
    };
    var _createbetrokkene = function (betrokkene, caseid) {
        var entity = {};
        entity["dig_caseid@odata.bind"] = "/incidents(" + caseid + ")";
        for (var index in betrokkene) {
            var element = betrokkene[index];
            if (element === null ||
                index === "dig_betrokkeneid" ||
                index.includes("dig_caseid") ||
                index.includes("dig_childcaseid") ||
                index.includes("@") ||
                index.includes("@Microsoft.Dynamics.CRM.lookuplogicalname") ||
                index.includes("@OData.Community.Display.V1.FormattedValue")) continue;
            if (index[0] === '_') {

                var attribute = index.substring(1, index.indexOf("_value"));
                var type = betrokkene[index + "@Microsoft.Dynamics.CRM.lookuplogicalname"];
                if (attribute === "customerid" || attribute === "dig_betrokkene") attribute += "_" + type;

                entity[attribute + "@odata.bind"] = "/" + type + "s(" + element + ")";
            } else {
                entity[index] = element;
            }

        }
        var req = new XMLHttpRequest();
        req.open("POST",Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/dig_betrokkenes", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 204) {
                    var uri = this.getResponseHeader("OData-EntityId");
                    var regExp = /\(([^)]+)\)/;
                    var matches = regExp.exec(uri);
                    var newEntityId = matches[1];
                } else {
                    Xrm.Utility.alertDialog(this.response);
                }
            }
        };
        req.send(JSON.stringify(entity));
    }
    var _newcase = function (data, casetypecode, entitycopyName) {
        if (data !== null && data.length > 0) {
            var caseId = data[0];
            Xrm.WebApi.online.retrieveMultipleRecords("ccp_entitycopy", "?$select=ccp_entitycopyid&$filter=ccp_name eq '" + entitycopyName + "'&$top=1").then(
                function success(results) {
                    if (results.entities.length > 0) {
                        var ccp_entitycopyid = results.entities[0]["ccp_entitycopyid"];
                        var caseParams = [];

                        Xrm.WebApi.online.retrieveMultipleRecords("ccp_entityfieldscopy", "?$select=_dig_entityattributeid_value&$expand=dig_entityattributeid($select=ccp_logicalname,ccp_typecode)&$filter=_ccp_entitycopyid_value eq " + ccp_entitycopyid).then(
                            function success(results) {
                                for (var i = 0; i < results.entities.length; i++) {
                                    var ccp_logicalname = results.entities[i].dig_entityattributeid.ccp_logicalname;
                                    var ccp_typecode = results.entities[i].dig_entityattributeid.ccp_typecode;
                                    if (ccp_typecode === 1 || ccp_typecode === 6) ccp_logicalname = "_" + ccp_logicalname + "_value"; //customer or lookup
                                    caseParams.push(ccp_logicalname);
                                }
                                Xrm.WebApi.online.retrieveRecord("incident", caseId, "?$select=" + caseParams.join(",")).then(
                                    function success(result) {
                                        var entityFormOptions = {};
                                        entityFormOptions["entityName"] = "incident";

                                        var formParameters = {};
                                        for (var i = 0; i < caseParams.length; i++) {
                                            if (result[caseParams[i]] !== null) {
                                                if (typeof result[caseParams[i]].Value !== 'undefined') {
                                                    if (result[caseParams[i]].Value !== null) formParameters[caseParams[i].toLowerCase()] = result[caseParams[i]].Value;
                                                } else if (typeof result[caseParams[i] + "@Microsoft.Dynamics.CRM.lookuplogicalname"] !== 'undefined') {

                                                    var attribute = caseParams[i].substring(1, caseParams[i].indexOf("_value"));
                                                    formParameters[attribute] = result[caseParams[i]];
                                                    formParameters[attribute + "name"] = result[caseParams[i] + "@OData.Community.Display.V1.FormattedValue"];
                                                    formParameters[attribute + "type"] = result[caseParams[i] + "@Microsoft.Dynamics.CRM.lookuplogicalname"];

                                                } else {
                                                    formParameters[caseParams[i].toLowerCase()] = result[caseParams[i]];
                                                }
                                            }
                                        }
                                        if (casetypecode !== null) formParameters["casetypecode"] = casetypecode;
                                        // Open the form.
                                        Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
                                            function (success) {
                                                console.log(success);
                                            },
                                            function (error) {
                                                console.log(error);
                                            });
                                    },
                                    function (error) {
                                        Xrm.Utility.alertDialog(error.message);
                                    }
                                );
                            },
                            function (error) {
                                Xrm.Utility.alertDialog(error.message);
                            }
                        );

                    }
                },
                function (error) {
                    Xrm.Utility.alertDialog(error.message);
                }
            );
        };
    };
    var newRenovatiebegeleidingCase = function (data) {
        _createcase(data, 41, "KopieerRenovatieBegeleidingNaarNieuweCase");
    };
    var newCustomerCase = function (data, casetypecode) {
        _newcase(data, casetypecode, "KopieerCaseNaarNieuweCase");
    };
    var klantZoekenViaEidCallback = function (data) {
        data.picture = "";
        var triggerplugin = {};
        triggerplugin.dig_name = "ZoekContactViaRrnr";
        triggerplugin.dig_extra = JSON.stringify(data);
        //Triggerplugin-record aanmaken
        var dig_triggerpluginId;
        var req = new XMLHttpRequest();
        req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/dig_triggerplugins", false);
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
                    dig_triggerpluginId = newId.replace('{', '').replace('}', '');
                } else {
                    console.log(this.responseText);
                    alert(this.responseText);
                }
            }
        };
        req.send(JSON.stringify(triggerplugin));
        if (dig_triggerpluginId !== null) {
            var contactid;
            //Triggerplugin-record ophalen (output)
            var req3 = new XMLHttpRequest();
            req3.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/dig_triggerplugins(" + dig_triggerpluginId + ")", false);
            req3.setRequestHeader("OData-MaxVersion", "4.0");
            req3.setRequestHeader("OData-Version", "4.0");
            req3.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req3.setRequestHeader("Accept", "application/json");
            req3.setRequestHeader("Prefer", "odata.include-annotations=*");
            req3.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var result2 = JSON.parse(this.response);
                        console.log(result2);
                        // Columns
                        var dig_triggerpluginid = result2["dig_triggerpluginid"]; // Guid
                        contactid = JSON.parse(result2["dig_output"]);
                    } else {
                        console.log(this.responseText);
                        alert(this.responseText);
                    }
                }
            };
            req3.send();

            if (contactid !== null) {
                //Lookup invullen
                CClearPartners.General.Form.SetLookupValue("customerid",contactid.Id, contactid.Name, contactid.LogicalName);
                

                //Triggerplugin-record verwijderen
                var req1 = new XMLHttpRequest();
                req1.open("DELETE", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/dig_triggerplugins(" + dig_triggerpluginId + ")", false);
                req1.setRequestHeader("OData-MaxVersion", "4.0");
                req1.setRequestHeader("OData-Version", "4.0");
                req1.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req1.setRequestHeader("Accept", "application/json");
                req1.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req1.onreadystatechange = null;
                        if (this.status === 204 || this.status === 1223) {
                            console.log("Record deleted");
                        } else {
                            console.log(this.responseText);
                            alert(this.responseText);
                        }
                    }
                };
                req1.send();
            }
        }
    };
    var zoekCasesViaEid = function () {
        readeid(zoekCasesViaEidCallback);
    };
    var zoekCasesViaEidCallback = function (data) {
        data.picture = "";
        var zoekcasesviaeid = {};
        zoekcasesviaeid.dig_name = data.lastName + " " + data.firstName;
        zoekcasesviaeid.dig_eid = JSON.stringify(data);
        var zoekcasesviaeidId;
        var req = new XMLHttpRequest();
        req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/dig_zoekcasesviaeids", false);
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

                    Xrm.Utility.openEntityForm("dig_zoekcasesviaeid", newId.replace('{', '').replace('}', ''), null);
                } else {
                    console.log(this.responseText);
                    alert(this.responseText);
                }
            }
        };
        req.send(JSON.stringify(zoekcasesviaeid));
    };
    var readeid = function (callback) {
        if (typeof ($) === 'undefined') {
            $ = parent.$;
            jQuery = parent.jQuery;
        }
        try {
            // Check if local eid reader is installed
            $.ajax({
                url: 'http://localhost:8081/eID/rest/status?ticks=' + new Date().getTime(), // Make request unique to avoid browser caching
                success: function (response) {
                    // OK continue with the read
                    $.ajax({
                        url: 'http://localhost:8081/eID/rest/read?ticks=' + new Date().getTime(), // Make request unique to avoid browser caching
                        success: function (response) {
                            if (response !== null && response !== "") {
                                // Transform data
                                var data = {
                                    firstName: response._FirstName,
                                    middleName: "",
                                    lastName: response._LastName,
                                    street: response._Street,
                                    municipality: response._City,
                                    zipCode: response._PostalCode,
                                    insz: response._NationalNumber,
                                    nationality: response._Nationality,
                                    dateOfBirth: response._BirthDate !== null ? new Date(parseInt(response._BirthDate.replace('/Date(', ''))) : "",
                                    gender: response._Gender,
                                    picture: "",
                                    cardNumber: response._CardNumber,
                                    cardValidUntilDate: new Date(parseInt(response._CardValidUntil.replace('/Date(', ''))),
                                    placeOfBirth: response._CityOfBirth
                                };
                                callback(data);
                            }
                        },
                        error: function (error) {
                            alert('Unexpected error contacting eid reader!');
                        },
                    });
                },
                error: function () {
                     CClearPartners.General.Form.GetFormContext().ui.setFormNotification("De eid reader software kan niet worden gevonden! Gelieve applicatiebeheer te contacteren.", "WARNING", "readeid");
                },
            });
        } catch (e) {
            alert(e);
        }
    };
    var startDocumentDialog = function (data) {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var recordId = formContext.data.entity.getId();
        var entityName = "incident";
        var dialogName = "Wonen - Aanmaken Document";
        // first get dialogId
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/workflows?$select=workflowid&$filter=(name eq '" + dialogName + "' and type eq 1 and rendererobjecttypecode eq 'null' and category eq 1)", false);
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
                        var workflowid = result["workflowid"]; // Guid
                        var dialogId = workflowid.replace('{', '').replace('}', '');
                        var dialogurl = "/cs/dialog/rundialog.aspx?DialogId=%7b" + dialogId + "%7d&EntityName=" + entityName + "&ObjectId=" + recordId;
                        CClearPartners.General.Form.TryShowDialog(dialogurl, 600, 400);
                    }
                } else {
                    console.log(this.responseText);
                    alert("Dialoog '" + dialogName + "' is niet gevonden!");
                }
            }
        };
        req.send();
    };
    var openPremieTool = function (data) {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var wooneenheid = formContext.getAttribute("dig_wooneenheid")
        if (wooneenheid !== null && wooneenheid.getValue() !== null) {
            var straat = null;
            var nr = null;
            var bus = null;
            var postcode = null;
            var stad = null;
            var callback = function () {
                var customParameters = "";
                if (straat !== null) customParameters += "&straat=" + straat;
                if (nr !== null) customParameters += "&nr=" + nr;
                if (bus !== null) customParameters += "&bus=" + bus;
                if (postcode !== null) customParameters += "&postcode=" + postcode;
                if (stad !== null) customParameters += "&stad=" + stad;
                var serverUrl =Xrm.Utility.getGlobalContext().getClientUrl();
                var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
                Alert.showWebResource("dig_/premietool/page.html?Data=" + encodeURIComponent(customParameters.substring(1)), 1200, height, "Premie Tool", null, serverUrl, false, 10);
            };
            // Get wooneenheid 
            Xrm.WebApi.online.retrieveRecord("dig_wooneenheid", wooneenheid.getValue()[0].id.replace('{', '').replace('}', ''), "?$select=dig_busnummer,dig_gemeente,dig_huisnummer,dig_postcode,dig_straat").then(
                function success(result) {
                    console.log(result);
                    // Columns
                    straat = result["dig_wooneenheidid"]; // Guid
                    bus = result["dig_busnummer"]; // Text
                    stad = result["dig_gemeente"]; // Text
                    nr = result["dig_huisnummer"]; // Text
                    postcode = result["dig_postcode"]; // Text
                    straat = result["dig_straat"]; // Text
                },
                function (error) {
                    console.log(error.message);
                }
            );
        }
    };
    var emailNaar = function (data) {
         var formContext = CClearPartners.General.Form.GetFormContext();
        var recordId = formContext.data.entity.getId();
        var email = {};
        email.dig_type = {
            Value: parseInt(data)
        };
        email.RegardingObjectId = {
            Id: recordId,
            LogicalName: 'incident'
        };
        var req = new XMLHttpRequest();
        req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/emails", true);
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

                    Xrm.Utility.openEntityForm("email", newId.replace('{', '').replace('}', ''), null);
                } else {
                    console.log(this.responseText);
                }
            }
        };
        req.send(JSON.stringify(email));
    };
    var openInGeoTool = function () {
        var serverUrl =Xrm.Utility.getGlobalContext().getClientUrl();
        var url = serverUrl + "/WebResources/dig_/geotool/index.htm";
        var formContext = CClearPartners.General.Form.GetFormContext();
        var customParameters = "adres=" + formContext.getAttribute("dig_wooneenheid").getValue()[0].name;
        window.open(url + "?Data=" + encodeURIComponent(customParameters));
    };
    var ooVoorrang = function (primaryControl) {
        Xrm.Utility.showProgressIndicator("Document OO voorrang Even geduld... het systeem maakt het document aan.")
        var sys_proc_user = "";
        var formContext = CClearPartners.General.Form.GetFormContext();
        var incidentId = formContext.data.entity.getId().replace(/[{}]/g, '').toLowerCase();
        var req = new XMLHttpRequest();
        req.open("GET",Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/ccp_parameters?$select=ccp_value&$filter=ccp_name eq 'Sys_Azure_stedontw-crm_proc'", false);
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
                        sys_proc_user = results.value[i]["ccp_value"];
                    }
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                    Xrm.Utility.closeProgressIndicator();
                }
            }
        };
        req.send();

        var templateName = "Wonen OO voorrang";
        Digipolis.Experlogix.RunSmartFlow(templateName, incidentId)
        .then(() => {
            // Success logic
            Xrm.Utility.closeProgressIndicator();
            //Success - No Return Data - Do Something
            //TODO navigeren naar incident  naar tab documenten
            //init the destination after succesfull
            var entityFormOptions = {};
            entityFormOptions["entityName"] = "incident";
            entityFormOptions["entityId"] = incidentId;
            var parameters = {};
            parameters["setfocus_tab"] = "tab_documents";
            var formContext = CClearPartners.General.Form.GetFormContext();
            formContext.data.refresh(true);
            Xrm.Navigation.openForm(entityFormOptions, parameters).then(
                function (success) {
                    console.log(success);
                },
                function (error) {
                    console.log(error);
                }
            );
        })
        .catch(error => {
            console.error("Error in RunSmartFlow:", error);
            Xrm.Utility.closeProgressIndicator();
            Xrm.Utility.alertDialog(this.statusText);
        })
        .finally(() => {
             // Logic you want no matter if it is succes of error
             Alert.hide();
        });      
    };
    var ooUitnodiging = function (primaryControl) {
        Xrm.Utility.showProgressIndicator("Document OO Uitnodiging Even geduld... het systeem maakt het document aan.")
        var sys_proc_user = "";
        var formContext = CClearPartners.General.Form.GetFormContext();
        var incidentId = formContext.data.entity.getId().replace(/[{}]/g, '').toLowerCase();
        var req = new XMLHttpRequest();
        req.open("GET",Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/ccp_parameters?$select=ccp_value&$filter=ccp_name eq 'Sys_Azure_stedontw-crm_proc'", false);
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
                        sys_proc_user = results.value[i]["ccp_value"];
                    }
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                    Xrm.Utility.closeProgressIndicator();
                }
            }
        };
        req.send();

        var templateName = "Wonen OO uitnodiging consulent";
        Digipolis.Experlogix.RunSmartFlow(templateName, incidentId)
        .then(() => {
            // Success logic
            Xrm.Utility.closeProgressIndicator();
            //Success - No Return Data - Do Something
            //TODO navigeren naar incident  naar tab documenten
            //init the destination after succesfull
            var entityFormOptions = {};
            entityFormOptions["entityName"] = "incident";
            entityFormOptions["entityId"] = incidentId;
            var parameters = {};
            parameters["setfocus_tab"] = "tab_documents";
             var formContext = CClearPartners.General.Form.GetFormContext();
            formContext.data.refresh(true);
            Xrm.Navigation.openForm(entityFormOptions, parameters).then(
                function (success) {
                    console.log(success);
                },
                function (error) {
                    console.log(error);
                }
            );
        })
        .catch(error => {
            console.error("Error in RunSmartFlow:", error);
            Xrm.Utility.closeProgressIndicator();
            Xrm.Utility.alertDialog(this.statusText);
        })
        .finally(() => {
             // Logic you want no matter if it is succes of error
             Alert.hide();
        });      
    };
    var aanwezigheidsAttest = function (primaryControl) {
        Xrm.Utility.showProgressIndicator("Document aanwezigheidsAttest Even geduld... het systeem maakt het document aan.")
        var sys_proc_user = "";
         var formContext = CClearPartners.General.Form.GetFormContext();
        var incidentId = formContext.data.entity.getId().replace(/[{}]/g, '').toLowerCase();
        var req = new XMLHttpRequest();
        req.open("GET",Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/ccp_parameters?$select=ccp_value&$filter=ccp_name eq 'Sys_Azure_stedontw-crm_proc'", false);
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
                        sys_proc_user = results.value[i]["ccp_value"];
                    }
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                    Xrm.Utility.closeProgressIndicator();
                }
            }
        };
        req.send();

        var templateName = "Wonen aanwezigheidsattest";
        Digipolis.Experlogix.RunSmartFlow(templateName, incidentId)
        .then(() => {
            // Success logic
            Xrm.Utility.closeProgressIndicator();
            //Success - No Return Data - Do Something
            //TODO navigeren naar incident  naar tab documenten
            //init the destination after succesfull
            var entityFormOptions = {};
            entityFormOptions["entityName"] = "incident";
            entityFormOptions["entityId"] = incidentId;
            var parameters = {};
            parameters["setfocus_tab"] = "tab_documents";
            var formContext = CClearPartners.General.Form.GetFormContext();
            formContext.data.refresh(true);
            Xrm.Navigation.openForm(entityFormOptions, parameters).then(
                function (success) {
                    console.log(success);
                },
                function (error) {
                    console.log(error);
                }
            );
        })
        .catch(error => {
            console.error("Error in RunSmartFlow:", error);
            Xrm.Utility.closeProgressIndicator();
            Xrm.Utility.alertDialog(this.statusText);
        })
        .finally(() => {
             // Logic you want no matter if it is succes of error
             Alert.hide();
        });      
    };
    var doorverwijsBrief = function (primaryControl) {
        Xrm.Utility.showProgressIndicator("Document doorverwijsBrief Even geduld... het systeem maakt het document aan.")
        var sys_proc_user = "";
        var formContext = CClearPartners.General.Form.GetFormContext();
        var incidentId = formContext.data.entity.getId().replace(/[{}]/g, '').toLowerCase();
        var req = new XMLHttpRequest();
        req.open("GET",Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/ccp_parameters?$select=ccp_value&$filter=ccp_name eq 'Sys_Azure_stedontw-crm_proc'", false);
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
                        sys_proc_user = results.value[i]["ccp_value"];
                    }
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                    Xrm.Utility.closeProgressIndicator();
                }
            }
        };
        req.send();

        var templateName = "Wonen doorverwijsbrief";
        Digipolis.Experlogix.RunSmartFlow(templateName, incidentId)
        .then(() => {
            // Success logic
            Xrm.Utility.closeProgressIndicator();
            //Success - No Return Data - Do Something
            //TODO navigeren naar incident  naar tab documenten
            //init the destination after succesfull
            var entityFormOptions = {};
            entityFormOptions["entityName"] = "incident";
            entityFormOptions["entityId"] = incidentId;
            var parameters = {};
            parameters["setfocus_tab"] = "tab_documents";
            var formContext = CClearPartners.General.Form.GetFormContext();
            formContext.data.refresh(true);
            Xrm.Navigation.openForm(entityFormOptions, parameters).then(
                function (success) {
                    console.log(success);
                },
                function (error) {
                    console.log(error);
                }
            );
        })
        .catch(error => {
            console.error("Error in RunSmartFlow:", error);
            Xrm.Utility.closeProgressIndicator();
            Xrm.Utility.alertDialog(this.statusText);
        })
        .finally(() => {
             // Logic you want no matter if it is succes of error
             Alert.hide();
        });     
    };
    var afspraakHuurdersbond = function (primaryControl) {
        Xrm.Utility.showProgressIndicator("Document afspraakHuurdersbond Even geduld... het systeem maakt het document aan.")
        var sys_proc_user = "";
        var formContext = CClearPartners.General.Form.GetFormContext();
        var incidentId = formContext.data.entity.getId().replace(/[{}]/g, '').toLowerCase();
        var req = new XMLHttpRequest();
        req.open("GET",Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/ccp_parameters?$select=ccp_value&$filter=ccp_name eq 'Sys_Azure_stedontw-crm_proc'", false);
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
                        sys_proc_user = results.value[i]["ccp_value"];
                    }
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                    Xrm.Utility.closeProgressIndicator();
                }
            }
        };
        req.send();

        var templateName = "Wonen Huurdersbond";
        Digipolis.Experlogix.RunSmartFlow(templateName, incidentId)
        .then(() => {
            // Success logic
            Xrm.Utility.closeProgressIndicator();
            //Success - No Return Data - Do Something
            //TODO navigeren naar incident  naar tab documenten
            //init the destination after succesfull
            var entityFormOptions = {};
            entityFormOptions["entityName"] = "incident";
            entityFormOptions["entityId"] = incidentId;
            var parameters = {};
            parameters["setfocus_tab"] = "tab_documents";
            var formContext = CClearPartners.General.Form.GetFormContext();
            formContext.data.refresh(true);
            Xrm.Navigation.openForm(entityFormOptions, parameters).then(
                function (success) {
                    console.log(success);
                },
                function (error) {
                    console.log(error);
                }
            );
        })
        .catch(error => {
            console.error("Error in RunSmartFlow:", error);
            Xrm.Utility.closeProgressIndicator();
            Xrm.Utility.alertDialog(this.statusText);
        })
        .finally(() => {
             // Logic you want no matter if it is succes of error
             Alert.hide();
        });     
    };
    var ontvangstbewijs = function (primaryControl) {
        Xrm.Utility.showProgressIndicator("Document ontvangstbewijs Even geduld... het systeem maakt het document aan.")
        var sys_proc_user = "";
         var formContext = CClearPartners.General.Form.GetFormContext();
        var incidentId = formContext.data.entity.getId().replace(/[{}]/g, '').toLowerCase();
        var req = new XMLHttpRequest();
        req.open("GET",Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/ccp_parameters?$select=ccp_value&$filter=ccp_name eq 'Sys_Azure_stedontw-crm_proc'", false);
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
                        sys_proc_user = results.value[i]["ccp_value"];
                    }
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                    Xrm.Utility.closeProgressIndicator();
                }
            }
        };
        req.send();

        var templateName = "Wonen ontvangstbewijs";
        Digipolis.Experlogix.RunSmartFlow(templateName, incidentId)
        .then(() => {
            // Success logic
            Xrm.Utility.closeProgressIndicator();
            //Success - No Return Data - Do Something
            //TODO navigeren naar incident  naar tab documenten
            //init the destination after succesfull
            var entityFormOptions = {};
            entityFormOptions["entityName"] = "incident";
            entityFormOptions["entityId"] = incidentId;
            var parameters = {};
            parameters["setfocus_tab"] = "tab_documents";
            var formContext = CClearPartners.General.Form.GetFormContext();
            formContext.data.refresh(true);
            Xrm.Navigation.openForm(entityFormOptions, parameters).then(
                function (success) {
                    console.log(success);
                },
                function (error) {
                    console.log(error);
                }
            );
        })
        .catch(error => {
            console.error("Error in RunSmartFlow:", error);
            Xrm.Utility.closeProgressIndicator();
            Xrm.Utility.alertDialog(this.statusText);
        })
        .finally(() => {
             // Logic you want no matter if it is succes of error
             Alert.hide();
        });     
    };
    var cancelCase = function (primaryControl)
    {
        var incidentId = primaryControl.data.entity.getId().replace("{", "").replace("}", "");
    
        var record = {};
        record.statecode = 2; // State
        record.statuscode = 6; // Status

        Xrm.WebApi.updateRecord("incident", incidentId, record).then(
            function success(result) {
                var updatedId = result.id;
                console.log(updatedId);
                primaryControl.data.refresh();
            },
            function(error) {
                var alertStrings = { confirmButtonLabel: "OK", text: error.message, title: "Case kan niet geannuleerd worden" };
                var alertOptions = { height: 120, width: 450 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        console.log("Alert dialog closed");
                    },
                    function (error) {
                        console.log(error.message);
                    }
                );
            }
        );
    };
    return {
        CreateContactMomentDossier: createContactMomentDossier,
        NewCustomerCase: newCustomerCase,
        NewRenovatiebegeleidingCase: newRenovatiebegeleidingCase,
        AdresOvernemen: adresOvernemen,
        ResolveCase: resolveCase,
        CreateServiceActivity: createServiceActivity,
        IsCaseDienstMilieu: isCaseDienstMilieu,
        IsKleinAdvies: isKleinAdvies,
        KopieGegevensPlanning: kopieGegevensPlanning,
        KlantZoekenViaEid: klantZoekenViaEid,
        ZoekCasesViaEid: zoekCasesViaEid,
        StartDocumentDialog: startDocumentDialog,
        OpenPremieTool: openPremieTool,
        EmailNaar: emailNaar,
        OpenInGeoTool: openInGeoTool,
        OoVoorrang: ooVoorrang,
        OoUitnodiging: ooUitnodiging,
        AanwezigheidsAttest: aanwezigheidsAttest,
        DoorverwijsBrief: doorverwijsBrief,
        AfspraakHuurdersbond: afspraakHuurdersbond,
        Ontvangstbewijs: ontvangstbewijs,
        CancelCase: cancelCase
    };
}();