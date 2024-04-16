var onLoad = true;
var _accountid = null;
var onFormLoad = function (context) {
    CClearPartners.General.Form.SetFormContext(context);

    var formContext = CClearPartners.General.Form.GetFormContext();
    //Open VKBO search if new account
    if (formContext.ui.getFormType() === 1) { organisatieZoeken(); }
    
    if (CClearPartners.General.Form.GetValue("ves_vestaid") == null && CClearPartners.General.Form.GetValue("ves_tempid") == null) {
        //Nothing
    } else {
        if (CClearPartners.General.Form.GetValue("ves_tempid") == "CreatedFromSL" && CClearPartners.General.Form.GetValue("ves_toevoegenaanvesta") != true) {
            CClearPartners.General.Form.SetValue("ves_toevoegenaanvesta", true);
            CClearPartners.General.Form.SetValue("ves_tempid", "GeenHistoriek");
            //disable alle subgrids          
            setTimeout(function () {
                var controls = formContext.ui.controls.get();
                for (var i in controls) {
                    if (controls[i].getControlType() == "subgrid") {
                        // UNSUPPORTED: disable grid buttons
                        var gridcontrolname = controls[i].getName();
                        var addImageBtn = window.parent.$('#' + gridcontrolname + '_addImageButton');
                        if (addImageBtn != null) addImageBtn.css('display', 'none');
                        var assImageBtn = window.parent.$('#' + gridcontrolname + '_openAssociatedGridViewImageButton');
                        if (assImageBtn != null) assImageBtn.css('display', 'none');
                    }
                }
            }, 500);
        }
        if (document.getElementById("_NA_PROC") != null) document.getElementById("_NA_PROC").lastChild.innerText = "Digidos";
        CClearPartners.Form.General.HideNavigationGroupIfEmpty("_NA_SFA");
        CClearPartners.Form.General.HideNavigationGroupIfEmpty("_NA_MA");
        CClearPartners.Form.General.HideNavigationGroupIfEmpty("_NA_CS");
        CClearPartners.Form.General.HideNavigationGroupIfEmpty("_NA_PROC");
        onIsZakenpartnerChanged();
        onLoad = false;
        CClearPartners.General.Form.AddOnChange("ves_zakenpartner", onIsZakenpartnerChanged);
    }
    initOnChange();
};
var formInitialized = false;
var initOnChange = function () {
    onChange.Aannemer();
    onChange.Verwarming();
    onChange.Sanitair();
    onChange.Dakisolatie();
    onChange.DakvernieuwingHellend();
    onChange.DakvernieuwingPlat();
    onChange.Gevelisolatie();
    onChange.Spouwmuurisolatie();
    onChange.Vloerisolatie();
    onChange.Hoogbouw();
    onChange.Asbest();
    // Only add events once
    if (formInitialized) return;
    CClearPartners.Form.General.AddOnChange("dig_aannemer", onChange.Aannemer);
    CClearPartners.Form.General.AddOnChange("dig_techniekenverwarming", onChange.Verwarming);
    CClearPartners.Form.General.AddOnChange("dig_techniekensanitair", onChange.Sanitair);
    CClearPartners.Form.General.AddOnChange("dig_dakisolatie", onChange.Dakisolatie);
    CClearPartners.Form.General.AddOnChange("dig_dakvernieuwinghellend", onChange.DakvernieuwingHellend);
    CClearPartners.Form.General.AddOnChange("dig_dakvernieuwingplat", onChange.DakvernieuwingPlat);
    CClearPartners.Form.General.AddOnChange("dig_gevelisolatie", onChange.Gevelisolatie);
    CClearPartners.Form.General.AddOnChange("dig_spouwmuurisolatie", onChange.Spouwmuurisolatie);
    CClearPartners.Form.General.AddOnChange("dig_vloerisolatie", onChange.Vloerisolatie);
    CClearPartners.Form.General.AddOnChange("dig_anderespecshoogbouw", onChange.Hoogbouw);
    CClearPartners.Form.General.AddOnChange("dig_anderespecsasbest", onChange.Asbest);
    CClearPartners.Form.General.AddOnChange("dig_zoekadresbutton", search);
   
    formInitialized = true;
};
var onChange = {
    Aannemer: function (args) {
        var formContext = CClearPartners.General.Form.GetFormContext();
        var dig_aannemer = CClearPartners.Form.General.GetValue("dig_aannemer");
        if (formContext.ui.tabs.get("tab_Economic") != null) {
            formContext.ui.tabs.get("tab_Economic").sections.forEach(function (section, idx1) {
                var sname = section.getName();
                if (sname.indexOf("EconomicInfo_section_") == 0) {
                    // Hide and disable checks
                    CClearPartners.Form.General.SetSectionVisible("tab_Economic", sname, dig_aannemer);
                    if (!dig_aannemer && args != null) {
                        // Clear checks
                        section.controls.forEach(function (control, idx2) {
                            var attr = control.getAttribute();
                            if (attr.getAttributeType() == "boolean") attr.setValue(false);
                            else if (attr.getAttributeType() == "memo") attr.setValue(null);
                            attr.fireOnChange();
                        });
                    }
                }
            });
        }
    },
    Verwarming: function () {
        var val = CClearPartners.Form.General.GetValue("dig_techniekenverwarming");
        CClearPartners.Form.General.SetSectionVisible("tab_Economic", "EconomicInfo_subsection_techniekenverwarming", val);
        // reset values 
        if (!val) {
            CClearPartners.Form.General.SetValue("dig_verwarminggas", false);
            CClearPartners.Form.General.SetValue("dig_verwarmingwarmtepomp", false);
            CClearPartners.Form.General.SetValue("dig_verwarminghybride", false);
            CClearPartners.Form.General.SetValue("dig_verwarmingvloer", false);
            CClearPartners.Form.General.SetValue("dig_verwarmingwand", false);
        }
    },
    Sanitair: function () {
        var val = CClearPartners.Form.General.GetValue("dig_techniekensanitair");
        CClearPartners.Form.General.SetSectionVisible("tab_Economic", "EconomicInfo_subsection_techniekensanitair", val);
        // reset values 
        if (!val) {
            CClearPartners.Form.General.SetValue("dig_verwarmingsanitairgas", false);
            CClearPartners.Form.General.SetValue("dig_verwarmingzonneboiler", false);
            CClearPartners.Form.General.SetValue("dig_verwarmingsanitairwarmtepomp", false);
        }
    },
    Dakisolatie: function () {
        var val = CClearPartners.Form.General.GetValue("dig_dakisolatie");
        CClearPartners.Form.General.SetSectionVisible("tab_Economic", "EconomicInfo_subsection_Dakisolatie", val);
        // reset values 
        if (!val) {
            CClearPartners.Form.General.SetValue("dig_dakisolatiebioecologisch", false);
            CClearPartners.Form.General.SetValue("dig_dakisolatiemineralewol", false);
            CClearPartners.Form.General.SetValue("dig_dakisolatiekunststof", false);
            CClearPartners.Form.General.SetValue("dig_dakisolatieandere", false);
        }
    },
    DakvernieuwingHellend: function () {
        var val = CClearPartners.Form.General.GetValue("dig_dakvernieuwinghellend");
        CClearPartners.Form.General.SetSectionVisible("tab_Economic", "EconomicInfo_subsection_DakvernieuwingHellend", val);
        // reset values 
        if (!val) {
            CClearPartners.Form.General.SetValue("dig_dakvernieuwingtraditioneel", false);
            CClearPartners.Form.General.SetValue("dig_dakvernieuwingsarkingmethode", false);
            CClearPartners.Form.General.SetValue("dig_dakvernieuwinguitdikkennaarbuiten", false);
            CClearPartners.Form.General.SetValue("dig_dakvernieuwingplaatsingdakvensters", false);
        }
    },
    DakvernieuwingPlat: function () {
        var val = CClearPartners.Form.General.GetValue("dig_dakvernieuwingplat");
        CClearPartners.Form.General.SetSectionVisible("tab_Economic", "EconomicInfo_subsection_DakvernieuwingPlat", val);
        // reset values 
        if (!val) {
            CClearPartners.Form.General.SetValue("dig_dakvernieuwingbioecologisch", false);
            CClearPartners.Form.General.SetValue("dig_dakvernieuwingmineralewol", false);
            CClearPartners.Form.General.SetValue("dig_dakvernieuwingkunststof", false);
            CClearPartners.Form.General.SetValue("dig_dakvernieuwingandere", false);
        }
    },
    Gevelisolatie: function () {
        var val = CClearPartners.Form.General.GetValue("dig_gevelisolatie");
        CClearPartners.Form.General.SetSectionVisible("tab_Economic", "EconomicInfo_subsection_Gevelisolatie1", val);
        CClearPartners.Form.General.SetSectionVisible("tab_Economic", "EconomicInfo_subsection_Gevelisolatie2", val);
        // reset values 
        if (!val) {
            CClearPartners.Form.General.SetValue("dig_gevelisolatiebioecologisch", false);
            CClearPartners.Form.General.SetValue("dig_gevelisolatiemineralewol", false);
            CClearPartners.Form.General.SetValue("dig_gevelisolatiekunststof", false);
            CClearPartners.Form.General.SetValue("dig_gevelisolatiecrepi", false);
            CClearPartners.Form.General.SetValue("dig_gevelisolatiehout", false);
            CClearPartners.Form.General.SetValue("dig_gevelisolatieandere", false);
        }
    },
    Spouwmuurisolatie: function () {
        var val = CClearPartners.Form.General.GetValue("dig_spouwmuurisolatie");
        CClearPartners.Form.General.SetSectionVisible("tab_Economic", "EconomicInfo_subsection_Spouwmuurisolatie", val);
        // reset values 
        if (!val) {
            CClearPartners.Form.General.SetValue("dig_spouwmuurisolatiemineralewol", false);
            CClearPartners.Form.General.SetValue("dig_spouwmuurisolatiekunststof", false);
        }
    },
    Vloerisolatie: function () {
        var val = CClearPartners.Form.General.GetValue("dig_vloerisolatie");
        CClearPartners.Form.General.SetSectionVisible("tab_Economic", "EconomicInfo_subsection_Vloerisolatie", val);
        // reset values 
        if (!val) {
            CClearPartners.Form.General.SetValue("dig_vloerisolatieisolerendechape", false);
            CClearPartners.Form.General.SetValue("dig_vloerisolatiekunststofplaten", false);
            CClearPartners.Form.General.SetValue("dig_vloerisolatiegespotenkunststof", false);
        }
    },
    Hoogbouw: function () {
        var val = CClearPartners.Form.General.GetValue("dig_anderespecshoogbouw");
        CClearPartners.Form.General.SetSectionVisible("tab_Economic", "EconomicInfo_subsection_anderespecshoogbouw", val);
        // reset values 
        if (!val) {
            CClearPartners.Form.General.SetValue("dig_anderespecshoogbouwaantal", null);
        }
    },
    Asbest: function () {
        var val = CClearPartners.Form.General.GetValue("dig_anderespecsasbest");
        CClearPartners.Form.General.SetSectionVisible("tab_Economic", "EconomicInfo_subsection_anderespecsasbest", val);
        // reset values 
        if (!val) {
            CClearPartners.Form.General.SetValue("dig_anderespecsasbestgehecht", false);
            CClearPartners.Form.General.SetValue("dig_anderespecsasbestlos", false);
        }
    }
};
var preventAutoSave = function (executionContext) {
    CClearPartners.General.Form.SetFormContext(executionContext);
    var formContext = CClearPartners.General.Form.GetFormContext();
    var eventArgs = executionContext.getEventArgs();
    // Only when we updated the ves_tempid (we do this on CreatedFromSL)
    if (formContext.getAttribute("ves_tempid").getIsDirty()) {
        if (eventArgs.getSaveMode() == 70 || eventArgs.getSaveMode() == 2) {
            eventArgs.preventDefault();
        }
    }
};
var openOrCloseAccount = function (accountid) {
    _accountid = accountid;
};
var onIsZakenpartnerChanged = function () {
    if (CClearPartners.General.Form.GetValue("ves_zakenpartner") === true) {
         CClearPartners.General.Form.SetTabVisible("tabZakenpartner", true);
            if (onLoad == true) {
                disableFormFields(true);
            }
    } else {
        CClearPartners.General.Form.SetRequired("ves_alias", "none");
        if (onLoad == true) {
            disableFormFields(false);
        }
    }
};
var disableFormFields = function (onOff) {
    var ignoreFieldList = [ 
        "ves_zakenpartner",
        "telephone1"
    ];
    var ignoreSectionList = ["tab_Economic_section_Info",
        "tab_Economic_section_InfoText",
        "tab_Economic_section_Uitsluitingscriteria",
        "EconomicInfo_section_Buitenschrijnwerk",
        "EconomicInfo_section_Technieken",
        "EconomicInfo_section_Technieken2",
        "EconomicInfo_section_Technieken3",
        "EconomicInfo_subsection_techniekenverwarming",
        "EconomicInfo_section_Technieken4",
        "EconomicInfo_subsection_techniekensanitair",
        "EconomicInfo_section_Technieken5",
        "EconomicInfo_section_Technieken6",
        "EconomicInfo_section_13",
        "EconomicInfo_section_EnergiebesparendeMaatregelen",
        "EconomicInfo_subsection_Dakisolatie",
        "EconomicInfo_section_EnergiebesparendeMaatregelen2",
        "EconomicInfo_section_EnergiebesparendeMaatregelen3",
        "EconomicInfo_subsection_DakvernieuwingHellend",
        "EconomicInfo_section_EnergiebesparendeMaatregelen4",
        "EconomicInfo_subsection_DakvernieuwingPlat",
        "EconomicInfo_section_EnergiebesparendeMaatregelen5",
        "EconomicInfo_section_EnergiebesparendeMaatregelen6",
        "EconomicInfo_subsection_Gevelisolatie1",
        "EconomicInfo_subsection_Gevelisolatie2",
        "EconomicInfo_section_EnergiebesparendeMaatregelen7",
        "EconomicInfo_section_EnergiebesparendeMaatregelen8",
        "EconomicInfo_subsection_Spouwmuurisolatie",
        "EconomicInfo_section_EnergiebesparendeMaatregelen9",
        "EconomicInfo_subsection_Vloerisolatie",
        "EconomicInfo_section_anderewerken",
        "EconomicInfo_section_anderespecificaties",
        "EconomicInfo_section_anderespecificaties2",
        "EconomicInfo_subsection_anderespecshoogbouw",
        "EconomicInfo_section_anderespecificaties3",
        "EconomicInfo_subsection_anderespecsasbest",
        "section_Datakwaliteit",
        "Contactgegevens_section1_address",
        "Contactgegevens_section2_address"
    ];
    var formContext = CClearPartners.General.Form.GetFormContext();
    formContext.ui.controls.forEach(function (control, index) {
        if (doesControlHaveAttribute(control)) {
            var section = control.getParent();
            if ((ignoreFieldList.indexOf(control.getName()) == -1) && (section == null || ignoreSectionList.indexOf(section.getName()) == -1)) {
                control.setDisabled(onOff);
            }
        }
    });
    //OnDisable(!onOff);
    //}
};


