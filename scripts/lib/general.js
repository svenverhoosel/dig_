if (typeof CClearPartners === "undefined") {
    CClearPartners = {};
}
if (typeof CClearPartners.General === "undefined") {
    CClearPartners.General = {};
}
if (typeof CClearPartners.General.Form === "undefined") {
    CClearPartners.General.Form = function () {
        var _formContext = null;
        var setFormContext = function (executionContext) {
            _formContext = executionContext.getFormContext();
            // Add reference to CClearPartners namespace
            window.top.Xrm.CClearPartners = CClearPartners;
        };
        var getFormContext = function () {
            if (_formContext === null) console.log('WARN CClearPartners.General.Form: FormContext is NOT set!');
            return _formContext;
        };
        var setValue = function (field, value, fireOnChange) {
            // First get attribute
            var att = getFormContext().getAttribute(field);
            if (att === null) {
                console.log('WARN CClearPartners.General.Form.SetValue: "' + field + '" is not available');
            } else {
                // Second set value
                att.setValue(value);
                // Always submit
                att.setSubmitMode("always");
                // Default: fireonechange
                if (fireOnChange !== false) getFormContext().getAttribute(field).fireOnChange();
            }
        };
        var setLookupValue = function (field, id, name, logicalname, fireOnChange) {
            var value = null;
            // Make sure there is a value
            if (id !== null && id !== "") {
                // FIX: GUID is case sensitive
                if (id.indexOf('{') == -1) id = '{' + id;
                if (id.indexOf('}') == -1) id = id + '}';
                id = id.toUpperCase();
                value = [];
                value[0] = {};
                value[0].id = id;
                value[0].name = name;
                value[0].entityType = logicalname;
            }
            setValue(field, value, fireOnChange);
        };
        var getValue = function (field) {
            // First get attribute
            var att = getFormContext().getAttribute(field);
            if (att === null) {
                console.log('WARN CClearPartners.General.Form.GetValue: "' + field + '" is not available');
            } else {
                // Second get value
                var val = att.getValue();
                //if ((val == null) || (val.length == 0)) return null;
                // Return value from array
                return val;
                //return val[0].name;
            }
        };
        var setDisabled = function (field, disabled) {
            // First get attribute
            var ctrl = getFormContext().getControl(field);
            if (ctrl === null) {
                console.log('WARN CClearPartners.General.Form.SetDisabled: "' + field + '" is not available');
            } else {
                ctrl.setDisabled(disabled);
            }
        };
        var addOnChange = function (field, func) {
            var att = getFormContext().getAttribute(field);
            if (att === null) return;
            att.addOnChange(func);
        };
        var addEventToGridRefresh = function (gridName, functionToCall) {
            var grid = document.getElementById(gridName);
            if (grid === null) {
                setTimeout(function () {
                    addEventToGridRefresh(gridName, functionToCall);
                }, 1000);
                return;
            }
            grid.control.add_onRefresh(functionToCall);
        };
        var setFieldVisible = function (field, visible) {
            var ctrl = getFormContext().getControl(field);
            if (ctrl === null) {
                console.log('WARN CClearPartners.General.Form.SetFieldVisible: "' + field + '" is not available');
            } else {
                ctrl.setVisible(visible);
            }
        };
        var setSectionVisible = function (tabname, sectionname, visible) {
            var tab = getFormContext().ui.tabs.get(tabname);
            if (tab) {
                var displaystate = tab.getDisplayState(); // get current tab display state
                var section = tab.sections.get(sectionname);
                if (section) section.setVisible(visible);
                else console.log('WARN CClearPartners.General.Form.SetTabVisible: SECTION "' + sectionname + '" is not available');
                tab.setDisplayState(displaystate); // restore display state
            } else {
                console.log('WARN CClearPartners.General.Form.SetSectionVisible: TAB "' + tabname + '" is not available');
            }
        };
        var setTabVisible = function (tabname, visible) {
            var tab = getFormContext().ui.tabs.get(tabname);
            if (tab) tab.setVisible(visible);
            else console.log('WARN CClearPartners.General.Form.SetTabVisible: TAB "' + tabname + '" is not available');
        };
        var setRequired = function (field, required) {
            var att = getFormContext().getAttribute(field);
            if (att === null) return;
            att.setRequiredLevel(((required !== true) ? "none" : "required"));
        };
        var hideNavigationGroupIfEmpty = function (navgroup) {
            // function is obsolete
            if (document.getElementById(navgroup) !== null) {
                if (document.getElementById(navgroup).nextSibling.innerHTML === "") {
                    document.getElementById(navgroup).parentNode.style.display = "none";
                }
            }
        };
        var getXmlDocument = function (responseXml, responseText) {
            var data = responseXml;
            //Only IE doesn't support XPath evaluation
            if (window.ActiveXObject === undefined) return responseXml;
            //Only IE 10 and > doesn't support Microsoft.XMLDOM
            if (typeof responseXml.selectNodes == "unknown") return responseXml;
            //Convert responseText to XML Document
            try {
                var xmlDOM = new ActiveXObject("Microsoft.XMLDOM");
                xmlDOM.async = false;
                xmlDOM.loadXML(responseText);
                data = xmlDOM;
            } catch (e) {}
            return data;
        };
        var showDocumentTab = function (mainTabName) {
            var formContext = getFormContext();
            // Get Nav. Item    
            var navItem = formContext.ui.navigation.items.get("navSPDocuments");
            // First set focus on Nav. Item to open related tab    
            if (navItem) navItem.setFocus();
            else console.log('WARN CClearPartners.General.Form.ShowDocumentTab: TAB "navSPDocuments" is not available on the form');
            // get Main tab (replace it with your tab name)    
            var mainTab = formContext.ui.tabs.get(mainTabName);
            // Then move to Main Tab    
            if (mainTab) mainTab.setFocus();
            else console.log('WARN CClearPartners.General.Form.ShowDocumentTab: TAB "' + mainTabName + '" is not available');
        };
        var _webresources = [];
        var loadWebResource = function (resource) {
            if (!_webresources[resource]) {
                var httpRequest = null;
                try {
                    if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
                        httpRequest = new XMLHttpRequest();
                    } else { // code for IE6, IE5
                        httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
                    }
                    var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();
                    if (serverUrl.match(/\/$/)) {
                        serverUrl = serverUrl.substring(0, serverUrl.length - 1);
                    }
                    httpRequest.open("GET", serverUrl + "/webresources/" + resource, false);
                    httpRequest.send(null);
                    _webresources[resource] = eval(httpRequest.responseText);
                } catch (e) {
                    alert("LoadWebResource &gt;&gt; Error loading " + resource + ":\n" + e.description);
                }
            }
            return _webresources[resource];
        };
        var registerAlertCallback = function (name, method) {
            console.log('registerAlertCallback: ' + name);
            // Overwrite default hide
            if (!Alert._oldHide) Alert._oldHide = Alert.hide;
            Alert.hide = function () {
                Alert._oldHide();
                method.apply(this, arguments); // Call the callback on close 
            };
            // Make sure the dialog is closed on the webresource callback
            var $frame = Alert.$("#alertJs-iFrame");
            $frame.load(function () {
                var w = $frame[0].contentWindow;
                w[name] = Alert.hide;
                if (!!w.MSInputMethodContext && !!document.documentMode) // Check if IE 11
                    setTimeout(function () {
                        try {
                            w[name] = Alert.hide;
                        } catch (err) {}
                    }, 2500);
                else if (w.attachEvent) // ::sigh:: IE8 support
                    w.attachEvent('onload', function () {
                        w[name] = Alert.hide;
                    });
                else if (w.addEventListener) w.addEventListener('load', function () {
                    w[name] = Alert.hide;
                }, false);
                else w.onload = function () {
                    w[name] = Alert.hide;
                };
            });
        };
        var _options = [];
        var filterOptionSet = function (field, p1, p2) {
            var evaluator = null;
            if ((p1 === null || Array.isArray(p1)) && (p2 === null || Array.isArray(p2))) {
                var allowValues = p1;
                var ignoreValues = p2;
                console.log("CClearPartners.General.Form.FilterOptionSet with values");
                evaluator = function (value) {
                    return (allowValues !== null && allowValues.indexOf(value) >= 0) || (ignoreValues !== null && ignoreValues.indexOf(value) < 0);
                };
            } else if (p1 && {}.toString.call(p1) === '[object Function]') {
                evaluator = p1;
                console.log("CClearPartners.General.Form.FilterOptionSet with function");
            }
            if (evaluator !== null) {
                var attrField = getFormContext().getAttribute(field);
                if (attrField !== null) {
                    var value = attrField.getValue();
                    var options = attrField.getOptions();
                    // Save all options  
                    if (!_options[field]) {
                        _options[field] = [];
                        for (var i = 0; i < options.length; i++)
                            _options[field].push(options[i]);
                    }
                    // for all controls
                    for (var i = 0; i < attrField.controls.getLength(); i++) {
                        var ctrl = attrField.controls.get(i);
                        // Clear all items 
                        for (var j = 0; j < options.length; j++)
                            ctrl.removeOption(options[j].value);
                        // Add options depending on form
                        for (var j = 0; j < _options[field].length; j++) {
                            var option = _options[field][j];
                            if (evaluator(option.value)) ctrl.addOption(option);
                        }
                    }
                    attrField.setValue(value);
                }
            }
        };
        var getFormType = function () {
            return getFormContext().ui.getFormType();
        };
        var setSubmitMode = function (field, mode) {
            var att = getFormContext().getAttribute(field);
            if (att === null) {
                console.log('WARN CClearPartners.General.Form.SetSubmitMode: "' + field + '" is not available');
            } else {
                att.setSubmitMode(mode);
            }
        };
        return {
            SetFormContext: setFormContext,
            GetFormContext: getFormContext,
            SetValue: setValue,
            SetLookupValue: setLookupValue,
            GetValue: getValue,
            SetDisabled: setDisabled,
            AddOnChange: addOnChange,
            AddEventToGridRefresh: addEventToGridRefresh,
            SetFieldVisible: setFieldVisible,
            SetSectionVisible: setSectionVisible,
            SetTabVisible: setTabVisible,
            SetRequired: setRequired,
            HideNavigationGroupIfEmpty: hideNavigationGroupIfEmpty,
            GetXmlDocument: getXmlDocument,
            ShowDocumentTab: showDocumentTab,
            LoadWebResource: loadWebResource,
            RegisterAlertCallback: registerAlertCallback,
            FilterOptionSet: filterOptionSet,
            GetFormType: getFormType,
            SetSubmitMode: setSubmitMode
        };
    }();
}
if (typeof (CClearPartners.Form) === "undefined") {
    CClearPartners.Form = {};
}
if (typeof CClearPartners.Form.General === "undefined") {
    // Make script backwards compatible
    CClearPartners.Form.General = CClearPartners.General.Form;
}
if (typeof CClearPartners.General.Numeric === "undefined") {
    CClearPartners.General.Numeric = function () {
        var stringToDouble = function (text) {
            var ref = 1 / 2;
            // Check if we use decimal points
            if (ref.toString().indexOf('.') != -1) return parseFloat(text.replace(',', '.'));
            else return parseFloat(text.replace('.', ','));
        };
        return {
            StringToDouble: stringToDouble
        };
    }();
}
if (typeof CClearPartners.General.Rest === "undefined") {
    CClearPartners.General.Rest = function () {
        var _userTeams = [];
        var isUserInTeam = function (userId, teamId, callback, async) {
            var userteamkey = userId + "_" + teamId;
            if (typeof _userTeams[userteamkey] === 'undefined') {
                async = (typeof async !=='undefined') ? async :true;
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/teammemberships?$filter=(systemuserid eq " + userId + " and teamid eq " + teamId + ")", async);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Prefer", "odata.include-annotations=*");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
                            var results = JSON.parse(this.response);
                            console.log(results);
                            result = (results !== null && results.length > 0);
                            _userTeams[userteamkey] = result;
                            callback(result);
                        } else {
                            console.log(this.responseText);
                            callback(this.responseText);
                        }
                    }
                };
                req.send();
            } else {
                callback(_userTeams[userteamkey]);
            }
        };
        var _teams = [];
        var getTeamId = function (teamName, callback, async) {
            if (typeof _teams[teamName] === 'undefined') {
                async = (typeof async !=='undefined') ? async :true;
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/teams?$select=teamid&$filter=name eq '" + teamName + "'", async);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Prefer", "odata.include-annotations=*");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
                            var results = JSON.parse(this.response);
                            console.log(results);

                            var teamResult = null;
                            if (results !== null && results.value && results.value.length > 0) {
                                teamResult = results.value[0];
                                _teamnames[teamResult.teamid] = teamName;
                            } 
                            
                            _teams[teamName] = teamResult
                            callback(teamResult);
                        } else {
                            console.log(this.responseText);
                            callback(this.responseText);
                        }
                    }
                };
                req.send();
            } else {
                callback(_teams[teamName]);
            }
        };
        var _teamnames = [];
        var getTeamName = function (teamId, callback, async) {
            if (typeof _teamnames[teamId] === 'undefined') {
                async = (typeof async !=='undefined') ? async :true;
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/teams(" + teamId + ")?$select=name", async);
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
                            var teamid = result["teamid"]; // Guid
                            var name = result["name"]; // Text
                            _teamnames[teamid] = name;
                            _teams[name] = result;
                            callback(result);
                        } else {
                            console.log(this.responseText);
                        }
                    }
                };
                req.send();
            } else {
                callback(_teamnames[teamId]);
            }
        };
        var _userBusinessUnits = [];
        var isUserInBusinessUnit = function (businessunit) {
            var userid = Xrm.Utility.getGlobalContext().userSettings.userId.replace(/[{}]/g, '').toLowerCase();
            if (!_userBusinessUnits[userid]) {
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/systemusers(" + userid + ")?$select=_businessunitid_value", false);
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
                            var systemuserid = result["systemuserid"].toLowerCase(); // Guid
                            var businessunitid = result["_businessunitid_value"]; // Lookup
                            var businessunitid_formatted = result["_businessunitid_value@OData.Community.Display.V1.FormattedValue"];
                            if (businessunitid !== null) _userBusinessUnits[systemuserid] = businessunitid_formatted;
                        } else {
                            console.log(this.responseText);
                        }
                    }
                };
                req.send();
            }
            return _userBusinessUnits[userid] == businessunit;
        };
        var hasCurrentUserRoles = function (roleNames) {
            var hasRole = false;
            roleNames.forEach(role => {
                var userSettings = Xrm.Utility.getGlobalContext().userSettings;
                var securityRoles = userSettings.securityRoles;
                var validSecurityRoles = getValidSecurityRoles(role, false);

                for (var i in validSecurityRoles) {
                    if (securityRoles.indexOf(validSecurityRoles[i]) > -1) {
                        hasRole = true;
                        break;
                    }
                }
            });
            if (hasRole) {
                return true;
            } else {
                return false;
            }
        };
        var hasCurrentUserRole = function (roleName) {
            var userSettings = Xrm.Utility.getGlobalContext().userSettings;
            var securityRoles = userSettings.securityRoles;
            var validSecurityRoles = getValidSecurityRoles(roleName, false);
            var hasRole = false;
            for (var i in validSecurityRoles) {
                if (securityRoles.indexOf(validSecurityRoles[i]) > -1) {
                    hasRole = true;
                    break;
                }
            }
            if (hasRole) {
                return true;
            } else {
                return false;
            }
        };
        var getValidSecurityRoles = function (roleName, async) {
            var validSecurityRoles = [];
            async = (typeof async !=='undefined') ? async :true;
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/roles?$select=roleid&$filter=name eq '" + roleName + "'", async);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Prefer", "odata.include-annotations=*");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var results = JSON.parse(this.response);
                        console.log(results);
                        for (var i = 0; i < results.value.length; i++) {
                            var result = results.value[i];
                            var roleid = result["roleid"];
                            validSecurityRoles.push(roleid);
                        }
                    } else {
                        console.log(this.responseText);
                    }
                }
            };
            req.send();
            return validSecurityRoles;
        };
        var hasUserRole = function (userId, roleName, callback) {
            var validSecurityRoles = getValidSecurityRoles(roleName);
            if (validSecurityRoles.lenght > 0) {
                var result = validSecurityRoles[0];
                var roleid = result["roleid"];
                hasUserRoleId(userId, roleid, callback);
            } else {
                callback(false)
            }
        };
        var _userRoles = [];
        var hasUserRoleId = function (userId, roleId, callback, async) {
            var key = userId + "_" + roleId;
            if (typeof _userRoles[key] === 'undefined') {
                async = (typeof async !=='undefined') ? async :true;
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/systemuserrolescollection?$filter=(systemuserid eq " + userId + " and roleid eq " + roleId + ")", async);
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Prefer", "odata.include-annotations=*");
                req.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req.onreadystatechange = null;
                        if (this.status === 200) {
                            var results = JSON.parse(this.response);
                            console.log(results);
                            result = (results !== null && results.length > 0);
                            _userRoles[key] = result;
                            callback(result);
                        } else {
                            console.log(this.responseText);
                            callback(this.responseText);
                        }
                    }
                };
                req.send();
            } else {
                callback(_userRoles[key]);
            }
        };
        var _roleNames = [];
        var getRoleName = function (roleid) {
            if (!_roleNames[roleid]) {
                var req = new XMLHttpRequest();
                req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.0/roles(" + roleid + ")?$select=name", false);
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
                            var roleid = result["roleid"]; // Guid
                            var name = result["name"]; // Text
                            if (name !== null) _roleNames[roleid] = name;
                        } else {
                            console.log(this.responseText);
                        }
                    }
                };
                req.send();
            }
            return _roleNames[roleid];
        };
        var executeAction = function (actionName, inputParam, successCallback, errorCallback, async) {
            var result = null;
            var req = new XMLHttpRequest();
            var uri = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v8.2/";
            if (!async) async = false;
            try {
                req.open("POST", encodeURI(uri + actionName), async);
                req.setRequestHeader("Accept", "application/json");
                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req.setRequestHeader("OData-MaxVersion", "4.0");
                req.setRequestHeader("OData-Version", "4.0");
                req.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        req.onreadystatechange = null;
                        if (this.status == 200) {
                            result = JSON.parse(this.response);
                            if (successCallback) successCallback(result);
                        } else {
                            var err = JSON.parse(this.response).error;
                            console.log(err.message);
                            if (errorCallback) errorCallback(err);
                        }
                    }
                };
                req.send(JSON.stringify(inputParam));
                return result;
            } catch (err) {
                console.log(err.message);
                if (errorCallback) errorCallback(err);
            }
        };
        return {
            GetTeam: getTeamId,
            GetTeamName: getTeamName,
            IsUserInTeam: isUserInTeam,
            IsUserInBusinessUnit: isUserInBusinessUnit,
            HasCurrentUserRole: hasCurrentUserRole,
            HasCurrentUserRoles: hasCurrentUserRoles,
            HasUserRole: hasUserRole,
            HasUserRoleId: hasUserRoleId,
            GetRoleName: getRoleName,
            ExecuteAction: executeAction
        };
    }();
}
if (typeof CClearPartners.General.Soap === "undefined") {
    CClearPartners.General.Soap = {
        InstantiateTemplateRequest: function (TemplateId, UserId) {
            var Soapreq =
                "<request i:type='b:InstantiateTemplateRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>" +
                "    <a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>" +
                "        <a:KeyValuePairOfstringanyType>" +
                "            <c:key>TemplateId</c:key>" +
                "            <c:value i:type='d:guid' xmlns:d='http://schemas.microsoft.com/2003/10/Serialization/'>" + TemplateId + "</c:value>" +
                "        </a:KeyValuePairOfstringanyType>" +
                "        <a:KeyValuePairOfstringanyType>" +
                "            <c:key>ObjectType</c:key>" +
                "            <c:value i:type='d:string' xmlns:d='http://www.w3.org/2001/XMLSchema'>systemuser</c:value>" +
                "        </a:KeyValuePairOfstringanyType>" +
                "        <a:KeyValuePairOfstringanyType>" +
                "            <c:key>ObjectId</c:key>" +
                "            <c:value i:type='d:guid' xmlns:d='http://schemas.microsoft.com/2003/10/Serialization/'>" + UserId + "</c:value>" +
                "        </a:KeyValuePairOfstringanyType>" +
                "    </a:Parameters>" +
                "    <a:RequestId i:nil='true' />" +
                "    <a:RequestName>InstantiateTemplate</a:RequestName>" +
                "</request>";
            return Soapreq;
        }
    }
}