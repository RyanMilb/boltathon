const Proof = require("../public/proof.js");

class IdentityRequest{

    constructor(proof,dataRequest){
        // proof of the originator of the request
        this.proof = proof;
        // request for data from the owner
        this.dataRequest = dataRequest;
    }

    isValid(){
        return this.proof.isValid();
    }
}

module.exports = IdentityRequest;