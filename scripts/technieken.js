if (typeof (Digipolis) == "undefined") { Digipolis = {}; }

Digipolis.Technieken = {
    //*********************************Variables*****************************
    _formInitialized: false,
    _rlambda: [],
    
	//*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);

        this.AttachEvents();
        this.LoadForm();
    },
    
    AttachEvents: function(){       
        // Only add events once
        if (this._formInitialized) return;
       
        this._formInitialized = true;
    },

    //*********************************Functions*****************************
    
    LoadForm: function(){
        this.setDefaults();
  	},
    
    OnChange: {
        
    },
    
    Ribbon: {

    },
  
    setDefaults: function(){
        var dig_adviesid = CClearPartners.General.Form.GetValue("dig_adviesid");
        CClearPartners.General.Form.SetFieldVisible("header_dig_adviesid", (dig_adviesid != null && dig_adviesid.length > 0));
	
        var dig_scanid = CClearPartners.General.Form.GetValue("dig_scanid");
        CClearPartners.General.Form.SetFieldVisible("header_dig_scanid", (dig_scanid != null && dig_scanid.length > 0));	
    },
    
}
