if (typeof (Digipolis) == "undefined") { Digipolis = {}; }

Digipolis.Basiswoonkwaliteit = {
    //*********************************Variables*****************************
    _formInitialized: false,

    //*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);
        this.AttachEvents();
        this.LoadForm();
    },

    AttachEvents: function () {
        if (Digipolis.Basiswoonkwaliteit._formInitialized) return;

        CClearPartners.General.Form.AddOnChange("dig_elektriciteitsinstallatie", Digipolis.Basiswoonkwaliteit.OnChange.Toelichting);
        CClearPartners.General.Form.AddOnChange("dig_stabiliteitsproblemen", Digipolis.Basiswoonkwaliteit.OnChange.Toelichting);
        CClearPartners.General.Form.AddOnChange("dig_brandofontploffingsgevaar", Digipolis.Basiswoonkwaliteit.OnChange.BrandGevaar);
        CClearPartners.General.Form.AddOnChange("dig_rookmeldersaanwezig", Digipolis.Basiswoonkwaliteit.OnChange.BrandGevaar);
        CClearPartners.General.Form.AddOnChange("dig_vochtprobleem", Digipolis.Basiswoonkwaliteit.OnChange.Toelichting);
        CClearPartners.General.Form.AddOnChange("dig_basisvoorzieningsanitair", Digipolis.Basiswoonkwaliteit.OnChange.Toelichting);
        CClearPartners.General.Form.AddOnChange("dig_lodendrinkwaterleidingen", Digipolis.Basiswoonkwaliteit.OnChange.Toelichting);
        CClearPartners.General.Form.AddOnChange("dig_afvoerleidingen", Digipolis.Basiswoonkwaliteit.OnChange.Toelichting);
        CClearPartners.General.Form.AddOnChange("dig_asbest", Digipolis.Basiswoonkwaliteit.OnChange.Toelichting);
        CClearPartners.General.Form.AddOnChange("dig_cogevaar", Digipolis.Basiswoonkwaliteit.OnChange.Toelichting);
        CClearPartners.General.Form.AddOnChange("dig_valgevaar", Digipolis.Basiswoonkwaliteit.OnChange.Toelichting);
        CClearPartners.General.Form.AddOnChange("dig_geluidsbelasteomgeving", Digipolis.Basiswoonkwaliteit.OnChange.Toelichting);

        Digipolis.Basiswoonkwaliteit._formInitialized = true;
    },

    //*********************************Functions*****************************

    LoadForm: function () {
        
        this.setDefaults();

        Digipolis.Basiswoonkwaliteit.OnChange.Toelichting("dig_elektriciteitsinstallatie");
        Digipolis.Basiswoonkwaliteit.OnChange.Toelichting("dig_stabiliteitsproblemen");
        Digipolis.Basiswoonkwaliteit.OnChange.Toelichting("dig_vochtprobleem");
        Digipolis.Basiswoonkwaliteit.OnChange.Toelichting("dig_basisvoorzieningsanitair");
        Digipolis.Basiswoonkwaliteit.OnChange.Toelichting("dig_lodendrinkwaterleidingen");
        Digipolis.Basiswoonkwaliteit.OnChange.Toelichting("dig_afvoerleidingen");
        Digipolis.Basiswoonkwaliteit.OnChange.Toelichting("dig_asbest");
        Digipolis.Basiswoonkwaliteit.OnChange.Toelichting("dig_cogevaar");
        Digipolis.Basiswoonkwaliteit.OnChange.Toelichting("dig_valgevaar");
        Digipolis.Basiswoonkwaliteit.OnChange.Toelichting("dig_geluidsbelasteomgeving");
        Digipolis.Basiswoonkwaliteit.OnChange.BrandGevaar();
    },

    OnChange: {
        BrandGevaar: function (args) {
            // We need to check 2 field values here...
            var value1 = CClearPartners.General.Form.GetValue("dig_brandofontploffingsgevaar");
            var hasvalue1 = (value1 != null && value1 !== false);
            var value2 = CClearPartners.General.Form.GetValue("dig_rookmeldersaanwezig");
            var hasvalue2 = (value2 != null && value2 !== false);
            console.log("Show/Hide Toelichting dig_brandofontploffingsgevaar: " + hasvalue1 + "+" + hasvalue2);
            CClearPartners.General.Form.SetFieldVisible("dig_brandofontploffingsgevaartoelichting", hasvalue1 || hasvalue2);
        },
        Toelichting: function (args) {
            if (args != null) {
                if (args.getEventSource != null && args.getEventSource().getName() != null) {
                    // onchange event
                    Digipolis.Basiswoonkwaliteit.ShowToelichting(args.getEventSource().getName());
                } else if (typeof args == "string") {
                    // direct text
                    Digipolis.Basiswoonkwaliteit.ShowToelichting(args);
                }
            }
        },
    },

    Ribbon: {
    },

    setDefaults: function () {
        var dig_adviesid = CClearPartners.General.Form.GetValue("dig_adviesid");
        CClearPartners.General.Form.SetFieldVisible("header_dig_adviesid", (dig_adviesid != null && dig_adviesid.length > 0));

        var dig_scanid = CClearPartners.General.Form.GetValue("dig_scanid");
        CClearPartners.General.Form.SetFieldVisible("header_dig_scanid", (dig_scanid != null && dig_scanid.length > 0));
    },

    ShowToelichting: function (sourceattribute) {

        var value = CClearPartners.General.Form.GetValue(sourceattribute);
        var hasvalue = (value != null && value !== false);
        console.log("Show/Hide Toelichting " + sourceattribute + ": " + hasvalue);
        CClearPartners.General.Form.SetFieldVisible(sourceattribute + "toelichting", hasvalue);
    }
}