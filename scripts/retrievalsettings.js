if (typeof CClearPartners === "undefined") { CClearPartners = {}; }

CClearPartners.dig_serviceretrievalsetting = {
    _crmAPI: null,
    CrmAPI: function () {
        if (this._crmAPI === null) {
            this._crmAPI = new CRMWebAPI({ APIUrl: parent.Xrm.Page.context.getClientUrl() + '/api/data/v8.2/' });
        }
        return this._crmAPI;
    },
    OnLoad: function () {
        CClearPartners.dig_serviceretrievalsetting.addEventHandler();
    },
    addEventHandler: function () {
        // add the event handler for PreSearch Event
        Xrm.Page.getControl("dig_attributeid").addPreSearch(CClearPartners.dig_serviceretrievalsetting.AddFilter);
    },
    AddFilter: function () {
        var parent = Xrm.Page.getAttribute("dig_servicedefinitionid").getValue();
        var p = CClearPartners.dig_serviceretrievalsetting.CrmAPI().Get("ccp_attributes",
            null, {
                FetchXml: ["<fetch>",
                    "  <entity name='ccp_attribute' >",
                    "  <attribute name='ccp_attributeid' />",
                    "    <filter/>",
                    "    <link-entity name='ccp_entity' from='ccp_entityid' to='ccp_entity' >",
                    "      <link-entity name='dig_servicedefinition' from='dig_targetentityid' to='ccp_entityid' >",
                    "        <filter>",
                    "          <condition attribute='dig_servicedefinitionid' operator='eq' value='", parent[0].id, "' />",
                    "        </filter>",
                    "      </link-entity>",
                    "    </link-entity>",
                    "  </entity>",
                    "</fetch>"].join('')
            });
        
        p.then(function (result) {
                var filter =
                    "<filter type='and'>" +
                    "<condition attribute='ccp_attributeid' operator='in'>" +
                    "<value>"+
                    result.value.map(function (elem) { return elem.ccp_attributeid }).join('</value><value>') +
                    "</value>"+
                    "</condition>" +
                    "</filter>";
                debugger;
                //add filter
                Xrm.Page.getControl("dig_attributeid").addCustomFilter(filter);
        });
        CClearPartners.dig_serviceretrievalsetting.Inspect(p);
    },
    Inspect: function (promise) {
        if (promise["[[PromiseStatus]]"] == "pending") CClearPartners.dig_serviceretrievalsetting.Inspect(promise);
    }
};