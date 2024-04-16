if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

Digipolis.Renovatiewerken = {
    //*********************************Variables*****************************
    _formInitialized: false,

    //*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);

        this.AttachEvents();
        this.LoadForm(context);
        //this.ShowButtonLijstderwerken(context);
    },

    AttachEvents: function () {
        // Only add events once
        if (this._formInitialized) return;

        CClearPartners.General.Form.AddOnChange("dig_lijstsderwerken", Digipolis.Renovatiewerken.OnChange.RenoPlan);
        CClearPartners.General.Form.AddOnChange("dig_werkenafgerond", Digipolis.Renovatiewerken.OnChange.RenoPlan);
        CClearPartners.General.Form.AddOnChange("dig_premiesaangevraagd", Digipolis.Renovatiewerken.OnChange.RenoPlan);
        CClearPartners.General.Form.AddOnChange("dig_offertesgoedgekeurd", Digipolis.Renovatiewerken.OnChange.RenoPlan);
        CClearPartners.General.Form.AddOnChange("dig_offertesaangevraagd", Digipolis.Renovatiewerken.OnChange.RenoPlan);
        CClearPartners.General.Form.AddOnChange("dig_istussenkomstovereenkomst", Digipolis.Renovatiewerken.OnChange.RenoPlan);
        this._formInitialized = true;
    },

    //*********************************Functions*****************************

    LoadForm: function (context) {
       this.OnChange.RenoPlan(context);
    },

    OnChange: {
        RenoPlan: function (context) {

            var isCheckedLijsts = CClearPartners.General.Form.GetValue("dig_lijstsderwerken");
            var isWerkenafgerond = CClearPartners.General.Form.GetValue("dig_werkenafgerond");
            var isPremiesAangevraagd = CClearPartners.General.Form.GetValue("dig_premiesaangevraagd");
            var isOffertesGoedgekeurd = CClearPartners.General.Form.GetValue("dig_offertesgoedgekeurd");
            var isOffertesAangevraagd = CClearPartners.General.Form.GetValue("dig_offertesaangevraagd");
            var isTussenkomstovereenkomst = CClearPartners.General.Form.GetValue("dig_istussenkomstovereenkomst");

            // Show/hide fields
            CClearPartners.General.Form.SetFieldVisible("dig_klanthaaktaf", isCheckedLijsts == 0);
            CClearPartners.General.Form.SetFieldVisible("dig_datumwerkenafgerond", isWerkenafgerond);
            CClearPartners.General.Form.SetFieldVisible("dig_infopremiesaangevraagd", isPremiesAangevraagd);
            CClearPartners.General.Form.SetFieldVisible("dig_datumoffertesgoedgekeurd", isOffertesGoedgekeurd);
            CClearPartners.General.Form.SetFieldVisible("dig_datumoffertesaangevraagd", isOffertesAangevraagd);
            CClearPartners.General.Form.SetFieldVisible("dig_klanthaaktafopvolging", isTussenkomstovereenkomst == 0);

            // Show/hide tabs
            CClearPartners.General.Form.SetTabVisible("tab_lijstderwerken", isCheckedLijsts == 1);
            CClearPartners.General.Form.SetTabVisible("tab_offertes", isTussenkomstovereenkomst == 1);
            CClearPartners.General.Form.SetTabVisible("tab_opvolgingwerken", isTussenkomstovereenkomst == 1);

        }
    },

    ShowButtonLijstderwerken: function (formContext) {
        var caseEntityReference = formContext.getAttribute("dig_caseid").getValue();
        var caseid = (caseEntityReference[0].id).replace('{', '').replace('}', '');


        Xrm.WebApi.online.retrieveRecord("incident", caseid, "?$select=casetypecode").then(
            function success(result) {
                var casetypecode = result.casetypecode;

                //enkel tonen voor renovatiebegeleiding gent knapt op
                if (casetypecode == 10)
                    return true;
                else
                    return false;
            },
            function (error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );
    },

    Lijstderwerken: function (primaryControl) {
        Xrm.Utility.showProgressIndicator("Document lijstderwerken Even geduld... het systeem maakt het document aan.");

        var caseid = primaryControl.getAttribute("dig_caseid").getValue()[0].id.replace(/[{}]/g,'').toLowerCase();
        //ar caseid = (caseEntityReference[0].id).replace('{', '').replace('}', '');

        var sys_proc_user = "";
        var req = new XMLHttpRequest();
        req.open("GET",  Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/ccp_parameters?$select=ccp_value&$filter=ccp_name eq 'Sys_Azure_stedontw-crm_proc'", false);
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

        var templateName = "Wonen lijst der werken";
        Digipolis.Experlogix.RunSmartFlow(templateName, caseid)
        .then(() => {
            // Success logic
            Xrm.Utility.closeProgressIndicator();
            //Success - No Return Data - Do Something
            //TODO navigeren naar incident  naar tab documenten
            //init the destination after succesfull
            var entityFormOptions = {};
            entityFormOptions.entityName = "incident";
            entityFormOptions.entityId = caseid;

            var parameters = {};
            parameters.setfocus_tab = "tab_documents";
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
