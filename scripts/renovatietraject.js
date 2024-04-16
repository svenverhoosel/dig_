if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

Digipolis.Renovatietrajact = {
    //*********************************Variables*****************************
    _formInitialized: false,
    //*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);

        this.AttachEvents();
        this.LoadForm();
        this.CheckCaseType2();
    },

    AttachEvents: function () {
        // Only add events once
        if (this._formInitialized) return;

        CClearPartners.General.Form.AddOnChange("dig_adviesgesprek", Digipolis.Renovatietrajact.OnChange.RenoPlan);
        CClearPartners.General.Form.AddOnChange("dig_huisbezoek", Digipolis.Renovatietrajact.OnChange.RenoPlan);
        CClearPartners.General.Form.AddOnChange("dig_renovatieadviesverzonden", Digipolis.Renovatietrajact.OnChange.RenoPlan);
        CClearPartners.General.Form.AddOnChange("dig_adviesgesprek2", Digipolis.Renovatietrajact.OnChange.RenoPlan);

        CClearPartners.General.Form.AddOnChange("dig_huurcontractnarenovatie", Digipolis.Renovatietrajact.OnChange.RenoPlan);

        this._formInitialized = true;
    },

    //*********************************Functions*****************************

    LoadForm: function () {
        this.OnChange.RenoPlan();
    },
    CheckCaseType2: function () {
        var parentIncident = CClearPartners.General.Form.GetValue("dig_caseid");
        if (parentIncident != null) {
            var id = parentIncident[0].id.replace('{', '').replace('}', '');
            Xrm.WebApi.online.retrieveRecord("incident", id, "?$select=casetypecode,_dig_hoedanigheid_value").then(
                function success(result) {
                    var casetypecode = result.casetypecode;
                    var _dig_hoedanigheid_value_formatted = result["_dig_hoedanigheid_value@OData.Community.Display.V1.FormattedValue"];
                    if (casetypecode == 41 && _dig_hoedanigheid_value_formatted == "Verhuurder") {
                        CClearPartners.General.Form.SetTabVisible("tab_adviseurs", true);
                        CClearPartners.General.Form.SetTabVisible("tab_appartement", true);
                        CClearPartners.General.Form.SetTabVisible("tab_ingrepen", true);
                        CClearPartners.General.Form.SetTabVisible("tab_stappenrenovatietraject", false);
                        CClearPartners.General.Form.SetTabVisible("tab_huisbezoek", false);
                        CClearPartners.General.Form.SetTabVisible("tab_conformiteitsattest", false);
                        CClearPartners.General.Form.SetTabVisible("tab_subsidierenovatiehuur", false);
                        CClearPartners.General.Form.SetTabVisible("tab_zittendehuurder", false);
                        CClearPartners.General.Form.SetTabVisible("tab_opvolging", false);

                    }
                },
                function (error) {
                    Xrm.Utility.alertDialog(error.message);
                }
            );
        }
    },
    OnChange: {
        RenoPlan: function (args) {

            var isCheckedAdvies = CClearPartners.General.Form.GetValue("dig_adviesgesprek");
            var isCheckedHuisbezoek = CClearPartners.General.Form.GetValue("dig_huisbezoek");
            var isCheckedAdvies2 = CClearPartners.General.Form.GetValue("dig_adviesgesprek2");
            var isCheckedRenovatieAdviesVer = CClearPartners.General.Form.GetValue("dig_renovatieadviesverzonden");
            var isNotNullHuurcontract = CClearPartners.General.Form.GetValue("dig_huurcontractnarenovatie") != null;

            // Show/hide fields
            CClearPartners.General.Form.SetFieldVisible("dig_datumadviesgesprek", isCheckedAdvies);
            CClearPartners.General.Form.SetFieldVisible("dig_datumrenovatieadviesverzonden", isCheckedRenovatieAdviesVer);
            CClearPartners.General.Form.SetFieldVisible("dig_datumadviesgesprek2", isCheckedAdvies2);
            CClearPartners.General.Form.SetFieldVisible("dig_startdatumhuurcontract", isNotNullHuurcontract);

            // Show/hide tabs
            CClearPartners.General.Form.SetTabVisible("tab_huisbezoek", isCheckedHuisbezoek);
        }
    },
    ShowButtonRAVerhuurderspunt: function (formContext) {
        
        var caseEntityReference = formContext.getAttribute("dig_caseid").getValue();
        var caseid = (caseEntityReference[0].id).replace('{', '').replace('}', '');
		
		return new Promise(function (resolve, reject){
			var buttonvisible = true;			
			
			Xrm.WebApi.online.retrieveRecord("incident", caseid, "?$select=casetypecode").then(
				function success(result) {
                
					Digipolis.Renovatietrajact.isAsyncOperationCompletedShowRAVerhuurpuntButton = true;
					var casetypecode = result.casetypecode;
                    
					//if case is verhuurpunt
					if(casetypecode == 5){
						buttonvisible= false;
					}
                    resolve(buttonvisible);
				},
				function(error) {
					reject(buttonvisible);
				}
			);
		});
    },


    RaVerhuurderspunt: function (primaryControl) {
        Xrm.Utility.showProgressIndicator("Document RaVerhuurderspunt Even geduld... het systeem maakt het document aan.");

        //retrieve case
        var caseid = primaryControl.getAttribute("dig_caseid").getValue()[0].id.replace(/[{}]/g, '').toLowerCase();
        //retrieve renovatiebegeleiding
        var renovatiebegeleidingid = primaryControl.getAttribute("dig_renovatiebegeleidingid").getValue()[0].id.replace(/[{}]/g, '').toLowerCase();

        //get app user to start xpertdoc with
        var sys_proc_user = "";
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/ccp_parameters?$select=ccp_value&$filter=ccp_name eq 'Sys_Azure_stedontw-crm_proc'", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                    for (var i = 0; i < results.value.length; i++) {
                        sys_proc_user = results.value[i].ccp_value;
                    }
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                    Xrm.Utility.closeProgressIndicator();
                }
            }
        };
        req.send();

        var templateName = "Ra Verhuurderspunt";
        // Run Smartflow
        Digipolis.Experlogix.RunSmartFlow(templateName, akkoordverklaringId)
        .then(() => {
            // Success logic
            Xrm.Utility.closeProgressIndicator();
            //Success - No Return Data - Do Something
            //TODO navigeren naar incident  naar tab documenten
            //init the destination after succesfull
            var entityFormOptions = {};
            entityFormOptions.entityName = "dig_renovatiebegeleiding";
            entityFormOptions.entityId = renovatiebegeleidingid;

            var parameters = {};
            parameters.setfocus_tab = "navSPDocuments";
            //context.ui.tabs.get("tab_offertefase").setFocus();
            //console.log(parameters.setfocus_tab);
            primaryControl.data.refresh(true);
            Xrm.Navigation.openForm(entityFormOptions, parameters).then(
                function (success) {
                    console.log(success);
                },
                function (error) {
                    console.log(error);
                }
            );

            //.xls copy advies verhuurderspunt
            parameters = {};
            var entity = {};
            entity.id = caseid;
            entity.entityType = "incident";
            parameters.entity = entity;

            var dig_CACopyadviesverhuurderspuntRequest = {
                entity: parameters.entity,

                getMetadata: function () {
                    return {
                        boundParameter: "entity",
                        parameterTypes: {
                            "entity": {
                                "typeName": "mscrm.incident",
                                "structuralProperty": 5
                            }
                        },
                        operationType: 0,
                        operationName: "dig_CACopyadviesverhuurderspunt"
                    };
                }
            };

            Xrm.WebApi.online.execute(dig_CACopyadviesverhuurderspuntRequest).then(
                function success(result) {
                    if (result.ok) {
                        //Success - No Return Data - Do Something
                    }
                },
                function (error) {
                    Xrm.Utility.alertDialog(error.message);
                }
            );
        })
        .catch(error => {
            console.error("Error in RunSmartFlow:", error);
            Xrm.Utility.closeProgressIndicator();
            Xrm.Utility.alertDialog(this.statusText);
        })
        .finally(() => {
             // Logic you want no matter if it is succes of error
            
        });
    }

};