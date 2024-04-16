if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

Digipolis.Huurcontact = {
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

        CClearPartners.General.Form.AddOnChange("dig_huuropzeggegeven", Digipolis.Huurcontact.OnChange.HuurCont);
        CClearPartners.General.Form.AddOnChange("dig_huuropzeggekregen", Digipolis.Huurcontact.OnChange.HuurCont);

        this._formInitialized = true;
    },

    //*********************************Functions*****************************

    LoadForm: function () {
        // Set external reference
        Xrm.Page.Digipolis = Digipolis;
        this.OnChange.HuurCont();
    },

    OnChange: {
        HuurCont: function (args) {

            var huuropzegGegeven = CClearPartners.General.Form.GetValue("dig_huuropzeggegeven");
            var huuropzegGekregen = CClearPartners.General.Form.GetValue("dig_huuropzeggekregen");

            // Show/hide fields
            if (huuropzegGegeven == "914380000" || huuropzegGekregen == "914380000") {
                CClearPartners.General.Form.SetFieldVisible("dig_redenopzeg", true);
            }else{
                CClearPartners.General.Form.SetFieldVisible("dig_redenopzeg", false);
            }
            
            
        }
    },


}