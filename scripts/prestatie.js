if (typeof (CClearPartners) == "undefined")
{
	CClearPartners = {};
}
CClearPartners.prestatie = {
	//*********************************Variables*****************************
	//*******************************Event Handlers**************************
	Form_Onload: function ()
	{
		this.AttachEvents();
		this.LoadForm();
	},
	AttachEvents: function ()
	{
    },
    
	//*********************************Functions*****************************
	LoadForm: function ()
	{
		
	},
	Ribbon: 
	{
		Factureren: 
        {
            _itemcache: [],
            IsAllowed: function (primaryitemid, primaryitemtype, itemids)
            {
                if (!CClearPartners.General.Rest.HasCurrentUserRole("EC - Prestaties factureren")) return false;
                else if (primaryitemtype == "dig_prestatie" && primaryitemid != null) {
                    var status = CClearPartners.prestatie.GetPrestatieStatus(primaryitemid);
                    return status == 2; // Openstaand
                } else if (itemids != null && itemids.length > 0) {
                    for (var i = 0; i < itemids.length; i++) {
                        if (CClearPartners.prestatie.Ribbon.Factureren._itemcache[itemids[i]] == null) 
                            CClearPartners.prestatie.Ribbon.Factureren._itemcache[itemids[i]] = CClearPartners.prestatie.GetPrestatieStatus(itemids[i]);
                            
                        if (CClearPartners.prestatie.Ribbon.Factureren._itemcache[itemids[i]] != 2) return false; // At least one item is not 'Openstaand'
                    }
                    return true;
                }
                
                return false;
            },
            ExecuteItems: 0,
            ExecuteControl: null,
            Execute: function (control, primaryitemid, itemids)
            {
                var url = Xrm.Utility.getGlobalContext().getClientUrl();
                Alert.show("Prestatie factureren...", "", [], "LOADING", 400, 200, url, true);
                
                CClearPartners.prestatie.Ribbon.Factureren.ExecuteControl = control;
                if (primaryitemid != null) {
                    console.log("Factureren.Execute: " + primaryitemid)
                    CClearPartners.prestatie.Ribbon.Factureren.ExecuteItems = 1;
                    CClearPartners.prestatie.UpdatePrestatieStatus(primaryitemid);
                }
                else if (itemids.length > 0) {
                    console.log("Factureren.Execute #" + itemids.length)
                    CClearPartners.prestatie.Ribbon.Factureren.ExecuteItems = itemids.length;
                    for (var i = 0; i < itemids.length; i++) {
                        CClearPartners.prestatie.UpdatePrestatieStatus(itemids[i]);
                    }
                }
            },
            ExecuteCallback: function() {
                CClearPartners.prestatie.Ribbon.Factureren.ExecuteItems -= 1;
                
                if (CClearPartners.prestatie.Ribbon.Factureren.ExecuteItems == 0) {
                    if (CClearPartners.prestatie.Ribbon.Factureren.ExecuteControl 
                    && CClearPartners.prestatie.Ribbon.Factureren.ExecuteControl.refresh)
                        CClearPartners.prestatie.Ribbon.Factureren.ExecuteControl.refresh();
                                           
                    Alert.hide();
                }
            }
        }
	},
    
    GetPrestatieStatus: function(id) {
        id = id.replace('{','').replace('}','').toLowerCase();
        var statuscode;
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v8.2/dig_prestaties(" + id + ")?$select=statuscode", false);
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
                    statuscode = result["statuscode"];
                } else {
                    console.log("ERROR GetPrestatieStatus [" + id + "]: " + this.statusText);
                }
            }
        };
        req.send();
        
        return statuscode;
    },
    
    UpdatePrestatieStatus: function(id) {
        id = id.replace('{','').replace('}','').toLowerCase();
        debugger;
        var entity = {};
        entity.statecode = 1;
        entity.statuscode = 914380000;

        Xrm.WebApi.online.updateRecord("dig_prestatie", id, entity).then(
            function success(result) {
                var updatedEntityId = result.id;
                CClearPartners.prestatie.Ribbon.Factureren.ExecuteCallback();
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );
            },
}