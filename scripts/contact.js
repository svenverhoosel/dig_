//02-2015	C-Clear Partners	OD-Vesta Integratie
var formInitialized = false;
var onLoad = false;

if (typeof (District09) == 'undefined') { District09 = {}; }
if (typeof (District09.Contact) == 'undefined') { District09.Contact = {}; }

District09.Contact.Ribbon = {
	Action: {
		Sync: function (primaryControl) {
			const formContext = primaryControl; // rename as formContext 

			Xrm.Utility.showProgressIndicator("Bezig met ophalen persoonsgegevens uit RR");

			var execute_ves_magdapersoonsync_Request = {
				// Parameters
				entity: { entityType: "contact", id: formContext.data.entity.getId().replace(/[{}]/g, '') }, // entity

				getMetadata: function () {
					return {
						boundParameter: "entity",
						parameterTypes: {
							entity: { typeName: "mscrm.contact", structuralProperty: 5 }
						},
						operationType: 0, operationName: "ves_magdapersoonsync"
					};
				}
			};

			Xrm.WebApi.execute(execute_ves_magdapersoonsync_Request).then(
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
		},
	    ClearAdres: function(primaryControl) {
			primaryControl.getAttribute("ves_adres1adres").setValue(null);
			primaryControl.getAttribute("address1_line1").setValue(null);
			primaryControl.getAttribute("address1_line2").setValue(null);
			primaryControl.getAttribute("address1_line3").setValue(null);
			primaryControl.getAttribute("address1_postalcode").setValue(null);
			primaryControl.getAttribute("address1_city").setValue(null);
			primaryControl.getAttribute("address1_county").setValue(null);
			primaryControl.getAttribute("address1_country").setValue(null);
			primaryControl.getAttribute("ves_adres1crabx").setValue(null);
			primaryControl.getAttribute("ves_adres1craby").setValue(null);
		}
	},
	EnableRule: {
		UserHasMagdaRole: function () {
			const userSettings = Xrm.Utility.getGlobalContext().userSettings;
			const userRoles = userSettings.roles;

			return userRoles.some(function (userRole) {
				return userRole.name.toLowerCase() === "magda personen zoeker";
			});
		},
		ContactHasOpenCase: async function (primaryControl) {
			console.log("Entered ContactHasOpenCase");
			const formContext = primaryControl; // rename as formContext 
			const contactid = formContext.data.entity.getId();
			const checkcasetypecodes = "['2','5','6','8','10']";
			const select = "?$select=incidentid";
			const filter = "&$filter=(statecode eq 0 and _customerid_value eq " + contactid + " and Microsoft.Dynamics.CRM.In(PropertyName='casetypecode',PropertyValues=" + checkcasetypecodes + "))";
			console.log("Execute retrieveMultipleRecords");
			var result = await Xrm.WebApi.retrieveMultipleRecords("incident", select + filter + "&$top=1");
			console.log(result);
			return result.entities.length > 0;
		}
	}
};


function onContactFormLoad(executionContext) {
	CClearPartners.General.Form.SetFormContext(executionContext);
	var formContext = CClearPartners.General.Form.GetFormContext();
	if (document.getElementById("_NA_PROC") != null) document.getElementById("_NA_PROC").lastChild.innerText = "Digidos";
	CClearPartners.Form.General.HideNavigationGroupIfEmpty("_NA_SFA");
	CClearPartners.Form.General.HideNavigationGroupIfEmpty("_NA_MA");
	CClearPartners.Form.General.HideNavigationGroupIfEmpty("_NA_CS");
	CClearPartners.Form.General.HideNavigationGroupIfEmpty("_NA_PROC");
	var navBarItem = document.getElementById("navAddresses");
	if (formContext.getAttribute("ves_type").getValue()) {
		if (navBarItem != null) {
			navBarItem.style.display = 'none';
		}
	}
	idemGsmNummer();
	//idemEmail();
	IsBelgChanged();
	PrivePersoonChanged();
	if (CClearPartners.General.Form.GetFormType() == 1) {
		SetDefaultNummerLandCode("ves_telefoonnummerlandcode");
		SetDefaultNummerLandCode("ves_gsmnummerlandcode");
		SetDefaultNummerLandCode("ves_faxnummerlandcode");
	} else {
		if (CClearPartners.General.Form.GetValue("ves_telefoonnummerlandcode") == null) {
			SetDefaultNummerLandCode("ves_telefoonnummerlandcode");
		} else {
			CClearPartners.General.Form.SetSubmitMode("ves_telefoonnummerlandcode","never");
		}
		if (CClearPartners.General.Form.GetValue("ves_gsmnummerlandcode") == null) {
			SetDefaultNummerLandCode("ves_gsmnummerlandcode");
		} else {
			CClearPartners.General.Form.SetSubmitMode("ves_gsmnummerlandcode","never");
		}
		if (CClearPartners.General.Form.GetValue("ves_faxnummerlandcode") == null) {
			SetDefaultNummerLandCode("ves_faxnummerlandcode");
		} else {
			CClearPartners.General.Form.SetSubmitMode("ves_faxnummerlandcode", "never");
		}
		OnNummerLandCodeChanged("ves_telefoonnummerlandcode");
		OnNummerLandCodeChanged("ves_gsmnummerlandcode");
		OnNummerLandCodeChanged("ves_faxnummerlandcode");
	}
	onLoad = false;
	IsTypeEditable();
	if (CClearPartners.General.Form.GetValue("ves_historiek") != null) CClearPartners.General.Form.SetTabVisible("tab_Historiek", true);
	// Secties verbergen op basis van type contact
	SetContactTypeFields();
	// initCustomLookups();
	if (formInitialized) return;
	CClearPartners.General.Form.AddOnChange("modifiedon", postSaveEvent);
	CClearPartners.General.Form.AddOnChange("ves_type", SetContactTypeFields);
	CClearPartners.General.Form.AddOnChange("dig_zoekadresbutton", search);
	CClearPartners.General.Form.AddOnChange("ves_isbelg", IsBelgChanged);
	formInitialized = true;
}

function postSaveEvent()  {
	OnNummerLandCodeChanged("ves_telefoonnummerlandcode");
	OnNummerLandCodeChanged("ves_gsmnummerlandcode");
	OnNummerLandCodeChanged("ves_faxnummerlandcode");
}

function SetContactTypeFields() {
	var type = CClearPartners.Form.General.GetValue("ves_type");
	var isPro = (type == 1);
	CClearPartners.Form.General.SetSectionVisible("general", "general_ProfessioneleInformatie", isPro);
	CClearPartners.Form.General.SetSectionVisible("tab_contactgegevens", "tab_contactgegevens_emaildetails", !isPro);
	CClearPartners.Form.General.SetSectionVisible("tab_contactgegevens", "tab_contactgegevens_adresdetails", !isPro);
}
// NO use found
/*
function OpenOrCloseContact(contactid) {
	_contactid = contactid;
}
*/
// no use found
/*
function setType() {
	if (CClearPartners.General.Form.GetValue(privatecontactField) != null) {
		CClearPartners.General.Form.SetValue(typeField, 1);
	}
}
*/
//saveTypes: null | "saveandclose" | "saveandnew"

function CustomSave(saveType) {
	var formContext = CClearPartners.General.Form.GetFormContext();
	var typeAttribute = formContext.getAttribute("ves_type");
	if (typeAttribute != null) {
		if (typeAttribute.getValue() == false) {
			CustomSavePrive(saveType);
		} else {
			if (typeAttribute.getValue() == true) {
				CustomSavePro(saveType);
			}
		}
	}
}

function CustomSavePrive(saveType) {
	var formContext = CClearPartners.General.Form.GetFormContext();
	var overlijdenAttribute = formContext.getAttribute("ves_datumoverlijden");
	if (overlijdenAttribute != null) {
		if (overlijdenAttribute.getValue() != null) {
			var r = window.confirm("Wilt u zeker deze persoon op overleden zetten?");
			if (r == true) {
				if (saveType == null) formContext.data.entity.save();
				else formContext.data.entity.save(saveType);
			} else {
				formContext.getControl("ves_datumoverlijden").setFocus();
				return;
			}
		} else {
			if (saveType == null) formContext.data.entity.save();
			else formContext.data.entity.save(saveType);
		}
	} else {
		if (saveType == null) formContext.data.entity.save();
		else formContext.data.entity.save(saveType);
	}
}

function CustomSavePro(saveType) {
	var formContext = CClearPartners.General.Form.GetFormContext();
	formContext.getControl("ves_typerelatie").setFocus();
	var endDateAttribute = formContext.getAttribute("ves_relationenddate");
	if (endDateAttribute != null) {
		if (endDateAttribute.getValue() != null) {
			var r = window.confirm("Bent u zeker dat u deze professionele persoon wil stopzetten?");
			if (r == true) {
				if (saveType == null) formContext.data.entity.save();
				else formContext.data.entity.save(saveType);
			} else {
				formContext.getControl("ves_relationenddate").setFocus();
				return;
			}
		} else {
			if (saveType == null) formContext.data.entity.save();
			else formContext.data.entity.save(saveType);
		}
	} else {
		if (saveType == null) formContext.data.entity.save();
		else formContext.data.entity.save(saveType);
	}
}



function DeactivateInVesta() {
	alert("nog niet geïmplementeerd");
}

function search(context) {
	var serverUrl = Xrm.Utility.getGlobalContext().getClientUrl();
	var height = (window.outerHeight && window.outerHeight > 600) ? (window.outerHeight - 200) : 600;
	if ((CClearPartners.General.Form.GetValue("ves_type") == true || CClearPartners.General.Form.GetValue("ves_type") == null) && CClearPartners.General.Form.GetValue("ves_privepersoon") != null && CClearPartners.General.Form.GetValue("parentcustomerid") != null) {
		var privepersoonid = CClearPartners.General.Form.GetValue("ves_privepersoon")[0].id;
		var organisatieid = CClearPartners.General.Form.GetValue("parentcustomerid")[0].id;
		var customParameters = encodeURIComponent("privepersoonid=" + privepersoonid + "&organisatieid=" + organisatieid + "&postcode=9000");
		Alert.showWebResource("ccp_/zoekadres/zoeken.html?Data=" + customParameters, 700, height, "Zoek adres", null, serverUrl, false, 10);
		CClearPartners.Form.General.RegisterAlertCallback("callback", FillAdresField);
	} else {
		Alert.showWebResource("ccp_/zoekadres/zoeken.html?Data=postcode=9000", 700, height, "Zoek adres", null, serverUrl, false, 10);
		CClearPartners.Form.General.RegisterAlertCallback("zoekadresCallback", FillAdresField, FillAdresField);
	}

	if (!context) { return; }
	var attribute = context.getEventSource();

	// Clear the value and avoid to submit data
	attribute.setValue(null);
	attribute.setSubmitMode("never");
}

function FillAdresField(straat, huisnummer, busnummer, postcode, gemeente, land, GrabX, GrabY, adresId) {
	if (postcode == null) { return; }
	if (straat != null) {
		CClearPartners.General.Form.SetValue("ves_adres1type", "Domicilieadres");
	} else {
		CClearPartners.General.Form.SetValue("ves_adres1type", "");
	}

	CClearPartners.General.Form.SetValue("ves_adres1adres", adresId);
	CClearPartners.General.Form.SetValue("address1_line1", straat);
	CClearPartners.General.Form.SetValue("address1_line2", huisnummer);
	CClearPartners.General.Form.SetValue("address1_line3", busnummer);
	CClearPartners.General.Form.SetValue("address1_postalcode", postcode);
	CClearPartners.General.Form.SetValue("address1_city", gemeente);
	CClearPartners.General.Form.SetValue("address1_county", null);
	CClearPartners.General.Form.SetValue("address1_country", land);
	CClearPartners.General.Form.SetValue("ves_verdiepinglokaal", null);
	CClearPartners.General.Form.SetValue("ves_adres1gebouw", null);

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
			//Xrm page will be replaced with deprecation project :-$
			CClearPartners.General.Form.SetValue("ves_adres1crabx", resultJson.Coordinates[0].toString().replace(".", ","));
			CClearPartners.General.Form.SetValue("ves_adres1craby", resultJson.Coordinates[1].toString().replace(".", ","));
		}

	}).catch(function (error) {
		console.log(error.message);
	});
}


