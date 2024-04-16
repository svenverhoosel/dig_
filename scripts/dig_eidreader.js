if (typeof (Digipolis) == "undefined") {
    Digipolis = {};
}

if (typeof (Digipolis.Combib) == "undefined") {
    Digipolis.Combib = {};
}

if (typeof (Digipolis.Combib.Eid) == "undefined") {
    Digipolis.Combib.Eid = {};  
}

Digipolis.Combib.Eid.Reader = {
    read: function (formContext, callback) {
        fetch('http://localhost:8081/eID/rest/status?ticks=' + new Date().getTime()).then( function(response) { // Make request unique to avoid browser caching
            fetch('http://localhost:8081/eID/rest/read?ticks=' + new Date().getTime()).then( (response) => response.json())
            .then(function(responsedata) {
               
                if (responsedata !== null && responsedata !== "") {
                    // Transform data
                                                 
                    const [streetWithourNumberBox, number, box] = responsedata._Street.split(/(?= \d|\D+$)/);
                    
                    var data = {
                        firstName: responsedata._FirstName,
                        middleName: "",
                        lastName: responsedata._LastName,
                        street: responsedata._Street,
                        municipality: responsedata._City,
                        zipCode: responsedata._PostalCode,
                        insz: responsedata._NationalNumber,
                        nationality: responsedata._Nationality,
                        dateOfBirth: responsedata._BirthDate !== null ? new Date(parseInt(responsedata._BirthDate.replace('/Date(', ''))) : "",
                        gender: responsedata._Gender,
                        picture: "",
                        cardNumber: responsedata._CardNumber,
                        cardValidUntilDate: new Date(parseInt(responsedata._CardValidUntil.replace('/Date(', ''))),
                        placeOfBirth: responsedata._CityOfBirth,
                        
                        //Manual split
                        streetWithoutNumber: streetWithourNumberBox,
                        housenumber: number,
                        box: box
                    };
                    callback(data);
                    
                    formContext.ui.clearFormNotification("readeid");
                }
            }).catch(function(error){
                formContext.ui.setFormNotification("Er ging iets mis bij het uitlezen van de E-ID.", "WARNING", "readeid");
            });

        }).catch(function(error){
            formContext.ui.setFormNotification("De eid reader software kan niet worden gevonden! Gelieve applicatiebeheer te contacteren.", "WARNING", "readeid");
        });
    }
}