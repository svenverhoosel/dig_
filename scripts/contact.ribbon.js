if (typeof (CClearPartners) == "undefined") { CClearPartners = {}; }
if (typeof (CClearPartners.Contact) == "undefined") { CClearPartners.Contact = {}; }

CClearPartners.Contact.Ribbon = function () {
    
    var isRelatedAccountZakenpartner = function(){
    	// This function will check if the main form is "account" and if the account is a zakenpartner
    	return false;
    };
    
    return {
        IsRelatedAccountZakenpartner: isRelatedAccountZakenpartner
    };
}();