/*
//END
///VESTA SCRIPTS
///<reference path="XrmPage-vsdoc.js"/>
if (typeof (RD) == "undefined") RD = {};
if (typeof (RD.Vesta) == "undefined") RD.Vesta = {};
if (typeof (RD.Vesta.Contact) == "undefined") RD.Vesta.Contact = {};
if (typeof (RD.Vesta.Contact.Form) == "undefined") RD.Vesta.Contact.Form = {};
if (typeof (RD.Vesta.Contact.Ribbon) == "undefined") RD.Vesta.Contact.Ribbon = {};
if (typeof (RD.Vesta.Contact.Ribbon.Enable) == "undefined") RD.Vesta.Contact.Ribbon.Enable = {};
(function () {
	RD.Vesta.Contact.Ribbon.Enable.ActivateForWinLVB = function () {
		var doelAppId = Xrm.Page.getAttribute("ves_doelapplicatieid").getValue();
		if (!doelAppId) return true;
		var result = true;
		CrmRestKit.Retrieve("new_doelapplicatie", doelAppId[0].id, ["new_name"], false).done(function (doelApp) {
			if (doelApp.d.new_name == "WINLBV") result = false
		});
		return result;
	};
})();
var onLoad = true;
var nummerLandCode = new Object();
var defaultCountrid;
*/
var _defaultCountryId = null;
var	_nummerlandCode = {};


