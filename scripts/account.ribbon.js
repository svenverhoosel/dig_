if (typeof (CClearPartners) == "undefined") { CClearPartners = {}; }
if (typeof (CClearPartners.Account) == "undefined") { CClearPartners.Account = {}; }

CClearPartners.Account.Ribbon = function () {
    
    var isZakenpartner = function(){
    alert('ok');
    debugger;
    	// call the function on account.js
    	var result = IsZakenPartner();
    	return result;
    };
    
    return {
        IsZakenpartner: isZakenpartner
    };
}();