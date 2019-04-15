
const Proof = require("../public/proof.js");
const InvalidProofError = require("../public/invalidProofError.js");
const PublicKey = require('../public/publicKey.js');
const IdentityRequest = require('../public/identityRequest.js');

class IdentityResponse{

    constructor(request, proof, diddocument){
        // The identityRequest assoiated with this proof
        this.request = request;
        // The proof that was requested
        this.proof = proof;
        //  The document fufilling the data request
        this.document = diddocument;
    };

    isValid(){
        return this.request.isValid() && this.proof.isValid();
    }
}

module.exports = IdentityResponse;