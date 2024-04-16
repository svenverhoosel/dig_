if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

Digipolis.Gebouwschil = {
    //*********************************Variables*****************************
    _formInitialized: false,
    _rlambda: [],

    //*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);

        this.AttachEvents();
        this.LoadForm();
    },

    AttachEvents: function () {
        // Only add events once
        if (this._formInitialized) return;

        CClearPartners.General.Form.AddOnChange("dig_materiaalisolatiehoofddak", Digipolis.Gebouwschil.OnChange.RWaardeHoofddak);
        CClearPartners.General.Form.AddOnChange("dig_dikteisolatiehoofddak", Digipolis.Gebouwschil.OnChange.RWaardeHoofddak);
        CClearPartners.General.Form.AddOnChange("dig_exactelambdawaardehoofddak", Digipolis.Gebouwschil.OnChange.RWaardeHoofddak);

        CClearPartners.General.Form.AddOnChange("dig_materiaalisolatiebijdak", Digipolis.Gebouwschil.OnChange.RWaardeBijdak);
        CClearPartners.General.Form.AddOnChange("dig_dikteisolatiebijdak", Digipolis.Gebouwschil.OnChange.RWaardeBijdak);
        CClearPartners.General.Form.AddOnChange("dig_exactelambdawaardebijdak", Digipolis.Gebouwschil.OnChange.RWaardeBijdak);

        CClearPartners.General.Form.AddOnChange("dig_materiaalzoldervloerisolatie", Digipolis.Gebouwschil.OnChange.RWaardeZolder);
        CClearPartners.General.Form.AddOnChange("dig_diktezoldervloerisolatie", Digipolis.Gebouwschil.OnChange.RWaardeZolder);
        CClearPartners.General.Form.AddOnChange("dig_exactelambdawaardezolder", Digipolis.Gebouwschil.OnChange.RWaardeZolder);
        //CClearPartners.General.Form.AddOnChange("dig_materiaalvloerisolatie", Digipolis.Gebouwschil.OnChange.RWaardeVloer);

        CClearPartners.General.Form.AddOnChange("dig_materiaalvloerisolatieopvollegrond", Digipolis.Gebouwschil.OnChange.RWaardeVloerVolleGrond);
        CClearPartners.General.Form.AddOnChange("dig_materiaalkelderplafondisolatie", Digipolis.Gebouwschil.OnChange.RWaardeVloerKelderPlafond);
        CClearPartners.General.Form.AddOnChange("dig_diktevloerisolatie", Digipolis.Gebouwschil.OnChange.RWaardeVloerKelderPlafond);
        CClearPartners.General.Form.AddOnChange("dig_diktevloerisolatieopvollegrond", Digipolis.Gebouwschil.OnChange.RWaardeVloerVolleGrond);
        CClearPartners.General.Form.AddOnChange("dig_exactelambdawaardevloer", Digipolis.Gebouwschil.OnChange.RWaardeVloerVolleGrond);
        CClearPartners.General.Form.AddOnChange("dig_exactelambdawaardevloerkelderplafond", Digipolis.Gebouwschil.OnChange.RWaardeVloerKelderPlafond);

        CClearPartners.General.Form.AddOnChange("dig_materiaalmuurisolatie", Digipolis.Gebouwschil.OnChange.RWaardeMuur);
        CClearPartners.General.Form.AddOnChange("dig_diktemuurisolatie", Digipolis.Gebouwschil.OnChange.RWaardeMuur);
        CClearPartners.General.Form.AddOnChange("dig_exactelambdawaardemuur", Digipolis.Gebouwschil.OnChange.RWaardeMuur);

        CClearPartners.General.Form.AddOnChange("dig_exactelambdawaardebuitengevel", Digipolis.Gebouwschil.OnChange.RWaardeBuitenGevel);
        CClearPartners.General.Form.AddOnChange("dig_materiaalbuitengevelisolatie", Digipolis.Gebouwschil.OnChange.RWaardeBuitenGevel);
        CClearPartners.General.Form.AddOnChange("dig_diktebuitengevelisolatie", Digipolis.Gebouwschil.OnChange.RWaardeBuitenGevel);

        CClearPartners.General.Form.AddOnChange("dig_exactelambdawaardebinnengevel", Digipolis.Gebouwschil.OnChange.RWaardeBinnenGevel);
        CClearPartners.General.Form.AddOnChange("dig_diktebinnengevelisolatiecm", Digipolis.Gebouwschil.OnChange.RWaardeBinnenGevel);
        CClearPartners.General.Form.AddOnChange("dig_materiaalbinnengevelisolatie", Digipolis.Gebouwschil.OnChange.RWaardeBinnenGevel);

        CClearPartners.General.Form.AddOnChange("dig_exactelambdawaardespouwmuur", Digipolis.Gebouwschil.OnChange.RWaardeSpouwMuur);
        CClearPartners.General.Form.AddOnChange("dig_materiaalspouwmuurisolatie", Digipolis.Gebouwschil.OnChange.RWaardeSpouwMuur);
        CClearPartners.General.Form.AddOnChange("dig_diktespouwmuurisolatie", Digipolis.Gebouwschil.OnChange.RWaardeSpouwMuur);

        this._formInitialized = true;
    },

    //*********************************Functions*****************************

    LoadForm: function () {

        var caseguid = CClearPartners.General.Form.GetValue("dig_caseid");
        if (caseguid != null) {
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/incidents(" + (caseguid[0].id).replace("{", "").replace("}", "") + ")?$select=casetypecode", true);
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    req.onreadystatechange = null;
                    if (this.status === 200) {
                        var result = JSON.parse(this.response);
                        var isEs = (result.casetypecode == 35);
                        var isOs = (result.casetypecode == 37);
                        //var casetypecode_formatted = result["casetypecode@OData.Community.Display.V1.FormattedValue"];
                        CClearPartners.General.Form.SetFieldVisible("dig_schattingenkelglas", isEs == true || isOs == true);
                        CClearPartners.General.Form.SetFieldVisible("dig_schattingdubbelglas", isEs == true || isOs == true);
                        CClearPartners.General.Form.SetFieldVisible("dig_schattinghoogrendementsglas", isEs == true || isOs == true);
                        CClearPartners.General.Form.SetFieldVisible("dig_schattingdrievoudigglas", isEs == true || isOs == true);


                    } else {
                        Xrm.Utility.alertDialog(this.statusText);
                    }
                }
            };
            req.send();
        }

        this.setDefaults();
    },
    OnChange: {
        RWaardeHoofddak: function () {
            Digipolis.Gebouwschil.berekenRWaarde("dig_materiaalisolatiehoofddak", "dig_dikteisolatiehoofddak", "dig_rwaardehoofddakmkw", "dig_exactelambdawaardehoofddak");
        },
        RWaardeBijdak: function () {
            Digipolis.Gebouwschil.berekenRWaarde("dig_materiaalisolatiebijdak", "dig_dikteisolatiebijdak", "dig_rwaardebijdakmkw", "dig_exactelambdawaardebijdak");
        },
        RWaardeZolder: function () {
            Digipolis.Gebouwschil.berekenRWaarde("dig_materiaalzoldervloerisolatie", "dig_diktezoldervloerisolatie", "dig_rwaardezoldermkw", "dig_exactelambdawaardezolder");
        },
        RWaardeMuur: function () {
            Digipolis.Gebouwschil.berekenRWaarde("dig_materiaalmuurisolatie", "dig_diktemuurisolatie", "dig_rwaardemuurmkw", "dig_exactelambdawaardemuur");
        },
        RWaardeVloerVolleGrond: function () {
            Digipolis.Gebouwschil.berekenRWaarde("dig_materiaalvloerisolatieopvollegrond", "dig_diktevloerisolatieopvollegrond", "dig_rwaardevloermkw", "dig_exactelambdawaardevloer");
        },
        RWaardeVloerKelderPlafond: function () {
            Digipolis.Gebouwschil.berekenRWaarde("dig_materiaalkelderplafondisolatie", "dig_diktevloerisolatie", "dig_rwaardekelderplafondmkw", "dig_exactelambdawaardevloerkelderplafond");
        },
        RWaardeBuitenGevel: function () {
            Digipolis.Gebouwschil.berekenRWaarde("dig_materiaalbuitengevelisolatie", "dig_diktebuitengevelisolatie", "dig_rwaardebuitengevelmkw", "dig_exactelambdawaardebuitengevel");
        },
        RWaardeBinnenGevel: function () {
            Digipolis.Gebouwschil.berekenRWaarde("dig_materiaalbinnengevelisolatie", "dig_diktebinnengevelisolatiecm", "dig_rwaardebinnengevelmkw", "dig_exactelambdawaardebinnengevel");
        },
        RWaardeSpouwMuur: function () {
            Digipolis.Gebouwschil.berekenRWaarde("dig_materiaalspouwmuurisolatie", "dig_diktespouwmuurisolatie", "dig_rwaardespouwmuurmkw", "dig_exactelambdawaardespouwmuur");
        },
    },

    Ribbon: {

    },
    setDefaults: function () {
        var dig_adviesid = CClearPartners.General.Form.GetValue("dig_adviesid");
        CClearPartners.General.Form.SetFieldVisible("header_dig_adviesid", (dig_adviesid != null && dig_adviesid.length > 0));

        var dig_scanid = CClearPartners.General.Form.GetValue("dig_scanid");
        CClearPartners.General.Form.SetFieldVisible("header_dig_scanid", (dig_scanid != null && dig_scanid.length > 0));
    },
    berekenRWaarde: function (materiaalid, dikteid, rwaardeid, exactelambdaid) {
        if (CClearPartners.General.Form.GetValue(materiaalid) != null && CClearPartners.General.Form.GetValue(dikteid) != null) {
            var materiaal = CClearPartners.General.Form.GetValue(materiaalid);
            var dikte = CClearPartners.General.Form.GetValue(dikteid);
            var lambda = CClearPartners.General.Form.GetValue(exactelambdaid);

            console.log(materiaal);
            const arrV = [];
            if (materiaal.length != null) {
                for (let index = 0; index <= materiaal.length - 1; index++) {

                    if (lambda == null && materiaal != null) {
                        Digipolis.Gebouwschil.initRLambda();

                        lambda = Digipolis.Gebouwschil._rlambda[materiaal[index]];
                        console.log("Lambda: " + lambda);
                    }

                    if (lambda == null || dikte == null) {
                        CClearPartners.General.Form.SetValue(rwaardeid, null);
                    } else {
                        // round number at 2 decimals: sometimes too many decimal places
                        var rwrde = (dikte / (lambda * 100)).toFixed(2);
                        arrV[index] = parseFloat(rwrde);
                        lambda = null;
                        //CClearPartners.General.Form.SetValue(rwaardeid,parseFloat((dikte/(lambda*100)).toFixed(2)));                
                    }

                }
            }
            //calculate max value of rwaarde array
            let max = arrV[0];
            for (let i = 1; i < arrV.length; ++i) {
                if (arrV[i] > max) {
                    max = arrV[i];
                }
            }

            CClearPartners.General.Form.SetValue(rwaardeid, max);

            arrV.forEach(element => {
                console.log(element);
            });

        } else {
            console.log("legen velden?");
            CClearPartners.General.Form.SetValue(rwaardeid, null);
        }

    },
    initRLambda: function () {
        if (Digipolis.Gebouwschil._rlambda.length == 0) {
            var req = new XMLHttpRequest();
            req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.1/ccp_parameters?$select=ccp_name,ccp_value&$filter=startswith(ccp_name,'R_Waarde_')", false);
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
                            var ccp_name = results.value[i]["ccp_name"];
                            var ccp_value = results.value[i]["ccp_value"];
                            var materiaalid = ccp_name.substr(ccp_name.lastIndexOf('_') + 1);
                            var lambda = CClearPartners.General.Numeric.StringToDouble(ccp_value);
                            Digipolis.Gebouwschil._rlambda[materiaalid] = lambda;
                        }
                    } else {
                        console.log("initRLambda ERROR: " + this.statusText);
                    }
                }
            };
            req.send();
        }
    }

}