if (typeof CClearPartners === "undefined") { CClearPartners = {}; }

CClearPartners.dig_servicedefinition = {
    _crmAPI: null,
    config: null,
    CrmAPI: function () {
        if (this._crmAPI === null) {
            this._crmAPI = new CRMWebAPI({ APIUrl: parent.Xrm.Page.context.getClientUrl() + '/api/data/v8.1/' });
        }
        return this._crmAPI;
    },

    OnLoad: function () {
        //CClearPartners.dig_servicedefinition.LoadAttributes();
        //CClearPartners.dig_servicedefinition.LoadRelationships();
        CClearPartners.dig_servicedefinition.refreshConfiguration();
    },
    LoadRelationships: function () {
        //var p = jQuery.Deferred();
        var p = new Promise(function (resolve, reject) {
            var fetchXml = ["<fetch top='50' >"
                , "  <entity name='ccp_relationship' >"
                , "    <attribute name='ccp_name' />"
                , "    <link-entity name='dig_dig_servicedefinition_ccp_relationship' from='ccp_relationshipid' to='ccp_relationshipid' intersect='true' >"
                , "      <filter>"
                , "        <condition attribute='dig_servicedefinitionid' operator='eq' value='", Xrm.Page.data.entity.getId(), "' />"
                , "      </filter>"
                , "    </link-entity>"
                , "  </entity>"
                , "</fetch>"].join('');
            CClearPartners.dig_servicedefinition.CrmAPI().Get("ccp_relationships", null, {
                FetchXml: fetchXml
            }).then(function (result) {
                resolve(result);
                //p.resolve(result);
                //CClearPartners.dig_servicedefinition.setRelationships(result.value);
            }, function (err) {
                reject(err);
                //p.reject(err);
                debugger;
            });
        });
        return p;
    },
    LoadAttributes: function () {
        //var p = jQuery.Deferred();
        var p = new Promise(function (resolve, reject) {

        var fetchXml = ["<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='true'>"
            , "  <entity name='ccp_attribute'>"
            , "    <attribute name='ccp_attributeid' />"
            , "    <attribute name='ccp_name' />"
            , "    <attribute name='ccp_logicalname' />"
            , "    <attribute name='createdon' />"
            , "    <order attribute='ccp_name' descending='false' />"
            , "    <link-entity name='dig_ccp_attribute_dig_servicedefinition' from='ccp_attributeid' to='ccp_attributeid' visible='false' intersect='true'>"
            , "      <link-entity name='dig_servicedefinition' from='dig_servicedefinitionid' to='dig_servicedefinitionid' alias='aa'>"
            , "        <filter type='and'>"
            , "          <condition attribute='dig_servicedefinitionid' operator='eq' value='", Xrm.Page.data.entity.getId(), "' />"
            , "        </filter>"
            , "      </link-entity>"
            , "    </link-entity>"
            , "  </entity>"
                , "</fetch>"].join('');
            CClearPartners.dig_servicedefinition.CrmAPI().Get("ccp_attributes", null, {
            FetchXml: fetchXml
        }).then(function (result) {
            resolve(result);
            //p.resolve(result);
            //CClearPartners.dig_servicedefinition.setAttributes(result.value);
        }, function (err) {
            reject(err);
            //p.reject(err);
            debugger;
        });
        });
        return p;
        //return p.promise();
    },
    setAttributes: function (attributes, relationships) {
        console.log("att");
        var config =
            JSON.parse(Xrm.Page.getAttribute("dig_configuration").getValue());
        var changetocollection = false;
        for (var i = 0; i < attributes.length; i++) {
            var found = false;
            for (var c = 0; c < config.attributesettings.attributes.length; c++) {
                if (config.attributesettings.attributes[c].logicalname === attributes[i].ccp_logicalname) found = true;
            }
            if (found) continue;
            changetocollection = true;
            config.attributesettings.attributes.push({ logicalname: attributes[i].ccp_logicalname});
            //if (config.attributesettings)
        }
        for (var i = 0; i < relationships.length; i++) {
            var found = false;
            for (var c = 0; c < config.relationshipsettings.relationships.length; c++) {
                if (config.relationshipsettings.relationships[c].logicalname === relationships[i].ccp_name) found = true;
            }
            if (found) continue;
            changetocollection = true;
            config.relationshipsettings.relationships.push({ logicalname: relationships[i].ccp_name });
        }
        if (changetocollection) {
            console.log("Setting dig_configuration from setAttributes");
            Xrm.Page.getAttribute("dig_configuration").setValue(JSON.stringify(config));
            Xrm.Page.getAttribute("dig_configuration").fireOnChange();
        }
    },
    refreshConfiguration: function () {
        //jQuery.when([CClearPartners.dig_servicedefinition.LoadAttributes(), CClearPartners.dig_servicedefinition.LoadRelationships()])
        Promise.all([
            CClearPartners.dig_servicedefinition.LoadAttributes(),
            CClearPartners.dig_servicedefinition.LoadRelationships()
        ])
            .then(function (results) {
                CClearPartners.dig_servicedefinition.setAttributes(results[0].value, results[1].value);
            });
    }
};
/*Model: */
/*
{
  "attributesettings": {
    "attributes": []
  },
  "relationshipsettings": {
    "relationships": []
  }
}
*/