class IdentityRequest{

    constructor(proof,dataRequest){
        // proof of the originator of the request
        this.proof = proof;
        // request for data from the owner
        this.dataRequest = dataRequest;
    }

    getProof(){
        return this.proof;
    }
}

module.exports = IdentityRequest;