if (typeof (RealDolmen) == "undefined") {
	RealDolmen = {
		__namespace: true
	};
}

//This will establish a more unique namespace for functions in this library. This will reduce the 
// potential for functions to be overwritten due to a duplicate name when the library is loaded.
RealDolmen = {
	
	/*
	RequestPrivePersoon: function (contactid) {
		//work with the response here
		Xrm.Page.getAttribute("lastname").setSubmitMode("always");
		Xrm.Page.getAttribute("nickname").setSubmitMode("always");
		Xrm.Page.getAttribute("firstname").setSubmitMode("always");
		Xrm.Page.getAttribute("middlename").setSubmitMode("always");
		Xrm.Page.getAttribute("gendercode").setSubmitMode("always");
		Xrm.Page.getAttribute("birthdate").setSubmitMode("always");
		if (Xrm.Page.getAttribute("ves_geboorteplaats").getUserPrivilege() == "canUpdate") Xrm.Page.getAttribute("ves_geboorteplaats").setSubmitMode("always");
		Xrm.Page.getAttribute("ves_isbelg").setSubmitMode("always");
		Xrm.Page.getAttribute("ves_nationaliteit").setSubmitMode("always");
		Xrm.Page.getAttribute("ves_salutation").setSubmitMode("always");
		Xrm.Page.getAttribute("ves_datumoverlijden").setSubmitMode("always");
		Xrm.Page.getAttribute("lastname").setValue(null);
		Xrm.Page.getAttribute("nickname").setValue(null);
		Xrm.Page.getAttribute("firstname").setValue(null);
		Xrm.Page.getAttribute("middlename").setValue(null);
		Xrm.Page.getAttribute("gendercode").setValue(null);
		Xrm.Page.getAttribute("birthdate").setValue(null);
		if (Xrm.Page.getAttribute("ves_geboorteplaats").getUserPrivilege() == "canUpdate") Xrm.Page.getAttribute("ves_geboorteplaats").setValue(null);
		Xrm.Page.getAttribute("ves_isbelg").setValue(null);
		Xrm.Page.getAttribute("ves_nationaliteit").setValue(null);
		Xrm.Page.getAttribute("ves_salutation").setValue(null);
		Xrm.Page.getAttribute("ves_datumoverlijden").setValue(null);
		//var privileges = Xrm.Page.getAttribute("ves_rijksregisternummer").getUserPrivilege();
		//var formType = Xrm.Page.ui.getFormType();

		Xrm.WebApi.online.retrieveRecord("contact", contactid.replace('{', '').replace('}', ''), "?$select=ves_salutation,ves_isbelg,birthdate,ves_datumoverlijden,firstname,ves_geboorteplaats,gendercode,lastname,middlename,_ves_nationaliteit_value,nickname").then(
			function success(result) {
				console.log(result);
				// Columns
				var contactid = result["contactid"]; // Guid
				var ves_salutation = result["ves_salutation"]; // Choice
				var ves_salutation_formatted = result["ves_salutation@OData.Community.Display.V1.FormattedValue"];
				var ves_isbelg = result["ves_isbelg"]; // Boolean
				var ves_isbelg_formatted = result["ves_isbelg@OData.Community.Display.V1.FormattedValue"];
				var birthdate = result["birthdate"]; // Date Time
				var birthdate_formatted = result["birthdate@OData.Community.Display.V1.FormattedValue"];
				var ves_datumoverlijden = result["ves_datumoverlijden"]; // Date Time
				var ves_datumoverlijden_formatted = result["ves_datumoverlijden@OData.Community.Display.V1.FormattedValue"];
				var firstname = result["firstname"]; // Text
				var ves_geboorteplaats = result["ves_geboorteplaats"]; // Text
				var gendercode = result["gendercode"]; // Choice
				var gendercode_formatted = result["gendercode@OData.Community.Display.V1.FormattedValue"];
				var lastname = result["lastname"]; // Text
				var middlename = result["middlename"]; // Text
				var ves_nationaliteit = result["_ves_nationaliteit_value"]; // Lookup
				var ves_nationaliteit_formatted = result["_ves_nationaliteit_value@OData.Community.Display.V1.FormattedValue"];
				var ves_nationaliteit_lookuplogicalname = result["_ves_nationaliteit_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
				var nickname = result["nickname"]; // Text

				Xrm.Page.getAttribute("ves_isbelg").setValue((ves_isbelg === 'true'));
				if (ves_nationaliteit != null && ves_nationaliteit != null) CClearPartners.Form.General.SetLookupValue("ves_nationaliteit", ves_nationaliteit, ves_nationaliteit_formatted, ves_nationaliteit_lookuplogicalname, false);
				else Xrm.Page.getAttribute("ves_nationaliteit").setValue(null);

				Xrm.Page.getAttribute("lastname").setValue(lastname);
				Xrm.Page.getAttribute("nickname").setValue(nickname);
				Xrm.Page.getAttribute("firstname").setValue(firstname);
				Xrm.Page.getAttribute("middlename").setValue(middlename);
				Xrm.Page.getAttribute("gendercode").setValue(gendercode == null ? null : gendercode);
				Xrm.Page.getAttribute("birthdate").setValue(birthdate);
				Xrm.Page.getAttribute("ves_geboorteplaats").setValue(ves_geboorteplaats);
				Xrm.Page.getAttribute("ves_salutation").setValue(ves_salutation == null ? null : ves_salutation);
				Xrm.Page.getAttribute("ves_datumoverlijden").setValue(ves_datumoverlijden);
			},
			function (error) {
				console.log(error.message);
			}
		);
	},
	*/
	RequestAccount: function (accountid) {
		accountid = accountid.replace('{', '').replace('}', '');
		var url = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v8.2/accounts(" + accountid + ")?$select=address1_city,address1_country,address1_line1,address1_line2,address1_line3,address1_postalcode,ves_adres1type,ves_adresid";
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
					var result = JSON.parse(this.response);
					CClearPartners.General.Form.SetValue("address1_city", result["address1_city"]);
					CClearPartners.General.Form.SetValue("address1_county", result["address1_city"]);
					CClearPartners.General.Form.SetValue("address1_country", result["address1_country"]);
					CClearPartners.General.Form.SetValue("address1_line1", result["address1_line1"]);
					CClearPartners.General.Form.SetValue("address1_line2", result["address1_line2"]);
					CClearPartners.General.Form.SetValue("address1_line3", result["address1_line3"]);
					CClearPartners.General.Form.SetValue("address1_postalcode", result["address1_postalcode"]);
					CClearPartners.General.Form.SetValue("ves_adres1type", result["ves_adres1type"]);
					CClearPartners.General.Form.SetValue("ves_adres1adres", result["ves_adresid"]);
				} else {
					Xrm.Utility.alertDialog(this.statusText);
				}
			}
		};
		req.send();
	},
	RequestNummerLandCode: function (landid) {
		if (_nummerlandCode !== null &&_nummerlandCode[landid] != null) {
			return _nummerlandCode[landid];
		} else {
			var nummer = null;
			var reqq = new XMLHttpRequest();
			reqq.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/ves_countries(" + landid.replace('{', '').replace('}', '') + ")?$select=ves_nummerprefixcode", false);
			reqq.setRequestHeader("OData-MaxVersion", "4.0");
			reqq.setRequestHeader("OData-Version", "4.0");
			reqq.setRequestHeader("Content-Type", "application/json; charset=utf-8");
			reqq.setRequestHeader("Accept", "application/json");
			reqq.setRequestHeader("Prefer", "odata.include-annotations=*");
			reqq.onreadystatechange = function () {
				if (this.readyState === 4) {
					reqq.onreadystatechange = null;
					if (this.status === 200) {
						var result = JSON.parse(this.response);
						console.log(result);
						// Columns
						var ves_nummerprefixcode = result["ves_nummerprefixcode"]; // Text

						if (result != null) nummer = ves_nummerprefixcode;
					} else {
						console.log(this.responseText);
					}
				}
			};
			reqq.send();

			_nummerlandCode[landid] = nummer;
			return nummer;
		}
	},
	
	RequestDefaultNummerLandCode: function () {
		if (_defaultCountryId != null) {
			return _defaultCountryId;
		}
		else {
			var req = new XMLHttpRequest();
			req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/ves_countries?$select=ves_countryid&$filter=ves_nummerdefaultland eq true", false);
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
						for (var i = 0; i < results.value.length; i++) {
							var result = results.value[i];
							// Columns
							var ves_countryid = result["ves_countryid"]; // Guid
							_defaultCountryId = ves_countryid;
							return _defaultCountryId;
						}
					}
					else {
						console.log(this.responseText);
						return null;
					}
				}
			};
			req.send();
			return _defaultCountryId;
		}
	},
	
	RequestMoreAdressId: function (accountid) {
		accountid = accountid.replace('{', '').replace('}', '');
		var url = Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v8.2/ves_meeradressens?$select=ves_meeradressenid,ves_name&$filter=_ves_organisatieid_value eq " + accountid;
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
						var ves_meeradressenid = results.value[i]["ves_meeradressenid"];
						var ves_name = results.value[i]["ves_name"];
						CClearPartners.General.Form.SetLookupValue("ves_syncadresid", ves_meeradressenid, ves_name, "ves_meeradressen");
					}
				} else {
					Xrm.Utility.alertDialog(this.statusText);
				}
			}
		};
		req.send();
	},
	RequestGsmNummers: function (contactid) {
		Xrm.WebApi.online.retrieveRecord("contact", contactid.replace('{', '').replace('}', ''), "?$select=ves_gsmnummernummer").then(
			function success(result4) {
				console.log(result4);
				// Columns
				var ves_gsmnummernummer = result4["ves_gsmnummernummer"]; // Text
				if (result4 != null) {
					CClearPartners.General.Form.SetSubmitMode("ves_gsmnummernummer","always");
					CClearPartners.General.Form.SetValue("ves_gsmnummernummer", ves_gsmnummernummer);
				}
			},
			function (error) {
				console.log(error.message);
			}
		);
	},
	/*
	RequestEmail: function (contactid) {
		Xrm.WebApi.online.retrieveRecord("contact", contactid.replace('{', '').replace('}', ''), "?$select=emailaddress1").then(
			function success(result) {
				console.log(result);
				// Columns
				var contactid = result["contactid"]; // Guid
				var emailaddress1 = result["emailaddress1"]; // Text
				Xrm.Page.getAttribute("emailaddress1").setValue(emailaddress1);

			},
			function (error) {
				console.log(error.message);
			}
		);
	},
	*/
	RequestBelgie: function () {
		Xrm.WebApi.online.retrieveMultipleRecords("ves_nationaliteit", "?$select=ves_nationaliteitid&$filter=ves_name eq 'België'").then(
			function success(results) {
				console.log(results);
				for (var i = 0; i < results.entities.length; i++) {
					var result = results.entities[i];
					// Columns
					var ves_nationaliteitid = result["ves_nationaliteitid"]; // Guid
					CClearPartners.General.Form.SetSubmitMode("ves_nationaliteit", "always");
					if (results != null) CClearPartners.Form.General.SetLookupValue("ves_nationaliteit", ves_nationaliteitid, "België", "ves_nationaliteit", false);
				}
			},
			function (error) {
				console.log(error.message);
				alert(error.message);
			}
		);
	},
	/*
	getODataUTCDateFilter: function (date) {
		var f = date.Format("yyyy-mm-ddThh:MM:ss+" + (-date.getTimezoneOffset() / 60) + ":00");
		return f;
	},
	*/
	__namespace: true
};

