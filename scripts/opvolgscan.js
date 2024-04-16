if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

var customlookups = {};

Digipolis.Opvolgscan = {
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

        CClearPartners.General.Form.AddOnChange("dig_mod_abnormaalenergieverbruik", Digipolis.Opvolgscan.OnChange.AbnormaalEnergieverbruik);
        CClearPartners.General.Form.AddOnChange("dig_mod_energiebesparendemaatregelen", Digipolis.Opvolgscan.OnChange.EnergieBesparendeMaatregelen);
        CClearPartners.General.Form.AddOnChange("dig_mod_evaluatieenherhalingtips", Digipolis.Opvolgscan.OnChange.EvaluatieEnHerhalingTips);
        CClearPartners.General.Form.AddOnChange("dig_mod_grondigecontrolefacturen", Digipolis.Opvolgscan.OnChange.GrondigeControleFacturen);
        CClearPartners.General.Form.AddOnChange("dig_mod_socialerechtenenpremies", Digipolis.Opvolgscan.OnChange.SocialeRechtenEnPremies);
        CClearPartners.General.Form.AddOnChange("dig_mod_leverancierswissel", Digipolis.Opvolgscan.OnChange.Leverancierswissel);

        this._formInitialized = true;
    },

    //*********************************Functions*****************************

    LoadForm: function () {
        
        this.OnChange.AbnormaalEnergieverbruik();
        this.OnChange.EnergieBesparendeMaatregelen();
        this.OnChange.EvaluatieEnHerhalingTips();
        this.OnChange.GrondigeControleFacturen();
        this.OnChange.SocialeRechtenEnPremies();
        this.OnChange.Leverancierswissel();
    },

    OnChange: {
        AbnormaalEnergieverbruik: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_mod_abnormaalenergieverbruik");
            CClearPartners.General.Form.SetTabVisible("tab_mod5", (ischecked == true));
        },
        EnergieBesparendeMaatregelen: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_mod_energiebesparendemaatregelen");
            CClearPartners.General.Form.SetTabVisible("tab_mod2", (ischecked == true));
        },
        EvaluatieEnHerhalingTips: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_mod_evaluatieenherhalingtips");
            CClearPartners.General.Form.SetTabVisible("tab_mod4", (ischecked == true));
        },
        GrondigeControleFacturen: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_mod_grondigecontrolefacturen");
            CClearPartners.General.Form.SetTabVisible("tab_mod6", (ischecked == true));
        },
        SocialeRechtenEnPremies: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_mod_socialerechtenenpremies");
            CClearPartners.General.Form.SetTabVisible("tab_mod3", (ischecked == true));
        },
        Leverancierswissel: function (args) {
            var ischecked = CClearPartners.General.Form.GetValue("dig_mod_leverancierswissel");
            CClearPartners.General.Form.SetTabVisible("tab_mod1", (ischecked == true));
        },
    },
    Ribbon: {
    },
    CustomLookups: {
        Controls: [],

        Vesta: function (a) {
            var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();

            var field = a.attributes.LogicalName;
            var account = CClearPartners.General.Form.GetValue(field);
            var entityid = (account == null) ? null : account[0].id;
            var searchfor = ((field == "customerid") ? "customer" : ((field == "dig_eigenaar" || field == "dig_huurder" || field == "dig_syndicusid" || field == "dig_verhuurder") ? "contact" : "account"));
            var title = ((field == "customerid") ? "klant" : ((field == "dig_eigenaar" || field == "dig_huurder" || field == "dig_syndicusid" || field == "dig_verhuurder") ? "persoon" : "organisatie"));

            var callback = function (id, name, type) {
                if (id) {
                    CClearPartners.General.Form.SetLookupValue(field, id, name, type);
                }
            };

            var customParameters = encodeURIComponent("SearchFor=" + searchfor + "&EntityId=" + entityid);
            var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
            Alert.showWebResource("ves_/zoekklant/zoeken.html?Data=" + customParameters, 1200, height, "Zoek " + title, null, serverUrl, false, 10);

            CClearPartners.General.Form.RegisterAlertCallback("zoekklantCallback", callback);
        },
    },

};