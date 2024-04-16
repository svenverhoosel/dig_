if (typeof (CClearPartners) == "undefined") {
	CClearPartners = {};
}

CClearPartners.zoekcasesviaeid = {
	//*********************************Variables*****************************
	//*******************************Event Handlers**************************
	Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);
		this.AttachEvents();
		this.LoadForm();
	},

	AttachEvents: function () {},

	//*********************************Functions*****************************

	LoadForm: function () {
		CClearPartners.zoekcasesviaeid.FilterCases();
	},

	FilterCases: function () {
        var formContext =  CClearPartners.General.Form.GetFormContext();

		if (formContext.getAttribute("dig_eid") != null && fomContext.getAttribute("dig_eid").getValue() != null) {
			var eiddata = JSON.parse(CClearPartners.General.Form.GetValue("dig_eid"));

			//Contact ophalen adhv RRNR
			var contactid = CClearPartners.zoekcasesviaeid.getContactId(eiddata);

			//Wooneenheid ophalen adhv straat, huisnr, busnr, postcode, gemeente
			var wooneenheidId = CClearPartners.zoekcasesviaeid.getWooneenheidId(eiddata);

			//alert("contactid = " + contactid + " ; wooneenheidId = " + wooneenheidId);

			CClearPartners.zoekcasesviaeid.filtersubgrid(contactid, wooneenheidId);

		}
	},

	filtersubgrid: function (contactid, wooneenheidId) {
		var casesSubgrid = document.getElementById("casessubgrid");
		if (casesSubgrid == null) {
			setTimeout(function () {
				CClearPartners.zoekcasesviaeid.filtersubgrid(contactid, wooneenheidId);
			}, 100);
			//if the grid hasn’t loaded run this again when it has
			return;
		}

		var fetchXml = "<fetch version='1.0' output-format='xml-platform' mapping='logical' distinct='false'>";
		fetchXml += "<entity name='incident'>";
		fetchXml += "<attribute name='title' />";
		fetchXml += "<attribute name='ticketnumber' />";
		fetchXml += "<attribute name='createdon' />";
		fetchXml += "<attribute name='dig_wooneenheid' />";
		fetchXml += "<attribute name='statuscode' />";
		fetchXml += "<attribute name='customerid' />";
		fetchXml += "<attribute name='casetypecode' />";
		fetchXml += "<attribute name='ownerid' />";
		fetchXml += "<attribute name='incidentid' />";
		fetchXml += "<order attribute='createdon' descending='true' />";
		fetchXml += "<filter type='or'>";
		if (contactid != null)
			fetchXml += "<condition attribute='customerid' operator='eq' value='" + contactid + "' />";
		else
			fetchXml += "<condition attribute='customerid' operator='eq' value='" + CClearPartners.zoekcasesviaeid.getGuid() + "' />";

		if (wooneenheidId != null)
			fetchXml += "<condition attribute='dig_wooneenheid' operator='eq' value='" + wooneenheidId + "' />";
		else
			fetchXml += "<condition attribute='dig_wooneenheid' operator='eq' value='" + CClearPartners.zoekcasesviaeid.getGuid() + "' />";

		fetchXml += "</filter>";
		fetchXml += "</entity>";
		fetchXml += "</fetch>";

		casesSubgrid.control.SetParameter("fetchXml", fetchXml); //set the fetch xml to the sub grid
		casesSubgrid.control.Refresh(); //refresh the sub grid using the new fetch xml
	},

	getContactId: function (eiddata) {
		var contactid;
		var req = new XMLHttpRequest();
		req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/contacts?$filter=ves_rijksregisternummer eq '" + eiddata.insz + "'", false);
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
						// Columns
						contactid = result["contactid"]; // Guid
					}
				} else {
					console.log(this.responseText);
				}
			}
		};
		req.send();

		return contactid;
	},

	getWooneenheidId: function (eiddata) {
		var dig_wooneenheidId;
		var straat = "";
		var huisnr = "";
		var busnr = "";
		var streetSplitted = eiddata.street.trim().split(/[ ]+/);
		//Bekijk uit hoeveel delen de straatnaam afkomstig uit de EID bestaat. De delen worden onderscheiden door een 1 spatie.
		if (streetSplitted.length == 2) {
			//Bestaat de straat slechts uit 2 delen dan deel1 = straat en deel2 = huisnr
			straat = streetSplitted[0];
			huisnr = streetSplitted[1];
		} else {
			//Bestaat de straat uit meer dan 2 delen dan :
			var x = streetSplitted[streetSplitted.length - 2];

			if (x == parseInt(x)) {
				//Indien voorlaatste deel volledig uit cijfer bestaat
				//?dan is er een busnr  aanwezig en  Busnr = laatste deel van de straat op EID en huisnr
				busnr = streetSplitted[streetSplitted.length - 1];
				//?huisnr = voorlaatse deel 
				huisnr = streetSplitted[streetSplitted.length - 2];
				//?straat = aantal delen -2 gescheiden door een spatie
				var str = "";
				for (var i = 0; i < streetSplitted.length - 2; i++)
					str += streetSplitted[i] + " ";
				straat = str.trim();
			} else {
				//Indien voorlaatste deel niet volledig uit cijfers bestaat
				//?	Geen busnr. Aanwezig en huisnr = laatste deel van de straat op EID
				huisnr = streetSplitted[streetSplitted.length - 1];
				//?	Straat = aandelen – 1 gescheiden door een spatie
				var str = "";
				for (var i = 0; i < streetSplitted.length - 1; i++)
					str += streetSplitted[i] + " ";
				straat = str.trim();
			}
		}

		straat = encodeURIComponent(straat);

		var postcode = encodeURIComponent(eiddata.zipCode);
		var gemeente = encodeURIComponent(eiddata.municipality);

		var select = "/api/data/v9.2/dig_wooneenheids?$select=dig_wooneenheidid,dig_name&$filter=(dig_straat eq '" + straat + "' and dig_huisnummer eq '" + huisnr + "' and dig_postcode eq '" + postcode + "' and dig_gemeente eq '" + gemeente + "' and dig_busnummer eq '" + encodeURIComponent(busnr) + "')";


		//var select2 = "$select=dig_name,dig_wooneenheidId&$filter=dig_straat eq '" + straat + "' and dig_huisnummer eq '" + huisnr + "' and dig_postcode eq '" + postcode + "' and dig_gemeente eq '" + gemeente + "'";
		if (busnr != "") {
			if (busnr.indexOf('/') == 0)
				busnr = busnr.substring(1, busnr.length);
			select += " and dig_busnummer eq '" + encodeURIComponent(busnr) + "'";
		}

		var req = new XMLHttpRequest();
		req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + select, false);
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
						// Columns
						dig_wooneenheidId = result["dig_wooneenheidid"]; // Guid
						var dig_name = result["dig_name"]; // Text
					}
				} else {
					console.log(this.responseText);
				}
			}
		};
		req.send();

		return dig_wooneenheidId;
	},

	getGuid: function () {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	}
}