function restrictCreate(executionContext) {
	CClearPartners.General.Form.SetFormContext(executionContext);
	var formType = CClearPartners.General.Form.GetFormType();
	if (formType == 1 && CClearPartners.General.Form.GetValue("parentcustomerid") != null) {
		CClearPartners.General.Form.SetValue("ves_type", true);
		CClearPartners.General.Form.SetDisabled("ves_type", true);
		CopyAdresFromAccount();
		typeChanged();
	} else if (formType != 1) {
		CClearPartners.General.Form.SetDisabled("ves_type", true);
	}
}

function IsBelgChanged() {
	var isbelg = CClearPartners.General.Form.GetValue("ves_isbelg");
	var formType = CClearPartners.General.Form.GetFormType();
	if (isbelg == true) {
		if (onLoad == false || formType == 1) {
			RealDolmen.RequestBelgie();
		}
		CClearPartners.General.Form.SetSubmitMode("ves_nationaliteit", "always");
		CClearPartners.General.Form.SetDisabled("ves_nationaliteit", true);
	} else if (isbelg == false)
		{
			CClearPartners.General.Form.SetDisabled("ves_nationaliteit", false); 
			if (onLoad == false || formType == 1) {
				CClearPartners.General.Form.SetValue("ves_nationaliteit", null);
			}
		}
	
}