var doesControlHaveAttribute = function (control) {
    var controlType = control.getControlType();
    return controlType != "iframe" && controlType != "webresource" && controlType != "subgrid";
};
var GetRequestObject = function () {
    if (window.XMLHttpRequest) {
        return new window.XMLHttpRequest;
    } else {
        try {
            return new ActiveXObject("MSXML2.XMLHTTP.3.0");
        } catch (ex) {
            return null;
        }
    }
};
var GuidsAreEqual = function (guid1, guid2) {
    var isEqual = false;
    if (guid1 == null || guid2 == null) {
        isEqual = false;
    } else {
        isEqual = guid1.replace(/[{}]/g, "").toLowerCase() == guid2.replace(/[{}]/g, "").toLowerCase();
    }
    return isEqual;
};

// Not used?
/*
var AdresRule = function () {
    if (CClearPartners.General.Form.GetValue("ves_zakenpartner") == false) {
            return true;
    } else {
        return CClearPartners.Generel.Rest.HasCurrentUserRole("Zakenpartnerbeheerder")) 
    }
};
*/
var CustomSave = function (saveType) {
    var formContext = CClearPartners.General.Form.GetFormContext();
    var stopzettingsDatumAttribute = formContext.getAttribute("ves_stopzettingsdatum");
    if (stopzettingsDatumAttribute != null) {
        if (stopzettingsDatumAttribute.getValue() != null) {
            var r = window.confirm("Bent u zeker dat u deze organisatie wil stopzetten?\nAutomatisch worden hiermee ook zijn eventuele vestigingen en professionele personen stopgezet.");
            if (r == true) {
                formContext.data.entity.save(saveType);
            } else {
                return;
            }
        } else {
            formContext.data.entity.save(saveType);
        }
    } else {
        formContext.data.entity.save(saveType);
    }
};
var CustomDeactivate = function (context) {
    alert("nog niet geïmplementeerd");
};
var search = function (context) {
    var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();

    var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
    Alert.showWebResource("ccp_/zoekadres/zoeken.html?Data=" + encodeURIComponent("showOpslaan=1&postcode=9000"), 1200, height, "Zoek adres", null, serverUrl, false, 10);
    CClearPartners.General.Form.RegisterAlertCallback("zoekadresCallback", FillAdresField, FillAdresField);
    
    if (!context) { return; }
    var attribute = context.getEventSource();
    
    // Clear the value and avoid to submit data
    attribute.setValue(null);
    attribute.setSubmitMode("never");
};
var FillAdresField = function (straat, huisnummer, busnummer, postcode, gemeente, land, GrabX, GrabY, adresId) {
    if (postcode == null) { return; }
    
    CClearPartners.General.Form.SetValue("ves_adres1type", "Vestigingsadres"); 
    CClearPartners.General.Form.SetValue("ves_adresid", adresId);
    CClearPartners.General.Form.SetValue("address1_line1" , straat);
    CClearPartners.General.Form.SetValue("address1_line2", huisnummer);
    CClearPartners.General.Form.SetValue("address1_line3", busnummer);
    CClearPartners.General.Form.SetValue("address1_postalcode", postcode);
    CClearPartners.General.Form.SetValue("address1_city", gemeente);
    CClearPartners.General.Form.SetValue("address1_county", null);
    CClearPartners.General.Form.SetValue("address1_country", land);
    CClearPartners.General.Form.SetValue("ves_adres1verdiepinglokaal", null);
    CClearPartners.General.Form.SetValue("ves_address1gebouw", null);
    
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
        var resultJson = JSON.parse(jsonresult);

        if (resultJson.Coordinates != null) {
            CClearPartners.General.Form.SetValue("ves_adres1crabx", resultJson.Coordinates[0].toString().replace(".", ","));
            CClearPartners.General.Form.SetValue("ves_adres1craby", resultJson.Coordinates[1].toString().replace(".", ","));
        }

    }).catch(function (error) {
        console.log(error.message);
    });
};
var ClearAdres = function (primaryControl) {
    primaryControl.getAttribute("ves_adresid").setValue(null);
    primaryControl.getAttribute("address1_line1").setValue(null);
    primaryControl.getAttribute("address1_line2").setValue(null);
    primaryControl.getAttribute("address1_line3").setValue(null);
    primaryControl.getAttribute("address1_postalcode").setValue(null);
    primaryControl.getAttribute("address1_city").setValue(null);
    primaryControl.getAttribute("address1_county").setValue(null);
    primaryControl.getAttribute("address1_country").setValue(null);
    primaryControl.getAttribute("ves_adres1verdiepinglokaal").setValue(null);
    primaryControl.getAttribute("ves_address1gebouw").setValue(null);
    primaryControl.getAttribute("ves_adres1crabx").setValue(null);
    primaryControl.getAttribute("ves_adres1craby").setValue(null);
};
var DuplicateDetection = function (executionContext) {
    CClearPartners.General.Form.SetFormContext(executionContext);
    var formContext = CClearPartners.General.Form.GetFormContext();

    if (formContext.getAttribute("name").getIsDirty() == false && formContext.getAttribute("ves_type").getIsDirty() == false) return;
    var filter = "";
    filter += "	<filters>";
    filter += "		<filter name='name' value='" + CClearPartners.General.Form.GetValue("name") + "' />";
    var vesType = CClearPartners.General.Form.GetValue("ves_type");
    filter += "		<filter name='ves_typename' value='" + vesType[0].name + "' />";
    var vestaid = CClearPartners.General.Form.GetValue("ves_vestaid");
    if (vestaid != null) filter += "		<filter name='ves_vestaid' value='" + vestaid + "' />";
    filter += "	</filters>";
    //Create 'Trigger Plugin' record to check for duplicates
    var triggerplugin = {};
    triggerplugin.dig_name = "AccountDuplicateDetection";
    triggerplugin.dig_extra = filter;
    var record = {};

    var req = new XMLHttpRequest();
    req.open("POST", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/dig_triggerplugins", false);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Prefer", "odata.include-annotations=*");
    req.onreadystatechange = function () {
        if (this.readyState === 4) {
            req.onreadystatechange = null;
            if (this.status === 204) {
                var uri = req.getResponseHeader("OData-EntityId");
                var regExp = /\(([^)]+)\)/;
                var matches = regExp.exec(uri);
                var newId = matches[1];
                console.log(newId);

                //delete triggerplugin
                var req2 = new XMLHttpRequest();
                req2.open("DELETE", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/dig_triggerplugins(" + newId.replace(/[{}]/g, "").toLowerCase() + ")", false);
                req2.setRequestHeader("OData-MaxVersion", "4.0");
                req2.setRequestHeader("OData-Version", "4.0");
                req2.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                req2.setRequestHeader("Accept", "application/json");
                req2.onreadystatechange = function () {
                    if (this.readyState === 4) {
                        req2.onreadystatechange = null;
                        if (this.status === 204 || this.status === 1223) {
                            console.log("Record deleted");
                        } else {
                            console.log(this.responseText);
                        }
                    }
                };
                req2.send();

            } else if (error) {
                console.log(this.responseText);
                if (error.message.indexOf("Duplicate") > -1) {
                    var r = confirm("Er bestaat reeds een organisatie in Vesta met deze naam en type. Bent u zeker dat u deze nogmaals wil toevoegen?");
                    if (r == false) {
                        executionContext.getEventArgs().preventDefault();
                    }
                } else alert(error.message);
            }
        }
    };
    req.send(JSON.stringify(record));
};

