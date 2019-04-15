var crypto = require('crypto');
/*
* A Proof encapsulates the data required to validate the identity
* of a wallet owner
*/
class Proof{

    constructor(
        message,
        publicKey,
        hashAlgoritm,
        signature
    ){
        this.message = message;
        this.publicKey = publicKey;
        this.hashAlgorithm = hashAlgoritm;
        this.signature = signature;
    }

    getMessage(){
        return this.message;
    }

    /*
    *  Validate whether the proof is valid or not
    *
    *  Returns boolean
    */
    isValid(){
        return Proof.isValid(this.message,this.publicKey.hex,this.signature,this.hashAlgorithm);
    }

};

Proof.isValid = function(message,publicKeyHex,signature,hashAlgorithm){
    var verifier = crypto.createVerify(hashAlgorithm);
    verifier.update(message);
    verifier.end();
    return verifier.verify(publicKeyHex,signature);
}
module.exports = Proof;