function PrivePersoonChanged() {
	if (CClearPartners.General.Form.GetValue("ves_privepersoon") != null) {
		PlaceFieldsReadOnlyForSection("GeneralPersoonGegevens", true);
		if (onLoad == false) {
			//idemEmail();
			idemGsmNummer();
		}
	} else {
		PlaceFieldsReadOnlyForSection("GeneralPersoonGegevens", false);
		CClearPartners.General.Form.SetDisabled("ves_salutation", true); 
	}
}

function OnNummerLandCodeChanged(fieldname) {
	var telNrLandCodeValue = CClearPartners.General.Form.GetValue(fieldname);
	if (telNrLandCodeValue != null) {
		telNrLandCodeValue[0].name = RealDolmen.RequestNummerLandCode(telNrLandCodeValue[0].id);
		CClearPartners.General.Form.SetValue(fieldname, telNrLandCodeValue);
	}
	CClearPartners.General.Form.SetSubmitMode(fieldname,"dirty");
}

function typeChanged() {
	var navBarItem = document.getElementById("navAddresses");
	var formContext =CClearPartners.General.Form.GetFormContext();
	if (CClearPartners.General.Form.GetValue("ves_type")) {
		if (navBarItem != null) {
			navBarItem.style.display = 'none';
		}
	}
	CClearPartners.General.Form.SetTabVisible("tabRelatie", true);
	CClearPartners.General.Form.SetFieldVisible("ves_privepersoon", true);
	CClearPartners.General.Form.SetFieldVisible("WebResource_ves_privepersoon", true);
	
	if (formContext.getControl("WebResource_parentcustomerid") != null) formContext.getControl("WebResource_parentcustomerid").setData(formContext.getControl("WebResource_parentcustomerid").getData() + ";required");
	CClearPartners.General.Form.SetSectionVisible("tab_contactgegevens", "Sec_MeerAdressen", false);
	CClearPartners.General.Form.SetSectionVisible("tab_contactgegevens", "tab_anderecontactgegevens", true);
	CClearPartners.General.Form.SetSectionVisible("tab_contactgegevens", "Sec_emailadressen", false);
	CClearPartners.General.Form.SetSectionVisible("tab_contactgegevens", "tab_contactgegevens_emaildetails", false);
	CClearPartners.General.Form.SetSectionVisible("tab_contactgegevens", "contactnummersHeader", false);
	CClearPartners.General.Form.SetFieldVisible("websiteurl", false);
	
	CClearPartners.General.Form.SetFieldVisible("ves_idemcontactnummersalsprivpersoon", true);
	var formlabel = "";
	if (formContext.ui.formSelector.getCurrentItem() != null) formlabel = formContext.ui.formSelector.getCurrentItem().getLabel();
	else formlabel = document.getElementById("crmFormSelector").innerText;
	if (formlabel == "Digidos") {
		CClearPartners.General.Form.SetTabVisible("tabVoorkeuren", false);
		CClearPartners.General.Form.SetTabVisible("tabNationaliteit", false);
		CClearPartners.General.Form.SetTabVisible("tabOnderwijsWerk", false);
		CClearPartners.General.Form.SetSectionVisible("general", "general_secExtra", false);
		CClearPartners.General.Form.SetSectionVisible("tab_contactgegevens", "Sec_MeerAdressen", false);
		
	}
	if (CClearPartners.General.Form.GetValue("ves_type") == false) {
		if (formlabel == "Digidos") {
			CClearPartners.General.Form.SetTabVisible("tabVoorkeuren", true);
			CClearPartners.General.Form.SetTabVisible("tabNationaliteit", true);
			CClearPartners.General.Form.SetTabVisible("tabOnderwijsWerk", true);
			CClearPartners.General.Form.SetSectionVisible("general", "general_secExtra", true);
			CClearPartners.General.Form.SetSectionVisible("tab_contactgegevens", "Sec_MeerAdressen", true);
		}
		CClearPartners.General.Form.SetRequired("parentcustomerid", "none");
		formContext.getControl("WebResource_parentcustomerid").setData(formContext.getControl("WebResource_parentcustomerid").getData().replace(";required", ""));
		CClearPartners.General.Form.SetFieldVisible("ves_privepersoon", false);
		CClearPartners.General.Form.SetFieldVisible("WebResource_ves_privepersoon", false);
		CClearPartners.General.Form.SetTabVisible("tabRelatie", false);
		CClearPartners.General.Form.SetSectionVisible("tab_contactgegevens", "Sec_MeerAdressen", true);
		CClearPartners.General.Form.SetSectionVisible("tab_contactgegevens", "tab_anderecontactgegevens", false);
		CClearPartners.General.Form.SetSectionVisible("tab_contactgegevens", "Sec_emailadressen", true);
		CClearPartners.General.Form.SetSectionVisible("tab_contactgegevens", "tab_contactgegevens_emaildetails", true);
		CClearPartners.General.Form.SetSectionVisible("tab_contactgegevens", "contactnummersHeader", true);
		CClearPartners.General.Form.SetFieldVisible("websiteurl", true);
		if (onLoad == false) {
			CClearPartners.General.Form.SetValue("ves_privepersoon", null);
			CClearPartners.General.Form.SetValue("ves_idemcontactnummersalsprivpersoon", null);
		}
		CClearPartners.General.Form.SetFieldVisible("ves_idemcontactnummersalsprivpersoon", false);
	}
}
//No use found
/*
function validateRijksregisterNr(field) {
	var nr = Xrm.Page.getAttribute(field).getValue();
	if (nr != null) {
		nr = nr.replace(/[^0-9]/gi, "");
		if (nr.length == 11) { } else {
			alert("Formaat van rijksregisternummer is niet correct");
		}
	}
}
*/
function SetDefaultNummerLandCode(fieldname) {
	if (CClearPartners.General.Form.GetFormType() == 1) {
		var id = id = RealDolmen.RequestDefaultNummerLandCode();
		CClearPartners.General.Form.SetLookupValue(fieldname, id , RealDolmen.RequestNummerLandCode(id), "ves_country");
	}
}

