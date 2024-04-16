if (typeof (CClearPartners) == "undefined") {
    CClearPartners = {};
}

CClearPartners.dig_wooneenheid = {
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
        
        if (CClearPartners.General.Form.GetFormContext().getAttribute("dig_oovantoepassing") != null) {
            CClearPartners.General.Form.AddOnChange("dig_oovantoepassing", CClearPartners.dig_wooneenheid.OnChange.OOVanToepassing);
        }
        if (CClearPartners.General.Form.GetFormContext().getAttribute("dig_typewoning") != null) {
            CClearPartners.General.Form.AddOnChange("dig_typewoning", CClearPartners.dig_wooneenheid.OnChange.TypeWoning);
        }
        if (CClearPartners.General.Form.GetFormContext().getAttribute("dig_stedebouwkundigevergunning") != null) {
            CClearPartners.General.Form.AddOnChange("dig_stedebouwkundigevergunning", CClearPartners.dig_wooneenheid.OnChange.StedenbouwkundigeVergunning);
        }
        if (CClearPartners.General.Form.GetFormContext().getAttribute("dig_epccijferrenovatie") != null) {
            CClearPartners.General.Form.AddOnChange("dig_epccijferrenovatie", CClearPartners.dig_wooneenheid.OnChange.EPClabel);
        }
        if (CClearPartners.General.Form.GetFormContext().getAttribute("dig_epccijfernarenovatie") != null) {
            CClearPartners.General.Form.AddOnChange("dig_epccijfernarenovatie", CClearPartners.dig_wooneenheid.OnChange.EPClabel);
        }
        if (CClearPartners.General.Form.GetFormContext().getAttribute("dig_oovantoepassing") != null) {
            CClearPartners.General.Form.AddOnChange("dig_oovantoepassing", CClearPartners.dig_wooneenheid.OnChange.Bijzonderheden);
        }
        //EAN velden
        if (CClearPartners.General.Form.GetFormContext().getAttribute("dig_eannummerelektriciteit") != null) {
            CClearPartners.General.Form.GetFormContext().getAttribute("dig_eannummerelektriciteit").addOnChange(function() { CClearPartners.dig_wooneenheid.OnChange.CheckEANNumber("dig_eannummerelektriciteit") });
        }
        if (CClearPartners.General.Form.GetFormContext().getAttribute("dig_eannummergas") != null) {
            CClearPartners.General.Form.GetFormContext().getAttribute("dig_eannummergas").addOnChange(function() { CClearPartners.dig_wooneenheid.OnChange.CheckEANNumber("dig_eannummergas") });
        }
        if (CClearPartners.General.Form.GetFormContext().getAttribute("dig_eannummerelektriciteitgemeenschappelijketeller") != null) {
            CClearPartners.General.Form.GetFormContext().getAttribute("dig_eannummerelektriciteitgemeenschappelijketeller").addOnChange(function() { CClearPartners.dig_wooneenheid.OnChange.CheckEANNumber("dig_eannummerelektriciteitgemeenschappelijketeller") });
        }
        if (CClearPartners.General.Form.GetFormContext().getAttribute("dig_eannummergasgemeenschappelijketeller") != null) {
            CClearPartners.General.Form.GetFormContext().getAttribute("dig_eannummergasgemeenschappelijketeller").addOnChange(function() { CClearPartners.dig_wooneenheid.OnChange.CheckEANNumber("dig_eannummergasgemeenschappelijketeller") });
        }

        this._formInitialized = true;
    },

    //*********************************Functions*****************************

    LoadForm: function () {
        // Set external reference
        Xrm.Page.CClearPartners = CClearPartners;
        //Xrm.Page.Digipolis = Digipolis;

        CClearPartners.dig_wooneenheid.CheckVestaId();

        this.OnChange.OOVanToepassing();
        this.OnChange.TypeWoning();
        this.OnChange.StedenbouwkundigeVergunning();
        this.OnChange.EPClabel();
        this.OnChange.Bijzonderheden();
        this.showDocumentTab();
    },

    OnChange: {
        OOVanToepassing: function () {
            var dig_oovantoepassing = CClearPartners.General.Form.GetValue("dig_oovantoepassing");

            CClearPartners.General.Form.SetFieldVisible("dig_ongeschiktverklaringvlaamsewooncode", dig_oovantoepassing == true);
            CClearPartners.General.Form.SetFieldVisible("dig_onbewoonbaarverklaringvlaamsewooncode", dig_oovantoepassing == true);
            CClearPartners.General.Form.SetFieldVisible("dig_onbewoonbaarverklaringart135ng", dig_oovantoepassing == true);
        },
        TypeWoning: function () {
            var dig_typewoning = CClearPartners.General.Form.GetValue("dig_typewoning");
            var isAppartement = (dig_typewoning == 10);

            CClearPartners.General.Form.SetFieldVisible("dig_aantalappartementen", isAppartement);
        },
        StedenbouwkundigeVergunning: function () {
            var dig_stedebouwkundigevergunning = CClearPartners.General.Form.GetValue("dig_stedebouwkundigevergunning");
            CClearPartners.General.Form.SetFieldVisible("dig_opmerkingstedebouwkundigevergunning", dig_stedebouwkundigevergunning == true);
        },
        EPClabel: function () {
            var cijferVoorreno = CClearPartners.General.Form.GetValue("dig_epccijferrenovatie");
            var cijferNareno = CClearPartners.General.Form.GetValue("dig_epccijfernarenovatie");

            if (cijferNareno == null) {
                CClearPartners.General.Form.SetValue("dig_epclabelnarenovatie", null);
            }
            if (cijferVoorreno == null) {
                CClearPartners.General.Form.SetValue("dig_epclabelnarenovatie", null);
            }

            //berekening voorrenovatie 
            if (cijferVoorreno < 0) {
                CClearPartners.General.Form.SetValue("dig_epclabelvoorrenovatie", 0);              
            }else if (cijferVoorreno < 100 && cijferVoorreno >= 0) {
                CClearPartners.General.Form.SetValue("dig_epclabelvoorrenovatie", 1);
            }else if (cijferVoorreno < 200 && cijferVoorreno >= 100) {
                CClearPartners.General.Form.SetValue("dig_epclabelvoorrenovatie", 2);
            }else if (cijferVoorreno < 300 && cijferVoorreno >= 200) {
                CClearPartners.General.Form.SetValue("dig_epclabelvoorrenovatie", 3);
            }else if (cijferVoorreno < 400 && cijferVoorreno >= 300) {
                CClearPartners.General.Form.SetValue("dig_epclabelvoorrenovatie", 4);
            }else if (cijferVoorreno < 500 && cijferVoorreno >= 400) {
                CClearPartners.General.Form.SetValue("dig_epclabelvoorrenovatie", 5);
            }else if (cijferVoorreno >= 500) {
                CClearPartners.General.Form.SetValue("dig_epclabelvoorrenovatie", 6);
            }

            //set empty if value is null
            if (cijferVoorreno == null) {
                CClearPartners.General.Form.SetValue("dig_epclabelvoorrenovatie", null);              
            }
            

            //berekening na de renovatie 
            if (cijferNareno < 0) {
                CClearPartners.General.Form.SetValue("dig_epclabelnarenovatie", 0);
            }else if (cijferNareno < 100 && cijferNareno >= 0) {
                CClearPartners.General.Form.SetValue("dig_epclabelnarenovatie", 1);
            }else if (cijferNareno < 200 && cijferNareno >= 100) {
                CClearPartners.General.Form.SetValue("dig_epclabelnarenovatie", 2);
            }else if (cijferNareno < 300 && cijferNareno >= 200) {
                CClearPartners.General.Form.SetValue("dig_epclabelnarenovatie", 3);
            }else if (cijferNareno < 400 && cijferNareno >= 300) {
                CClearPartners.General.Form.SetValue("dig_epclabelnarenovatie", 4);
            }else if (cijferNareno < 500 && cijferNareno >= 400) {
                CClearPartners.General.Form.SetValue("dig_epclabelnarenovatie", 5);
            }else if (cijferNareno >= 500) {
                CClearPartners.General.Form.SetValue("dig_epclabelnarenovatie", 6);
            }
            
            //set empty if value is null
            if (cijferNareno == null) {
                CClearPartners.General.Form.SetValue("dig_epclabelnarenovatie", null);              
            }
                              
        },
        Bijzonderheden: function(){
            var oovantoepassing = CClearPartners.General.Form.GetValue("dig_oovantoepassing");
            CClearPartners.General.Form.SetFieldVisible("dig_uitreikingconformiteitsattest", oovantoepassing);
            CClearPartners.General.Form.SetFieldVisible("dig_ongeschiktverklaringvlaamsewooncode", oovantoepassing);
            CClearPartners.General.Form.SetFieldVisible("dig_onbewoonbaarverklaringvlaamsewooncode", oovantoepassing);
            CClearPartners.General.Form.SetFieldVisible("dig_onbewoonbaarverklaringart135ng", oovantoepassing);
            CClearPartners.General.Form.SetFieldVisible("dig_socialevoorrang", oovantoepassing);
            CClearPartners.General.Form.SetFieldVisible("dig_huursubsidie", oovantoepassing);
            CClearPartners.General.Form.SetFieldVisible("dig_datumadvies", oovantoepassing);
            CClearPartners.General.Form.SetFieldVisible("dig_datumbesluit", oovantoepassing);
        },
        CheckEANNumber: function(fieldName) {
            CClearPartners.General.Form.GetFormContext().getControl(fieldName).clearNotification(fieldName + "start");
            CClearPartners.General.Form.GetFormContext().getControl(fieldName).clearNotification(fieldName + "length");
            
            let field = CClearPartners.General.Form.GetFormContext().getAttribute(fieldName);
            if(field != null && field.getValue() != null){
                let value = field.getValue();
                console.log(value);
                if(!value.startsWith("54")){
                    let message = "Het EAN-nummer moet beginnen met 54.";
                    CClearPartners.General.Form.GetFormContext().getControl(fieldName).setNotification(message, fieldName + "start");
                    
                }
                if(!(value.length == 18)){
                    let message = "Het EAN-nummer moet bestaan uit 18 getallen.";
                    CClearPartners.General.Form.GetFormContext().getControl(fieldName).setNotification(message, fieldName + "length");
                }
            }            
        }
    },

    Ribbon: {
        NewCase: function (args) {
            console.log("Ribbon.NewCase");
            var formContext = CClearPartners.General.Form.GetFormContext();
            var entityFormOptions = {};
            entityFormOptions["entityName"] = "incident";
            entityFormOptions["useQuickCreateForm"] = true;
            var formParameters = {};
            formParameters["dig_wooneenheid"] = formContext.data.entity.getId();
            formParameters["dig_wooneenheidname"] = CClearPartners.General.Form.GetValue("dig_name");

            Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
                function (lookup) {
                    // Open new case
                    if (lookup != null && lookup.savedEntityReference != null && lookup.savedEntityReference.length > 0) {
                        var entityFormOptions = {};
                        entityFormOptions["entityName"] = lookup.savedEntityReference[0].entityType;
                        entityFormOptions["entityId"] = lookup.savedEntityReference[0].id.replace('{', '').replace('}', '');
                        // Open the form.
                        Xrm.Navigation.openForm(entityFormOptions);
                    }
                },
                function (error) {
                    console.log("ERROR Ribbon.NewCase: " + error);
                });

        }
    },

    CheckVestaId: function () {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var vestaid = formContext.getAttribute("dig_vestaid");
        if (vestaid == null || vestaid.getValue() == null || vestaid.getValue() == "")
            CClearPartners.dig_wooneenheid.ZoekAdres();
    },

    ZoekAdres: function () {
        var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();
        var customParameters = "showOpslaan=1&showverdiepinglokaal=1&showGebouw=1&postcode=9000";

        var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 150) : 600;
        Alert.showWebResource("ccp_/zoekadres/zoeken.html?Data=" + encodeURIComponent(customParameters), 700, height, "Zoek wooneenheid", null, serverUrl, false, 10);

        CClearPartners.Form.General.RegisterAlertCallback("zoekadresCallback", CClearPartners.dig_wooneenheid.FillAdresField);
    },

    FillAdresField: function FillAdresField(straat, huisnummer, busnummer, postcode, gemeente, land, GrabX, GrabY, adresId) {
        if (!postcode) { return; }
        var formContext = CClearPartners.General.Form.GetFormContext();
        formContext.getAttribute("dig_vestaid").setSubmitMode("always");
        formContext.getAttribute("dig_straat").setSubmitMode("always");
        formContext.getAttribute("dig_huisnummer").setSubmitMode("always");
        formContext.getAttribute("dig_busnummer").setSubmitMode("always");
        formContext.getAttribute("dig_postcode").setSubmitMode("always");
        formContext.getAttribute("dig_gemeente").setSubmitMode("always");
        formContext.getAttribute("dig_crabx").setSubmitMode("always");
        formContext.getAttribute("dig_craby").setSubmitMode("always");
        formContext.getAttribute("dig_verdiepinglokaal").setSubmitMode("always");
        formContext.getAttribute("dig_gebouw").setSubmitMode("always");

        formContext.getAttribute("dig_vestaid").setValue(adresId);
        formContext.getAttribute("dig_straat").setValue(straat);
        formContext.getAttribute("dig_huisnummer").setValue(huisnummer);
        formContext.getAttribute("dig_busnummer").setValue(busnummer);
        formContext.getAttribute("dig_postcode").setValue(postcode);
        formContext.getAttribute("dig_gemeente").setValue(gemeente);
        formContext.getAttribute("dig_crabx").setValue(GrabX);
        formContext.getAttribute("dig_craby").setValue(GrabY);
        formContext.getAttribute("dig_verdiepinglokaal").setValue(null);
        formContext.getAttribute("dig_gebouw").setValue(null);
        
        //Call voor coordinaten van adres
        var execute_ccp_AddressGetById_Request = {
            // Parameters
            AddressId: adresId, // Edm.String

            getMetadata: function () {
                return {
                    boundParameter: null,
                    parameterTypes: {
                        AddressId: { typeName: "Edm.String", structuralProperty: 1 }
                    },
                    operationType: 0, operationName: "ccp_AddressGetById"
                };
            }
        };

        Xrm.WebApi.execute(execute_ccp_AddressGetById_Request).then(
            function success(response) {
                if (response.ok) { return response.json(); }
            }
        ).then(function (responseBody) {
            var result = responseBody;

            // Return Type: mscrm.ccp_AddressGetByIdResponse
            // Output Parameters
            var jsonresult = result["JsonResult"]; // Edm.String
            let resultJson = JSON.parse(jsonresult);

            if (resultJson.Coordinates != null) {
                CClearPartners.General.Form.SetValue("dig_crabx", resultJson.Coordinates[0].toString().replace(".", ","));
                CClearPartners.General.Form.SetValue("dig_craby", resultJson.Coordinates[1].toString().replace(".", ","));
            }

        }).catch(function (error) {
            console.log(error.message);
        });	
        
        var wooneenheidFormId = CClearPartners.Form.General.GetFormContext().ui.formSelector._formId["guid"];
                debugger;

        //Check if quickCreate
        Xrm.WebApi.retrieveRecord('systemform', wooneenheidFormId, "?$select=type").then(
            function success(result) {
                if(result["type@OData.Community.Display.V1.FormattedValue"] == "Quick Create") { CClearPartners.Form.General.GetFormContext().data.entity.save('saveandclose'); }                
            },
            function (error) {
                console.log(error.message);
                // handle error conditions
            }
        );     
    },
    showDocumentTab: function () {    
        var formContext = CClearPartners.General.Form.GetFormContext();
        // Get Nav. Item    
        var navItem = formContext.ui.navigation.items.get("navSPDocuments");    
        // First set focus on Nav. Item to open related tab    
        if (navItem !== null) navItem.setFocus();    
        // get Main tab (replace it with your tab name)    
        var mainTab =  formContext.ui.tabs.get("general"); 
        if (mainTab == null) { return; }
        // Then move to Main Tab    
        mainTab.setFocus();
      }
}