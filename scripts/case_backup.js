//if (typeof (CClearPartners) == "undefined") {
//    CClearPartners = {};
//}
//
//if (typeof (CClearPartners.Case) == "undefined") {
//    CClearPartners.Case = {};
//}
//
//var customlookups = {};
//	
//CClearPartners.Case.Form = function () {
//	//*******************************Variables*******************************
//	originalStatusadvies: -1;
//	
//    //*******************************Event Handlers**************************
//    var formInitialized = false;
//    var onLoad = function () {        
//        console.log("BEGIN onLoad");
//
//        // only load when tab is openend (limit bronnengebruik op SP)
//        //loadSharePointDocumenten();
//        //loadSharePointDocumentenWooneenheid();
//        //loadSharePointDocumentenVorigeCase();
//
//		// Set external reference
//        // BC 27/06/2019: bugfix freed script - always overwrite namespace with current script
//	    //if (typeof (Xrm.CClearPartners) == "undefined")
//           Xrm.CClearPartners = CClearPartners;
//	    //if (typeof (Xrm.Page.CClearPartners) == "undefined")
//		    Xrm.Page.CClearPartners = CClearPartners;
//		    
//        // Init form state
//        setDienst(); // Should be executed first
//        setReceivedDate();
//        //initMawUser();
//        initCustomLookups();
//        
//    	// Only whe Form Type != "Read Only" AND "Disabled"
//	    var formtype = Xrm.Page.ui.getFormType();
//	    if (formtype != 3 && formtype != 4){
//	        filterCaseTypeCode();
//	        filterKanaal();
//	        filterHoedanigheid();
//	        filterDoelgroep();
//        }
//        
//        onChange.Hoedanigheid();
//        onChange.Origin();
//        onChange.Hoofdtype();
//        onChange.Type();
//        onChange.EnergiefacturenBeschikbaar();
//        onChange.Nieuwbouw();
//        onChange.DoorverwezenNaar();
//        onChange.Taal();
//        onChange.StatusAdvies();
//        onChange.Herhuisvesting();
//        onChange.BenovatieBegeleiding();
//        onChange.BenovatieProcedureEandisAfgesloten();
//        onChange.VMEOverleg();
//        onChange.TypeWoning();
//        //loadSharePointDocumenten();
//        // Only on create form
//        if (Xrm.Page.ui.getFormType() == 1)
//        	onChange.OwnerId(true);
//        	
//        // Only add events once
//        if (formInitialized) return;
//        CClearPartners.Form.General.AddOnChange("dig_hoofdtype", onChange.Hoofdtype);
//        CClearPartners.Form.General.AddOnChange("casetypecode", onChange.Type);
//        CClearPartners.Form.General.AddOnChange("caseorigincode", onChange.Origin);
//        CClearPartners.Form.General.AddOnChange("ownerid", onChange.OwnerId);
//        CClearPartners.Form.General.AddOnChange("dig_energiefacturenbeschikbaar", onChange.EnergiefacturenBeschikbaar);
//        CClearPartners.Form.General.AddOnChange("dig_telefoondoorsturennaarvesta", onChange.TelefoonNaarVesta);
//        CClearPartners.Form.General.AddOnChange("dig_gsmdoorsturennaarvesta", onChange.GsmNaarVesta);
//        CClearPartners.Form.General.AddOnChange("dig_emaildoorsturennaarvesta", onChange.EmailNaarVesta);
//        CClearPartners.Form.General.AddOnChange("dig_wooneenheid", onChange.WoonEenheid);
//        CClearPartners.Form.General.AddOnChange("dig_behandelendedienstid", onChange.BehandelendeDienst);
//        CClearPartners.Form.General.AddOnChange("dig_hoedanigheid", onChange.Hoedanigheid);
//        CClearPartners.Form.General.AddOnChange("dig_vorigecaseid", onChange.VorigeCase);
//        CClearPartners.Form.General.AddOnChange("dig_nieuwbouw", onChange.Nieuwbouw);
//        CClearPartners.Form.General.AddOnChange("dig_comeldpuntrumodovoorcogevaar", onChange.CoMeldpunt);
//        CClearPartners.Form.General.AddOnChange("dig_documentocmwgentenergiecelopgemaakt", onChange.DocumentOCMWGentEnergiecelOpgemaakt);
//        CClearPartners.Form.General.AddOnChange("dig_eigenaarsbrief", onChange.Eigenaarsbrief);
//        CClearPartners.Form.General.AddOnChange("dig_premieberekening", onChange.Premieberekening);
//        CClearPartners.Form.General.AddOnChange("dig_doorverwezennaar", onChange.DoorverwezenNaar);
//        CClearPartners.Form.General.AddOnChange("customerid", onChange.Klant);
//        CClearPartners.Form.General.AddOnChange("dig_communicatietaal", onChange.Taal);
//        CClearPartners.Form.General.AddOnChange("dig_statusadvies", onChange.StatusAdvies);
//        CClearPartners.Form.General.AddOnChange("dig_materiaalisolatiehoofddak", onChange.RWaardeHoofddak);
//        CClearPartners.Form.General.AddOnChange("dig_dikteisolatiehoofddak", onChange.RWaardeHoofddak);
//        CClearPartners.Form.General.AddOnChange("dig_exactelambdawaardehoofddak", onChange.RWaardeHoofddak);
//        CClearPartners.Form.General.AddOnChange("dig_materiaalisolatiebijdak", onChange.RWaardeBijdak);
//        CClearPartners.Form.General.AddOnChange("dig_dikteisolatiebijdak", onChange.RWaardeBijdak);
//        CClearPartners.Form.General.AddOnChange("dig_exactelambdawaardebijdak", onChange.RWaardeBijdak);
//        CClearPartners.Form.General.AddOnChange("dig_materiaalzoldervloerisolatie", onChange.RWaardeZolder);
//        CClearPartners.Form.General.AddOnChange("dig_diktezoldervloerisolatie", onChange.RWaardeZolder);
//        CClearPartners.Form.General.AddOnChange("dig_exactelambdawaardezolder", onChange.RWaardeZolder);
//        CClearPartners.Form.General.AddOnChange("dig_materiaalvloerisolatie", onChange.RWaardeVloer);
//        CClearPartners.Form.General.AddOnChange("dig_diktevloerisolatie", onChange.RWaardeVloer);
//        CClearPartners.Form.General.AddOnChange("dig_exactelambdawaardevloer", onChange.RWaardeVloer);
//        CClearPartners.Form.General.AddOnChange("dig_materiaalmuurisolatie", onChange.RWaardeMuur);
//        CClearPartners.Form.General.AddOnChange("dig_diktemuurisolatie", onChange.RWaardeMuur);
//        CClearPartners.Form.General.AddOnChange("dig_exactelambdawaardemuur", onChange.RWaardeMuur);
//        CClearPartners.Form.General.AddOnChange("dig_datumadvies", onChange.DatumAdvies);
//        CClearPartners.Form.General.AddOnChange("dig_inkomenscategorie", onChange.InkomensCategorie);
//        CClearPartners.Form.General.AddOnChange("dig_herhuisvesting", onChange.Herhuisvesting);
//        CClearPartners.Form.General.AddOnChange("dig_benovatiebegeleiding", onChange.BenovatieBegeleiding);
//        CClearPartners.Form.General.AddOnChange("dig_benovatieprocedureeandisafgesloten", onChange.BenovatieProcedureEandisAfgesloten);
//        CClearPartners.Form.General.AddOnChange("dig_vmeoverleg", onChange.VMEOverleg);
//        CClearPartners.Form.General.AddOnChange("dig_syndicusid", onChange.Syndicus);
//        CClearPartners.Form.General.AddOnChange("dig_syndicusbedrijfid", onChange.SyndicusBedrijf);
//        CClearPartners.Form.General.AddOnChange("dig_wijkgebondenprojectid", onChange.Wijkgebondenproject);
//        CClearPartners.Form.General.AddOnChange("dig_typewoning", onChange.TypeWoning);
//  
//        Xrm.Page.getAttribute("customerid").setRequiredLevel("none"); // Not possible to set this system field "not required" in the configuration
//        setTimeout(function(){ Xrm.Page.getAttribute("customerid").setRequiredLevel("none"); }, 2000);
//
//        //Xrm.Page.data.entity.addOnSave(onChange.TelefoonNaarVesta);
//		//Xrm.Page.data.entity.addOnSave(onChange.EmailNaarVesta);
//        formInitialized = true;
//        
//        var statusadviesObj = Xrm.Page.getAttribute("dig_statusadvies");
//        if (statusadviesObj != null)
//        	originalStatusadvies = statusadviesObj.getValue();
//        	
//    	// Collapse tab huisvesting -> when it is collapsed initially, the editable grid doesn't load well
//    	var tab = Xrm.Page.ui.tabs.get("tab_InschrijvingenBijDeSocialeHuisvestingsmaatschappij");
//        if (tab) tab.setDisplayState('collapsed');
//        
//        console.log("END onLoad");
//    };
//
//    var onSave = function(context){
//        try {
//            // Check custom lookups required value
//            for (var key in customlookups){
//                for (cli in customlookups[key]){
//                    var scope = customlookups[key][cli];
//                    if (scope.required() == true){
//                        // Check value
//                        var field = scope.fieldname();
//                        var value = Xrm.Page.getAttribute(field).getValue();
//        
//                        if (value == null){
//                            var saveEvt = context.getEventArgs();
//                            saveEvt.preventDefault(); 
//                            var name = Xrm.Page.getControl(field).getLabel();
//                            XrmServiceToolkit.Common.AddNotification("Het veld '" + name + "' is verplicht!", 1, "required-" + field);
//                        }
//                    }
//                }
//            }
//        } catch(err) {
//            console.log("Error at onSave: \n" + err);
//        }
//    };
//
//    var onChange = {
//        Hoofdtype: function () {
//			var HoofdtypeAttribute = Xrm.Page.getAttribute("dig_hoofdtype");
//	    	var HoofdtypeControl = Xrm.Page.getControl("dig_hoofdtype");
//			var formtype = Xrm.Page.ui.getFormType();
//	    
//	    	if (HoofdtypeAttribute && HoofdtypeControl){
//	            var type = CClearPartners.Form.General.GetValue("dig_hoofdtype");
//	            if (formtype != 3 && formtype != 4) {
//		            if (type == null){
//		            	CClearPartners.Form.General.SetDisabled("casetypecode", true);
//					    CClearPartners.Form.General.SetValue("casetypecode", null);
//		            }
//		            else{
//		            	CClearPartners.Form.General.SetDisabled("casetypecode", false);
//		            }
//	            }
//
//		        // Advies: 1, Begeleiding: 2
//				var isAdvies = (type == 1);
//				var adviesCaseTypeCodes = [31,32,33,34,45,35,36,37,44,46];
//				var isBegeleiding = (type == 2);
//				var begeleidingCaseTypeCodes = [38,39,40,41,42,43];
//
//				var caseTypeAttribute = Xrm.Page.getAttribute("casetypecode");
//	    		var caseTypeControl = Xrm.Page.getControl("casetypecode");
//	            	            
//	            if (formtype != 3 && formtype != 4) {
//		    		if (caseTypeAttribute != null && caseTypeControl != null){
//			    		var code = CClearPartners.Form.General.GetValue("casetypecode");
//			    		var options = caseTypeAttribute.getOptions();
//				    
//					    // Save all options to memory
//					    if (!window.CaseTypeOptions)
//					    {
//					        window.CaseTypeOptions = [];
//						    for(var i = 0; i < options.length; i++)
//						    	CaseTypeOptions.push(options[i]);
//					    }
//				
//					    // Clear all items
//					    for(var i = 0; i < options.length; i++)
//					        caseTypeControl.removeOption(options[i].value);           
//				
//						// Add type-options depending on hoofdtype		
//					    for(var i = 0; i < CaseTypeOptions.length; i++){
//					    	var option = CaseTypeOptions[i];
//					    	var value = option.value;
//					    	
//					    	if (isAdvies && adviesCaseTypeCodes.indexOf(parseInt(value)) > -1){
//						        caseTypeControl.addOption(option);
//						    }
//						    else if (isBegeleiding && begeleidingCaseTypeCodes.indexOf(parseInt(value)) > -1){
//						        caseTypeControl.addOption(option);
//						    }
//					    }
//						
//						if ((isAdvies && adviesCaseTypeCodes.indexOf(parseInt(code)) > -1)
//						|| (isBegeleiding && begeleidingCaseTypeCodes.indexOf(parseInt(code)) > -1)){
//					    	CClearPartners.Form.General.SetValue("casetypecode", code);
//					    }
//					}
//				}
//		    }
//        },
//        Type: function () {
//            var HoofdtypeAttribute = Xrm.Page.getAttribute("dig_hoofdtype");
//            var Hoofdtype;
//	    	if (HoofdtypeAttribute)
//	            Hoofdtype = HoofdtypeAttribute.getValue();
//	            
//            var type = CClearPartners.Form.General.GetValue("casetypecode");
//			var currentForm = getDienst();
//			var formtype = Xrm.Page.ui.getFormType();
//			
//			if (currentForm == "Wonen"){
//	        	// Contactmoment: 1, Dossier: 2
//	            var isDossier = (type == 2 || type == 3 || type == 4);
//	            var isContactmoment = !isDossier; //(type == 1); // Default contactmoment -> != dossier
//	            
//	            // Set required value for customer
//				if (customlookups["customerid"] != null) 
//					for (cli in customlookups["customerid"])
//						customlookups["customerid"][cli].required(!isContactmoment);
//	            
//	            CClearPartners.Form.General.SetFieldVisible("dig_dossier", isContactmoment);
//				
//				CClearPartners.Form.General.SetSectionVisible("general","contactmoment_aanmelding", isContactmoment);
//				//CClearPartners.Form.General.SetSectionVisible("general","contactmoment_vraag", isContactmoment);
//				CClearPartners.Form.General.SetSectionVisible("general","contactmoment_antwoord", isContactmoment);
//				CClearPartners.Form.General.SetSectionVisible("general","dossier_aanmelding", isDossier);
//				CClearPartners.Form.General.SetSectionVisible("general","dossier_overzicht", isDossier);
//				CClearPartners.Form.General.SetSectionVisible("general","dossier_client", isDossier);
//				CClearPartners.Form.General.SetSectionVisible("general","dossier_wooneenheid", isDossier);
//				CClearPartners.Form.General.SetSectionVisible("general","dossier_privenotities", isDossier);
//				CClearPartners.Form.General.SetSectionVisible("Details","dossier_WooneenheidDetails", isDossier);
//				
//            	CClearPartners.Form.General.SetTabVisible("tab_Documenten", isDossier);
//            	CClearPartners.Form.General.SetTabVisible("tab_Dossier", isDossier);
//            	CClearPartners.Form.General.SetTabVisible("tab_Samenwerkingspartners", isDossier);
//            	CClearPartners.Form.General.SetTabVisible("tab_InschrijvingenBijDeSocialeHuisvestingsmaatschappij", isDossier);
//                
//                // Also set iccarus field
//                onChange.Origin();
//		    }
//		    else if (currentForm == "Energie"){
//	            var isHoofdtypeAdvies = (Hoofdtype == 1);
//	            var isAdvies = ((type == 31) || (type == 32) || (type == 33));
//	            var isMAW = ((type == 31) || (type == 32) || (type == 33) || (type == 42) /*|| (type == 34) || (type == 44)*/);
//	            var isOntzorging = (type == 42);
//                var isRenovatieAdvies = (type == 32);
//	            var isEnergiescan = ((type == 35) || (type == 37)|| (type == 38)|| (type == 39)|| (type == 40)|| (type == 41)|| (type == 43)|| (type == 44)|| (type == 46))
//	            var isWaterscan = (type == 36);    
//	            var isKleinAdvies = (type == 34);    
//	            var isTechnischAdvies = (type == 45);
//	            var isTrajectBegeleiding = (type == 41);
//	            var isOpvolgscanType1 = (type == 37)|| (type == 46);
//	            var isOpvolgscanType1A = (type == 37);
//	            var isOpvolgscanType2 = (type == 38) || (type == 39)  || (type == 40);
//	            //31 = Financieel advies
//	            var showDoelgroep = ((type == 34) || (type == 35) || (type == 36) ||(type == 37)|| (type == 38)|| (type == 39)|| (type == 40)|| (type == 41)|| (type == 43)|| (type == 44)|| (type == 45)|| (type == 46));
//	            
//	            // Set required value for customer
//				if (customlookups["customerid"] != null)
//					for (cli in customlookups["customerid"])
//						customlookups["customerid"][cli].required(!isKleinAdvies);
//
//	            CClearPartners.Form.General.SetTabVisible("tab_Advies", isMAW);
//	            CClearPartners.Form.General.SetTabVisible("tab_Planning", isMAW);
//	            CClearPartners.Form.General.SetTabVisible("tab_Basisscan", isEnergiescan);
//	            CClearPartners.Form.General.SetTabVisible("tab_BouwadviesOntzorging", isOntzorging);
//	            CClearPartners.Form.General.SetTabVisible("tab_AdviesEnOpvolging", isEnergiescan);
//	            CClearPartners.Form.General.SetTabVisible("tab_BerekeningBesparing", (isTrajectBegeleiding || isOpvolgscanType2 || isOntzorging || isTechnischAdvies));
//	            CClearPartners.Form.General.SetTabVisible("tab_OpvolgingOpvolgscanType1", isOpvolgscanType1);
//	            CClearPartners.Form.General.SetTabVisible("tab_TrajctebegeleidingEnOpvolgscanType2", (isTrajectBegeleiding || isOpvolgscanType2));
//
//				CClearPartners.Form.General.SetSectionVisible("general","general_section_KlantContacteren", isKleinAdvies);
//				CClearPartners.Form.General.SetSectionVisible("extra","Doelgroep", showDoelgroep);
//				CClearPartners.Form.General.SetSectionVisible("extra","Doelgroep", showDoelgroep);
//				CClearPartners.Form.General.SetSectionVisible("extra","Doelgroep", showDoelgroep);
//				CClearPartners.Form.General.SetSectionVisible("tab_OpvolgingOpvolgscanType1","tab_OpvolgingOpvolgscanType1_module2", isOpvolgscanType1A);
//				CClearPartners.Form.General.SetSectionVisible("tab_OpvolgingOpvolgscanType1","tab_OpvolgingOpvolgscanType1_module3", isOpvolgscanType1A);
//				CClearPartners.Form.General.SetSectionVisible("tab_OpvolgingOpvolgscanType1","tab_OpvolgingOpvolgscanType1_module4", isOpvolgscanType1A);
//				CClearPartners.Form.General.SetSectionVisible("tab_OpvolgingOpvolgscanType1","tab_OpvolgingOpvolgscanType1_module5", isOpvolgscanType1A);
//				CClearPartners.Form.General.SetSectionVisible("tab_OpvolgingOpvolgscanType1","tab_OpvolgingOpvolgscanType1_module6", isOpvolgscanType1A);
//				CClearPartners.Form.General.SetSectionVisible("tab_AdviesEnOpvolging","tab_AdviesEnOpvolging_section_leveranciers", !(isTrajectBegeleiding || isOpvolgscanType1 || isOpvolgscanType2));
//				CClearPartners.Form.General.SetSectionVisible("tab_AdviesEnOpvolging","tab_AdviesEnOpvolging_section_opvolging", !(isTrajectBegeleiding || isOpvolgscanType1 || isOpvolgscanType2));
//                //CClearPartners.Form.General.SetSectionVisible("tab_AdviesEnOpvolging","tab_AdviesEnOpvolging_section_advies", type == 35);
//
//				CClearPartners.Form.General.SetFieldVisible("dig_beschermd", isMAW);
//				
//	            CClearPartners.Form.General.SetFieldVisible("dig_statusadvies", (isHoofdtypeAdvies || isOpvolgscanType1));
//                if (formtype == 1) CClearPartners.Form.General.SetValue("dig_statusadvies", (isHoofdtypeAdvies || isOpvolgscanType1) ? 5 : null);
//				Xrm.Page.getAttribute("dig_statusadvies").setRequiredLevel((isHoofdtypeAdvies || isOpvolgscanType1) ? "required" : "none");
//                
//	            CClearPartners.Form.General.SetFieldVisible("dig_datumadvies", (isHoofdtypeAdvies || isOpvolgscanType1 || isOpvolgscanType2));
//	            CClearPartners.Form.General.SetFieldVisible("dig_actualduration", (isHoofdtypeAdvies || isOpvolgscanType1));
//	            CClearPartners.Form.General.SetFieldVisible("dig_formattedactualduration", (isHoofdtypeAdvies || isOpvolgscanType1));
//
//                if (!(isHoofdtypeAdvies || isOpvolgscanType1)) CClearPartners.Form.General.SetRequired("dig_actualduration", false);
//	            
//	            CClearPartners.Form.General.SetFieldVisible("ccp_bevestigingafspraaktrajectbegeleiding", isTrajectBegeleiding);
//	            
//	            CClearPartners.Form.General.SetFieldVisible("dig_statusontzorgingbegeleiding", isOntzorging);
//	            CClearPartners.Form.General.SetFieldVisible("dig_duurontzorgingbegeleiding", isOntzorging || isTrajectBegeleiding || isOpvolgscanType2);
//	            CClearPartners.Form.General.SetFieldVisible("dig_formattedduurontzorgingbegeleiding", isOntzorging || isTrajectBegeleiding || isOpvolgscanType2);
//
//	            CClearPartners.Form.General.SetFieldVisible("dig_benovatiebegeleiding", isTrajectBegeleiding || isOntzorging || isOpvolgscanType2 || isEnergiescan || isRenovatieAdvies);
//	            CClearPartners.Form.General.SetFieldVisible("dig_vmeoverleg", isTrajectBegeleiding || isOntzorging || isOpvolgscanType2 || isEnergiescan || isRenovatieAdvies);
//	            
//	            // Show warning when values are empty
//	            onChange.DatumAdvies();
//	            onChange.InkomensCategorie();
//				checkWooneenheidValue();
//                checkBehandelendeDienstValue();
//
//				if (formtype != 3 && formtype != 4) {
//		            CClearPartners.Form.General.SetDisabled("dig_statusadvies", (isEnergiescan || isWaterscan));
//		            CClearPartners.Form.General.SetDisabled("dig_datumadvies", ((isEnergiescan && !isOpvolgscanType2) || isWaterscan));
//	            
//					var statuscodeAttribute = Xrm.Page.getAttribute("statuscode");
//		    		var statuscodeControl = Xrm.Page.getControl("header_statuscode");
//					if (isKleinAdvies == false || type == null){
//						//statuscode 'Doorgestuurd naar MAW' verbergen
//			    		if (statuscodeControl && statuscodeAttribute){
//			            	var code = CClearPartners.Form.General.GetValue("casetypecode");
//				    		var options = statuscodeAttribute.getOptions();
//				    		
//							// Save all options to memory
//						    if (!window.StatusCodeOptions)
//						    {
//						        window.StatusCodeOptions = [];
//							    for(var i = 0; i < options.length; i++)
//							    	StatusCodeOptions.push(options[i]);
//						    }
//					    
//					    	for(var i = 0; i < options.length; i++){
//						    	if (options[i].value == 914380002)
//						    		statuscodeControl.removeOption(options[i].value);
//							}
//						}
//					}
//					/*else{
//						var options = statuscodeAttribute.getOptions();
//				    	for(var i = 0; i < options.length; i++){
//							statuscodeControl.removeOption(options[i].value);
//				    	}
//					    for(var i = 0; i < StatusCodeOptions.length; i++){
//					    	var option = StatusCodeOptions[i];
//							statuscodeControl.addOption(option);
//					    }
//					}*/
//					
//					/*// Set duurtijd based on type
//					var setduurtijd = function(){
//						initDuurtijden();
//						var duurtijd = CClearPartners.Form.General.GetValue("dig_actualduration");
//					   	if (type != null && _duurtijden[type] != null && duurtijd == null)
//						    CClearPartners.Form.General.SetValue("dig_actualduration",parseInt(_duurtijden[type]));
//					};
//     				// use settimeout to run async (performance)
//     				setTimeout(setduurtijd, 0);*/
//				}
//		    }		    
//        },
//        Origin: function(){
//            var caseorigincode = CClearPartners.Form.General.GetValue("caseorigincode");
//            var type = CClearPartners.Form.General.GetValue("casetypecode");
//            var isDossier = (type == 2 || type == 3 || type == 4);
//
//            if (isDossier && caseorigincode == 914380000) { // ICCARus
//	            CClearPartners.Form.General.SetFieldVisible("dig_afgevallenomwillevan", true);
//	            CClearPartners.Form.General.SetFieldVisible("dig_statuswerving", true);
//            } else {
//	            CClearPartners.Form.General.SetFieldVisible("dig_afgevallenomwillevan", false);
//	            CClearPartners.Form.General.SetFieldVisible("dig_statuswerving", false);
//            }
//       },
//        DatumAdvies: function(){
//            var type = CClearPartners.Form.General.GetValue("casetypecode");
//	        var isAdvies = ((type == 31) || (type == 32) || (type == 33));
//	        
//            if (isAdvies){
//            	// Show warning when Datum Advies is empty
//            	var dig_datumadvies = CClearPartners.Form.General.GetValue("dig_datumadvies");
//            	
//            	if (dig_datumadvies == null)
//            		XrmServiceToolkit.Common.AddNotification("\"Datum advies/scan\" is nog niet opgegeven in deze case.", 3, "dig_datumadvies-empty");
//            	else
//            		Xrm.Page.ui.clearFormNotification("dig_datumadvies-empty");
//            }
//       },
//		InkomensCategorie: function(){
//            var type = CClearPartners.Form.General.GetValue("casetypecode");
//	        var isTrajectBegeleiding = (type == 41);
//	        
//            if (isTrajectBegeleiding){
//            	// Show warning when Datum Advies is empty
//            	var dig_inkomenscategorie = CClearPartners.Form.General.GetValue("dig_inkomenscategorie");
//            	
//            	if (dig_inkomenscategorie == null)
//            		XrmServiceToolkit.Common.AddNotification("\"Inkomens Categorie\" is nog niet opgegeven in deze case.", 3, "dig_inkomenscategorie-empty");
//            	else
//            		Xrm.Page.ui.clearFormNotification("dig_inkomenscategorie-empty");
//            }
//       },
//        EnergiefacturenBeschikbaar: function(){
//            var beschikbaar = CClearPartners.Form.General.GetValue("dig_energiefacturenbeschikbaar");
//        
//			CClearPartners.Form.General.SetFieldVisible("dig_energiefacturenredennietbeschikbaar", beschikbaar == 0);
//       },
//        OwnerId: function(){
//            var owner = CClearPartners.Form.General.GetValue("ownerid");
//            
//			if (owner != null){
//				XrmServiceToolkit.Rest.Retrieve(
//					owner[0].id, 
//					"SystemUserSet", 
//					"dig_Locatie", 
//					null, 
//					function(result){
//						if (result != null && result.dig_Locatie != null){
//                            CClearPartners.Form.General.SetLookupValue("dig_locatie", result.dig_Locatie.Id, result.dig_Locatie.Name, result.dig_Locatie.LogicalName);
//						}
//					},
//					function(error){ /* do nothing */ }, 
//					true);
//			}     
//       },
//        TelefoonNaarVesta: function(econtext){
//       		var currentForm = getDienst();
//			if (currentForm == "Energie"
//       		&& Xrm.Page.getAttribute("dig_telefoondoorsturennaarvesta").getIsDirty()
//       		&& Xrm.Page.getAttribute("dig_telefoondoorsturennaarvesta").getValue()){
//       			var value = window.confirm("Is de klant op de hoogte dat zijn contactgegevens centraal worden opgeslagen?");
//       			if (value == false){
//       				Xrm.Page.getAttribute("dig_telefoondoorsturennaarvesta").setValue(false);
//       				/*if (econtext != null){
//       					econtext.getEventArgs().preventDefault();
//       				}*/
//       			}
//       		}
//       },
//		GsmNaarVesta: function(econtext){
//				var currentForm = getDienst();
//			if (currentForm == "Energie"
//				&& Xrm.Page.getAttribute("dig_gsmdoorsturennaarvesta").getIsDirty()
//				&& Xrm.Page.getAttribute("dig_gsmdoorsturennaarvesta").getValue()){
//					var value = window.confirm("Is de klant op de hoogte dat zijn contactgegevens centraal worden opgeslagen?");
//					if (value == false){
//						Xrm.Page.getAttribute("dig_gsmdoorsturennaarvesta").setValue(false);
//						/*if (econtext != null){
//							econtext.getEventArgs().preventDefault();
//						}*/
//					}
//				}
//		},
//		EmailNaarVesta: function(econtext){
//				var currentForm = getDienst();
//				if (currentForm == "Energie"
//				&& Xrm.Page.getAttribute("dig_emaildoorsturennaarvesta").getIsDirty()
//				&& Xrm.Page.getAttribute("dig_emaildoorsturennaarvesta").getValue()){
//					var value = window.confirm("Is de klant op de hoogte dat zijn contactgegevens centraal worden opgeslagen?");
//					if (value == false){
//						Xrm.Page.getAttribute("dig_emaildoorsturennaarvesta").setValue(false);
//						/*if (econtext != null){
//							econtext.getEventArgs().preventDefault();
//						}*/
//					}
//				}
//		},
//		WoonEenheid: function(){
//            setWijkgebondenProject();
//				
//				var currentForm = getDienst();
//				
//				if (Xrm.Page.getAttribute("dig_wooneenheid") != null){
//					var dig_wooneenheid = Xrm.Page.getAttribute("dig_wooneenheid").getValue();
//					
//					if (dig_wooneenheid != null){
//						XrmServiceToolkit.Rest.Retrieve(
//						dig_wooneenheid[0].id, 
//						"dig_wooneenheidSet", 
//						"dig_postcode,dig_bouwjaar,dig_bouwjaarvoor1970,dig_Renovatiejaar,dig_Renovatiewerken,dig_oovantoepassing,dig_Stedebouwkundigevergunning,dig_OpmerkingStedebouwkundigevergunning,dig_typewoning,dig_Typebebouwing", 
//						null, 
//						function(result){
//							if (result != null && result.dig_postcode != null){
//								if (Xrm.Page.getAttribute("dig_manuelepostcode") != null && Xrm.Page.getAttribute("dig_manuelepostcode").getValue() != result.dig_postcode){
//									Xrm.Page.getAttribute("dig_manuelepostcode").setValue(result.dig_postcode);
//									Xrm.Page.getAttribute("dig_manuelepostcode").fireOnChange();
//								}
//								if (Xrm.Page.getAttribute("dig_bouwjaar") != null && Xrm.Page.getAttribute("dig_bouwjaar").getValue() != result.dig_bouwjaar){
//									Xrm.Page.getAttribute("dig_bouwjaar").setValue(result.dig_bouwjaar);
//									Xrm.Page.getAttribute("dig_bouwjaar").fireOnChange();
//								}
//								if (Xrm.Page.getAttribute("dig_bouwjaarvoor1970") != null && Xrm.Page.getAttribute("dig_bouwjaarvoor1970").getValue() != result.dig_bouwjaarvoor1970){
//									Xrm.Page.getAttribute("dig_bouwjaarvoor1970").setValue(result.dig_bouwjaarvoor1970);
//									Xrm.Page.getAttribute("dig_bouwjaarvoor1970").fireOnChange();
//								}
//								if (Xrm.Page.getAttribute("dig_renovatiejaar") != null && Xrm.Page.getAttribute("dig_renovatiejaar").getValue() != result.dig_Renovatiejaar){
//									Xrm.Page.getAttribute("dig_renovatiejaar").setValue(result.dig_Renovatiejaar);
//									Xrm.Page.getAttribute("dig_renovatiejaar").fireOnChange();
//								}
//								if (Xrm.Page.getAttribute("dig_renovatiewerken") != null && Xrm.Page.getAttribute("dig_renovatiewerken").getValue() != result.dig_Renovatiewerken){
//									Xrm.Page.getAttribute("dig_renovatiewerken").setValue(result.dig_Renovatiewerken);
//									Xrm.Page.getAttribute("dig_renovatiewerken").fireOnChange();
//								}
//								if (Xrm.Page.getAttribute("dig_oovantoepassing") != null && Xrm.Page.getAttribute("dig_oovantoepassing").getValue() != result.dig_oovantoepassing){
//									Xrm.Page.getAttribute("dig_oovantoepassing").setValue(result.dig_oovantoepassing);
//									Xrm.Page.getAttribute("dig_oovantoepassing").fireOnChange();
//								}
//								if (Xrm.Page.getAttribute("dig_stedebouwkundigevergunning") != null && Xrm.Page.getAttribute("dig_stedebouwkundigevergunning").getValue() != result.dig_Stedebouwkundigevergunning){
//									Xrm.Page.getAttribute("dig_stedebouwkundigevergunning").setValue(result.dig_Stedebouwkundigevergunning);
//									Xrm.Page.getAttribute("dig_stedebouwkundigevergunning").fireOnChange();
//								}
//								if (Xrm.Page.getAttribute("dig_opmerkingstedebouwkundigevergunning") != null && Xrm.Page.getAttribute("dig_opmerkingstedebouwkundigevergunning").getValue() != result.dig_OpmerkingStedebouwkundigevergunning){
//									Xrm.Page.getAttribute("dig_opmerkingstedebouwkundigevergunning").setValue(result.dig_OpmerkingStedebouwkundigevergunning);
//									Xrm.Page.getAttribute("dig_opmerkingstedebouwkundigevergunning").fireOnChange();
//								}
//								if (Xrm.Page.getAttribute("dig_typewoning") != null && Xrm.Page.getAttribute("dig_typewoning").getValue() != result.dig_typewoning.Value){
//									Xrm.Page.getAttribute("dig_typewoning").setValue(result.dig_typewoning.Value);
//									Xrm.Page.getAttribute("dig_typewoning").fireOnChange();
//								}
//								if (Xrm.Page.getAttribute("dig_typebebouwing") != null && Xrm.Page.getAttribute("dig_typebebouwing").getValue() != result.dig_Typebebouwing.Value){
//									Xrm.Page.getAttribute("dig_typebebouwing").setValue(result.dig_Typebebouwing.Value);
//									Xrm.Page.getAttribute("dig_typebebouwing").fireOnChange();
//								}
//							}
//						},
//						function (error) {
//						    alert(error.message);
//						},
//						true);
//				}
//				
//				if (currentForm == "Milieu")
//					checkWooneenheidValue();       
//				}
//				
//				if (currentForm == "Wonen") {
//					// Make sure the wooneenheid documents are loaded
//					loadSharePointDocumentenWooneenheid();
//				}
//			},
//       	Hoedanigheid: function(){
//			var currentForm = getDienst();
//			var formtype = Xrm.Page.ui.getFormType();
//	    
//       		// show eigenaar (only on dienst milieu)
//			if (currentForm == "Energie"){
//				var hoedanigheid = CClearPartners.Form.General.GetValue("dig_hoedanigheid");
//				var isHuurder = ((hoedanigheid != null) && (hoedanigheid[0].name == "Huurder"));
//				var isVerhuurder = ((hoedanigheid != null) && (hoedanigheid[0].name == "Verhuurder"));
//                var isContactpersoon = ((hoedanigheid != null) && (hoedanigheid[0].name == "Contactpersoon collectief woongebouw"));		
//
// 				CClearPartners.Form.General.SetFieldVisible("dig_emailadreseigenaar", isHuurder);
// 				CClearPartners.Form.General.SetFieldVisible("dig_telefooneigenaar", isHuurder);
// 				CClearPartners.Form.General.SetFieldVisible("dig_betrokkenetelefoon", isVerhuurder || isContactpersoon);
// 				CClearPartners.Form.General.SetFieldVisible("dig_betrokkenegsm", isHuurder || isVerhuurder || isContactpersoon);
// 				CClearPartners.Form.General.SetFieldVisible("dig_betrokkeneemail", isVerhuurder || isContactpersoon);
//		
//                // Clear values if not relevant
// 				if (!isHuurder)
// 				{
// 					CClearPartners.Form.General.SetValue("dig_emailadreseigenaar", null);
// 					CClearPartners.Form.General.SetValue("dig_telefooneigenaar", null);
// 				}
// 				if (!(isVerhuurder || isContactpersoon))
// 				{
// 					CClearPartners.Form.General.SetValue("dig_betrokkenetelefoon", null);
// 					CClearPartners.Form.General.SetValue("dig_betrokkeneemail", null);
// 				}
// 				if (!(isHuurder || isVerhuurder || isContactpersoon))
// 				{
// 					CClearPartners.Form.General.SetValue("dig_betrokkenegsm", null);
//                }
//
// 				// Set web resource disabled (setvisible doesn't work as expected on webresource)
// 				if (customlookups["dig_eigenaar"]) for (cli in customlookups["dig_eigenaar"]) customlookups["dig_eigenaar"][cli].disable(!isHuurder);
// 				if (customlookups["dig_huurder"]) for (cli in customlookups["dig_huurder"]) customlookups["dig_huurder"][cli].disable(!isVerhuurder);
// 				if (customlookups["dig_syndicusid"]) for (cli in customlookups["dig_syndicusid"]) customlookups["dig_syndicusid"][cli].disable(!isContactpersoon);
// 				if (customlookups["dig_syndicusbedrijfid"]) for (cli in customlookups["dig_syndicusbedrijfid"]) customlookups["dig_syndicusbedrijfid"][cli].disable(!isContactpersoon);
//                
// 				if (!isHuurder){
// 					// Clear value when != huurder
//	 				if (formtype != 3 && formtype != 4) CClearPartners.Form.General.SetValue("dig_eigenaar", null);
// 					CClearPartners.Form.General.SetSectionVisible("Details","tab_Details_section_eigenaardetails", false);
//	 				if (customlookups["dig_eigenaar"]) for (cli in customlookups["dig_eigenaar"]) customlookups["dig_eigenaar"][cli].fieldvalue(null);
// 				}
// 				else if (isHuurder){
// 					CClearPartners.Form.General.SetSectionVisible("Details","tab_Details_section_eigenaardetails", true);
// 				}
//
// 				if (!isVerhuurder){
// 					// Clear value when != verhuurder
//	 				if (formtype != 3 && formtype != 4) CClearPartners.Form.General.SetValue("dig_huurder", null);
// 					CClearPartners.Form.General.SetSectionVisible("Details","tab_Details_section_huurderdetails", false);
//	 				if (customlookups["dig_huurder"]) for (cli in customlookups["dig_huurder"]) customlookups["dig_huurder"][cli].fieldvalue(null);
// 				}
// 				else if (isVerhuurder){
// 					CClearPartners.Form.General.SetSectionVisible("Details","tab_Details_section_huurderdetails", true);
// 				}
//
// 				if (!isContactpersoon){
// 					// Clear value when != verhuurder
//	 				if (formtype != 3 && formtype != 4) CClearPartners.Form.General.SetValue("dig_syndicusid", null);
// 					CClearPartners.Form.General.SetSectionVisible("Details","tab_Details_section_syndicusdetails", false);
//	 				if (customlookups["dig_syndicusid"]) for (cli in customlookups["dig_syndicusid"]) customlookups["dig_syndicusid"][cli].fieldvalue(null);
//	 				if (customlookups["dig_syndicusbedrijfid"]) for (cli in customlookups["dig_syndicusbedrijfid"]) customlookups["dig_syndicusbedrijfid"][cli].fieldvalue(null);
// 				}
// 				else if (isContactpersoon){
// 					CClearPartners.Form.General.SetSectionVisible("Details","tab_Details_section_syndicusdetails", true);
// 				}
//
//                // Hide betrokkene if none are editable/visible
//                CClearPartners.Form.General.SetSectionVisible("general","general_section_betrokkene", isHuurder || isVerhuurder || isContactpersoon);
//			}
//        },
//		VorigeCase: function(){
//			Xrm.Page.ui.refreshRibbon();
//   			var currentForm = getDienst();
//       		if (currentForm == "Energie") {
//	   			// Make sure the Vorige Case documents are loaded
//	   			loadSharePointDocumentenVorigeCase();
//   			}
//		},
//		Nieuwbouw: function(){
//			var isNieuwbouw = false;
//			if (Xrm.Page.getAttribute("dig_nieuwbouw") != null)
//				isNieuwbouw = Xrm.Page.getAttribute("dig_nieuwbouw").getValue();
//				
//			CClearPartners.Form.General.SetTabVisible("tab_Nieuwbouw", isNieuwbouw);
//		},
//		BehandelendeDienst: function(){
//			checkBehandelendeDienstValue();
//		},
//		CoMeldpunt: function(){
//			if (Xrm.Page.getAttribute("dig_comeldpuntrumodovoorcogevaar") != null && Xrm.Page.getAttribute("dig_beschrijvingcogevaar") != null){
//				var currentForm = getDienst();
//				if (currentForm == "Energie"
//	       		&& Xrm.Page.getAttribute("dig_comeldpuntrumodovoorcogevaar").getIsDirty()
//	       		&& Xrm.Page.getAttribute("dig_comeldpuntrumodovoorcogevaar").getValue() == 1)
//	       		{
//	       			var value = window.confirm("Hebt u bevestiging gevraagd bij de klant?");
//	       			if (value == false){
//	       				Xrm.Page.getAttribute("dig_comeldpuntrumodovoorcogevaar").setValue(0);
//	       			}
//	       		}
//	       		
//	       		if (Xrm.Page.getAttribute("dig_comeldpuntrumodovoorcogevaar").getValue() == 1){
//	       			Xrm.Page.getAttribute("dig_beschrijvingcogevaar").setRequiredLevel("required");
//	 				CClearPartners.Form.General.SetFieldVisible("dig_beschrijvingcogevaar", true);
//	       		}
//	   			else{
//	   				Xrm.Page.getAttribute("dig_beschrijvingcogevaar").setRequiredLevel("none");
//	 				CClearPartners.Form.General.SetFieldVisible("dig_beschrijvingcogevaar", false);
//	   			}
//       		}
//		},
//		Eigenaarsbrief: function(){
//			var currentForm = getDienst();
//			if (currentForm == "Energie"
//       		&& Xrm.Page.getAttribute("dig_eigenaarsbrief").getIsDirty()
//       		&& Xrm.Page.getAttribute("dig_eigenaarsbrief").getValue())
//       		{
//       			var value = window.confirm("Hebt u de toestemming om de eigenaar te contacteren?");
//       			if (value == false){
//       				Xrm.Page.getAttribute("dig_eigenaarsbrief").setValue(false);
//       			}
//       		}
//		},
//		Premieberekening: function(){
//			if (Xrm.Page.getAttribute("dig_premieberekening") != null){
//				if (Xrm.Page.getAttribute("dig_premieberekening").getValue() == true && Xrm.Page.ui.tabs.get("tab_Documenten").getDisplayState() == "expanded"){
//					Xrm.Page.ui.tabs.get("tab_Documenten").setDisplayState("collapsed");
//				}
//			}
//		},
//		DoorverwezenNaar: function(){
//            var type = CClearPartners.Form.General.GetValue("casetypecode");            
//
//			// Alleen bij contactmoment/registratie
//			if (type == 1){
//				var doorverwezennaar = CClearPartners.Form.General.GetValue("dig_doorverwezennaar");
//				if (doorverwezennaar != null){
//					Xrm.Page.getAttribute("customerid").setRequiredLevel("required");
//					//Xrm.Page.getAttribute("dig_telefoon").setRequiredLevel("required");
//					//Xrm.Page.getAttribute("dig_vraag").setRequiredLevel("required");
//					//Xrm.Page.getAttribute("dig_antwoord").setRequiredLevel("required");
//					CClearPartners.Form.General.SetSectionVisible("general","contactmoment_vraag", true);
//				} else {
//					Xrm.Page.getAttribute("customerid").setRequiredLevel("none");
//					//Xrm.Page.getAttribute("dig_telefoon").setRequiredLevel("none");
//					//Xrm.Page.getAttribute("dig_vraag").setRequiredLevel("none");
//					//Xrm.Page.getAttribute("dig_antwoord").setRequiredLevel("none");
//					CClearPartners.Form.General.SetSectionVisible("general","contactmoment_vraag", false);
//				}
//			}
//		},
//		Klant: function(){
//			if (Xrm.Page.getAttribute("customerid") != null){
//				CClearPartners.Form.General.SetValue("dig_customeraccountid", null);
//				CClearPartners.Form.General.SetValue("dig_customercontactid", null);
//				
//				var customer = Xrm.Page.getAttribute("customerid").getValue();
//				if (customer != null){
//					var id = customer[0].id;
//					var type = customer[0].entityType;
//					if (type == "contact"){				
//						XrmServiceToolkit.Rest.Retrieve(
//							id, 
//							"ContactSet", 
//							"EMailAddress1,Telephone1,MobilePhone", 
//							null, 
//							function(result){
//								if (result != null){
//									if (result.EMailAddress1 != null && result.EMailAddress1.trim()){
//       									CClearPartners.Form.General.SetValue("dig_email", result.EMailAddress1);
//									}
//									if (result.Telephone1 != null && result.Telephone1.trim()){
//       									CClearPartners.Form.General.SetValue("dig_telefoon", result.Telephone1);
//									}
//									if (result.MobilePhone != null && result.MobilePhone.trim() != ""){
//       									CClearPartners.Form.General.SetValue("dig_gsm", result.MobilePhone);
//									}
//								}
//							},
//							function(error){ alert(error.message); }, 
//							true);
//					}
//					else if (type == "account"){
//
//					}
//				} 
//				
//				// Make sure custom web resource is set with the correct value
//				if (customlookups["customerid"] != null){
//					for (cli in customlookups["customerid"]){
//						var scope = customlookups["customerid"][cli];
//						var custcustomer = scope.fieldvalue();
//	
//						if (customer == null && custcustomer != null)
//							scope.fieldvalue(null);
//						else if ((customer != null && custcustomer == null) || (customer != null && custcustomer != null && customer[0].id != custcustomer.Id))
//							scope.fieldvalue(customer);
//						scope.fieldvalue.notifySubscribers(); // force the value to update
//					}
//				}
//			}
//		},
//		Taal: function(){
//            var taal = CClearPartners.Form.General.GetValue("dig_communicatietaal");    
//            // Search control with visible parent
//            var anderetaal = Xrm.Page.getAttribute("dig_anderetaal");
//            if (anderetaal != null){
//	            var controls = anderetaal.controls;
//	            
//	            controls.forEach(
//		            function(ctrl){
//		            	// check if parent section and parent tab is visible
//		            	var section = ctrl.getParent();
//		            	if (section != null && section.getVisible()){
//		            		var tab = section.getParent();
//		            		if (tab != null && tab.getVisible())
//		 						ctrl.setVisible(taal == 5);
//		            	}
//		            });
//			}		
//		},
//		StatusAdvies: function(args){  
//	    	var statusadviesObj = Xrm.Page.getAttribute("dig_statusadvies");
//            // Only on change
//            if (args != null) {
//                if (statusadviesObj != null && statusadviesObj.getValue() == 1){
//                    var dig_emailObj = Xrm.Page.getAttribute("dig_email");
//                    if (dig_emailObj != null && dig_emailObj.getValue() == null){
//                        var x = window.confirm("Er is geen e-mailadres gevonden voor de gerelateerde klant. Bent u zeker dat u wil doorgaan met deze actie?");
//                        if (x == false)
//                            statusadviesObj.setValue(originalStatusadvies);
//                    }
//                }
//                else if (statusadviesObj != null){
//                    originalStatusadvies = statusadviesObj.getValue();
//                }
//            }
//
//    		if (Xrm.Page.getAttribute("dig_actualduration") != null && Xrm.Page.getControl("dig_actualduration").getVisible())
//	    		Xrm.Page.getAttribute("dig_actualduration").setRequiredLevel((statusadviesObj != null && statusadviesObj.getValue() == 2) ? "required" : "none");
//		},
//		DocumentOCMWGentEnergiecelOpgemaakt: function(){
//			if (Xrm.Page.getAttribute("dig_documentocmwgentenergiecelopgemaakt") != null && Xrm.Page.getAttribute("dig_beschrijvingtussenkomst") != null){
//				var currentForm = getDienst();
//				if (currentForm == "Energie"
//	       		&& Xrm.Page.getAttribute("dig_documentocmwgentenergiecelopgemaakt").getIsDirty()
//	       		&& Xrm.Page.getAttribute("dig_documentocmwgentenergiecelopgemaakt").getValue() == 1)
//	       		{
//	       			var value = window.confirm("Hebt u bevestiging gevraagd bij de klant?");
//	       			if (value == false){
//	       				Xrm.Page.getAttribute("dig_documentocmwgentenergiecelopgemaakt").setValue(0);
//	       			}
//	       		}
//	       		
//	       		if (Xrm.Page.getAttribute("dig_documentocmwgentenergiecelopgemaakt").getValue() == 1){
//	       			Xrm.Page.getAttribute("dig_beschrijvingtussenkomst").setRequiredLevel("required");
//	 				CClearPartners.Form.General.SetFieldVisible("dig_beschrijvingtussenkomst", true);
//	       		}
//	   			else{
//	   				Xrm.Page.getAttribute("dig_beschrijvingtussenkomst").setRequiredLevel("none");
//	 				CClearPartners.Form.General.SetFieldVisible("dig_beschrijvingtussenkomst", false);
//	   			}
//       		}
//		},
//		RWaardeHoofddak: function(){
//			berekenRWaarde("dig_materiaalisolatiehoofddak","dig_dikteisolatiehoofddak","dig_rwaardehoofddakmkw", "dig_exactelambdawaardehoofddak");
//		},
//		RWaardeBijdak: function(){
//			berekenRWaarde("dig_materiaalisolatiebijdak","dig_dikteisolatiebijdak","dig_rwaardebijdakmkw", "dig_exactelambdawaardebijdak");
//		},
//		RWaardeZolder: function(){
//			berekenRWaarde("dig_materiaalzoldervloerisolatie","dig_diktezoldervloerisolatie","dig_rwaardezoldermkw", "dig_exactelambdawaardezolder");
//		},
//		RWaardeMuur: function(){
//			berekenRWaarde("dig_materiaalmuurisolatie","dig_diktemuurisolatie","dig_rwaardemuurmkw", "dig_exactelambdawaardemuur");
//		},
//		RWaardeVloer: function(){
//			berekenRWaarde("dig_materiaalvloerisolatie","dig_diktevloerisolatie","dig_rwaardevloermkw", "dig_exactelambdawaardevloer");
//		},
//		Herhuisvesting: function(){
//			var isAndere = false;
//			if (Xrm.Page.getAttribute("dig_herhuisvesting") != null) {
//				var dig_herhuisvesting = Xrm.Page.getAttribute("dig_herhuisvesting").getValue();
//				
//				if (dig_herhuisvesting != null && dig_herhuisvesting.toString().endsWith("99"))
//					isAndere = true;
//			}
//				
//			CClearPartners.Form.General.SetFieldVisible("dig_herhuisvestingextra", isAndere);
//		},
//        BenovatieBegeleiding: function(args){
//            var benovatiebegeleiding = CClearPartners.Form.General.GetValue("dig_benovatiebegeleiding");
//            
//            // Set default benovatiedatum
//            var dig_benovatiedatum = CClearPartners.Form.General.GetValue("dig_benovatiedatum");
//            if (benovatiebegeleiding == true && args != null && dig_benovatiedatum == null)
//                CClearPartners.Form.General.SetValue("dig_benovatiedatum", new Date());
//                
//            if (Xrm.Page.getAttribute("dig_benovatiedatum") != null) Xrm.Page.getAttribute("dig_benovatiedatum").setRequiredLevel((benovatiebegeleiding == true) ? "required" : "none");
//			CClearPartners.Form.General.SetFieldVisible("dig_benovatiedatum", (benovatiebegeleiding == true));
//			CClearPartners.Form.General.SetFieldVisible("dig_benovatieprocedureeandisafgesloten", (benovatiebegeleiding == true));
//
//			CClearPartners.Form.General.SetFieldVisible("dig_genereerbenovatieverslag", (benovatiebegeleiding == true));
//			CClearPartners.Form.General.SetFieldVisible("dig_verstuurbenovatieverslag", (benovatiebegeleiding == true));
//		},
//        BenovatieProcedureEandisAfgesloten: function(args){
//            var benovatieprocedureeandisafgesloten = CClearPartners.Form.General.GetValue("dig_benovatieprocedureeandisafgesloten");
//            
//            // Set default benovatiedatum
//            var dig_benovatiedatumafsluitenprocedure = CClearPartners.Form.General.GetValue("dig_benovatiedatumafsluitenprocedure");
//            if (benovatieprocedureeandisafgesloten == true && args != null && dig_benovatiedatumafsluitenprocedure == null)
//                CClearPartners.Form.General.SetValue("dig_benovatiedatumafsluitenprocedure", new Date());
//                
//            CClearPartners.Form.General.SetFieldVisible("dig_benovatiedatumafsluitenprocedure", (benovatieprocedureeandisafgesloten == true));
//			
//		},
//        VMEOverleg: function(args){
//            var dig_vmeoverleg = CClearPartners.Form.General.GetValue("dig_vmeoverleg");
//            
//            // Set default benovatiedatum
//            var dig_vmeoverlegdatum = CClearPartners.Form.General.GetValue("dig_vmeoverlegdatum");
//                
//            if (Xrm.Page.getAttribute("dig_vmeoverlegdatum") != null) Xrm.Page.getAttribute("dig_vmeoverlegdatum").setRequiredLevel((dig_vmeoverleg == true) ? "required" : "none");
//			CClearPartners.Form.General.SetFieldVisible("dig_vmeoverlegdatum", (dig_vmeoverleg == true));
//		},
//        Syndicus: function(){
//            var dig_syndicusid = CClearPartners.Form.General.GetValue("dig_syndicusid");
//
//            if (dig_syndicusid == null || dig_syndicusid.length == 0) {
//                // Clear bedrijf
//                CClearPartners.Form.General.SetValue("dig_syndicusbedrijfid", null);
//            } else if (dig_syndicusid[0].typename == "contact") {
//                XrmServiceToolkit.Rest.Retrieve(
//					dig_syndicusid[0].id, 
//					"ContactSet", 
//					"ParentCustomerId", 
//					null, 
//					function(result){
//						if (result != null && result.ParentCustomerId != null && result.ParentCustomerId.LogicalName == "account"){
//                            CClearPartners.Form.General.SetLookupValue("dig_syndicusbedrijfid", result.ParentCustomerId.Id, result.ParentCustomerId.Name, result.ParentCustomerId.LogicalName);
//						} else {
//                            CClearPartners.Form.General.SetValue("dig_syndicusbedrijfid", null);
//                        }
//					},
//					function(error){ /* do nothing */ }, 
//					true);
//            } else if (dig_syndicusid[0].typename == "account") {
//                CClearPartners.Form.General.SetLookupValue("dig_syndicusbedrijfid", dig_syndicusid.Id, dig_syndicusid.Name, dig_syndicusid.LogicalName);
//            }
//		},
//        SyndicusBedrijf: function(){
//            var dig_syndicusbedrijfid = CClearPartners.Form.General.GetValue("dig_syndicusbedrijfid");
//            
//            // Make sure custom web resource is set with the correct value
//            if (customlookups["dig_syndicusbedrijfid"] != null){
//                for (cli in customlookups["dig_syndicusbedrijfid"]){
//                    var scope = customlookups["dig_syndicusbedrijfid"][cli];
//                    var val = scope.fieldvalue();
//
//                    if (dig_syndicusbedrijfid == null && val != null)
//                        scope.fieldvalue(null);
//                    else if ((dig_syndicusbedrijfid != null && val == null) || (dig_syndicusbedrijfid != null && val != null && dig_syndicusbedrijfid[0].id != val.Id))
//                        scope.fieldvalue(dig_syndicusbedrijfid);
//                    scope.fieldvalue.notifySubscribers(); // force the value to update
//                }
//            }
//		},
//		Wijkgebondenproject: function(){
//			
//            var WebResource_straatopmerkingen = Xrm.Page.ui.controls.get("WebResource_opmerking1");
//		    if (WebResource_straatopmerkingen != null){
//                var src = WebResource_straatopmerkingen.getSrc();
//                WebResource_straatopmerkingen.setSrc(null);
//                WebResource_straatopmerkingen.setSrc(src);
//            }
//		
//            var WebResource_straatopmerkingen2 = Xrm.Page.ui.controls.get("WebResource_opmerking2");
//		    if (WebResource_straatopmerkingen2 != null){
//                var src = WebResource_straatopmerkingen2.getSrc();
//                WebResource_straatopmerkingen2.setSrc(null);
//                WebResource_straatopmerkingen2.setSrc(src);
//            }
//		},
//		TypeWoning: function(){
//			var dig_typewoning = CClearPartners.Form.General.GetValue("dig_typewoning");
//            var isAppartement = (dig_typewoning == 10);
//            
//            CClearPartners.Form.General.SetFieldVisible("dig_aantalappartementen", isAppartement);
//            CClearPartners.Form.General.SetTabVisible("tab_betrokkenen", isAppartement);
//		}
//	};
//    
//    
//	    
//	var grid = {	
//        AddBetrokkene: function () {
//            console.log('BEGIN - AddBetrokkene');
//            var callback = function(id, name, type){
//                console.log('AddBetrokkene callback: ' + id);
//                if (id != null){
//                
//                    var parameters = {
//                        dig_betrokkene: "{" + id.toUpperCase() + "}",
//                        dig_betrokkenename: name,
//                        dig_betrokkeneidtype: type
//                    };	
//                    
//                    var openBetrokkenForm = function(email,tel,gsm,huisnummer){
//                        if (email != null) parameters.dig_email = email;
//                        if (tel != null) parameters.dig_telefoon = tel;
//                        if (gsm != null) parameters.dig_gsm = gsm;
//                        if (huisnummer != null) parameters.dig_huisnummer = huisnummer;
//                        // Open with a small delay (prevent issue with quick create load)
//                        setTimeout(function(){
//                            console.log('AddBetrokkene open Quick Create');
//                            OpenQuickCreate("dig_betrokkene", parameters,function(){ Xrm.Page.ui.controls.get("grdBetrokkenen").refresh(); });
//                        }, 500);
//                    };
//                    
//                    // Get huisnummer
//                    var url;
//                    if (type == "contact") url = "ContactSet(guid'" + id.replace('{','').replace('}','').toLowerCase() + "')?$select=Address1_Line2,EMailAddress1,ves_GSMnummernummer,ves_telefoonnummernummers";
//                    else url = "AccountSet(guid'" + id.replace('{','').replace('}','').toLowerCase() + "')?$select=Address1_Line2,EMailAddress1,Telephone1,Telephone2";
//                    
//                    var req = new XMLHttpRequest();
//                    req.open("GET",  Xrm.Page.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/" + url, true);
//                    req.setRequestHeader("Accept", "application/json");
//                    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
//                    req.onreadystatechange = function() {
//                        if (this.readyState === 4) {
//                            this.onreadystatechange = null;
//                            if (this.status === 200) {
//                                var result = JSON.parse(this.responseText).d;
//                                var email = result.EMailAddress1;
//                                var tel = (result.ves_telefoonnummernummers != null) ? result.ves_telefoonnummernummers : result.Telephone1;
//                                var gsm = (result.ves_GSMnummernummer != null) ? result.ves_GSMnummernummer : result.Telephone2;
//                                var huisnummer = result.Address1_Line2;
//                                openBetrokkenForm(email, tel, gsm, huisnummer);
//                            } else {
//                                console.log("ERROR in GetHuisnummer" + this.statusText);
//                                openBetrokkenForm();
//                            }
//                        }
//                    };
//                    req.send();
//                }
//            };
//        
//            var serverUrl = Xrm.Page.context.getClientUrl();
//            var customParameters = encodeURIComponent("SearchFor=customer");  
//            var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
//            Alert.showWebResource("ves_/zoekklant/zoeken.html?Data=" + customParameters, 1200, height, "Zoek betrokkene", null, serverUrl, false, 10);
//            CClearPartners.Form.General.RegisterAlertCallback("zoekklantCallback", callback);
//            console.log('END - AddBetrokkene');
//        },
//    };
//    
//    //****************************Private Functions***************************
//        	
//	var OpenQuickCreate = function(logicalname,parameters,callback){ 
//        if (Xrm.Utility.openQuickCreate){               
//            var source = {
//                entityType: "incident",
//                id: Xrm.Page.data.entity.getId()
//            };
//                
//            Xrm.Utility.openQuickCreate(logicalname, source, parameters).then(
//                callback, 
//                function (error) { 
//                    var msg = (error.message) ? error.message : error;
//                    alert(msg);
//                }
//            );	
//        }
//    };
//        
//    var setDienst = function(){
//	    // Only whe Form Type = "Create"
//	    if (Xrm.Page.ui.getFormType() == 1){
//	    	// Only when field is available on the form, the value will be set
//		    CClearPartners.Form.General.SetValue("dig_dienstwonen", true);	  
//		    CClearPartners.Form.General.SetValue("dig_dienstmilieu", true);	  
//	    }
//	};
//	
//	var getDienst = function(){
//		if (Xrm.Page.getAttribute("dig_dienstwonen") != null)
//			return "Wonen";
//		else if (Xrm.Page.getAttribute("dig_dienstmilieu") != null)
//			return "Energie";
//		else
//			return null;
//	};
//	
//    var setReceivedDate = function(){
//	    // Only whe Form Type != "Read Only" AND "Disabled"
//	    var formtype = Xrm.Page.ui.getFormType();
//	    if (formtype != 3 && formtype != 4){
//			var date = CClearPartners.Form.General.GetValue("dig_ontvangenop");	
//			
//			if (date == null){
//				var creationDate = formtype == 1 ? new Date() : CClearPartners.Form.General.GetValue("dig_createdon");	
//				CClearPartners.Form.General.SetValue("dig_ontvangenop", creationDate);	
//			}
//		}
//	};
//	
//	var checkWooneenheidValue = function(){
//   		var dig_wooneenheid = Xrm.Page.getAttribute("dig_wooneenheid");
//   		
//   		if (dig_wooneenheid != null) {
//	    	// Show warning when Wooneenheid is empty	            	
//	    	if (dig_wooneenheid.getValue() == null)
//	    		XrmServiceToolkit.Common.AddNotification("\"Wooneenheid\" is nog niet opgegeven in deze case.", 3, "dig_wooneenheid-empty");
//	    	else
//	    		Xrm.Page.ui.clearFormNotification("dig_wooneenheid-empty");
//    	}
//	};
//	
//	var checkBehandelendeDienstValue = function(){
//   		var dig_behandelendedienstid = Xrm.Page.getAttribute("dig_behandelendedienstid");
//   		
//   		if (dig_behandelendedienstid != null) {
//	    	// Show warning when Wooneenheid is empty	            	
//	    	if (dig_behandelendedienstid.getValue() == null)
//	    		XrmServiceToolkit.Common.AddNotification("\"Behandelende Dienst\" is nog niet opgegeven in deze case.", 3, "dig_behandelendedienstid-empty");
//	    	else
//	    		Xrm.Page.ui.clearFormNotification("dig_behandelendedienstid-empty");
//    	}
//	};
//	    
//	/*var initMawUser = function(){
//		// Only relevent for "Energie"
//		var currentForm = getDienst();
//		
//		if (currentForm == "Energie") {
//			var userId = Xrm.Page.context.getUserId();
//	
//			if (userId != null){
//			    XrmServiceToolkit.Rest.Retrieve(
//					userId, 
//					"SystemUserSet", 
//					"BusinessUnitId", 
//					null, 
//					function(result){
//						if (result != null && result.BusinessUnitId != null)
//		            		CClearPartners.Form.General.SetDisabled("dig_statusadvies", (result.BusinessUnitId.Name != "MAW"));
//					},
//					function(error){  }, 
//					true);
//			}
//		}
//	};*/
//	
//	var initCustomLookups = function(){
//		if (typeof (Xrm.Page.CustomLookup) == "undefined") Xrm.Page.CustomLookup = {};
//
//		Xrm.Page.CustomLookup.Initialize = initCustomLookup;
//		Xrm.Page.CustomLookup.ClearField = clearCustomLookup;
//		Xrm.Page.CustomLookup.OpenLookup = openCustomLookup;
//	};
//	
//	var initCustomLookup = function(scope){
//		var field = scope.fieldname();
//		
//		if (field == "dig_eigenaar"){
//			// Set disabled based on hoedanigheid + remember for future updates
//			var hoedanigheid = CClearPartners.Form.General.GetValue("dig_hoedanigheid");
//			var isHuurder = ((hoedanigheid != null) && (hoedanigheid[0].name == "Huurder"));		
//			scope.disable(!isHuurder);
//		}
//		else if (field == "dig_huurder"){
//			// Set disabled based on hoedanigheid + remember for future updates
//			var hoedanigheid = CClearPartners.Form.General.GetValue("dig_hoedanigheid");
//			var isVerhuurder = ((hoedanigheid != null) && (hoedanigheid[0].name == "Verhuurder"));		
//			scope.disable(!isVerhuurder);
//		}
//		else if (field == "dig_syndicusid" || field == "dig_syndicusbedrijfid"){
//			// Set disabled based on hoedanigheid + remember for future updates
//			var hoedanigheid = CClearPartners.Form.General.GetValue("dig_hoedanigheid");
//			var isContactpersoon = ((hoedanigheid != null) && (hoedanigheid[0].name == "Contactpersoon collectief woongebouw"));		
//			scope.disable(!isContactpersoon);
//		}
//		
//		// Only whe Form Type == "Read Only" OR "Disabled"
//	    var formtype = Xrm.Page.ui.getFormType();
//	    if (formtype == 3 || formtype == 4)
//			scope.disable(true);
//		
//		if (customlookups[field] == null)
//			customlookups[field] = [scope];
//		else
//			customlookups[field].push(scope);
//		
//		// Do we need to set default value?!
//		var val = CClearPartners.Form.General.GetValue(field);
//		if (val != null){
//			scope.fieldvalue(val);
//		}
//	};
//
//	var clearCustomLookup = function(scope){
//		updateCustomLookupField(scope, null);
//	};
//	
//	var openCustomLookup = function(scope){
//		// Do we open an address or a customer custom lookup?!
//		var field = scope.fieldname();
//		var serverUrl = Xrm.Page.context.getClientUrl();
//		if (field == "dig_huidigverblijf" || field == "dig_adresnieuwverblijf"){
//			var callback = function(adresId, adresName, straat, huisnummer, busnummer, postcode, gemeente, land, type, id, GrabX, GrabY, verdiepinglokaal, gebouw, GrabId){
//				addressFieldCallback(scope, adresId, adresName, straat, huisnummer, busnummer, postcode, gemeente, land, type, id, GrabX, GrabY, verdiepinglokaal, gebouw, GrabId);
//			};
//			
//			var url = "/ves_/zoekadres/zoeken.html"
//
//			var type = CClearPartners.Form.General.GetValue("casetypecode");            
//			if (type == 1){
//    			var customParameters = encodeURIComponent("showOpslaanZonderHuisnr=true");
//				url += "?Data="+customParameters;
//			}
//			//// open the webresource for an address 
//		    //window.FillAdresField = callback;
//		  	//window.showModalDialog(url, window, "dialogHeight:830px;dialogWidth:700px;status:no;toolbar:no;menubar:no;location:no");
//                   
//            var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
//            Alert.showWebResource(url, 1200, height, "Zoek adres", null, serverUrl, false, 10);
//          
//            CClearPartners.Form.General.RegisterAlertCallback("callback", callback);	
//		}
//		else {
//			var callback = function(id, name, type){
//				if (id) accountFieldCallback(scope, id, name, type);
//			};
//			var account = CClearPartners.Form.General.GetValue(field);
//            var entityid = (account == null) ? null : account[0].id;
//            var searchfor = ((field == "customerid") ? "customer" : ((field == "dig_eigenaar" || field == "dig_huurder" || field == "dig_syndicusid") ? "contact" : "account"));
//        
//            var customParameters = encodeURIComponent("SearchFor=" + searchfor + "&EntityId=" + entityid);  
//            var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
//            Alert.showWebResource("ves_/zoekklant/zoeken.html?Data=" + customParameters, 1200, height, "Zoek persoon", null, serverUrl, false, 10);
//          
//            CClearPartners.Form.General.RegisterAlertCallback("zoekklantCallback", callback);	
//        }
//	};
//	
//	var updateCustomLookupField = function(scope, result){
//		// Do we set an address or a customer?!
//		var lookupReference = null;
//		var field = scope.fieldname();
//		
//	    if (scope.required() == true)
//	    	Xrm.Page.ui.clearFormNotification("required-" + field);
//
//		if (result != null) {
//			if (field == "dig_huidigverblijf" || field == "dig_adresnieuwverblijf"){
//				lookupReference = [{id: result.ves_meeradressenId, name: result.ves_name, entityType: "ves_meeradressen" }];
//				//webresourceReference = {Id: result.ves_meeradressenId, Name: result.ves_name, LogicalName: "ves_meeradressen" };
//			}
//			else {
//			    /*lookupReference = [{id: result.Id, name: result.Name, entityType: result.LogicalName }];
//				webresourceReference = result;*/
//		    	lookupReference = [result];
//			}			
//		}
//
//	    CClearPartners.Form.General.SetValue(field, lookupReference);
//	    //Xrm.Page.getAttribute(field).fireOnChange(); // This already happens in the SetValue method
//    	Xrm.Page.ui.refreshRibbon();
//    	// update webresource
//		scope.fieldvalue(lookupReference);
//	};
//	
//	var addressFieldCallback = function(scope, adresId, adresName, straat, huisnummer, busnummer, postcode, gemeente, land, type, id, GrabX, GrabY, verdiepinglokaal, gebouw, GrabId) {
//
//		var resultCallback = function(results){
//			if (results != null && results.length > 0){
//				updateCustomLookupField(scope, results[0]);
//			} else {
//				// No result found: create new
//				XrmServiceToolkit.Rest.Create(
//	    		{ 
//	    			ves_adresId: adresId, 
//	    			ves_busnummer: busnummer, 
//	    			ves_straat: straat, 
//	    			ves_huisnummer: huisnummer, 
//	    			ves_postcode: postcode, 
//	    			ves_gemeente: gemeente, 
//	    			ves_deelgemeente: gemeente, 
//	    			ves_land: land, 
//	    			ves_grabx: GrabX, 
//	    			ves_graby: GrabY, 
//	    			ves_vestaid: adresId,
//					ves_adres1verdiepinglokaal: verdiepinglokaal,
//		    		ves_gebouw: gebouw
//	    		},    		
//	    		"ves_meeradressenSet", 
//	    		function(result){
//		   			// OK:
//					updateCustomLookupField(scope, result);
//	    		}, 
//	    		function(error){
//	    			// NOK: set notification
//	    			XrmServiceToolkit.Common.AddNotification("Er is iets foutgelopen bij het aanmaken van het adres! " + error, 1, "updateCustomLookupField");
//	    		},
//	    		false);
//			}
//		};
//		
//		if (adresId != null && adresId != ""){
//			// Retrieve wooneenheid with his address id or create new...
//			XrmServiceToolkit.Rest.RetrieveMultiple(
//					"ves_meeradressenSet", 
//					"$select=ves_name,ves_meeradressenId&$filter=ves_vestaid eq '" + adresId + "'", 
//					resultCallback,
//					function(error){ /* do nothing */ }, 
//					function(){ /* do nothing */ }, 
//					false);
//		}
//		else{
//			// set nothing
//			resultCallback(null);
//		}
//	};
//		
//    var accountFieldCallback = function(scope, id, name, type){	
//		updateCustomLookupField(scope, { id: id, name: name, entityType: type });
//    };
//    
//    var berekenRWaarde = function(materiaalid, dikteid, rwaardeid, exactelambdaid){
//    	var materiaal = CClearPartners.Form.General.GetValue(materiaalid);
//    	var dikte = CClearPartners.Form.General.GetValue(dikteid);
//    	var lambda = CClearPartners.Form.General.GetValue(exactelambdaid);
//    	
//    	if (lambda == null && materiaal != null){
//     		initRLambda();
//     		lambda = _rlambda[materiaal];
//     	} 
//    	
//	   	if (lambda == null || dikte == null)
//		    CClearPartners.Form.General.SetValue(rwaardeid, null);	
//		else
//			// round number at 2 decimals: sometimes too many decimal places
//		    CClearPartners.Form.General.SetValue(rwaardeid,parseFloat((dikte/(lambda*100)).toFixed(2)));
//    };
//    
//    var _rlambda = [];
//    var initRLambda = function(){
//    	if (_rlambda.length == 0){
//    		XrmServiceToolkit.Rest.RetrieveMultiple(
//	            "ves_parameterSet",
//	            "$select=ves_name,ves_value&$filter=startswith(ves_name, 'R_Waarde_')",
//	            function (results) {
//	                if (results.length > 0)
//	                	for (var i = 0; i < results.length; ++i){
//	                		var materiaalid = results[i].ves_name.substr(results[i].ves_name.lastIndexOf('_') + 1);
//	                		var lambda = CClearPartners.General.Numeric.StringToDouble(results[i].ves_value);
//						    _rlambda[materiaalid] = lambda;
//						}
//	            },
//				function(error){ /* do nothing */ }, 
//				function(){ /* do nothing */ }, 
//				false);
//    	}
//    };
//    
//    var _duurtijden = [];
//    var initDuurtijden = function(){
//    	if (_duurtijden.length == 0){
//    		XrmServiceToolkit.Rest.RetrieveMultiple(
//	            "ves_parameterSet",
//	            "$select=ves_name,ves_value&$filter=startswith(ves_name, 'Duurtijd_')",
//	            function (results) {
//	                if (results.length > 0)
//	                	for (var i = 0; i < results.length; ++i){
//	                		var casetypeid = results[i].ves_name.substr(results[i].ves_name.lastIndexOf('_') + 1);
//	                		var duurtijd = CClearPartners.General.Numeric.StringToDouble(results[i].ves_value);
//						    _duurtijden[casetypeid] = duurtijd;
//						}
//	            },
//				function(error){ /* do nothing */ }, 
//				function(){ /* do nothing */ }, 
//				false);
//    	}
//    };
//    
//    var filterCaseTypeCode = function(){
//	    var caseTypeAttribute = Xrm.Page.getAttribute("casetypecode");
//
//	    if (caseTypeAttribute != null){
//		    var code = CClearPartners.Form.General.GetValue("casetypecode");
//		    var options = caseTypeAttribute.getOptions();
//			var currentForm = getDienst();
//			
//		    // Save all options  
//		    if (!window.CaseTypeOptions)
//		    {
//		        window.CaseTypeOptions = [];
//			    for(var i = 0; i < options.length; i++)
//			    	CaseTypeOptions.push(options[i]);
//		    }
//		
//		    // for all controls
//		    for(var i = 0; i < caseTypeAttribute.controls.getLength(); i++){
//		    	var caseTypeControl = caseTypeAttribute.controls.get(i);
//		    	// Clear all items 
//		    	for(var j = 0; j < options.length; j++)
//		        	caseTypeControl.removeOption(options[j].value);   
//			
//				// Add options depending on form
//			    for(var j = 0; j < CaseTypeOptions.length; j++){
//			    	var option = CaseTypeOptions[j];
//			    	var value = option.value;
//				    if (((currentForm == "Wonen") && (0 < value) && (value <= 30))
//				    || ((currentForm == "Energie") && (30 < value) && (value <= 60))
//				    || ((100 < value))
//				    || ((currentForm != "Wonen") && (currentForm != "Energie"))){
//				        caseTypeControl.addOption(option);
//				    }
//			    }
//		    }
//
//		    CClearPartners.Form.General.SetValue("casetypecode", code);	    
//	    }
//    };
//    
//    var filterKanaal = function(){
//    	var caseOriginAttribute = Xrm.Page.getAttribute("caseorigincode");
//	    var caseOriginControl = Xrm.Page.getControl("caseorigincode");
//
//	    if (caseOriginAttribute && caseOriginControl){
//		    var code = CClearPartners.Form.General.GetValue("caseorigincode");
//		    var options = caseOriginAttribute.getOptions();
//
//		    // Save all options  
//		    if (!window.CaseOriginOptions)
//		    {
//		        window.CaseOriginOptions = [];
//			    for(var i = 0; i < options.length; i++)
//			    	CaseOriginOptions.push(options[i]);
//		    }
//		
//		    // Clear all items
//		    Xrm.Page.getAttribute("caseorigincode").controls.forEach(function (control, index) { 
//			    for(var i = 0; i < options.length; i++)
//			        control.removeOption(options[i].value); 
//			});          
//		
//			// Add options depending on form
//			var currentForm = getDienst();
//			
//			// First add the shared options (> 100)
//	    	Xrm.Page.getAttribute("caseorigincode").controls.forEach(function (control, index) { 
//			    for(var i = 0; i < CaseOriginOptions.length; i++){
//			    	var option = CaseOriginOptions[i];
//			    	var value = option.value;
//				    if ((100 < value) || ((currentForm != "Wonen") && (currentForm != "Energie"))){
//				        control.addOption(option);
//				    }
//			    }
//			});
//			// Then add the dienst specific options
//			Xrm.Page.getAttribute("caseorigincode").controls.forEach(function (control, index) { 
//			    for(var i = 0; i < CaseOriginOptions.length; i++){
//			    	var option = CaseOriginOptions[i];
//			    	var value = option.value;
//				    if (((currentForm == "Wonen") && (0 < value) && (value <= 30))
//				    || ((currentForm == "Energie") && (30 < value) && (value <= 60))){
//				        control.addOption(option);
//				    }
//			    }
//			});
//		    CClearPartners.Form.General.SetValue("caseorigincode", code);	    
//	    }
//    };
//    
//    var filterHoedanigheid = function(){
//        var ctrl = Xrm.Page.getControl("dig_hoedanigheid");
//        
//        if (ctrl){
//        	ctrl.addPreSearch(function(){
//        		var filter = null;
//				var currentForm = getDienst();
//		
//		    	//create a filter xml
//		    	if (currentForm == "Wonen"){
//			    	filter = "<filter type='and'>" +
//			        		"<condition attribute='dig_dienstwonen' operator='eq' value='1'/>" +
//			            "</filter>";
//		    	} else if (currentForm == "Energie"){
//		    		filter = "<filter type='and'>" +
//			        		"<condition attribute='dig_dienstmilieu' operator='eq' value='1'/>" +
//			            "</filter>";
//		    	}
//		                 
//				//add filter
//				if (filter != null)
//		    		Xrm.Page.getControl("dig_hoedanigheid").addCustomFilter(filter);
//        	});
//        }
//    };
//    
//    var filterDoelgroep = function(){
//        var ctrl = Xrm.Page.getControl("dig_doelgroep");
//        
//        if (ctrl){
//        	ctrl.addPreSearch(function(){
//        		var filter = null;
//				var currentForm = getDienst();
//		
//		    	//create a filter xml
//		    	if (currentForm == "Wonen"){
//			    	filter = "<filter type='and'>" +
//			        		"<condition attribute='dig_dienstwonen' operator='eq' value='1'/>" +
//			            "</filter>";
//		    	} else if (currentForm == "Energie"){
//		    		filter = "<filter type='and'>" +
//			        		"<condition attribute='dig_dienstmilieu' operator='eq' value='1'/>" +
//			            "</filter>";
//		    	}
//		                 
//				//add filter
//				if (filter != null)
//		    		Xrm.Page.getControl("dig_doelgroep").addCustomFilter(filter);
//        	});
//        }
//    };
//	
//    var loadSharePointDocumenten = function(){
//		var sharepointcontrol = Xrm.Page.getControl("IFRAME_sharepointdocument");
//
//        if (sharepointcontrol != null && Xrm.Page.getAttribute("ticketnumber").getValue() != null){
//			var parameters = {
//				RecordUrl: Xrm.Page.data.entity.getId().replace("{", "").replace("}", "")
//			};
//	
//			try {
//				CClearPartners.General.Rest.ExecuteAction("dig_GetSharepointUrl", parameters,
//					function (result) {
//						if (result && result.SiteUrl != null && result.DocumentLocationUrl != null) {
//							CClearPartners.Form.General.SetSectionVisible("tab_Documenten", "tab_Documenten_section_CreateSPDocLoc", false);
//
//							var url = result.SiteUrl + "/crmgrid/crmgridpage.aspx?locationUrl=" + encodeURIComponent(result.DocumentLocationUrl) + "&pageSize=250";
//							sharepointcontrol.setSrc("about:blank");
//							sharepointcontrol.setSrc(url);
//						}
//					},
//					function (error) {
//						console.log(error);
//					}, true);
//
//			} catch (error) {
//				console.log(error);
//			}
// 		       
//		}
//    };
//    
//	var loadSharePointDocumentenWooneenheid = function () {
//		var sharepointcontrol = Xrm.Page.getControl("IFRAME_DocumentenWooneenheid");
//		var wooneenheid = CClearPartners.Form.General.GetValue("dig_wooneenheid");
//
//		if (sharepointcontrol != null && wooneenheid != null) {
//			var parameters = {
//				RecordUrl: wooneenheid[0].id.replace("{", "").replace("}", "")
//			};
//
//			try {
//				CClearPartners.General.Rest.ExecuteAction("dig_GetSharepointUrl", parameters,
//					function (result) {
//						if (result && result.SiteUrl != null && result.DocumentLocationUrl != null) {
//							CClearPartners.Form.General.SetSectionVisible("tab_Documenten", "tab_Documenten_section_Wooneenheid", true);
//
//							var url = result.SiteUrl + "/crmgrid/crmgridpage.aspx?locationUrl=" + encodeURIComponent(result.DocumentLocationUrl) + "&pageSize=250";
//							sharepointcontrol.setSrc("about:blank");
//							sharepointcontrol.setSrc(url);
//						} else {
//							CClearPartners.Form.General.SetSectionVisible("tab_Documenten", "tab_Documenten_section_Wooneenheid", false);
//						}
//					},
//					function (error) {
//						CClearPartners.Form.General.SetSectionVisible("tab_Documenten", "tab_Documenten_section_Wooneenheid", false);
//						console.log(error);
//					}, true);
//				
//			} catch (error) {
//				CClearPartners.Form.General.SetSectionVisible("tab_Documenten", "tab_Documenten_section_Wooneenheid", false);
//				console.log(error);
//			}
//			
//		}
//	};
//    
//	var loadSharePointDocumentenVorigeCase = function () {
//		var sharepointcontrol = Xrm.Page.getControl("IFRAME_DocumentenVorigeCase");
//		var dig_vorigecaseid = CClearPartners.Form.General.GetValue("dig_vorigecaseid");
//
//		if (sharepointcontrol != null && dig_vorigecaseid != null) {
//			var parameters = {
//				RecordUrl: dig_vorigecaseid[0].id.replace("{", "").replace("}", "")
//			};
//			
//			try {
//				CClearPartners.General.Rest.ExecuteAction("dig_GetSharepointUrl", parameters,
//					function (result) {
//						if (result && result.SiteUrl != null && result.DocumentLocationUrl != null) {
//							CClearPartners.Form.General.SetSectionVisible("tab_Documenten", "tab_Documenten_section_VorigeCase", true);
//
//							var url = result.SiteUrl + "/crmgrid/crmgridpage.aspx?locationUrl=" + encodeURIComponent(result.DocumentLocationUrl) + "&pageSize=250";
//							sharepointcontrol.setSrc("about:blank");
//							sharepointcontrol.setSrc(url);
//						} else {
//							CClearPartners.Form.General.SetSectionVisible("tab_Documenten", "tab_Documenten_section_VorigeCase", false);
//						}
//					},
//					function (error) {
//						CClearPartners.Form.General.SetSectionVisible("tab_Documenten", "tab_Documenten_section_VorigeCase", false);
//						console.log(error);
//					}, true);
//			} catch (error) {
//				CClearPartners.Form.General.SetSectionVisible("tab_Documenten", "tab_Documenten_section_VorigeCase", false);
//				console.log(error);
//			}
//			
//		}
//	};    
//    
//    var resetSharePointFrameUrls = function(){
//        setTimeout(function(){
//            var sharepointcontrol1 = Xrm.Page.getControl("IFRAME_sharepointdocument");
//            if (sharepointcontrol1 != null){
//                var url1 = sharepointcontrol1.getSrc();
//                if (url1 == "" || url1 == "about:blank"){
//                    loadSharePointDocumenten();
//                } else {
//                    sharepointcontrol1.setSrc("about:blank"); 
//                    sharepointcontrol1.setSrc(url1); 
//                }
//            }
//            
//            var sharepointcontrol2 = Xrm.Page.getControl("IFRAME_DocumentenWooneenheid");
//            if (sharepointcontrol2 != null){
//                var url2 = sharepointcontrol2.getSrc();
//                if (url2 == "" || url2 == "about:blank"){
//                    loadSharePointDocumentenWooneenheid();
//                } else {
//                    sharepointcontrol2.setSrc("about:blank"); 
//                    sharepointcontrol2.setSrc(url2); 
//                }
//            }
//            
//            var sharepointcontrol3 = Xrm.Page.getControl("IFRAME_DocumentenVorigeCase");
//            if (sharepointcontrol3 != null){
//                var url3 = sharepointcontrol3.getSrc();
//                if (url3 == "" || url3 == "about:blank"){
//                    loadSharePointDocumentenVorigeCase();
//                } else {
//                    sharepointcontrol3.setSrc("about:blank"); 
//                    sharepointcontrol3.setSrc(url3); 
//                }
//            }
//         }, 50);
//    };
//
//    
//    var setWijkgebondenProject = function(){
//        if (Xrm.Page.getAttribute("dig_wooneenheid") != null && Xrm.Page.getAttribute("dig_wijkgebondenprojectid") != null){
//            
//            Xrm.Page.getAttribute("dig_wijkgebondenprojectid").setValue(null);
//            if (Xrm.Page.getControl("dig_wijkgebondenprojectid") != null)
//                Xrm.Page.getControl("dig_wijkgebondenprojectid").setDisabled(true);
//            if (Xrm.Page.getControl("dig_wijkgebondenprojectid1") != null)
//                Xrm.Page.getControl("dig_wijkgebondenprojectid1").setDisabled(true);
//                
//            
//            var dig_wooneenheid = Xrm.Page.getAttribute("dig_wooneenheid").getValue();
//            if (dig_wooneenheid != null){
//                var apiconfig = { APIUrl: Xrm.Page.context.getClientUrl() + '/api/data/v8.2/' };
//                var crmAPI = new CRMWebAPI(apiconfig);
//                
//                //straat ophalen<fetch top="50" >
//                 var fetchXml1 = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="true" >' +
//                '                   <entity name="dig_wooneenheid" >' +
//                '                   <attribute name="dig_straat" />' +
//                '                    <filter type="and" >' +
//                '                      <condition attribute="dig_wooneenheidid" operator="eq" value="' + dig_wooneenheid[0].id + '" />' +
//                '                    </filter>' +
//                '                  </entity>' +
//                '                </fetch>';
//                crmAPI.GetList("dig_wooneenheids", { FetchXml: fetchXml1}).then (
//                    function (response1){
//                        if (response1 != null && response1.List.length == 1){
//                            
//                            //haal project op
//                            var fetchXml2 = '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="true" >' +
//                            '                  <entity name="dig_wijkgebondenproject" >' +
//                            '                    <attribute name="dig_wijkgebondenprojectid" />' +
//                            '                    <attribute name="dig_name" />' +
//                            '                    <link-entity name="dig_dig_wijkgebondenproject_dig_straat" from="dig_wijkgebondenprojectid" to="dig_wijkgebondenprojectid" visible="false" intersect="true" >' +
//                            '                      <link-entity name="dig_straat" from="dig_straatid" to="dig_straatid" alias="ag" >' +
//                            '                        <filter type="and" >' +
//                            '                           <condition attribute="dig_name" operator="eq" value="' + response1.List[0].dig_straat + '" />' +
//                            '                        </filter>' +
//                            '                      </link-entity>' +
//                            '                    </link-entity>' +
//                            '                    <filter type="and" >' +
//                            '                      <condition attribute="statecode" operator="eq" value="0" />' +
//                            '                    </filter>' +
//                            '                  </entity>' +
//                            '                </fetch>';
//                            
//                            crmAPI.GetList("dig_wijkgebondenprojects", { FetchXml: fetchXml2}).then (
//                                function (response2){
//                                    if (response2 != null && response2.List.length == 1){
//                                        var wijkgebondenprojectid = response2.List[0].dig_wijkgebondenprojectid;
//                                        var wijkgebondenprojectname = response2.List[0].dig_name;
//                                        CClearPartners.Form.General.SetLookupValue("dig_wijkgebondenprojectid", wijkgebondenprojectid, wijkgebondenprojectname, "dig_wijkgebondenproject");
//                                        Xrm.Page.getAttribute("dig_wijkgebondenprojectid").setSubmitMode("always");
//										onChange.Wijkgebondenproject();
//                                    }
//                                    else if (response2 != null && response2.List.length > 1){
//                                        if (Xrm.Page.getControl("dig_wijkgebondenprojectid") != null)
//                                            Xrm.Page.getControl("dig_wijkgebondenprojectid").setDisabled(false);
//                                        if (Xrm.Page.getControl("dig_wijkgebondenprojectid1") != null)
//                                            Xrm.Page.getControl("dig_wijkgebondenprojectid1").setDisabled(false);
//                                    }
//                                    
//                                }, 
//                                function(error){
//                                    console.log(error.message);
//                                }
//                            );
//                        }
//                        
//                    }, 
//                    function(error){
//                        console.log(error.message);
//                    }
//                );
//            }
//            else{
//                Xrm.Page.getAttribute("dig_wijkgebondenprojectid").setValue(null);
//				onChange.Wijkgebondenproject();
//            }
//        }
//    };
//    
//    return {
//        OnLoad: onLoad,
//        OnSave: onSave,
//        ResetSharePointFrameUrls: resetSharePointFrameUrls,
//        Grid: grid
//    };
//}();
//
//
//
//CClearPartners.Case.Ribbon = function () {
//    var createContactMomentDossier = function(){
//    	// Clear previous errors:
//    	Xrm.Page.ui.clearFormNotification("createContactMomentDossier");
//    	
//    	// Create trigger plugin object
//    	XrmServiceToolkit.Rest.Create(
//    		{ dig_name: "CaseCreateDossier", dig_extra: Xrm.Page.data.entity.getId() }, 
//    		"dig_triggerpluginSet", 
//    		function(result){
//	   			// OK: output should contain new dossier
//    			if ((result != null) && (result.dig_output != null)){
//    				var output = result.dig_output;
//    				// first remove triggerplugin
//    				XrmServiceToolkit.Rest.Delete(
//    					result.dig_triggerpluginId, 
//    					"dig_triggerpluginSet", 
//    					function(resultXml){ /* Do nothing */ }, 
//    					function(resultXml){ /* Do nothing */ }, 
//    					true);
//    				// open new entity
//    				Xrm.Utility.openEntityForm("incident", output);
//    			}
//    		}, 
//    		function(error){
//    			// NOK: set notification
//    			XrmServiceToolkit.Common.AddNotification("Er is iets foutgelopen bij het aanmaken van het dossier! " + error, 1, "createContactMomentDossier");
//    		},
//    		false);
//    };
//    
//    var wooneenheidZoeken = function(){
//	    var serverUrl = Xrm.Page.context.getClientUrl();
//	    //var url = serverUrl + "/WebResources/ves_/zoekadres/zoeken.html"
//        
//        var customParameters = "showOpslaan=1&showGebouw=1&showverdiepinglokaal=1";
//
//		var type = CClearPartners.Form.General.GetValue("casetypecode");            
//		if (type == 1) customParameters += "&showOpslaanzonderhuisnr=1";
//
//		//window.FillAdresField = wooneenheidZoekenCallback;
//	  	//window.showModalDialog(url, window, "dialogHeight:830px;dialogWidth:700px;status:no;toolbar:no;menubar:no;location:no");
//        
//        var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 150) : 600;
//        Alert.showWebResource("ves_/zoekadres/zoeken.html?Data=" + encodeURIComponent(customParameters), 700, height, "Zoek wooneenheid", null, serverUrl, false, 10);
//      
//        CClearPartners.Form.General.RegisterAlertCallback("callback", wooneenheidZoekenCallback);	
//
//    };
//    
//    var wooneenheidZoekenCallback = function(adresId, adresName, straat, huisnummer, busnummer, postcode, gemeente, land, type, id, GrabX, GrabY, verdiepinglokaal, gebouw, GrabId) {
//		var setResult = function(result){
//            CClearPartners.Form.General.SetLookupValue("dig_wooneenheid", result.dig_wooneenheidId, result.dig_name, "dig_wooneenheid");
//    		Xrm.Page.getAttribute("dig_wooneenheid").fireOnChange();
//		    // Save the changes
//		    //Xrm.Page.data.save();
//		    Xrm.Page.data.refresh(true); // make sure to refresh
//		};
//		
//		var resultCallback = function(results){
//			if (results != null && results.length > 0){
//				//console.log("Wooneenheid found: update data");
//
//				XrmServiceToolkit.Rest.Update(
//	                results[0].dig_wooneenheidId,
//	                { 
//		    			dig_straat: straat, 
//		    			dig_huisnummer: huisnummer, 
//		    			dig_busnummer: busnummer, 
//		    			dig_postcode: postcode, 
//		    			dig_gemeente: gemeente, 
//		    			dig_vestaid: adresId,
//		    			dig_verdiepinglokaal: verdiepinglokaal,
//		    			dig_gebouw: gebouw,
//		    			dig_crabx: GrabX, 
//		    			dig_craby: GrabY,
//		    			dig_grabid: GrabId
//		    		},
//	                "dig_wooneenheidSet",
//	                function () {
//						setResult(results[0]);
//	                },
//	                function (error) {
//	                    alert(error.message);
//	                },
//	                false
//	            );
//			} else if (straat && postcode) {
//				//console.log("No wooneenheid found: create new");
//
//				XrmServiceToolkit.Rest.Create(
//	    		{ 
//	    			dig_straat: straat, 
//	    			dig_huisnummer: huisnummer, 
//	    			dig_busnummer: busnummer, 
//	    			dig_postcode: postcode, 
//	    			dig_gemeente: gemeente, 
//	    			dig_vestaid: adresId,
//	    			dig_verdiepinglokaal: verdiepinglokaal,
//	    			dig_gebouw: gebouw,
//	    			dig_crabx: GrabX, 
//	    			dig_craby: GrabY,
//	    			dig_grabid: GrabId
//	    		},
//	    		"dig_wooneenheidSet", 
//	    		function(result){
//		   			// OK:
//					setResult(result);
//	    		}, 
//	    		function(error){
//	    			// NOK: set notification
//	    			XrmServiceToolkit.Common.AddNotification("Er is iets foutgelopen bij het aanmaken van de wooneenheid! " + error, 1, "createContactMomentDossier");
//	    		},
//	    		false);
//			}
//		};
//		
//		var qryverdiepinglokaal = (verdiepinglokaal == null || verdiepinglokaal == "") ? " and dig_verdiepinglokaal eq null" : " and dig_verdiepinglokaal eq '" + verdiepinglokaal + "'";
//		var qrygebouw = (gebouw == null || gebouw == "") ? " and dig_gebouw eq null" : " and dig_gebouw eq '" + gebouw + "'";
//
//		if (adresId != null && adresId != ""){
//			//console.log("Retrieve wooneenheid with his address id");
//			XrmServiceToolkit.Rest.RetrieveMultiple(
//					"dig_wooneenheidSet", 
//					"$select=dig_name,dig_wooneenheidId&$filter=dig_vestaid eq '" + adresId + "'" + qrygebouw + qryverdiepinglokaal, 
//					resultCallback,
//					function(error){ /* do nothing */ }, 
//					function(){ /* do nothing */ }, 
//					false);
//		}
//		else{
//			// Optional parameters.
//			var qryhuisnr = (huisnummer == null || huisnummer == "") ? " and dig_huisnummer eq null" : " and dig_huisnummer eq '" + huisnummer + "'";
//			var qrybusnr = (busnummer == null || busnummer == "") ? " and dig_busnummer eq null" : " and dig_busnummer eq '" + busnummer + "'";
//
//			//console.log("Retrieve wooneenheid with his address data");
//			XrmServiceToolkit.Rest.RetrieveMultiple(
//					"dig_wooneenheidSet", 
//					"$select=dig_name,dig_wooneenheidId&$filter=dig_straat eq '" + straat + "'" + qryhuisnr + qrybusnr + " and dig_postcode eq '" + postcode + "' and dig_gemeente eq '" + gemeente + "'" + qrygebouw + qryverdiepinglokaal, 
//					resultCallback,
//					function(error){ /* do nothing */ }, 
//					function(){ /* do nothing */ }, 
//					false);
//		}
//	};     
//     
//    var klantZoeken = function(){  	
//	    var serverUrl = Xrm.Page.context.getClientUrl();
//	  	var url = serverUrl + "/WebResources/dig_/CustomerLookup.html";
//		window.ResponseFunction = "responseFunctionCallback";
//		window.responseFunctionCallback = klantZoekenCallback;
//		window.SearchFor = "customer";
//		window.EntityId = Xrm.Page.data.entity.getId();
//	    var win = window.showModalDialog(url, window, "dialogHeight:800px;dialogWidth:1400px;status:no;toolbar:no;menubar:no;location:no");
//
//    };
//    
//    var klantZoekenCallback = function(id, name, type, lookup){
//	    var lookupReference = [{id: id, name: name, entityType: type }];
//	    CClearPartners.Form.General.SetValue("customerid", lookupReference);
//    	Xrm.Page.getAttribute("customerid").fireOnChange();
//    	Xrm.Page.getAttribute("customerid").setSubmitMode("always");
//    	Xrm.Page.ui.refreshRibbon();
//    };
//       
//    var adresOvernemen = function(){
//    	var attrcustomerid = Xrm.Page.getAttribute("customerid");
//		if (attrcustomerid != null && attrcustomerid.getValue() != null) {
//			var id = Xrm.Page.getAttribute("customerid").getValue()[0].id;
//			var type = Xrm.Page.getAttribute("customerid").getValue()[0].entityType;
//			var columns = "ves_name,ves_adresId,ves_straat,ves_huisnummer,ves_busnummer,ves_postcode,ves_gemeente,ves_land,ves_grabx,ves_graby,ves_gebouw,ves_adres1verdiepinglokaal,ves_standaard";
//			
//			var resultCallback = function(results){
//				if (results != null && results.length > 0){
//					var result = results[0];
//					//(adresId, adresName, straat, huisnummer, busnummer, postcode, gemeente, land, type, id, GrabX, GrabY, verdiepinglokaal, gebouw, GrabId) 
//					wooneenheidZoekenCallback(result.ves_adresId,result.ves_name,result.ves_straat,result.ves_huisnummer,result.ves_busnummer,
//						result.ves_postcode,result.ves_gemeente,result.ves_land,"","",result.ves_grabx,result.ves_graby,result.ves_adres1verdiepinglokaal,result.ves_gebouw,"");
//				}
//			};
//			
//			if (type == "contact"){
//				XrmServiceToolkit.Rest.RetrieveMultiple(
//					"ves_meeradressenSet", 
//					"$select=" + columns + "&$filter=ves_PersoonId/Id eq (guid'" + id + "')&$top=1&$orderby=ves_standaard desc", 
//					resultCallback,
//					function(error){ /* do nothing */ }, 
//					function(){ /* do nothing */ }, 
//					true);
//			}
//			else if (type == "account"){
//				XrmServiceToolkit.Rest.RetrieveMultiple(
//					"ves_meeradressenSet", 
//					"$select=" + columns + "&$filter=ves_organisatieId/Id eq (guid'" + id + "')&$top=1&$orderby=ves_standaard desc", 
//					resultCallback,
//					function(error){ /* do nothing */ }, 
//					function(){ /* do nothing */ }, 
//					true);
//			}
//		}
//    	Xrm.Page.ui.refreshRibbon();
//    };
//    
//    var resolveCaseBusy = false;
//    //var resolveCaseCount = 0;
//    var resolveCase = function(status, selectedcases, gridcontrol){
//    	// Only execute once
//    	if (resolveCaseBusy == false){
//	    	resolveCaseBusy = true;
//	    	//resolveCaseCount ++; // Extra execution check to prevent double execution (resolveCaseBusy alone is not working)
//
//			var input = { state: 1, status: status };
//    		input.cases = selectedcases == null ? [Xrm.Page.data.entity.getId()] : selectedcases;
//    		
//    		var trigger = {};
//		    trigger.dig_name = "CloseCase";
//		    trigger.dig_extra = JSON.stringify(input);
//		
//			var errorhandler = function(err){
//	    		if (err.message.indexOf("Internal Server Error:") >= 0)
//					alert(err.message.substring(err.message.indexOf("Internal Server Error:") + 22, err.message.length));
//	    		else
//	    			alert(err);
//	    		
//	    		// Always refresh when executed from startpage (also on errors)
//	    		if (gridcontrol) {
//					gridcontrol.refresh();
//				}
//	    		resolveCaseBusy = false;
//	    	};
//			 
//			var execute = function(){
//				try {
//					XrmServiceToolkit.Rest.Create(
//				    	trigger, 
//				    	"dig_triggerpluginSet", 
//				    	function(result){
//					    		if (Xrm.Page.data) {
//					    			Xrm.Page.data.setFormDirty(false);
//									Xrm.Page.data.refresh(false);
//								} else if (gridcontrol) {
//									gridcontrol.refresh();
//								}
//					    		// remove plugintrigger
//					    		XrmServiceToolkit.Rest.Delete(result.dig_triggerpluginId, "dig_triggerpluginSet", function(){}, function(){}, true);
//					    		resolveCaseBusy = false;
//				    	}, errorhandler, false); // We need sync request to capture errors in try/catch
//		    	}
//				catch(err) {
//				    errorhandler(err);
//				}
//			};
//			
//			if (Xrm.Page.data)
//				Xrm.Page.data.save().then(execute);
//			else 
//				execute();
//			
//	    	/*var id = Xrm.Page.data.entity.getId();
//			var request = " <request i:type='b:CloseIncidentRequest' xmlns:a='http://schemas.microsoft.com/xrm/2011/Contracts' xmlns:b='http://schemas.microsoft.com/crm/2011/Contracts'>" +
//							 " <a:Parameters xmlns:c='http://schemas.datacontract.org/2004/07/System.Collections.Generic'>" +
//							 " <a:KeyValuePairOfstringanyType>" +
//							 " <c:key>IncidentResolution</c:key>" +
//							 " <c:value i:type='a:Entity'>" +
//							 " <a:Attributes>" +
//							 " <a:KeyValuePairOfstringanyType>" +
//							 " <c:key>incidentid</c:key>" +
//							 " <c:value i:type='a:EntityReference'>" +
//							 " <a:Id>" + id + "</a:Id>" +
//							 " <a:LogicalName>incident</a:LogicalName>" +
//							 " <a:Name i:nil='true' />" +
//							 " </c:value>" +
//							 " </a:KeyValuePairOfstringanyType>" +
//							 " </a:Attributes>" +
//							 " <a:EntityState i:nil='true' />" +
//							 " <a:FormattedValues />" +
//							 " <a:Id>00000000-0000-0000-0000-000000000000</a:Id>" +
//							 " <a:LogicalName>incidentresolution</a:LogicalName>" +
//							 " <a:RelatedEntities />" +
//							 " </c:value>" +
//							 " </a:KeyValuePairOfstringanyType>" +
//							 " <a:KeyValuePairOfstringanyType>" +
//							 " <c:key>Status</c:key>" +
//							 " <c:value i:type='a:OptionSetValue'>" +
//							 " <a:Value>" + status + "</a:Value>" +
//							 " </c:value>" +
//							 " </a:KeyValuePairOfstringanyType>" +
//							 " </a:Parameters>" +
//							 " <a:RequestId i:nil='true' />" +
//							 " <a:RequestName>CloseIncident</a:RequestName>" +
//							 " </request>";
//							 
//			// First check current value
//			XrmServiceToolkit.Rest.Retrieve(
//				id, 
//				"IncidentSet", 
//				"StateCode", 
//				null, 
//				function(result){	
//					if (resolveCaseCount == 1)
//					{
//						resolveCaseCount--;
//						Xrm.Page.data.save().then(
//							function(){
//								try{
//									if (result != null && result.StateCode != null && result.StateCode.Value == 0)
//										XrmServiceToolkit.Soap.Execute(request);
//									Xrm.Page.data.setFormDirty(false);
//									Xrm.Page.data.refresh(false);
//								}
//								catch(err){
//									if (err.message.indexOf("Error Code:-2147204086 Message: The incident can not be closed because there are open activities for this incident.") > -1){
//										alert("De aanvraag kan niet worden gesloten omdat er nog open activiteiten gekoppeld zijn.");
//									}
//									else{
//										if (err.message.indexOf("Message: ") >= 0)
//											alert(err.message.substring(err.message.indexOf("Message: ") + 9, err.message.length));
//										else
//											alert(err);
//									}
//								}
//								
//								resolveCaseBusy = false;
//							},
//							function(){ resolveCaseBusy = false; });
//					}
//					else 
//					{
//						resolveCaseCount--; // Reset counter
//					}
//				},
//				function(error){ resolveCaseBusy = false; }, 
//				true);
//			*/
//		}
//    };
//    
//    var kopieerGegevensVorigeCase = function(){
//    	var vorigecaseId = Xrm.Page.getAttribute("dig_vorigecaseid").getValue();
//    	if (vorigecaseId != null)
//    	{    	
//	    	//vorige case ophalen
//	    	var vorigecase;
//	    	XrmServiceToolkit.Rest.Retrieve(
//				vorigecaseId[0].id, 
//				"IncidentSet", 
//				null, 
//				null, 
//				function(result){
//					vorigecase = result;
//				},
//				function (error) {
//				    alert(error.message);
//				},
//				false
//			);
//	    	
//	    	if (vorigecase != null){
//                
//                var copyRelationships = function(){
//                    // Relaties kopiëren (enkel in geval van Betrokkenen)
//                    var tab_betrokkenen = Xrm.Page.ui.tabs.get("tab_betrokkenen");
//                    if (tab_betrokkenen.getVisible()) {
//                        var formtype = Xrm.Page.ui.getFormType();
//                        if (formtype == 1) {
//                            // Create form!
//                            XrmServiceToolkit.Common.AddNotification("Betrokkenen van de vorige case kunnen enkel overgenomen worden als deze case is aangemaakt.", 3, "kopieerGegevensVorigeCase-relations");
//                            setTimeout(function() { Xrm.Page.ui.clearFormNotification("kopieerGegevensVorigeCase-relations"); }, 10000);
//                        } else {
//                        
//                            // First save! (in het geval dat vorigecase gewijzigd is)
//                            if (Xrm.Page.getAttribute("dig_vorigecaseid").getIsDirty()){
//                                console.log('dig_vorigecaseid is dirty!');
//                                Xrm.Page.data.save().then(
//                                    copyRelationships, 
//                                    function() { 
//                                        XrmServiceToolkit.Common.AddNotification("Betrokkenen van de vorige case kunnen enkel overgenomen worden als deze case is opgeslaan.", 3, "kopieerGegevensVorigeCase-relations");
//                                        setTimeout(function() { Xrm.Page.ui.clearFormNotification("kopieerGegevensVorigeCase-relations"); }, 10000);
//                                    });
//                            } else {
//                                console.log('CREATE TriggerCopyRelationsVorigeCase');
//                                var entity = {};
//                                entity.ccp_name = "TriggerCopyRelationsVorigeCase";
//                                entity.ccp_input = Xrm.Page.data.entity.getId();
//
//                                var req = new XMLHttpRequest();
//                                req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/ccp_triggers", true);
//                                req.setRequestHeader("OData-MaxVersion", "4.0");
//                                req.setRequestHeader("OData-Version", "4.0");
//                                req.setRequestHeader("Accept", "application/json");
//                                req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
//                                req.onreadystatechange = function() {
//                                    if (this.readyState === 4) {
//                                        req.onreadystatechange = null;
//                                        if (this.status === 204) {
//                                            var uri = this.getResponseHeader("OData-EntityId");
//                                            var regExp = /\(([^)]+)\)/;
//                                            var matches = regExp.exec(uri);
//                                            var newEntityId = matches[1];
//                                            
//                                            // Refresh grids
//                                            var grdBetrokkenen = Xrm.Page.ui.controls.get("grdBetrokkenen");
//                                            if (grdBetrokkenen != null) grdBetrokkenen.refresh();
//                                            
//                                            // Delete trigger
//                                            XrmServiceToolkit.Rest.Delete(
//                                                newEntityId,
//                                                "ccp_triggerSet",
//                                                function (result) { console.log("TriggerCopyRelationsVorigeCase deleted"); },
//                                                function (error) { console.log("ERROR in TriggerCopyRelationsVorigeCase delete: " + error.message); },
//                                                true);
//                                        } else {
//                                            Xrm.Utility.alertDialog(this.statusText);
//                                        }
//                                    }
//                                };
//                                req.send(JSON.stringify(entity));
//                            }
//                        }
//                    }
//                };
//                
//		    	//velden kopiëren
//				XrmServiceToolkit.Rest.RetrieveMultiple(
//					"ccp_entitycopySet", 
//					"$filter=ccp_name eq 'KopieerGegevensVorigeCase'", 
//					function (results1) {
//					    if (results1.length > 0){
//					    	var entitycopy = results1[0];
//					    	
//					    	XrmServiceToolkit.Rest.RetrieveMultiple(
//								"ccp_entityfieldscopySet", 
//								"$filter=ccp_entitycopyId/Id eq (guid'" + entitycopy.ccp_entitycopyId + "')",
//								function (results2) {
//								    for (var i=0; i < results2.length; i++){
//                                        try {
//                                            var entityfieldcopy = results2[i];
//                                            var field = entityfieldcopy.ccp_entityfieldID.Name;
//                                            if (Xrm.Page.getAttribute(field.toLowerCase()) != null){
//                                                var type = Xrm.Page.getControl(field.toLowerCase()).getControlType();
//                                                if (type == "optionset" && vorigecase[field] != null){
//                                                    Xrm.Page.getAttribute(field.toLowerCase()).setValue(vorigecase[field].Value);
//                                                }
//                                                else if (type == "lookup" && vorigecase[field] != null){
//                                                    CClearPartners.Form.General.SetLookupValue(field.toLowerCase(), vorigecase[field].Id, vorigecase[field].Name, vorigecase[field].LogicalName);
//
//                                                    if (customlookups[field.toLowerCase()] != null){
//                                                        for (cli in customlookups[field.toLowerCase()])
//                                                            customlookups[field.toLowerCase()][cli].fieldvalue([{ id: vorigecase[field].Id, name: vorigecase[field].Name, entityType: vorigecase[field].LogicalName}]);
//                                                    }
//                                                }
//                                                else if (/^[\d\.]{3,}$/.test(vorigecase[field]) && (typeof vorigecase[field] == "string" && vorigecase[field].indexOf(".") > -1)) { //DECIMAL
//                                                        Xrm.Page.getAttribute(field.toLowerCase()).setValue(parseFloat(vorigecase[field]));
//                                                } 
//                                                else if (typeof vorigecase[field] == "object" && vorigecase[field] != null && typeof vorigecase[field].Value !== 'undefined') {
//                                                    // Money
//                                                    if (vorigecase[field].Value && vorigecase[field].Value.indexOf(".") > -1)
//                                                        Xrm.Page.getAttribute(field.toLowerCase()).setValue(parseFloat(vorigecase[field].Value));
//                                                } 
//                                                else {
//                                                    Xrm.Page.getAttribute(field.toLowerCase()).setValue(vorigecase[field]);		
//                                                }			    		
//                                                								    		
//                                                
//                                                // Prevent overwriting phone values
//                                                if (field.toLowerCase() != "customerid")
//                                                    Xrm.Page.getAttribute(field.toLowerCase()).fireOnChange();
//                                            }
//                                        } catch(err) {
//                                            console.log(err);
//                                        }
//								    }
//								},
//								function (error) {
//								    alert(error.message);
//								},
//								function onComplete() {
//                                    // check to see if we have to copy relationships as well
//                                    copyRelationships();
//                                },
//								true);
//					    }
//					},
//					function (error) {
//					    alert(error.message);
//					},
//					function onComplete() { },
//					true);
//			}
//		};   
//	    
//    };
//    
//    var isCaseDienstMilieu = function(caseId){
//    	var isMilieu = false;
//    	XrmServiceToolkit.Rest.Retrieve(
//			caseId, 
//			"IncidentSet", 
//			"dig_dienstmilieu,StateCode",
//			null, 
//			function(result){
//				if(result.dig_dienstmilieu == true && result.StateCode.Value == 0)
//					isMilieu = true;
//			},
//			function(error){ /* do nothing */ }, 
//			false
//		);
//		return isMilieu;
//    };
//    
//    var createServiceActivity = function(caseId){
//    	var parameters = {};
//		parameters["parameter_OriginatingCase"] = caseId;
// 		Xrm.Utility.openEntityForm("serviceappointment", null, parameters);		
//    };
//	    
//	var isKleinAdvies = function(){
//		var type = CClearPartners.Form.General.GetValue("casetypecode");  
//		return (type == 34);
//	};
//	
//	var kopieGegevensPlanning = function(){
//		var customParameters = encodeURIComponent("caseid=" + Xrm.Page.data.entity.getId());
//		Xrm.Utility.openWebResource("dig_/kopiegegevensplanning/kopie.html",customParameters, 600, 300);
//	
//		//var url = Xrm.Page.context.getClientUrl() + "WebResources/dig_/kopiegegevensplanning/kopie.html?Data=" + customParameters;
//		//url = "/WebResources/dig_/kopiegegevensplanning/kopie.html?Data=" + customParameters;
//		//CClearPartners.Form.General.OpenModalDialog(url, 600, 320);
//		
//	};
//	
//	var klantZoekenViaEid = function(){
//	    /*var data = {
//					firstName: "Bert Jan",
//					middleName: "",
//					lastName: "Vandepoele",
//					street: "2e Wormenseweg 50-B",
//					municipality: "Deinze",
//					zipCode: "9800",
//					insz: "79061507116",
//					nationality: "Belg",
//					dateOfBirth: "06/15/1979",
//					gender: "MALE",
//					picture: "",
//					cardNumber: "591231835257",
//					cardValidUntilDate: "12/17/2015",
//					placeOfBirth: "Roeselare"
//				};
//	
//		getContactData(data);*/
//		
//    	readeid(klantZoekenViaEidCallback);
//	};
//	
//    var newCustomerCase = function(data, formname) {
//    	if (data != null && data.length > 0)
//    	{    	
//    		var caseId = data[0];
//	    	
//	    	// te kopieren attributen ophalen
//			XrmServiceToolkit.Rest.RetrieveMultiple(
//				"ccp_entitycopySet", 
//				"$filter=ccp_name eq 'KopieerCaseNaarNieuweCase'", 
//				function (results1) {
//				    if (results1.length > 0){
//				    	var entitycopy = results1[0];
//				    	var caseParams = [];
//				    	
//				    	XrmServiceToolkit.Rest.RetrieveMultiple(
//							"ccp_entityfieldscopySet", 
//							"$filter=ccp_entitycopyId/Id eq (guid'" + entitycopy.ccp_entitycopyId + "')",
//							function (results2) {
//							    for (var i=0; i < results2.length; i++){
//							    	var entityfieldcopy = results2[i];
//							    	caseParams.push(entityfieldcopy.ccp_entityfieldID.Name); 
//							    }
//							},
//							function (error) {
//							    alert(error.message);
//							},
//							function onComplete() { 
//						    	//originele case ophalen
//						    	XrmServiceToolkit.Rest.Retrieve(
//									caseId, 
//									"IncidentSet", 
//									caseParams.join(","), 
//									null, 
//									function(result){
//								    	var parameters = {};
//								    	for (var i=0; i < caseParams.length; i++){
//								    		if (result[caseParams[i]] != null){
//									    		if (typeof result[caseParams[i]].Value !== 'undefined') {
//										    		if (result[caseParams[i]].Value != null) parameters[caseParams[i].toLowerCase()] = result[caseParams[i]].Value;
//										    	} else if (typeof result[caseParams[i]].Id !== 'undefined') {
//										    		if (result[caseParams[i]].Id != null){
//										    		debugger;
//											    		parameters[caseParams[i].toLowerCase()] = result[caseParams[i]].Id;
//														parameters[caseParams[i].toLowerCase() + "name"] = result[caseParams[i]].Name;
//														parameters[caseParams[i].toLowerCase() + "type"] = result[caseParams[i]].LogicalName;
//													}
//										    	} else {
//										    		parameters[caseParams[i].toLowerCase()] = result[caseParams[i]];
//										    	}
//										    }
//									    }
//                                        
//                                        if (formname == "EC"){
//                                            parameters["formid"] = "A23E6BC8-EDB4-4531-9CBC-ED7FBDE0BD0F";
//                                        }
//                                        else if (formname == "REGENT"){
//                                            parameters["formid"] = "34AA813A-3C11-4819-9BFB-19F1A51F9BFF";
//                                        }
//                                        else if (formname == "MAW"){
//                                            parameters["formid"] = "42415A42-CD87-48AC-A58D-44CE59D24661";
//                                        }
//                                        else if (formname == "WONEN"){
//                                            parameters["formid"] = "FC68B6CF-081C-46EE-965D-2E2B7BD9E47F";
//                                        }
//										
//										Xrm.Utility.openEntityForm("incident", null, parameters);
//									},
//									function (error) {
//									    alert(error.message);
//									},
//									false
//								);
//							},
//							true);
//				    }
//				},
//				function (error) {
//				    alert(error.message);
//				},
//				function onComplete() { },
//				true); 
//		};   
//		
//		
//    };
//	
//    var klantZoekenViaEidCallback = function(data) {
//    	data.picture = "";
//    	
//		var triggerplugin = {};
//        triggerplugin.dig_name = "ZoekContactViaRrnr";
//        triggerplugin.dig_extra = JSON.stringify(data);
//
//		//Triggerplugin-record aanmaken
//		var dig_triggerpluginId;
//		XrmServiceToolkit.Rest.Create(
//            triggerplugin,
//            "dig_triggerpluginSet",
//            function (result) {
//                dig_triggerpluginId = result.dig_triggerpluginId;
//            },
//            function (error) {
//                alert(error.message);
//            },
//            false
//        );
//        
//        if (dig_triggerpluginId != null){
//        	var contactid;
//        	
//        	//Triggerplugin-record ophalen (output)
//			XrmServiceToolkit.Rest.Retrieve(
//	            dig_triggerpluginId,
//	            "dig_triggerpluginSet",
//	            null, null,
//	            function (result) {
//	                contactid = JSON.parse(result.dig_output);
//	            },
//	            function (error) {
//	                alert(error.message);
//	            },
//	            false
//	        );
//	        
//	        if (contactid != null){
//	        	//Lookup invullen
//	        	var lookupReference = [];
//				lookupReference[0] = {};
//				lookupReference[0].id = contactid.Id;
//				lookupReference[0].entityType = contactid.LogicalName;
//				lookupReference[0].name = contactid.Name;
//				Xrm.Page.getAttribute("customerid").setValue(lookupReference);
//
//	    		if (customlookups["customerid"] != null){
//	    			for (cli in customlookups["customerid"])
//	    				customlookups["customerid"][cli].fieldvalue(lookupReference);
//	    		}
//			   
//	        	//Triggerplugin-record verwijderen
//				XrmServiceToolkit.Rest.Delete(
//		            dig_triggerpluginId,
//		            "dig_triggerpluginSet",
//		            function (result) {
//		                
//		            },
//		            function (error) {
//		                alert(error.message);
//		            },
//		            false
//		        );
//	        }
//        }
//	};
//
//    var zoekCasesViaEid = function(){
//	   /* var data = {
//					firstName: "Bert Jan",
//					middleName: "",
//					lastName: "Vandepoele",
//					street: "2e Wormenseweg 50-B",
//					municipality: "Deinze",
//					zipCode: "9800",
//					insz: "79061507116",
//					nationality: "Belg",
//					dateOfBirth: "06/15/1979",
//					gender: "MALE",
//					picture: "",
//					cardNumber: "591231835257",
//					cardValidUntilDate: "12/17/2015",
//					placeOfBirth: "Roeselare"
//				};
//	
//		zoekCasesViaEidCallback(data);*/
//		
//    	readeid(zoekCasesViaEidCallback);
//    };
//    
//    var zoekCasesViaEidCallback = function(data) {
//    	data.picture = "";
//		
//		var zoekcasesviaeid = {};
//        zoekcasesviaeid.dig_name = data.lastName + " " + data.firstName;
//        zoekcasesviaeid.dig_eid = JSON.stringify(data);
//        
//		var zoekcasesviaeidId;
//		XrmServiceToolkit.Rest.Create(
//            zoekcasesviaeid,
//            "dig_zoekcasesviaeidSet",
//            function (result) {
//                zoekcasesviaeidId = result.dig_zoekcasesviaeidId;
//                Xrm.Utility.openEntityForm("dig_zoekcasesviaeid",zoekcasesviaeidId,null);
//            },
//            function (error) {
//                alert(error.message);
//            },
//            false
//        );
//	};
//    
//    var readeid = function(callback){
//    	try {
//	    	// Check if local eid reader is installed
//	    	$.ajax({
//		        url:'http://localhost:8081/eID/rest/status?ticks=' + new Date().getTime(), // Make request unique to avoid browser caching
//		        success: function (response) {
//		            // OK continue with the read
//		            $.ajax({
//				        url:'http://localhost:8081/eID/rest/read?ticks=' + new Date().getTime(), // Make request unique to avoid browser caching
//				        success: function (response) {
//	        				if (response != null && response != "") {
//					            // Transform data
//					            var data = {
//									firstName: response._FirstName,
//									middleName: "",
//									lastName: response._LastName,
//									street: response._Street,
//									municipality: response._City,
//									zipCode: response._PostalCode,
//									insz: response._NationalNumber,
//									nationality: response._Nationality,
//									dateOfBirth: new Date(parseInt(response._BirthDate.replace('/Date(', ''))),
//									gender: response._Gender,
//									picture: "",
//									cardNumber: response._CardNumber,
//									cardValidUntilDate: new Date(parseInt(response._CardValidUntil.replace('/Date(', ''))),
//									placeOfBirth: response._CityOfBirth
//								};
//					
//								callback(data);
//	        				}
//				        },
//				        error: function (error) {
//				            alert('Unexpected error contacting eid reader!');
//				        },
//				    });
//		        },
//		        error: function () {
//                    /*
//	        		// fallback on old JAVA applet
//				    var serverUrl = Xrm.Page.context.getClientUrl();
//				    window.open(serverUrl + "/WebResources/dig_/eidreader/eIDreader.html", "", "height=400,width=650");
//				    window.getContactData = callback;*/
//                    XrmServiceToolkit.Common.AddNotification("De eid reader software kan niet worden gevonden! Gelieve applicatiebeheer te contacteren.", 3, "readeid");
//		        },
//		    });
//	    } catch(e){
//	    	alert(e);
//	    }
//    };
//       
//    var startDocumentDialog = function(data) {
//    	var recordId = Xrm.Page.data.entity.getId();
//    	var entityName = "incident";
//    	var dialogName = "Wonen - Aanmaken Document";
//    	
//    	// first get dialogId
//    	XrmServiceToolkit.Rest.RetrieveMultiple(
//			"WorkflowSet", 
//			"$select=WorkflowId&$filter=Name eq '" + dialogName + "' and Type/Value eq 1 and RendererObjectTypeCode eq null and Category/Value eq 1", 
//			function(results){ 
//				if (results != null && results.length > 0){
//					var dialogId = results[0].WorkflowId;
//			    	var dialogurl = "/cs/dialog/rundialog.aspx?DialogId=%7b" + dialogId + "%7d&EntityName=" + entityName + "&ObjectId=" + recordId;
//			    	CClearPartners.Form.General.TryShowDialog(dialogurl, 600, 400);
//			    } else {
//			    	alert("Dialoog '" + dialogName + "' is niet gevonden!");
//			    }
//			},
//			function(error){ /* do nothing */ }, 
//			function(){ /* do nothing */ }, 
//			false);
//	};
//	
//	var openPremieTool = function(data) {  
//		var wooneenheid = Xrm.Page.getAttribute("dig_wooneenheid")
//		
//		if (wooneenheid != null && wooneenheid.getValue() != null){
//	    	var user = null;
//		    var straat = null; 
//		    var nr = null; 
//		    var bus = null; 
//		    var postcode = null; 
//		    var stad = null; 
//		    var nrofqueries = 2;
//		    
//		    var callback = function(){		
//				var customParameters = "user=" + user;
//				if (straat != null) customParameters += "&straat=" + straat;
//				if (nr != null) customParameters += "&nr=" + nr;
//				if (bus != null) customParameters += "&bus=" + bus;
//				if (postcode != null) customParameters += "&postcode=" + postcode;
//				if (stad != null) customParameters += "&stad=" + stad;
//				//Xrm.Utility.openWebResource("dig_/premietool/page.html", encodeURIComponent(customParameters));
//
//				var options = new Xrm.DialogOptions;
//				options.width = 1024;
//				options.height = 700;
// 
//				Xrm.Internal.openDialog(Xrm.Page.context.getClientUrl() + "/Webresources/dig_/premietool/page.html?Data=" + encodeURIComponent(customParameters), 
//                        options, 
//                        null, null, 
//                        function(returnvalue){});
//			};
//			
//		    // Get username 
//	    	XrmServiceToolkit.Rest.Retrieve(
//	    		Xrm.Page.context.getUserId(),
//				"SystemUserSet", 
//				"DomainName", 
//				null,
//				function(result){ 
//					user = result.DomainName;
//					// For testing
//					if (user.toLowerCase() == "gentgrp\\colpaebr" || user.toLowerCase() == "gentgrp\\verschwe2") user = "GENTGRP\\HermanAn";
//						
//					nrofqueries--;
//					if (nrofqueries == 0) callback();
//				},
//				function(error){ /* do nothing */ }, 
//				true);
//				
//		    // Get wooneenheid 
//		    
//	    	XrmServiceToolkit.Rest.Retrieve(
//	    		wooneenheid.getValue()[0].id,
//				"dig_wooneenheidSet", 
//				"dig_straat,dig_huisnummer,dig_busnummer,dig_postcode,dig_gemeente", 
//				null,
//				function(result){ 
//				    straat = result.dig_straat; 
//				    nr = result.dig_huisnummer; 
//				    bus = result.dig_busnummer; 
//				    postcode = result.dig_postcode; 
//				    stad = result.dig_gemeente; 
//					nrofqueries--;
//					if (nrofqueries == 0) callback();
//				},
//				function(error){ /* do nothing */ }, 
//				true);
//		}
//	};
//	
//    var emailNaar = function(data){
//        var recordId = Xrm.Page.data.entity.getId();
//        
//		var email = {};
//        email.dig_type = { Value : parseInt(data)};
//        email.RegardingObjectId = { Id: recordId, LogicalName: 'incident'};
//        
//        XrmServiceToolkit.Rest.Create(
//            email,
//            "EmailSet",
//            function (result) {
//                Xrm.Utility.openEntityForm("email", result.ActivityId, null);
//            },
//            function (error) {
//                alert(error.message);
//            },
//            false
//        );
//    };
//    var openInGeoTool = function() {
//        var serverUrl = Xrm.Page.context.getClientUrl();
//	  	var url = serverUrl + "/WebResources/dig_/geotool/index.htm";
//        var customParameters = "adres=" + Xrm.Page.getAttribute("dig_wooneenheid").getValue()[0].name;
//        window.open(url + "?Data=" + encodeURIComponent(customParameters));
//    };
//    
//    var akkoordverklaring = {
//        Enable: function(){
//            var enable = false;
//			var formtype = Xrm.Page.ui.getFormType();            
//            var type = CClearPartners.Form.General.GetValue("casetypecode");
//
//            var isOntzorging = (type == 42);
//            var isTrajectBegeleiding = (type == 41);
//            
//            // TB of OZ EN editable
//            if ((isOntzorging || isTrajectBegeleiding) && (formtype == 2)) {
//                enable = true;
//            }
//            
//            console.log("Akkoordverklaring.Enable: " + enable);
//
//            return enable;
//        },
//        Execute: function(){
//            var clienturl = Xrm.Page.context.getClientUrl();
//            var recordId = Xrm.Page.data.entity.getId().replace("{", "").replace("}", "");
//            console.log("Akkoordverklaring.Execute: " + recordId);
//            
//            Alert.show("Akkoordverklaring", "Even geduld... het systeem maakt de e-mail aan en genereert de akkoordverklaring.", null, "LOADING", 500, 250, clienturl);
//
//            
//            var parameters = {};
//            parameters.templatename = "EC - CA bevestiging renovatiebegeleiding";
//            parameters.attachmenttemplatename = "Energiecentrale akkoordverklaring renovatiebegeleiding";
//
//            var url = "/api/data/v8.2/incidents(" + recordId + ")/Microsoft.Dynamics.CRM.dig_CA_InstantiateTemplate";
//            var req = new XMLHttpRequest();
//            req.open("POST", clienturl + url, true);
//            req.setRequestHeader("OData-MaxVersion", "4.0");
//            req.setRequestHeader("OData-Version", "4.0");
//            req.setRequestHeader("Accept", "application/json");
//            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
//            req.onreadystatechange = function() {
//                if (this.readyState === 4) {
//                    req.onreadystatechange = null;
//                    if (this.status === 200) {
//                        var results = JSON.parse(this.response);
//                        console.log("Akkoordverklaring.Execute: open email " + results.emailid);
//                        Xrm.Utility.openEntityForm("email", results.emailid, null);
//                    } else {
//                        console.log("ERROR Akkoordverklaring.Execute: " + this.statusText);
//                    }
//                    Alert.hide();
//                }
//            };
//            req.send(JSON.stringify(parameters));
//        }
//    };
//    
//    return {
//        CreateContactMomentDossier: createContactMomentDossier,
//        WooneenheidZoeken: wooneenheidZoeken,
//        KlantZoeken: klantZoeken,
//        NewCustomerCase: newCustomerCase,
//        AdresOvernemen: adresOvernemen,
//        ResolveCase: resolveCase,
//        KopieerGegevensVorigeCase: kopieerGegevensVorigeCase,
//        CreateServiceActivity: createServiceActivity,
//        IsCaseDienstMilieu: isCaseDienstMilieu,
//        IsKleinAdvies: isKleinAdvies,
//        KopieGegevensPlanning: kopieGegevensPlanning,
//        KlantZoekenViaEid: klantZoekenViaEid,
//        ZoekCasesViaEid: zoekCasesViaEid,
//        StartDocumentDialog: startDocumentDialog,
//        OpenPremieTool: openPremieTool,
//        EmailNaar: emailNaar,
//        OpenInGeoTool: openInGeoTool,
//        Akkoordverklaring: akkoordverklaring
//    };
//}();
//