function idemGsmNummer() {
	if (CClearPartners.General.Form.GetValue("ves_idemcontactnummersalsprivpersoon") == true) {
		CClearPartners.General.Form.SetSubmitMode("ves_gsmnummerlandcode", "always");
		CClearPartners.General.Form.SetSubmitMode("ves_gsmnummernummer", "always");
		CClearPartners.General.Form.SetDisabled("ves_gsmnummerlandcode", true);
		CClearPartners.General.Form.SetDisabled("ves_gsmnummernummer", true);
		var priveContact = CClearPartners.General.Form.GetValue("ves_privepersoon");
		if (priveContact != null) {
			if (onLoad == false) {
				RealDolmen.RequestGsmNummers(priveContact[0].id);
				if (CClearPartners.General.Form.GetValue("ves_gsmnummernummer") == null) {
					alert("De privé persoon heeft geen gsm nummer.");
				}
			}
		}
	} else {
		if (CClearPartners.General.Form.GetValue("statecode") == 0) {
			CClearPartners.General.Form.SetDisabled("ves_gsmnummerlandcode",false); 
			CClearPartners.General.Form.SetDisabled("ves_gsmnummernummer", false); 
		}
		if (onLoad == false) {
			SetDefaultNummerLandCode("ves_gsmnummerlandcode");
			CClearPartners.General.Form.SetValue("ves_gsmnummernummer",null); 
		}
	}
}
// No use found
/*
function CopyBasicDetailsFromPrivateContact() {
	var privateContactValue = Xrm.Page.getAttribute("ves_privepersoon").getValue();
	if (privateContactValue != null) {
		RealDolmen.RequestPrivePersoon(privateContactValue[0].id);
	}
}
*/
function CopyAdresFromAccount() {
	var accountValue = CClearPartners.General.Form.GetValue("parentcustomerid");
	if (accountValue != null) {
		RealDolmen.RequestAccount(accountValue[0].id);
		RealDolmen.RequestMoreAdressId(accountValue[0].id);
	}
}


