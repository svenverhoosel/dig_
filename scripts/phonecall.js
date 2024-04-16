if (typeof (CClearPartners) == "undefined")
{
	CClearPartners = {};
}
CClearPartners.phonecall = {
	//*********************************Variables*****************************
	_defaultDuration: 5,
	//*******************************Event Handlers**************************
	Form_Onload: function (executionContext)
	{
		CClearPartners.General.Form.SetFormContext(executionContext);
		this.AttachEvents();
		this.LoadForm();
	},
	AttachEvents: function ()
	{
		CClearPartners.General.Form.AddOnChange("actualstart", function() { CClearPartners.phonecall.OnChange.DateDiff("actualstart"); });
		CClearPartners.General.Form.AddOnChange("actualend", function() { CClearPartners.phonecall.OnChange.DateDiff("actualend"); });
		CClearPartners.General.Form.AddOnChange("actualdurationminutes", function() { CClearPartners.phonecall.OnChange.DateDiff("actualdurationminutes"); });
	},
	//*********************************Functions*****************************
	LoadForm: function ()
	{
		if (CClearPartners.General.Form.GetFormType() == 1)
		{
            CClearPartners.phonecall.SetDefaultDates();
		}
	},
	SetDefaultDates: function ()
	{
        CClearPartners.General.Form.SetValue("actualstart", new Date(), false);
		CClearPartners.General.Form.SetValue("actualdurationminutes", CClearPartners.phonecall._defaultDuration);
	},
	OnChange: {
    
		DateDiff: function (fieldName)
		{
			var formContext = CClearPartners.General.Form.GetFormContext();
			var actualStartObj = formContext.getAttribute("actualstart");
			var actualEndObj = formContext.getAttribute("actualend");
			var durationinMinutesObj = formContext.getAttribute("actualdurationminutes");
			if (actualStartObj != null && actualEndObj != null && durationinMinutesObj != null)
			{
                var actualStart = actualStartObj.getValue();
				if (fieldName === "actualstart" || fieldName === "actualend")
				{
					var actualEnd = actualEndObj.getValue();
					if (actualStart != null && actualEnd != null)
					{
						var dateDifference = Math.abs(actualEnd - actualStart);
						var durationInMinutes = Math.floor((dateDifference / 1000) / 60);
						CClearPartners.General.Form.SetValue("actualdurationminutes",durationInMinutes, false);
					}
				}
				else
				{
					var enddate = new Date(actualStart.getTime() + durationinMinutesObj.getValue() * 60000);
					CClearPartners.General.Form.SetValue("actualend",enddate, false);
				}
			}
		}
	}
};