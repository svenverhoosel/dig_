//if (typeof (CClearPartners) == "undefined") {
//	CClearPartners = {};
//}
//
//CClearPartners.dig_besparing = {
//	//*********************************Variables*****************************
//	//*******************************Event Handlers**************************
//	Form_Onload: function () {
//		this.AttachEvents();
//		this.LoadForm();
//	},
//
//	AttachEvents: function () {
//		//Xrm.Page.getAttribute("attribute").addOnChange(function);    	
//	},
//
//	//*********************************Functions*****************************
//
//	LoadForm: function () {
//		if (Xrm.Page.ui.getFormType() == 1) {
//			this.LoadPrijsPerKWh();
//		}
//	},
//
//	LoadPrijsPerKWh: function () {
//		req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/ves_parameters?$select=ves_value&$filter=ves_name eq 'Prijs_per_kWh'", false);
//		req.setRequestHeader("OData-MaxVersion", "4.0");
//		req.setRequestHeader("OData-Version", "4.0");
//		req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
//		req.setRequestHeader("Accept", "application/json");
//		req.setRequestHeader("Prefer", "odata.include-annotations=*");
//		req.onreadystatechange = function () {
//			if (this.readyState === 4) {
//				req.onreadystatechange = null;
//				if (this.status === 200) {
//					var results = JSON.parse(this.response);
//					console.log(results);
//					for (var i = 0; i < results.value.length; i++) {
//						var result = results.value[i];
//						// Columns
//						var ves_value = parseFloat(result["ves_value"].replace(',','.').replace(' ','')); // Multiline Text
//						Xrm.Page.getAttribute("dig_prijsperkwh").setValue(ves_value);
//					}
//				} else {
//					console.log(this.responseText);
//				}
//			}
//		};
//		req.send();
//		//deprecated call
//		/* XrmServiceToolkit.Rest.RetrieveMultiple(
//			"ves_parameterSet",
//			"$filter=ves_name eq 'Prijs_per_kWh'",
//			function (results) {
//			    for (var i = 0; i < results.length; i++) {
//			    	var value = parseFloat(results[i].ves_value.replace(',','.').replace(' ',''));
//			        Xrm.Page.getAttribute("dig_prijsperkwh").setValue(value);
//			    }
//			},
//			function (error) {
//			    alert(error.message);
//			},
//			function onComplete() { },
//			false
//		); */
//	}
//}