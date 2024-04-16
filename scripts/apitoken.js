if (typeof CClearPartners === "undefined") { CClearPartners = {}; }

CClearPartners.dig_apitoken = {

    OnLoad: function () {
    },
    
    Ribbon: {
        RefreshToken: function(){
            var length = 128;
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            
            Xrm.Page.getAttribute("dig_token").setValue(result);
        }
    },
};