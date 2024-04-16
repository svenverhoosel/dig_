if (typeof (CClearPartners) == "undefined") {
	CClearPartners = {};
}

if (typeof (CClearPartners.Account) == "undefined") {
	CClearPartners.Account = {};
}

CClearPartners.Account.Related = function () {

	var isRelatedAccountZakenpartner = function () {
        debugger;
		if (CClearPartners.General.Form.GetFormContext().data.entity.getEntityName() == "account") {
			// We are on an account form
			var x = true;
			// Do we have the attribute?
			var attr = CClearPartners.General.Form.GetFormContext().getAttribute("ves_zakenpartner");
			if (attr == null) {
				// Retrieve the value from the server
				var accountId = CClearPartners.General.Form.GetFormContext().data.entity.getId();
				var req = new XMLHttpRequest();
				req.open("GET", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/accounts("+accountId.replace(/[{}]/g, "").toLowerCase()+")?$select=ves_zakenpartner", false);
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
							var accountid = result["accountid"]; // Guid
							x = result["ves_zakenpartner"]; // Boolean
							var ves_zakenpartner_formatted = result["ves_zakenpartner@OData.Community.Display.V1.FormattedValue"];
						} else {
							console.log(this.responseText);
						}
					}
				};
				req.send();
				//deprecated call
				/* var acc = XrmServiceToolkit.Rest.Retrieve(
			            accountId,
			            "AccountSet",
			            "ves_zakenpartner", null,
			            function (result) {
							x = result.ves_zakenpartner;
			            },
			            function (error) {
			                alert(error.message);
			            },
			            false
			        ); */
			} else {
				x = attr.getValue();
			}

			return x;
		}

		return false;
	};

	return {
		IsRelatedAccountZakenpartner: isRelatedAccountZakenpartner
	};
}();