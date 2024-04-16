if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

if (typeof (Digipolis.Email) == "undefined") {
    Digipolis.Email = {};
}

if (typeof (Digipolis.Email.Algemeen) == "undefined") {
    Digipolis.Email.Algemeen = {

        IsPrintPreviewAllowed: function (primaryItemType, primaryItemIds) {
            return (primaryItemType == "email" && primaryItemIds.length > 0);
        },
        PrintPreview: function (primaryItemType, primaryItemIds, selectedItemIds) {
            var arrayToString = function (arr) {
                let str = '';
                arr.forEach(function (i, index) {
                    str += i.replace('{', '%7b').replace('}', '%7d').toLowerCase();
                    if (index != (arr.length - 1)) {
                        str += ',';
                    };
                });
                return str;
            };

            var records = arrayToString(primaryItemIds);
            console.log('PrintPreview: ' + records);

            const clientUrl = Xrm.Utility.getGlobalContext().getClientUrl();
            const url = clientUrl + "/api/data/v9.0/reports?$select=name,reportid&$filter=name eq 'Afdrukvoorbeeld'";
            var req = new XMLHttpRequest();
            req.open("GET", url, true);
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
                            var name = results.value[i]["name"];
                            var reportid = results.value[i]["reportid"];
                            console.log("Afdrukvoorbeeld report id " + reportid);
                            // open report
                            window.open(clientUrl + "/crmreports/viewer/viewer.aspx?action=run&id=%7b" + reportid + "%7d&context=records&recordstype=4202&records=" + records);
                        }
                    } else {
                        console.log("PrintPreview: " + this.statusText);
                    }
                }
            };
            req.send();
        },

        AddHistoriek: {
            Enabled: function () {
                var allOk = true;

                if (typeof Alert === 'undefined' && (typeof Xrm === 'undefined' || typeof Xrm.Navigation === 'undefined' || !Xrm.Navigation.navigateTo)) {
                    console.log("AddHistoriek.Enabled WARNING: AlertJS or Xrm.Navigation.navigateTo is required for this functionality!");
                    allOk = false;
                }

                if (allOk) {
                    // check parameter: which means SharepointIntegration should be installed
                    var req = new XMLHttpRequest();
                    req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v8.2/ccp_parameters?$select=ccp_name,ccp_value&$filter=ccp_name eq 'sharepointapi_url'", false);
                    req.setRequestHeader("OData-MaxVersion", "4.0");
                    req.setRequestHeader("OData-Version", "4.0");
                    req.setRequestHeader("Accept", "application/json");
                    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\",odata.maxpagesize=1");
                    req.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            req.onreadystatechange = null;
                            if (this.status === 200) {
                                var results = JSON.parse(this.response);
                                if (results.value.length == 0) {
                                    allOk = false;
                                } else {
                                    console.log("AddHistoriek.Enabled WARNING: DIG.SharepointIntegratie solution and parameter 'sharepointapi_url' is required for this functionality!");
                                }
                            } else {
                                console.log("ERROR AddHistoriek.Enabled: " + this.statusText);
                            }
                        }
                    };
                    req.send();
                }

                console.log("AddHistoriek.Enabled: " + allOk);

                return allOk;
            },
            Execute: function (primaryControl) {
                var formContext = primaryControl;
                const emailid = formContext.data.entity.getId().replace('{', '').replace('}', '').toLowerCase();
                const regardingobjectid = formContext.getAttribute("regardingobjectid").getValue()[0].id.replace('{', '').replace('}', '').toLowerCase();
                const customParameters = "emailid=" + emailid + "&regardingobjectid=" + regardingobjectid;
                const height = 500;
                const width = 800;
                const webresource = "dig_/gethistoriek/index.html";
                const title = "Selecteer historiek";
                const callback = function () {
                    const attachmentsGrid = formContext.getControl("attachmentsGrid");
                    if (attachmentsGrid) attachmentsGrid.refresh();
                };

                if (typeof Xrm !== 'undefined' && typeof Xrm.Navigation !== 'undefined' && Xrm.Navigation.navigateTo) {
                    const pageInput = {
                        pageType: "webresource",
                        webresourceName: webresource,
                        data: customParameters
                    };

                    const navigationOptions = {
                        target: 2,
                        width: width, // value specified in pixel
                        height: height, // value specified in pixel
                        position: 1,
                        title: title
                    };
                    Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
                        function success() {
                            // Run code on success
                            callback();
                        },
                        function error() {
                            // Handle errors
                        }
                    );
                } else {
                    const clientUrl = Xrm.Utility.getGlobalContext().getClientUrl();
                    Alert.showWebResource(webresource + "?Data=" + encodeURIComponent(customParameters), 800, 500, title, null, clientUrl, false, 10);
                    CClearPartners.Form.General.RegisterAlertCallback("callback", callback);
                }
            }
        }
    }
}