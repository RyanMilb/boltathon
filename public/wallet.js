const IdentityRequest = require("./identityRequest.js");
const IdentityResponse = require("./identityResponse.js");
const crypto = require("crypto");
const { DIDDocument } = require('did-document');

class Wallet{

    constructor(privateKey,publicKey){
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }

    getPublicKey(){
        return this.publicKey;
    }
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
    request(){
        var req = new IdentityRequest("0123456789abcde",null);
        return req;
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
    respond(request){
        // check the signature in the IdentityRequest to make
        // sure that we have a valid request
        var verifier = crypto.createVerify(request.hashAlgorithm);
        verifier.update(request.message,Wallet.ENCODING);
        verifier.end();
        // check signature is valid, else throw an error
        if (verifier.verify(
            request.publicKey,
            request.signature)){
                // create the response
                // add our part to the message to authenticate ***TODO***
                var message = request.message + "edcba9876543210";
                // create a message signature
                var signer = crypto.createSign(request.hashAlgorithm);
                signer.write(message);
                signer.end();
                var signature = signer.sign(this.privateKey,Wallet.ENCODING);
                // choose our DID Document from the document store ***TODO***
                var doc = new DIDDocument(Wallet.TESTDOCUMENT);
                var res = new IdentityResponse(doc,this.publicKey,message,signature);
                return res;
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
    check(request,response){
        return "TODO";
    };

}

Wallet.ENCODING = 'binary';
Wallet.HASH = 'SHA256';
Wallet.HASH = 'secp256k1';

/*
*  Placing this here for testing
*/
Wallet.TESTDOCUMENT = {
    id: 'did:ara:701012c34fc3c883c4b61dfae06568483c5ae6c81020767ee536a9ba6300792b',
    publicKey: [
        {
            id: 'did:ara:701012c34fc3c883c4b61dfae06568483c5ae6c81020767ee536a9ba6300792b#keys-1',
            publicKeyHex: 'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEiGTUxcFtFEQV/XP4AyLR3AMiVIuV82ItvbttzV8jtr3C+tTX29eApmyh3C7NGzwxOEkP3L+VAgBpetn76w91Pg==',
            type: 'secp256k1'
        },
        {
            id: 'did:ara:701012c34fc3c883c4b61dfae06568483c5ae6c81020767ee536a9ba6300792b#keys-2',
            publicKeyHex: 'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEiGTUxcFtFEQV/XP4AyLR3AMiVIuV82ItvbttzV8jtr3C+tTX29eApmyh3C7NGzwxOEkP3L+VAgBpetn76w91Pg==',
            type: 'secp256k1'
        },
        {
            id: 'did:ara:701012c34fc3c883c4b61dfae06568483c5ae6c81020767ee536a9ba6300792b#keys-3',
            publicKeyHex: 'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEiGTUxcFtFEQV/XP4AyLR3AMiVIuV82ItvbttzV8jtr3C+tTX29eApmyh3C7NGzwxOEkP3L+VAgBpetn76w91Pg==',
            type: 'secp256k1'
        },
        {
            id: 'did:ara:701012c34fc3c883c4b61dfae06568483c5ae6c81020767ee536a9ba6300792b#keys-1',
            publicKeyHex: 'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEiGTUxcFtFEQV/XP4AyLR3AMiVIuV82ItvbttzV8jtr3C+tTX29eApmyh3C7NGzwxOEkP3L+VAgBpetn76w91Pg==',
            type: 'secp256k1'
        }
    ],
    service: [
        {
            id: 'did:ara:701012c34fc3c883c4b61dfae06568483c5ae6c81020767ee536a9ba6300792b;channelId',
            type: 'LightningNetworkChannel.0Service',
            shortChannelId: '1487922x68x1',
            serviceEndpoint: 'https://1ml.com/'
        }
    ]
}
  
module.exports = { Wallet: Wallet };