var searchKBO = function (primaryControl) {
    const formContext = primaryControl; // rename as formContext 
    var url;

    var onnr = formContext.getAttribute("accountnumber").getValue();

    var searchString = "?";
    if (onnr != null && onnr != "") {
        //removing dot's:
        onnr = onnr.replace(/[.]+/g, '');
        searchString += "nummer=" + encodeURIComponent(onnr);
        searchString += "&actionLu=Zoek";
        url = "http://kbopub.economie.fgov.be/kbopub/zoeknummerform.html" + searchString;
    }
    else {
        var name = formContext.getAttribute("name").getValue();
        const postal = formContext.getAttribute("address1_postalcode").getValue();

        if (name != null && name != "") {
            searchString += "rechtsvormFonetic=ALL&_oudeBenaming=on&ondNP=true&_ondNP=on&ondRP=true&_ondRP=on&vest=true&_vest=on&filterEnkelActieve=true&_filterEnkelActieve=on&actionNPRP=Zoek";
            //removing quote's:
            name = name.replace(/["]+/g, '');
            if (name != null && name != "") {
                searchString += "&searchWord=" + encodeURIComponent(name);
            }
            if (postal != null && postal != "") {
                searchString += "&pstcdeNPRP=" + postal;
            }
            if ((name != null && name != "") || (postal != null && postal != "")) {
                searchString += "&actionNPRP=Zoek";
            }
            url = "http://kbopub.economie.fgov.be/kbopub/zoeknaamfonetischform.html" + searchString;
        }
        else {
            url = "http://kbopub.economie.fgov.be/kbopub/zoeknaamfonetischform.html";
        }
    }

    Xrm.Navigation.openUrl(url);     
};
var syncVkbo = function (primaryControl) {
    const formContext = primaryControl; // rename as formContext 

    Xrm.Utility.showProgressIndicator("Bezig met ophalen updates uit VKBO");

    const execute_ves_vkbosync_Request = {
        // Parameters
        entity: {
            entityType: "account",
            id: formContext.data.entity.getId().replace(/[{}]/g, '')
        },
        getMetadata: function () {
            return {
                boundParameter: "entity",
                parameterTypes: {
                    entity: { typeName: "mscrm.account", structuralProperty: 5 }
                },
                operationType: 0, operationName: "ves_vkbosync"
            };
        }
    };

    Xrm.WebApi.online.execute(execute_ves_vkbosync_Request).then(
        function success(response) {
            if (response.ok) {
                console.log("Success");
                Xrm.Utility.closeProgressIndicator();
                formContext.data.refresh(false);
            }
        }
    ).catch(function (error) {
        console.log(error.message);
        Xrm.Utility.closeProgressIndicator();
        Xrm.Navigation.openErrorDialog(error);
    });
};

var organisatieZoeken = function () {
    var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();
    var searchfor = "accountonly";
    var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
    var width = (window.outerWidth && window.outerWidth > 800) ? (window.outerWidth - 200) : 800;
    var querystring = "SearchFor=" + searchfor;
    width = 1200;
    Alert.showWebResource("ves_/zoekklant/zoeken.html?Data=" + encodeURIComponent(querystring), width, height, "Zoek Organisatie", null, serverUrl, false, 10);
    CClearPartners.General.Form.RegisterAlertCallback("zoekklantCallback", zoekklantCallback);
};
var zoekklantCallback = function (id, name, type) {
  if (id) {
	  var pageInput = {
        pageType: "entityrecord",
        entityName: type,
        entityId: id
    };
    Xrm.Navigation.navigateTo(pageInput).then(

    function success()
    {
        // Run code on success
    },

    function error()
    {
        // Handle errors
    });
  }
};

