if (typeof (CClearPartners) == "undefined") { CClearPartners = {}; }

CClearPartners.task = {
    //*********************************Variables*****************************
    _defaultDuration: 5,
    //*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);
        this.AttachEvents();
        this.LoadForm();
    },
    
    AttachEvents: function(){
        CClearPartners.Form.General.AddOnChange("actualstart", CClearPartners.task.CalculateDuration);
        CClearPartners.Form.General.AddOnChange("actualend", CClearPartners.task.CalculateDuration);
    },

    //*********************************Functions*****************************
    
    LoadForm: function(){
        var formContext = CClearPartners.General.Form.GetFormContext();
        if (formContext.ui.getFormType() == 1)
		{
            debugger;
            const tenMinutes = 10 * 60 * 1000; // 10 minutes in milliseconds
            const currentDate = new Date();
            const newDate = new Date(currentDate.getTime() + tenMinutes);
			CClearPartners.General.Form.SetValue("actualstart", newDate);
			var minutes = this._defaultDuration;
			var enddate = new Date(newDate.getTime() + minutes * 60000);
			CClearPartners.General.Form.SetValue("actualend", enddate);
			CClearPartners.task.SetDefaultDuration();
		}
    },
  	SetDefaultDuration: function()
	{
		CClearPartners.General.Form.SetValue("actualdurationminutes", CClearPartners.task._defaultDuration);
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
    },
    MarkeerTaskAlsVoltooid: function(control, selectedItems){
        Xrm.Utility.showProgressIndicator("Taken worden voltooid.");
        debugger;
        console.log("test");
        for (let i = 0; i < selectedItems.length; i++) {
          console.log("item: " + selectedItems[i]);
          var entity = {};
            entity.statecode = 1;
            entity.statuscode = 5;
            debugger;
            Xrm.WebApi.online.updateRecord("task", selectedItems[i], entity).then(
                function success(result) {
                    debugger;
                    var updatedEntityId = result.id;
                    console.log("item " + selectedItems[i] + " updated");
                    if(i == (selectedItems.length -1)){
                        control.refresh();
                        Xrm.Utility.closeProgressIndicator()
                    }
                    
                },
                function(error) {
                    Xrm.Utility.closeProgressIndicator()
                    Xrm.Utility.alertDialog(error.message);
                }
            );  
        }          
    }
}