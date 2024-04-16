if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

Digipolis.Resultaat = {
    //*********************************Variables*****************************
    _formInitialized: false,
    _rbKeys: ["electriciteit",
        "stabiliteit",
        "brandgevaar",
        "vocht",
        "risico",
        "isolatiehoofddak",
        "isolatiebijdak",
        "ramen",
        "vloerisolatie",
        "gevelisolatie",
        "verwarming",
        "sanitair",
        "ventilatie",
        "pvpanelen",
        "groendak",
        "gevelgroen",
        "ontharding",
        "hergebruikregenwater",
        "hittebestendigheid"
    ],

    //*******************************Event Handlers**************************
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);

        this.AttachEvents();
        this.LoadForm();
    },

    AttachEvents: function () {
        // Only add events once
        if (this._formInitialized) return;

        // Add default events
        Digipolis.Resultaat._rbKeys.forEach(function myFunction(rbkey) {
            CClearPartners.General.Form.AddOnChange("dig_renovatiebegeleiding" + rbkey, Digipolis.Resultaat.OnChange.Renovatiebegeleiding);
            CClearPartners.General.Form.AddOnChange("dig_resultaat" + rbkey, Digipolis.Resultaat.OnChange.Result);
        });

        // Optional fields
        CClearPartners.General.Form.AddOnChange("dig_resultaatelectriciteit", Digipolis.Resultaat.OnChange.Electriciteit);
        CClearPartners.General.Form.AddOnChange("dig_resultaatisolatiehoofddak", Digipolis.Resultaat.OnChange.IsolatieHoofddak);
        CClearPartners.General.Form.AddOnChange("dig_resultaatisolatiebijdak", Digipolis.Resultaat.OnChange.IsolatieBijdak);
        CClearPartners.General.Form.AddOnChange("dig_resultaatramen", Digipolis.Resultaat.OnChange.Ramen);
        CClearPartners.General.Form.AddOnChange("dig_resultaatvloerisolatie", Digipolis.Resultaat.OnChange.VloerIsolatie);
        CClearPartners.General.Form.AddOnChange("dig_resultaatverwarming", Digipolis.Resultaat.OnChange.Verwarming);
        CClearPartners.General.Form.AddOnChange("dig_resultaatsanitair", Digipolis.Resultaat.OnChange.TypeGeplaatst);
        CClearPartners.General.Form.AddOnChange("dig_resultaatventilatie", Digipolis.Resultaat.OnChange.TypeGeplaatst);
        CClearPartners.General.Form.AddOnChange("dig_resultaatpvpanelen", Digipolis.Resultaat.OnChange.PvPanelen);

        CClearPartners.General.Form.AddOnChange("dig_resultaatstabiliteit", Digipolis.Resultaat.OnChange.Stabiliteit);
        CClearPartners.General.Form.AddOnChange("dig_resultaatbrandgevaar", Digipolis.Resultaat.OnChange.BrandOntploffingsGevaar);
        CClearPartners.General.Form.AddOnChange("dig_resultaatvocht", Digipolis.Resultaat.OnChange.Vocht);
        CClearPartners.General.Form.AddOnChange("dig_resultaatrisico", Digipolis.Resultaat.OnChange.AndereVeiligheidGezondheidsRisicos);
        CClearPartners.General.Form.AddOnChange("dig_resultaatgevelisolatie", Digipolis.Resultaat.OnChange.IsolatieGevel);
        CClearPartners.General.Form.AddOnChange("dig_resultaatgroendak", Digipolis.Resultaat.OnChange.GroenDak);
        CClearPartners.General.Form.AddOnChange("dig_resultaatgevelgroen", Digipolis.Resultaat.OnChange.GevelGroen);
        CClearPartners.General.Form.AddOnChange("dig_resultaatontharding", Digipolis.Resultaat.OnChange.Ontharding);
        CClearPartners.General.Form.AddOnChange("dig_resultaathergebruikregenwater", Digipolis.Resultaat.OnChange.HergebruikRegenwater);
        CClearPartners.General.Form.AddOnChange("dig_resultaathittebestendigheid", Digipolis.Resultaat.OnChange.HitteBestendigheid);
        CClearPartners.General.Form.AddOnChange("dig_resultaatsanitair", Digipolis.Resultaat.OnChange.Sanitair);
        CClearPartners.General.Form.AddOnChange("dig_resultaatventilatie", Digipolis.Resultaat.OnChange.Ventilatie);

        //check op resultaat gekend is
        CClearPartners.General.Form.AddOnChange("dig_resultaatisolatiehoofddak", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatisolatiebijdak", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatramen", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatvloerisolatie", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatgevelisolatie", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatverwarming", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatsanitair", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatventilatie", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatpvpanelen", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatelectriciteit", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatstabiliteit", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatbrandgevaar", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatvocht", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatrisico", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatgroendak", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatgevelgroen", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatontharding", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaathergebruikregenwater", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaathittebestendigheid", Digipolis.Resultaat.OnChange.ResultaatGekend);


        this._formInitialized = true;
    },

    //*********************************Functions*****************************

    LoadForm: function () {
        
        // Trigger default events
        Digipolis.Resultaat._rbKeys.forEach(function myFunction(rbkey) {
            Digipolis.Resultaat.OnChange.Renovatiebegeleiding("dig_renovatiebegeleiding" + rbkey);
            Digipolis.Resultaat.OnChange.Result("dig_resultaat" + rbkey);
        });

        // Optional fields
        // TODO IB -> conform TypeGeplaatst (aannemer voor elec, brand, ....)
        Digipolis.Resultaat.OnChange.IsolatieHoofddak("dig_resultaatisolatiehoofddak");
        Digipolis.Resultaat.OnChange.IsolatieBijdak("dig_resultaatisolatiebijdak");
        Digipolis.Resultaat.OnChange.Ramen("dig_resultaatramen");
        Digipolis.Resultaat.OnChange.VloerIsolatie("dig_resultaatvloerisolatie");
        Digipolis.Resultaat.OnChange.Verwarming("dig_resultaatverwarming");
        Digipolis.Resultaat.OnChange.TypeGeplaatst("dig_resultaatsanitair");
        Digipolis.Resultaat.OnChange.TypeGeplaatst("dig_resultaatventilatie");
        Digipolis.Resultaat.OnChange.PvPanelen("dig_resultaatpvpanelen");
        Digipolis.Resultaat.OnChange.Electriciteit("dig_resultaatelectriciteit");
        Digipolis.Resultaat.OnChange.Stabiliteit("dig_resultaatstabiliteit");
        Digipolis.Resultaat.OnChange.BrandOntploffingsGevaar("dig_resultaatbrandgevaar");
        Digipolis.Resultaat.OnChange.Vocht("dig_resultaatvocht");
        Digipolis.Resultaat.OnChange.AndereVeiligheidGezondheidsRisicos("dig_resultaatrisico");
        Digipolis.Resultaat.OnChange.IsolatieGevel("dig_resultaatgevelisolatie");
        Digipolis.Resultaat.OnChange.GroenDak("dig_resultaatgroendak");
        Digipolis.Resultaat.OnChange.GevelGroen("dig_resultaatgevelgroen");
        Digipolis.Resultaat.OnChange.Ontharding("dig_resultaatontharding");
        Digipolis.Resultaat.OnChange.HergebruikRegenwater("dig_resultaathergebruikregenwater");
        Digipolis.Resultaat.OnChange.HitteBestendigheid("dig_resultaathittebestendigheid");
        Digipolis.Resultaat.OnChange.Sanitair("dig_resultaatsanitair");
        Digipolis.Resultaat.OnChange.Ventilatie("dig_resultaatventilatie");

        //check op resultaat gekend is
        CClearPartners.General.Form.AddOnChange("dig_resultaatisolatiehoofddak", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatisolatiebijdak", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatramen", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatvloerisolatie", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatgevelisolatie", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatverwarming", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatsanitair", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatventilatie", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatpvpanelen", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatelectriciteit", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatstabiliteit", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatbrandgevaar", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatvocht", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatrisico", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatgroendak", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatgevelgroen", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaatontharding", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaathergebruikregenwater", Digipolis.Resultaat.OnChange.ResultaatGekend);
        CClearPartners.General.Form.AddOnChange("dig_resultaathittebestendigheid", Digipolis.Resultaat.OnChange.ResultaatGekend);


        this.setDefaults();
    },

    OnChange: {
        Renovatiebegeleiding: function (args) {
            if (args != null) {
                if (args.getEventSource != null && args.getEventSource().getName() != null) {
                    // onchange event
                    Digipolis.Resultaat.showAttributes(args.getEventSource().getName());
                } else if (typeof args == "string") {
                    // direct text
                    Digipolis.Resultaat.showAttributes(args);
                }
            }
        },
        Result: function (args) {
            if (args != null) {
                if (args.getEventSource != null && args.getEventSource().getName() != null) {
                    // onchange event
                    Digipolis.Resultaat.showResult(args.getEventSource().getName());
                } else if (typeof args == "string") {
                    // direct text
                    Digipolis.Resultaat.showResult(args);
                }
            }
        },
        Electriciteit: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        IsolatieHoofddak: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        IsolatieBijdak: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        Ramen: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        VloerIsolatie: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        Verwarming: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        PvPanelen: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        TypeGeplaatst: function (args) {
            if (args != null) {
                if (args.getEventSource != null && args.getEventSource().getName() != null) {
                    // onchange event
                    Digipolis.Resultaat.showTypeGeplaatst(args.getEventSource().getName());
                } else if (typeof args == "string") {
                    // direct text
                    Digipolis.Resultaat.showTypeGeplaatst(args);
                }
            }
        },
        Stabiliteit: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        BrandOntploffingsGevaar: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        Vocht: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        AndereVeiligheidGezondheidsRisicos: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        IsolatieGevel: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        GroenDak: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
            var value = CClearPartners.General.Form.GetValue("dig_resultaatgroendak");
            var hasvalue = (value == 1);
            CClearPartners.General.Form.SetFieldVisible("dig_aannemergroendakid", hasvalue);
        },
        GevelGroen: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        Ontharding: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        HergebruikRegenwater: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        HitteBestendigheid: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        Sanitair: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        Ventilatie: function (args) {
            Digipolis.Resultaat.CheckBeforeShowFieldsAannemerMethod(args);
        },
        ResultaatGekend: function () {
            //alle resultaatgekende velden
            //resultaat isolatie hoofddak
            var formContext = CClearPartners.General.Form.GetFormContext();
            var resultaatIsolatieHoofd = CClearPartners.General.Form.GetValue("dig_resultaatisolatiehoofddak");
            if (resultaatIsolatieHoofd == 1) {
                var dig_rwaardehoofddak = CClearPartners.General.Form.GetValue("dig_rwaardehoofddak");
                var dig_investeringisolatiehoofddak = CClearPartners.General.Form.GetValue("dig_investeringisolatiehoofddak");
                var dig_aannemerhoofddakid = CClearPartners.General.Form.GetValue("dig_aannemerhoofddakid");

                // Show warning
                if (dig_rwaardehoofddak == null || dig_investeringisolatiehoofddak == null || dig_aannemerhoofddakid == null)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatisolatiehoofddak-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatisolatiehoofddak-empty");
            }

            //resultaat isolatie bijdak
            var resultaatIsolatieBijdak = CClearPartners.General.Form.GetValue("dig_resultaatisolatiebijdak");
            if (resultaatIsolatieBijdak == 1) {
                var dig_rwaardebijdak = CClearPartners.General.Form.GetValue("dig_rwaardebijdak");
                var dig_investeringisolatiebijdak = CClearPartners.General.Form.GetValue("dig_investeringisolatiebijdak");
                var dig_aannemerbijdakid = CClearPartners.General.Form.GetValue("dig_aannemerbijdakid");

                // Show warning
                if (dig_rwaardebijdak == null || dig_investeringisolatiebijdak == null || dig_aannemerbijdakid == null)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "resultaatIsolatieBijdak-empty");
                else
                    formContext.ui.clearFormNotification("resultaatIsolatieBijdak-empty");
            }

            //resultaat Ramen
            var resultaatRamen = CClearPartners.General.Form.GetValue("dig_resultaatramen");
            if (resultaatRamen == 1) {
                var dig_uwaarderamen = CClearPartners.General.Form.GetValue("dig_uwaarderamen");
                var dig_investeringramen = CClearPartners.General.Form.GetValue("dig_investeringramen");
                var dig_aannemerramenid = CClearPartners.General.Form.GetValue("dig_aannemerramenid");

                // Show warning
                if (dig_uwaarderamen == null || dig_investeringramen == null || dig_aannemerramenid == null)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatramen-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatramen-empty");
            }

            //resultaat Vloer
            var resultaatVloer = CClearPartners.General.Form.GetValue("dig_resultaatvloerisolatie");
            if (resultaatVloer == 1) {
                var dig_rwaardevloer = CClearPartners.General.Form.GetValue("dig_rwaardevloer");
                var dig_investeringvloerisolatie = CClearPartners.General.Form.GetValue("dig_investeringvloerisolatie");
                var dig_aannemervloerisolatieid = CClearPartners.General.Form.GetValue("dig_aannemervloerisolatieid");

                // Show warning
                if (dig_rwaardevloer == null || dig_investeringvloerisolatie == null || dig_aannemervloerisolatieid == null)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatvloerisolatie-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatvloerisolatie-empty");
            }

            //resultaat Gevel
            var resultaatGevel = CClearPartners.General.Form.GetValue("dig_resultaatgevelisolatie");
            if (resultaatGevel == 1) {
                var dig_rwaardegevel = CClearPartners.General.Form.GetValue("dig_rwaardegevel");
                var dig_investeringgevelisolatie = CClearPartners.General.Form.GetValue("dig_investeringgevelisolatie");
                var dig_aannemergevelisolatieid = CClearPartners.General.Form.GetValue("dig_aannemergevelisolatieid");

                // Show warning
                if (dig_rwaardegevel == null || dig_investeringgevelisolatie == null || dig_aannemergevelisolatieid == null)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatgevelisolatie-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatgevelisolatie-empty");
            }

            //resultaat Verwarming
            var resultaatVerwarming = CClearPartners.General.Form.GetValue("dig_resultaatverwarming");
            if (resultaatVerwarming == 1) {
                var dig_typebijverwarminggeplaatst = CClearPartners.General.Form.GetValue("dig_typebijverwarminggeplaatst");
                var dig_investeringverwarming = CClearPartners.General.Form.GetValue("dig_investeringverwarming");
                var dig_aannemerverwarmingid = CClearPartners.General.Form.GetValue("dig_aannemerverwarmingid");

                // Show warning
                if (dig_rwaardegevel == null || dig_investeringgevelisolatie == null || dig_aannemergevelisolatieid == null)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatverwarming-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatverwarming-empty");
            }

            //resultaat Sanitair warmwater
            var resultaatsanitair = CClearPartners.General.Form.GetValue("dig_resultaatsanitair");
            if (resultaatsanitair == 1) {
                var dig_investeringsanitair = CClearPartners.General.Form.GetValue("dig_investeringverwarming");
                var dig_aannemerwarmwaterid = CClearPartners.General.Form.GetValue("dig_aannemerverwarmingid");

                // Show warning
                if (dig_investeringsanitair == null || dig_aannemerwarmwaterid == null)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatsanitair-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatsanitair-empty");
            }

            //resultaat Ventilatie
            var resultaatVentilatie = CClearPartners.General.Form.GetValue("dig_resultaatventilatie");
            if (resultaatVentilatie == 1) {
                var dig_investeringventilatie = CClearPartners.General.Form.GetValue("dig_investeringventilatie");
                var dig_aannemerventilatieid = CClearPartners.General.Form.GetValue("dig_aannemerventilatieid");

                // Show warning
                if (dig_investeringventilatie == null || dig_aannemerventilatieid == null)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatventilatie-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatventilatie-empty");
            }

            //resultaat PV-Panelen
            var resultaatpvpanelen = CClearPartners.General.Form.GetValue("dig_resultaatpvpanelen");
            if (resultaatpvpanelen == 1) {
                var dig_geinstalleerdvermogenpv = CClearPartners.General.Form.GetValue("dig_geinstalleerdvermogenpv");
                var dig_investeringpvpanelen = CClearPartners.General.Form.GetValue("dig_investeringpvpanelen");
                var dig_aannemerpvpanelenid = CClearPartners.General.Form.GetValue("dig_aannemerpvpanelenid");

                // Show warning
                if (dig_geinstalleerdvermogenpv == null || dig_investeringpvpanelen == null || dig_aannemerpvpanelenid)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatpvpanelen-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatpvpanelen-empty");
            }

            //resultaat Electriciteit
            var resultaatelectriciteit = CClearPartners.General.Form.GetValue("dig_resultaatelectriciteit");
            if (resultaatelectriciteit == 1) {
                var dig_investeringelectriciteit = CClearPartners.General.Form.GetValue("dig_investeringelectriciteit");
                var dig_aannemerelectriciteit = CClearPartners.General.Form.GetValue("dig_aannemerelectriciteit");

                // Show warning
                if (dig_investeringelectriciteit == null || dig_aannemerelectriciteit)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatelectriciteit-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatelectriciteit-empty");
            }

            //resultaat Stabiliteit
            var resultaatStabiliteit = CClearPartners.General.Form.GetValue("dig_resultaatstabiliteit");
            if (resultaatStabiliteit == 1) {
                var dig_investeringstabiliteit = CClearPartners.General.Form.GetValue("dig_investeringstabiliteit");
                var dig_aannemerstabiliteitid = CClearPartners.General.Form.GetValue("dig_aannemerstabiliteitid");

                // Show warning
                if (dig_investeringstabiliteit == null || dig_aannemerstabiliteitid)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatstabiliteit-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatstabiliteit-empty");
            }

            //resultaat Brand of ontploffingsgevaar
            var resultaatBrandOntploffing = CClearPartners.General.Form.GetValue("dig_resultaatbrandgevaar");
            if (resultaatBrandOntploffing == 1) {
                var dig_investeringbrandgevaar = CClearPartners.General.Form.GetValue("dig_investeringbrandgevaar");
                var dig_aannemerbrandgevaarid = CClearPartners.General.Form.GetValue("dig_aannemerbrandgevaarid");

                // Show warning
                if (dig_investeringbrandgevaar == null || dig_aannemerbrandgevaarid)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatbrandgevaar-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatbrandgevaar-empty");
            }

            //resultaat Vocht
            var resultaatVocht = CClearPartners.General.Form.GetValue("dig_resultaatvocht");
            if (resultaatVocht == 1) {
                var dig_investeringvocht = CClearPartners.General.Form.GetValue("dig_investeringvocht");
                var dig_aannemervochtid = CClearPartners.General.Form.GetValue("dig_aannemervochtid");

                // Show warning
                if (dig_investeringvocht == null || dig_aannemervochtid)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatvocht-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatvocht-empty");
            }

            //resultaat Andere veiligheids- en gezondsheidsrisico's
            var resultaatRisico = CClearPartners.General.Form.GetValue("dig_resultaatrisico");
            if (resultaatRisico == 1) {
                var dig_investeringrisico = CClearPartners.General.Form.GetValue("dig_investeringvocht");
                var dig_aannemerrisicoid = CClearPartners.General.Form.GetValue("dig_aannemerrisicoid");

                // Show warning
                if (dig_investeringrisico == null || dig_aannemerrisicoid)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatrisico-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatrisico-empty");
            }

            //resultaat Groendak
            var resultaatGroendak = CClearPartners.General.Form.GetValue("dig_resultaatgroendak");
            if (resultaatGroendak == 1) {
                var dig_investeringgroendak = CClearPartners.General.Form.GetValue("dig_investeringgroendak");
                var dig_aannemergroendakid = CClearPartners.General.Form.GetValue("dig_aannemergroendakid");

                // Show warning
                if (dig_investeringgroendak == null || dig_aannemergroendakid)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatgroendak-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatgroendak-empty");
            }

            //resultaat Gevelgroen
            var resultaatGevelgroen = CClearPartners.General.Form.GetValue("dig_resultaatgevelgroen");
            if (resultaatGevelgroen == 1) {
                var dig_investeringgevelgroen = CClearPartners.General.Form.GetValue("dig_investeringgroendak");
                var dig_aannemergevelgroenid = CClearPartners.General.Form.GetValue("dig_aannemergroendakid");

                // Show warning
                if (dig_investeringgevelgroen == null || dig_aannemergevelgroenid)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatgevelgroen-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatgevelgroen-empty");
            }

            //resultaat Ontharding
            var resultaatOntharding = CClearPartners.General.Form.GetValue("dig_resultaatontharding");
            if (resultaatOntharding == 1) {
                var dig_investeringontharding = CClearPartners.General.Form.GetValue("dig_investeringontharding");
                var dig_aannemeronthardingid = CClearPartners.General.Form.GetValue("dig_aannemeronthardingid");

                // Show warning
                if (dig_investeringontharding == null || dig_aannemeronthardingid)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaatontharding-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaatontharding-empty");
            }

            //resultaat Hergebruik regenwater
            var resultaatHergebruikRegenwater = CClearPartners.General.Form.GetValue("dig_resultaathergebruikregenwater");
            if (resultaatHergebruikRegenwater == 1) {
                var dig_investeringhergebruikregenwater = CClearPartners.General.Form.GetValue("dig_investeringhergebruikregenwater");
                var dig_aannemerregenwaterid = CClearPartners.General.Form.GetValue("dig_aannemerregenwaterid");

                // Show warning
                if (dig_investeringhergebruikregenwater == null || dig_aannemerregenwaterid)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaathergebruikregenwater-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaathergebruikregenwater-empty");
            }

            //resultaat Hittebstendigheid
            var resultaatHittebestending = CClearPartners.General.Form.GetValue("dig_resultaathittebestendigheid");
            if (resultaatHittebestending == 1) {
                var dig_investeringhittebestendigheid = CClearPartners.General.Form.GetValue("dig_investeringhittebestendigheid");
                var dig_aannemerhitteid = CClearPartners.General.Form.GetValue("dig_aannemerhitteid");

                // Show warning
                if (dig_investeringhittebestendigheid == null || dig_aannemerhitteid)
                    formContext.ui.setFormNotification("Vul alle resultaatsvelden in.", "WARNING", "dig_resultaathittebestendigheid-empty");
                else
                    formContext.ui.clearFormNotification("dig_resultaathittebestendigheid-empty");
            }


        },
    },

    Ribbon: {

    },

    CustomLookups: {
        Vesta: function (a) {
            var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();

            var field = a.attributes.LogicalName;
            var account = CClearPartners.General.Form.GetValue(field);
            var entityid = (account == null) ? null : account[0].id;
            var searchfor = "account";

            var callback = function (id, name, type) {
                if (id) {
                    CClearPartners.General.Form.SetLookupValue(field, id, name, type);
                }
            };

            var customParameters = encodeURIComponent("SearchFor=" + searchfor + "&EntityId=" + entityid);
            var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
            Alert.showWebResource("ves_/zoekklant/zoeken.html?Data=" + customParameters, 1200, height, "Zoek aannemer", null, serverUrl, false, 10);

            CClearPartners.General.Form.RegisterAlertCallback("zoekklantCallback", callback);
        },
    },

    setDefaults: function () {
        var dig_renovatiebegeleidingid = CClearPartners.General.Form.GetValue("dig_renovatiebegeleidingid");
        CClearPartners.General.Form.SetFieldVisible("header_dig_renovatiebegeleidingid", (dig_renovatiebegeleidingid != null && dig_renovatiebegeleidingid.length > 0));
    },

    showAttributes: function (sourceattribute) {
        var value = CClearPartners.General.Form.GetValue(sourceattribute);
        var hasvalue = (value != null);
        console.log("Show/Hide Renovatiebegeleiding " + sourceattribute + ": " + hasvalue);
        var attributekey = sourceattribute.replace("dig_renovatiebegeleiding", "");
        CClearPartners.General.Form.SetFieldVisible("dig_resultaat" + attributekey, hasvalue);

        // 	Indien 'zonder RB' 2e optieset mag automatisch op 'Resultaat gekend' komen.
        var resultvalue = CClearPartners.General.Form.GetValue("dig_resultaat" + attributekey);
        if (value == 0 && resultvalue == null) CClearPartners.General.Form.SetValue("dig_resultaat" + attributekey, 1);
    },

    showResult: function (sourceattribute) {
        var value = CClearPartners.General.Form.GetValue(sourceattribute);
        var hasvalue = (value == 1);
        console.log("Show/Hide Result " + sourceattribute + ": " + hasvalue);
        var attributekey = sourceattribute.replace("dig_resultaat", "");

        CClearPartners.General.Form.SetFieldVisible("dig_investering" + attributekey, hasvalue);
    },
    CheckBeforeShowFieldsAannemerMethod: function (args) {
        if (args != null) {
            if (args.getEventSource != null && args.getEventSource().getName() != null) {
                // onchange event
                Digipolis.Resultaat.showFieldsAannemer(args.getEventSource().getName());
            } else if (typeof args == "string") {
                // direct text
                Digipolis.Resultaat.showFieldsAannemer(args);
            }
        }
    },
    showTypeGeplaatst: function (sourceattribute) {
        var value = CClearPartners.General.Form.GetValue(sourceattribute);
        var hasvalue = (value == 1);
        console.log("Show/Hide TypeGeplaatst " + sourceattribute + ": " + hasvalue);
        var attributekey = sourceattribute.replace("dig_resultaat", "");
        CClearPartners.General.Form.SetFieldVisible("dig_type" + attributekey + "geplaatst", hasvalue);
    },
    showFieldsAannemer: function (sourceattribute) {
        var value = CClearPartners.General.Form.GetValue(sourceattribute);
        var hasvalue = (value == 1);
        var attributekey = sourceattribute.replace("dig_resultaat", "");


        switch (attributekey) {
            case "isolatiehoofddak":
                console.log("Show/Hide isolatiehoofddak " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_mhoofddakgeisoleerd", hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_rwaardehoofddak", hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemerhoofddakid", hasvalue);
                break;
            case "electriciteit":
                console.log("Show/Hide electriciteit " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemer" + attributekey, hasvalue);
                break;
            case "isolatiebijdak":
                console.log("Show/Hide isolatiebijdak " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_mbijdakgeisoleerd", hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_rwaardebijdak", hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemerbijdakid", hasvalue);
                break;
            case "ramen":
                console.log("Show/Hide ramen " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_mramengeisoloeerd", hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_uwaarderamen", hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemerramenid", hasvalue);
                break;
            case "vloerisolatie":
                console.log("Show/Hide vloerisolatie " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_mvloergeisoleerd", hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_rwaardevloer", hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemervloerisolatieid", hasvalue);
                break;
            case "verwarming":
                console.log("Show/Hide verwarming " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_typehoofdverwarminggeplaatst", hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_typebijverwarminggeplaatst", hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemerverwarmingid", hasvalue);
                break;
            case "pvpanelen":
                console.log("Show/Hide pvpanelen " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aantalpvpanelen", hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_geinstalleerdvermogenpv", hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemerpvpanelenid", hasvalue);
                break;
            case "stabiliteit":
                console.log("Show/Hide stabiliteit " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemerstabiliteitid", hasvalue);
                break;
            case "brandgevaar":
                console.log("Show/Hide brandgevaar " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemerbrandgevaarid", hasvalue);
                break;
            case "vocht":
                console.log("Show/Hide vocht " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemervochtid", hasvalue);
                break;
            case "risico":
                console.log("Show/Hide risico " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemerrisicoid", hasvalue);
                break;
            case "gevelisolatie":
                console.log("Show/Hide gevelisolatie " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemergevelisolatieid", hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_mgevelgeisoleerd", hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_rwaardegevel", hasvalue);
                break;
            case "groendak":
                console.log("Show/Hide groendak " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemergroendakid", hasvalue);
                break;
            case "gevelgroen":
                console.log("Show/Hide gevelgroen " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemergevelgroenid", hasvalue);

                break;
            case "ontharding":
                console.log("Show/Hide ontharding " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemeronthardingid", hasvalue);
                break;
            case "hergebruikregenwater":
                console.log("Show/Hide hergebruikregenwater " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemerregenwaterid", hasvalue);
                break;
            case "hittebestendigheid":
                console.log("Show/Hide hittebestendigheid " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemerhitteid", hasvalue);
                break;
            case "sanitair":
                console.log("Show/Hide sanitair " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemerwarmwaterid", hasvalue);
                break;
            case "ventilatie":
                console.log("Show/Hide ventilatie " + sourceattribute + ": " + hasvalue);
                CClearPartners.General.Form.SetFieldVisible("dig_aannemerventilatieid", hasvalue);
                break;
            default:
                break;
        }
    },

};