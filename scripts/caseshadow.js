if (typeof (Digipolis) == "undefined") { Digipolis = {}; }

Digipolis.caseshadow = {
    //*********************************Variables*****************************
	//*******************************Event Handlers**************************
    Form_Onload: function () {
        this.AttachEvents();
        this.LoadForm();
    },
    
    AttachEvents: function(){
    },

    //*********************************Functions*****************************
    
    LoadForm: function(){
 		// Set external reference
        Xrm.Page.Digipolis = Digipolis;  	
  	},
  	
  	Ribbon: {
  		OpenCase: function (primarycontrol,primarytype,primaryid,selectedcontrol,selectedtype,selectedids) {
            if (selectedids != null && selectedids.length > 0) {
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/dig_caseshadows(" + selectedids[0] + ")?$select=_dig_caseid_value", true);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
                req.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
                            var result = JSON.parse(this.response);
                            var _dig_caseid_value = result["_dig_caseid_value"];
                            var _dig_caseid_value_formatted = result["_dig_caseid_value@OData.Community.Display.V1.FormattedValue"];
                            var _dig_caseid_value_lookuplogicalname = result["_dig_caseid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                            
                            var entityFormOptions = {};
                            entityFormOptions["entityName"] = _dig_caseid_value_lookuplogicalname;
                            entityFormOptions["entityId"] = _dig_caseid_value;
                            entityFormOptions["openInNewWindow"] = true;

                            // Open the form.
                            Xrm.Navigation.openForm(entityFormOptions).then(
                                function (success) {
                                    //console.log(success);
                                },
                                function (error) {
                                    console.log("ERROR OpenCase: " + error);
                                });
                        } else {
                            console.log("ERROR OpenCase.Retrieve: " + error);
                        }
                    }
                };
                req.send();
            }
        }
  	},
    
}