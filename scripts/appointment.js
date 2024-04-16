if (typeof (CClearPartners) == "undefined") { CClearPartners = {}; }

CClearPartners.appointment = {
    //*********************************Variables*****************************
    //*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);
        this.AttachEvents();
        this.LoadForm();
    },
    
    AttachEvents: function(){
        CClearPartners.Form.General.AddOnChange("actualstart", CClearPartners.appointment.CalculateDuration);
        CClearPartners.Form.General.AddOnChange("actualend", CClearPartners.appointment.CalculateDuration);
    },

    //*********************************Functions*****************************
    
    LoadForm: function(){
        
    },
  	
    CalculateDuration: function() {
        var formContext = CClearPartners.General.Form.GetFormContext();
		var actualStartObj = formContext.getAttribute("actualstart");
		var actualEndObj = formContext.getAttribute("actualend");
 		var durationinMinutesObj = formContext.getAttribute("actualdurationminutes");
 		
 		if (actualStartObj != null && actualEndObj != null && durationinMinutesObj != null) {
       		var actualStart = actualStartObj.getValue();
       		var actualEnd = actualEndObj.getValue();
         	if (actualStart != null && actualEnd != null) {
            	var dateDifference = Math.abs(actualEnd - actualStart);
            	var durationInMinutes = Math.floor((dateDifference / 1000) / 60);
				durationinMinutesObj.setValue(durationInMinutes);
         	}
     	}
    }
}