if (typeof (CClearPartners) == "undefined") { CClearPartners = {}; }

CClearPartners.dig_berekening = {
    //*********************************Variables*****************************
	//*******************************Event Handlers**************************
    Form_Onload: function () {
        this.AttachEvents();
        this.LoadForm();
    },
    
    AttachEvents: function(){
        //Xrm.Page.getAttribute("attribute").addOnChange(function);    	
    },

    //*********************************Functions*****************************
    
    LoadForm: function(){
    	if (Xrm.Page.ui.getFormType() == 1){
    		if (Xrm.Page.getAttribute("dig_caseid") != null && Xrm.Page.getAttribute("dig_caseid").getValue() != null){
    			var today = new Date();
    			var name = today.getDate().toString() + "/" + ((today.getMonth() + 1).toString()) + "/" + today.getFullYear().toString() ;
    			name += " - " + Xrm.Page.getAttribute("dig_caseid").getValue()[0].name;
    			Xrm.Page.getAttribute("dig_name").setValue(name);

    			Xrm.Page.data.save().then(
    				function(){
    					Xrm.Utility.openEntityForm("dig_berekening",Xrm.Page.data.entity.getId());
    				}, 
    				function (error){
    					alert(error.message);
    				}
    			);
    		}
    	}
  	},
  	
  	Vernieuw: function(){
  		Xrm.Page.data.refresh(false);
  	}
}