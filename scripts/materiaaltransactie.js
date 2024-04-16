if (typeof (CClearPartners) == "undefined") {
    CClearPartners = {};
}

CClearPartners.MateriaalTransactie =  {
    //*********************************Variables*****************************
    //*******************************Event Handlers**************************
    _formInitialized : false,
    
    Form_Onload: function (context) {
        CClearPartners.General.Form.SetFormContext(context);

        this.AttachEvents();
        this.LoadForm();
    },

    AttachEvents: function () {
        // Only add events once
        if (this._formInitialized) return;

        CClearPartners.General.Form.AddOnChange("dig_productid", CClearPartners.MateriaalTransactie.OnChange.Aantal);
        CClearPartners.General.Form.AddOnChange("dig_aantal", CClearPartners.MateriaalTransactie.OnChange.Aantal);
        this._formInitialized = true;
    },

    //*********************************Functions*****************************

    LoadForm: function () {
       
    },
    
    
    OnChange : {
        Aantal: function () {
            var product = CClearPartners.General.Form.GetValue("dig_productid");
            var aantal = CClearPartners.General.Form.GetValue("dig_aantal");

            if ((product == null) || (product.length == 0) || (aantal == null)) {
                CClearPartners.General.Form.SetValue("dig_totalekost", null);
            } else {
                var productId = product[0].id.substring(1, 37);
                Xrm.WebApi.online.retrieveRecord("product", productId.replace('{', '').replace('}', ''), "?$select=price").then(
                    function success(result) {
                        console.log(result);
                        // Columns
                        var price = result.price; // Currency

                        if ((result == null) || (price == null))
                        CClearPartners.General.Form.SetValue("dig_totalekost", 0);
                        else
                        CClearPartners.General.Form.SetValue("dig_totalekost", aantal * price);
                    },
                    function (error) {
                        console.log(error.message);
                    }
                );
                
            }
        }
    }
};