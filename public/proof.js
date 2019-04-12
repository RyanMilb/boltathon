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
        var verifier = crypto.createVerify(this.hashAlgorithm);
        verifier.update(this.message);
        verifier.end();
        return verifier.verify(this.publicKey,this.signature);
    }

}

module.exports = { Proof: Proof }