function SetReadOnlyWhenFromWinLBV(executionContext) {
	CClearPartners.General.Form.SetFormContext(executionContext);
	var formContext = CClearPartners.General.Form.GetFormContext();

	var isWinlbv = IsWinLbv();
	if (isWinlbv == false) {
		if (CClearPartners.General.Form.GetValue("ves_type") == true) {
			return;
		}
		if (CClearPartners.General.Form.GetValue("statecode") != 0) {
			return;
		}
	}
	// Also disable when it is a system contact
	var dig_systemcontact = CClearPartners.General.Form.GetValue("dig_issystemcontact");
	CClearPartners.General.Form.SetDisabled("firstname", dig_systemcontact == true);
	CClearPartners.General.Form.SetTabVisible("tab_contactgegevens", dig_systemcontact != true);
	var disable = isWinlbv || dig_systemcontact;

	const controlsToSetReadOnly = ["lastname", "nickname", "middlename", "gendercode", "birthdate",
		"statuscode", "ves_datumoverlijden", "ves_geboorteplaats", "ves_isbelg", "ves_nationaliteit"];

	for (var index = 0; index < controlsToSetReadOnly.length; index++) {
		const controlToSetReadOnly = controlsToSetReadOnly[index];
		CClearPartners.General.Form.SetDisabled(controlToSetReadOnly, disable);
		
		if (disable == true) {
			if (controlToSetReadOnly === "ves_geboorteplaats") {
				const ves_geboorteplaats = formContext.getAttribute(controlToSetReadOnly);
				if (ves_geboorteplaats.getUserPrivilege() == "canUpdate")
					CClearPartners.General.Form.SetSubmitMode("ves_geboorteplaats", "always");
			} else {
				CClearPartners.General.Form.SetSubmitMode(controlToSetReadOnly, "always");
			}
		}
	}
}

