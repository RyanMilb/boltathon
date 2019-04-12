class IdentityRequest{

    constructor(message,publicKey,hashAlgoritm,signature,dataRequest){
        this.message = message;
        this.publicKey = publicKey;
        this.hashAlgorithm = hashAlgoritm;
        this.signature = signature;
        this.dataRequest = dataRequest;
    }
}

module.exports = IdentityRequest;