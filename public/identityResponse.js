class IdentityResponse{

    constructor(request, proof, diddocument){
        // The identityRequest assoiated with this proof
        this.request = request;
        // The proof that was requested
        this.proof = proof;
        //  The document fufilling the data request
        this.document = diddocument;
    }
}

module.exports = IdentityResponse;