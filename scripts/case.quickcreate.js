if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

if (typeof (Digipolis.Case) == "undefined") {
    Digipolis.Case = {};
}
	
Digipolis.Case.QuickCreate = {
    //*********************************Variables*****************************
    _formInitialized: false,
    
	//*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);

        this.AttachEvents();
        this.LoadForm();
    },
    
    AttachEvents: function(){       
        // Only add events once
        if (this._formInitialized) return;

        CClearPartners.General.Form.AddOnChange("casetypecode", Digipolis.Case.QuickCreate.OnChange.CaseTypeCode);
      
        this._formInitialized = true;
    },

    //*********************************Functions*****************************
    
    LoadForm: function(){
		// Set external reference
        Xrm.Page.Digipolis = Digipolis;
		this.SetWooneenheidDetails();
  	},
    
    OnChange: {
        CaseTypeCode: function() {
            // if opvolgscan: set vorige case to last created ES
            // Get last created case + values
            var casetypecode = CClearPartners.General.Form.GetValue("casetypecode");
            var dig_wooneenheid = CClearPartners.General.Form.GetValue("dig_wooneenheid");

            var isopvolgscan = (casetypecode == 37 || casetypecode == 38 || casetypecode == 39 || casetypecode == 40 || casetypecode == 46);
            if (isopvolgscan && dig_wooneenheid != null && dig_wooneenheid.length > 0) {
                
                var id = dig_wooneenheid[0].id.replace('{','').replace('}','').toLowerCase();
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/incidents?$select=incidentid,title&$filter=_dig_wooneenheid_value eq " +  id + " and casetypecode eq 35 &$orderby=createdon desc", true);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("Prefer", "odata.include-annotations=\"*\",odata.maxpagesize=1");
                req.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
                            var results = JSON.parse(this.response);
                            for (var i = 0; i < results.value.length; i++) {
                                var incidentid = results.value[i]["incidentid"];
                                var title = results.value[i]["title"];
                                CClearPartners.General.Form.SetLookupValue("dig_vorigecaseid",  incidentid, title, "incident");
                            }
                        } else {
                            console.log("OnChange.CaseTypeCode ERROR: " + this.statusText);
                        }
                    }
                };
                req.send();
            }
        }
    },
    
    SetWooneenheidDetails: function(){
        var dig_wooneenheid = CClearPartners.General.Form.GetValue("dig_wooneenheid");

        if (dig_wooneenheid != null && dig_wooneenheid.length > 0) {
            var id = dig_wooneenheid[0].id.replace('{','').replace('}','').toLowerCase();
            var cols = "caseorigincode,_customerid_value,dig_gsm,dig_email,dig_telefoon,_dig_hoedanigheid_value,_dig_doelgroep_value"
            // Get last created case + values
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/incidents?$select=" + cols + "&$filter=_dig_wooneenheid_value eq " +  id + "&$orderby=createdon desc", true);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("Prefer", "odata.include-annotations=\"*\",odata.maxpagesize=1");
            req.onreadystatechange = function() {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var results = JSON.parse(this.response);
                        for (var i = 0; i < results.value.length; i++) {
                            var caseorigincode = results.value[i]["caseorigincode"];
                            var dig_gsm = results.value[i]["dig_gsm"];
                            var dig_email = results.value[i]["dig_email"];
                            var dig_telefoon = results.value[i]["dig_telefoon"];
                            
                            CClearPartners.General.Form.SetValue("caseorigincode", caseorigincode);
                            CClearPartners.General.Form.SetValue("dig_gsm", dig_gsm);
                            CClearPartners.General.Form.SetValue("dig_email", dig_email);
                            CClearPartners.General.Form.SetValue("dig_telefoon", dig_telefoon);
                            
                            var _customerid_value = results.value[i]["_customerid_value"];
                            var _customerid_type = results.value[i]["_customerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                            var _customerid_name = results.value[i]["_customerid_value@OData.Community.Display.V1.FormattedValue"];
                            var _dig_hoedanigheid_value = results.value[i]["_dig_hoedanigheid_value"];
                            var _dig_hoedanigheid_type = results.value[i]["_dig_hoedanigheid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                            var _dig_hoedanigheid_name = results.value[i]["_dig_hoedanigheid_value@OData.Community.Display.V1.FormattedValue"];
                            var _dig_doelgroep_value = results.value[i]["_dig_doelgroep_value"];
                            var _dig_doelgroep_type = results.value[i]["_dig_doelgroep_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                            var _dig_doelgroep_name = results.value[i]["_dig_doelgroep_value@OData.Community.Display.V1.FormattedValue"];
                            if (_customerid_value != null) CClearPartners.General.Form.SetLookupValue("customerid",  _customerid_value, _customerid_name, _customerid_type);
                            if (_dig_hoedanigheid_value != null) CClearPartners.General.Form.SetLookupValue("dig_hoedanigheid",  _dig_hoedanigheid_value, _dig_hoedanigheid_name, _dig_hoedanigheid_type);
                            if (_customerid_value != null) CClearPartners.General.Form.SetLookupValue("dig_doelgroep",  _customerid_value, _customerid_name, _customerid_type);
                        }
                    } else {
                        console.log("SetWooneenheidDetails ERROR: " + this.statusText);
                    }
                }
            };
            req.send();
        }
    }
}