if (typeof (CClearPartners) == "undefined") {
    CClearPartners = {};
}

if (typeof (CClearPartners.InschrijvingHuisvesting) == "undefined") {
    CClearPartners.InschrijvingHuisvesting = {};
}

CClearPartners.InschrijvingHuisvesting.Form = function () {
    //*******************************Event Handlers**************************
    var formInitialized = false;
    var onLoad = function () {
        // Init form state

        // Only add events once
        if (formInitialized) return;
        
    	formInitialized = true;
    };
    
    var onSave = function (context) {

    };
    
    var onChange = {

    };
    
    //****************************Private Functions***************************
    
    return {
        OnLoad: onLoad,
        OnSave: onSave
    };
}();