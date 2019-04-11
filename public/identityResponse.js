class IdentityResponse{

    constructor(diddocument,publicKey,message,signature){
        this.document = diddocument;
        this.publicKey = publicKey;
        this.message = message;
        this.signature = signature;
    }
    
}

module.exports = IdentityResponse;