if (typeof (Digipolis) == "undefined") { Digipolis = {}; }

Digipolis.dig_downloads = {
    //*********************************Variables*****************************
	//*******************************Event Handlers**************************
    Form_Onload: function () {
        this.AttachEvents();
        this.LoadForm();
    },
    
    AttachEvents: function(){
        //Xrm.Page.getAttribute("attribute").addOnChange(function);    	
    },

    //*********************************Functions*****************************
    
    LoadForm: function(){
		// Set external reference
	    if (typeof (Xrm.Page.Digipolis) == "undefined")
		    Xrm.Page.Digipolis = Digipolis;
    },
}