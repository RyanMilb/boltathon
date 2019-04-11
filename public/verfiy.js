const { DIDDocument } = require('did-document')
const did = 'did:stack:701012c34fc3c883c4b61dfae06568483c5ae6c81020767ee536a9ba6300792b'

// create a new DID document
const ddo = new DIDDocument({ id: did })

/*
*  "Halt who goes there!"
*  
*  Present an owner with a request for identification.
*  At this point the challenger may also request proof
*  of additional information from an issuer.
*
*  Accepts:
*  Returns: a IdentityRequest object
*/
function request(){
    return "TODO";
}

/*
*  "It is I!"
*
*  After being issued with a challenge, the owner selects
*  the appropriate did document from their wallet and
*  returns the did document along with the challenge
*  response.
*
*  Accepts: IdentityRequest
*  Returns: IdentityResponse
*/
function respond(request){
    // check the signature in the IdentityRequest to make
    // sure that we have a valid request
    if (crypto.verify(request.algorithm,
        request.publicKey,
        request.signature,
        request.message)){
            
            return "TODO";
        }else{
            // throw an error
            throw new InvalidSignatureError("The request has an invalid signature");
        };
}


/*
*  "Let me just check that for you"
*
*  Now the verifier has been returned the challenge and
*  the challenge response they can verify the response.
*
*  Accepts: IdentityRequest, IdentityResponse
*  Returns: Boolean
*/
function check(request,response){
    return "TODO";
}

module.exports = { request, respond, check };