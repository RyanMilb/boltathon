const IdentityRequest = require("./identityRequest.js");
const IdentityResponse = require("./identityResponse.js");
const PublicKey = require("./publicKey.js");
const Proof = require("./proof.js");

const InvalidSignatureError = require("./invalidSignatureError.js");
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
        // TODO create random message
        var message = "0123456789abcde";
        // create proof for request
        var proof = new Proof(message,this.publicKey,Wallet.HASH,null);
        proof = this._sign(proof);
        // choose data to prove
        var data = {};
        // create request
        let req = new IdentityRequest(proof,data);
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
        
        // check signature is valid, else throw an error
        if (request.proof.isValid()){
                // create the response
                // add our part to the message to authenticate ***TODO***
                var message = request.proof.message + "edcba9876543210";
                //create a proof to include in our response
                var proof = new Proof(message,this.publicKey,Wallet.HASH,null);
                // create a message signature
                proof = this._sign(proof);
                // choose our DID Document from the document store ***TODO***
                var doc = new DIDDocument(Wallet.TESTDOCUMENT);
                // compose our response
                var res = new IdentityResponse(proof,doc);
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
    verify(identityResponse){

        let request = identityResponse.request;
        let requestProof = request.proof;
        let responseProof = identityResponse.proof;
        
        // check that we issued the request
        if (requestProof.publicKey == this.publicKey &&
        // check that the request proof is valid
        requestProof.isValid() &&
        // check that the response message includes our request message
        responseProof.message.includes(requestProof.message) &&
        // check that the response proof is valid
        responseProof.isValid()){
            return true;
        } else {
            return false;
        }
    }

    _sign(proof){
        var signer = crypto.createSign(proof.hashAlgorithm);
        signer.write(proof.message);
        signer.end();
        proof.signature = signer.sign(this.privateKey,Wallet.ENCODING);
        return proof;
    }
    
}

Wallet.ENCODING = 'binary';
Wallet.HASH = 'SHA256';
Wallet.EC = 'secp256k1';
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

module.exports = { Wallet : Wallet };