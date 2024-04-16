if (typeof (CClearPartners) == "undefined") {
    CClearPartners = {};
}

if (typeof (CClearPartners.Form) == "undefined") {
    CClearPartners.Form = {};
}

CClearPartners.Form.Partner = function () {
    //*********************************Variables*****************************
	var customlookups = {};

    //*******************************Event Handlers**************************
    var formInitialized = false;
    var onLoad = function (executionContext) {
        CClearPartners.General.Form.SetFormContext(executionContext);
        
    	onChange.Manueel();

        // Only add events once
        if (formInitialized) return;
        CClearPartners.Form.General.AddOnChange("dig_persoon", onChange.Persoon);
        CClearPartners.Form.General.AddOnChange("dig_organisatie", onChange.Organisatie);
        CClearPartners.Form.General.AddOnChange("dig_manueel", onChange.Manueel);
        formInitialized = true;
    };
/*
•Logica aanmaken op partner entiteit. 
Organisatie, functie, telefoonnummer en GSM automatisch invullen indien bij persoon een prof. persoon wordt ingevuld. 
Indien een organisatie wordt ingevuld, moet het standaard telefoonnummer van de organisatie overgenomen worden. 
*/
    var onChange = {
        Persoon: function () {
            var persoon = CClearPartners.Form.General.GetValue("dig_persoon");
            
            // Default values
            var firstname = null;
            var lastname = null;
            var organisation = null;
            var functie = null;
            var tel = null;
            var gsm = null;
            var email = null;
            var orgId = null;
            var orgName = null;
            var orgLogicalName = null;
            
			if (persoon != null){
            
                debugger;
            
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/contacts(" + persoon[0].id.slice(1,-1) + ")?$select=telephone1,emailaddress1,firstname,jobtitle,ves_gsmnummernummer,lastname,mobilephone,_parentcustomerid_value,ves_telefoonnummernummers,ves_type", false);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Prefer", "odata.include-annotations=*");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
                            var result = JSON.parse(this.response);
                            console.log(result);                         

                            // Columns
                            tel = result["telephone1"]; // Text
                            email = result["emailaddress1"]; // Text
                            firstname = result["firstname"]; // Text
                            functie = result["jobtitle"]; // Text
                            lastname = result["lastname"]; // Text
                            gsm = result["mobilephone"]; // Text
                            if(result["_parentcustomerid_value"] != null) orgId = result["_parentcustomerid_value"]; // Customer
                            if(result["_parentcustomerid_value@OData.Community.Display.V1.FormattedValue"] != null) orgName = result["_parentcustomerid_value@OData.Community.Display.V1.FormattedValue"];
                            if(result["_parentcustomerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"] != null) orgLogicalName = result["_parentcustomerid_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                        } else {
                            //Do nothing
                        }
                    }
                };
                req.send();
			}
			
			CClearPartners.Form.General.SetValue("dig_voornaam",firstname);
			CClearPartners.Form.General.SetValue("dig_naam",lastname);
			CClearPartners.Form.General.SetValue("dig_organisatiemanueel",organisation);
			CClearPartners.Form.General.SetValue("dig_functie",functie);
			CClearPartners.Form.General.SetValue("dig_telefoonnummer",tel);
			CClearPartners.Form.General.SetValue("dig_gsmnummer",gsm);
			CClearPartners.Form.General.SetValue("dig_emailadres",email);
			if (orgId != null && orgName != null && orgLogicalName != null) CClearPartners.Form.General.SetLookupValue("dig_organisatie", orgId, orgName, orgLogicalName);			
			// Call onChange.Organisatie
			onChange.Organisatie();
        },
        Organisatie: function () {
        	// BC 11/09/2015: disable organisation tel retrieve.
        },
        Manueel: function(args) {
        	var manueel = CClearPartners.Form.General.GetValue("dig_manueel");
        	
        	for (cli in customlookups["dig_persoon"]){
				var scope = customlookups["dig_persoon"][cli];
	        	if (manueel){
	        		if (args != null) updateCustomLookupField(scope, null);
	        		scope.disable(true);
	        	} else {
	        		scope.disable(false);
	        	}
        	}
        }
    };
    
  	var ribbon = {
  		AddNew: {
            Execute: function (selectedtype,selectedcontrol,primaryid,primarycontrol) {
                var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();
                var searchfor = (selectedcontrol.name == "grdPartners") ? "contact" : "account";
                var title = primarycontrol.getAttribute("title").getValue();

                var callback = function (id, name, type) {
                    // clear callback
                    CClearPartners.General.Form.RegisterAlertCallback("zoekklantCallback", null);
                        
                    if (id) { 
                        Alert.show("Nieuwe partner", "De partner wordt aangemaakt...", null, "LOADING", 500, 250, url, true);

                        var entity = {};
                        entity["dig_caseid@odata.bind"] = "/incidents(" + primaryid.replace('{', '').replace('}', '') + ")";
                        entity.dig_manueel = false;
                        
                        if (type == "account") {
                            entity.dig_typepartner = (selectedcontrol.name == "sg_doorverwijzigen_woonwijzer") ? 2 : 3;
                            entity["dig_organisatie@odata.bind"] = "/accounts(" + id + ")";
                        } else {
                            entity.dig_typepartner = 1;
                            entity["dig_persoon@odata.bind"] = "/contacts(" + id + ")";
                            
                            
                            var req = new XMLHttpRequest();
                            var url = "/api/data/v9.1/contacts(" + id + ")?$select=firstname,lastname,emailaddress1,ves_telefoonnummernummers,ves_gsmnummernummer,jobtitle,_parentcustomerid_value";
                            req.open("GET", serverUrl + url, false);
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
                                        entity.dig_voornaam = result["firstname"];
                                        entity.dig_naam = result["lastname"];
                                        
                                        entity.dig_emailadres = result["emailaddress1"];
                                        entity.dig_gsmnummer = result["ves_gsmnummernummer"];
                                        entity.dig_telefoonnummer = result["ves_telefoonnummernummers"];
                                        
                                        entity.dig_functie = result["jobtitle"];
                                        if (result["_parentcustomerid_value"])
                                            entity["dig_organisatie@odata.bind"] = "/accounts(" + result["_parentcustomerid_value"] + ")";
                                    } else {
                                        console.log("ERROR retrieve contact: " + this.statusText);
                                    }
                                }
                            };
                            req.send();
                        }

                        var req = new XMLHttpRequest();
                        req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/dig_partnerses", true);
                        req.setRequestHeader("OData-MaxVersion", "4.0");
                        req.setRequestHeader("OData-Version", "4.0");
                        req.setRequestHeader("Accept", "application/json");
                        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                        req.onreadystatechange = function() {
                            if (this.readyState === 4) {
                                req.onreadystatechange = null;
                                if (this.status === 204) {
                                    var uri = this.getResponseHeader("OData-EntityId");
                                    var regExp = /\(([^)]+)\)/;
                                    var matches = regExp.exec(uri);
                                    var newEntityId = matches[1];
                                    // Refresh grid
                                    if (selectedcontrol && selectedcontrol.refresh) {
                                        selectedcontrol.refresh();
                                    }
                                } else {
                                    console.log("ERROR create partner: " + this.statusText);
                                }
                                Alert.hide();
                            }
                        };
                        req.send(JSON.stringify(entity));
                    } else {
                        var formParameters = {
                            dig_caseid: primaryid,
                            dig_caseidname: title,
                            //dig_caseidtype = "incident"; // Table name. 
                            dig_manueel: true
                        };
                    
                        // Open quick create                   
                        var entityFormOptions = {};
                        entityFormOptions["entityName"] = "dig_partners";
                        entityFormOptions["useQuickCreateForm"] = true;

                        // Open the form.
                        Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
                            function (success) {
                                console.log(success);
                            },
                            function (error) {
                                console.log(error);
                            });
                    }
                };

                var customParameters = "SearchFor=" + searchfor;
                
                //don't allow search in magda
                customParameters += "&allowmagdasearch=0";
                customParameters = encodeURIComponent(customParameters);
                           
                var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
                Alert.showWebResource("ves_/zoekklant/zoeken.html?Data=" + customParameters, 1200, height, "Zoek partner", null, serverUrl, false, 10);

                CClearPartners.General.Form.RegisterAlertCallback("zoekklantCallback", callback);
            }
        }
  	};
    //*****************************Private Functions*************************


    
    var customLookups = {
        Vesta: function(a){
            var serverUrl =Xrm.Utility.getGlobalContext().getClientUrl();
                        
            var field = a.attributes.LogicalName;
            var account = CClearPartners.General.Form.GetValue(field);
            var entityid = (account == null) ? null : account[0].id;
            var searchfor = "contact";

            var callback = function (id, name, type) {
                if (id) { 
                    CClearPartners.General.Form.SetLookupValue(field, id, name, type);
                }
            };

            var customParameters = "SearchFor=" + searchfor + "&profcontact=1&inactivecontact=0";
            
            //don't allow search in magda
            customParameters += "&allowmagdasearch=0";
            customParameters = encodeURIComponent(customParameters);
            
            var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
            Alert.showWebResource("ves_/zoekklant/zoeken.html?Data=" + customParameters, 1200, height, "Zoek partner", null, serverUrl, false, 10);

            CClearPartners.General.Form.RegisterAlertCallback("zoekklantCallback", callback);
        },
    };
    
	
	
    return {
        OnLoad: onLoad,
        CustomLookups: customLookups,
        Ribbon: ribbon
    };
}()