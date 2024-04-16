if (typeof (Digipolis) == "undefined") { Digipolis = {}; }

Digipolis.gezinslid = {
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
 		
  	},
  	
  	Ribbon: {
  		AddNew: {
            Execute: function (selectedtype,primarytype,primaryid,primarycontrol) {
                var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();
                var searchfor = "contact";
                var title = primarycontrol.getAttribute("title").getValue();

                var callback = function (id, name, type) {
                    var formParameters = {
                            dig_caseid: primaryid,
                            dig_caseidname: title,
                            //dig_caseidtype = "incident"; // Table name. 
                        };
                        
                    if (id) { 
                        // Get contact data
                        var req = new XMLHttpRequest();
                        var url = "/api/data/v9.1/contacts(" + id + ")?$select=birthdate,firstname,gendercode,lastname,ves_rijksregisternummer";
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
                                    formParameters.dig_geboortedatum = result.birthdate;
                                    formParameters.dig_voornaam = result.firstname;
                                    formParameters.dig_geslacht = result.gendercode;
                                    formParameters.dig_naam = result.lastname;
                                    formParameters.dig_rijkregisternummer = result.ves_rijksregisternummer;
                                } else {
                                    console.log("ERROR retrieve contact: " + this.statusText);
                                }
                            }
                        };
                        req.send();
                    }
                    
                    // Open quick create                   
                    var entityFormOptions = {};
                    entityFormOptions.entityName = "dig_gezinslid";
                    entityFormOptions.useQuickCreateForm = true;

                    // Open the form.
                    Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
                        function (success) {
                            console.log(success);
                        },
                        function (error) {
                            console.log(error);
                        });
                };

                var customParameters = "SearchFor=" + searchfor;
                
                //don't allow search in magda
                customParameters += "&allowmagdasearch=0";
                customParameters = encodeURIComponent(customParameters);
                
                var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
                Alert.showWebResource("ves_/zoekklant/zoeken.html?Data=" + customParameters, 1200, height, "Zoek gezinslid", null, serverUrl, false, 10);

                CClearPartners.General.Form.RegisterAlertCallback("zoekklantCallback", callback);
            }
        }
  	},
    
};