var crypto = require('crypto');

class Crypto{

    //genrates a random number
    static getRandom(length){

        //checks that the length requested is within required bounds
        //if not then throws a RangeError
        if (length < Crypto.MINLENGTH){
            throw new RangeError("Number must not be less than " + Crypto.MINLENGTH);
        } else if (length > Crypto.MAXLENGTH) {
            throw new RangeError("Number must not be more than " + Crypto.MAXLENGTH);
        }
        
        var rand = Array.apply(null, {'length': length})
            .map(function()
            {
            var result;
            while(true) 
            {
                result = String.fromCharCode(Crypto._getRandomByte());
                if(Crypto.PATTERN.test(result))
                {
                return result;
                }
            }        
            })
            .join('');
        
        return rand;

    };

    static _getRandomByte(){
        // http://caniuse.com/#feat=getrandomvalues
        if(crypto && crypto.getRandomValues){
            var result = new Uint8Array(1);
            crypto.getRandomValues(result);
            return result[0];
        }else{
            return Math.floor(Math.random() * 256);
        };
    };
};

Crypto.PATTERN = /[a-zA-Z0-9_\-\+\.]/;
Crypto.MAXLENGTH = 32;
Crypto.MINLENGTH = 1;

module.exports = Crypto;