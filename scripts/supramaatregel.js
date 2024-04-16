if (typeof (Digipolis) == "undefined")
	Digipolis = {};

Digipolis.supramaatregel = {
	//*********************************Variables*****************************+
    _formInitialized: false,
    
	//*******************************Event Handlers**************************
	Form_Onload: function (context)
	{
		this.AttachEvents();
		this.LoadForm();
	},
	AttachEvents: function ()
	{
        // Only add events once
        if (this._formInitialized) return;
        
        CClearPartners.General.Form.AddOnChange("dig_type", Digipolis.supramaatregel.OnChange.Type);
        
        this._formInitialized = true;
    },
    
	//*********************************Functions*****************************
	LoadForm: function ()
	{
		Digipolis.supramaatregel.OnChange.Type();
	},
    
	OnChange: 
	{
        Type: function(args){
            var type = CClearPartners.Form.General.GetValue("dig_type");

            var isee = (type == 1 || type == 3);
            var isres = (type == 2 || type == 3);
            
            CClearPartners.General.Form.SetSectionVisible("general","section_finalenergy_ee", isee);
            CClearPartners.General.Form.SetSectionVisible("general","section_finalenergy_res", isres);
        }
	},
    
    Grid: 
    {
        RowSelected: function(context) {
            // Grid context
            context.getFormContext().getData().getEntity().attributes.forEach(function (attr) {
                var name = attr.getName();
                if (name === "dig_name" || name === "dig_type") {
                    attr.controls.forEach(function (c) {
                        c.setDisabled(true);
                    })
                }
            });
        },
    }
}