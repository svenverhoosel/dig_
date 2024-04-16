if (typeof (Digipolis) == "undefined")
{
	Digipolis = {};
}
Digipolis.Experlogix = {
	//*********************************Variables*****************************
	//*******************************Event Handlers**************************


    // to call this function:
    // Digipolis.Experlogix.RunSmartFlow(templateName, akkoordverklaringId)
    // .then(() => {
    //     // Success logic
    // })
    // .catch(error => {
    //     console.error("Error in RunSmartFlow:", error);
    // })
    // .finally(() => {
    //      // Logic you want no matter if it is succes of error
    // });

    RunSmartFlow: function (templateName, recordId) {
        return new Promise(function (resolve, reject) {
            // Get smartFlowId from template
            Xrm.WebApi.retrieveMultipleRecords("dig_xpertdoctemplate", "?$select=dig_entitylogicalname,dig_smartflowid&$filter=dig_name eq '" + templateName + "'")
                .then(function success(results) {
                    if (results.entities.length > 0) {
                        var result = results.entities[0];
                        var dig_entitylogicalname = result["dig_entitylogicalname"];
                        var dig_smartflowid = result["dig_smartflowid"];
    
                        // get flow http
                        var queryUrl = "?$select=value&$expand=EnvironmentVariableDefinitionId($select=environmentvariabledefinitionid)&$filter=(EnvironmentVariableDefinitionId/schemaname eq 'dig_ExperlogixRunSmartflowpowerautomateurl')";
                        Xrm.WebApi.online.retrieveMultipleRecords("environmentvariablevalue", queryUrl)
                            .then(function success(results) {
                                if (results.entities.length > 0) {
                                    var endpointUrl = results.entities[0]["value"];
    
                                    // Call power automate
                                    var input = JSON.stringify({
                                        "recordid": recordId,
                                        "entitylogicalname": dig_entitylogicalname,
                                        "smartflowid": dig_smartflowid
                                    });
    
                                    var req = new XMLHttpRequest();
                                    req.open("POST", endpointUrl, true);
                                    req.setRequestHeader('Content-Type', 'application/json');
                                    req.onreadystatechange = function () {
                                        if (this.readyState === 4) {
                                            req.onreadystatechange = null;
                                            if (this.status === 200) {
                                                resolve(this.response);
                                            } else if (this.status === 400 || this.status === 502) {
                                                reject("Error: " + this.response);
                                            }
                                        }
                                    };
                                    req.send(input);
    
                                } else {
                                    reject("No environment variable with name 'dig_ExperlogixRunSmartflowpowerautomateurl' is found");
                                }
                            })
                            .catch(function (error) {
                                reject(error.message);
                            });
                    } else {
                        reject("No Template with the name " + templateName + " was found");
                    }
                })
                .catch(function (error) {
                    reject(error.message);
                });
        });
    }
    
}