function PlaceFieldsReadOnlyForSection(sectionName, readonly) {
	if (CClearPartners.General.Form.GetValue("statecode") == 0) {
		var formContext = CClearPartners.General.Form.GetFormContext();
		var ctrlName = formContext.ui.controls.get();
		for (var i in ctrlName) {
			var ctrl = ctrlName[i];
			var parent = ctrl.getParent();
			if (parent != null) {
				var ctrlSection = parent.getName();
				if (ctrlSection == sectionName) {
					ctrl.setDisabled(readonly);
				}
			}
		}
	}
}

function IsCreatedFromSL() {
	var formContext = CClearPartners.General.Form.GetFormContext();
	var parameters = formContext.context.getQueryStringParameters();
	if (parameters["CreatedFromSL_"] != undefined && parameters["CreatedFromSL_"] == "true") {
		return true;
	}
	return false;
}

function IsTypeEditable() {
	if (IsCreatedFromSL()) {
		CClearPartners.General.Form.SetDisabled("ves_type", false);
	}
}
//No use found
/*
function HidePrivateField() {
	//type = false then it's private
	const controlsToHide = ["ves_geboorteplaats", "ves_isbelg", "ves_nationaliteit", "middlename", "ves_gezinshoofd", "birthdate",
		"ves_salutation"];

	var show = Xrm.Page.getAttribute("ves_type") != null && Xrm.Page.getAttribute("ves_type").getValue() == false;
	for (let index = 0; index < controlsToHide.length; index++) {
		const controlToHide = controlsToHide[index];
		Xrm.Page.getControl(controlToHide).setVisible(show);
	}
}
*/
//No use found
/*
function StartdateRequired() {
	if (Xrm.Page.getAttribute("ves_type").getValue()) {
		Xrm.Page.getAttribute("ves_relationstartdate").setRequiredLevel("required");
	} else {
		Xrm.Page.getAttribute("ves_relationstartdate").setRequiredLevel("none");
	}
}
*/
// No use found
/*
function IsBenoemd(onload) {
	if (Xrm.Page.getAttribute("ves_datumbenoeming").getValue() == null) {
		Xrm.Page.getControl("ves_benoemd").setDisabled(true);
		Xrm.Page.getAttribute("ves_benoemd").setRequiredLevel("none");
		if (onLoad == false) {
			Xrm.Page.getAttribute("ves_benoemd").setValue(null);
			Xrm.Page.getAttribute("ves_benoemd").setSubmitMode("always");
		}
	} else {
		Xrm.Page.getControl("ves_benoemd").setDisabled(false);
		Xrm.Page.getAttribute("ves_benoemd").setRequiredLevel("required");
		if (onLoad == false) {
			Xrm.Page.getAttribute("ves_benoemd").setSubmitMode("always");
		}
	}
}
*/ 
// No use found
/*
function showRijksregisternummer() {
	//Xrm.Page.getControl("ves_rijksregisternummer").setVisible(true);
}
*/
// No use found
/*
function VertegenwoordigdInRequired() {
	if (Xrm.Page.getAttribute("ves_type").getValue() == true) {
		Xrm.Page.getAttribute("ves_com_vertegenwoordigdin").setRequiredLevel("required");
	}
}
*/


function IsWinLbv() {
	var iswinlbv = false;

	var bron = CClearPartners.General.Form.GetValue("ves_doelapplicatieid");
	if (bron != null) {
		bron = bron[0].name;
		if (bron == 'WINLBV' || bron == 'RR') iswinlbv = true;
	}
	return iswinlbv;
}
// No use found
/*
function HideAddress() {
	var startDate = Xrm.Page.getAttribute("ves_it252startdatum").getValue();
	var endDate = Xrm.Page.getAttribute("ves_it252einddatum").getValue();
	var hide = false;
	if (startDate != null && startDate < new Date()) {
		if (endDate != null && endDate > new Date()) {
			hide = true;
		} else {
			if (endDate == null) {
				hide = true;
			}
		}
	}
	if (hide == true) {
		Xrm.Page.ui.tabs.get("tab_contactgegevens").sections.get("address").setVisible(false);
	} else {
		Xrm.Page.ui.tabs.get("tab_contactgegevens").sections.get("address").setVisible(true);
	}
}
*/