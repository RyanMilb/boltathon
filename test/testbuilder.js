const fs = require('fs');

const PublicKey = require('../public/publicKey.js');
const Proof = require("../public/proof.js");
const IdentityRequest = require('../public/identityRequest.js');
const IdentityResponse = require('../public/identityResponse.js');
const InvalidProofError = require("../public/invalidProofError.js");

class TestBuilder {

    constructor(){
        // load test data from file
        this.testDataDir = './test/data';

        this.ownerPubKey = new PublicKey(fs.readFileSync(this.testDataDir + '/secp256k1-owner.pub'),'secp256k1');
        this.ownerMessage = fs.readFileSync(this.testDataDir + '/owner.txt');
        this.ownerSignature = fs.readFileSync(this.testDataDir + '/owner.sig');

        this.verifierPubKey = new PublicKey(fs.readFileSync(this.testDataDir + '/secp256k1-verifier.pub'),'secp256k1');
        this.verifierMessage = fs.readFileSync(this.testDataDir + '/verifier.txt');
        this.verifierSignature = fs.readFileSync(this.testDataDir + '/verifier.sig');
        this.hashAlgorithm = "SHA256";
    }

    getProof(type){

        if (type == "valid" || type == "validVerifier"){
            return new Proof(this.verifierMessage,this.verifierPubKey,this.hashAlgorithm,this.verifierSignature);
        } else if (type == "validOwner"){
            return new Proof(this.ownerMessage,this.ownerPubKey,this.hashAlgorithm,this.ownerSignature);
        } else if (type == "invalidPubKey"){
            return new Proof(this.verifierMessage,this.ownerPubKey,this.hashAlgorithm,this.verifierSignature);
        } else if (type == "invalidSignature"){
            return new Proof(this.verifierMessage,this.verifierPubKey,this.hashAlgorithm,this.ownerSignature);
        } else if (type == "invalidMessage"){
            return new Proof(this.verifierMessage,this.ownerPubKey,this.hashAlgorithm,this.ownerSignature);
        } else {
            throw new Error(type + "is not a valid type");
        }

    };

    getRequest(type){

        let request;

        if (type == "valid"){
            return new IdentityRequest(this.getProof("validVerifier"),null);
        } else if(type = "invalidSignature"){
            return new IdentityRequest(this.getProof("invalidSignature"),null);
        } else {
            throw new Error(type + "is not a valid type");
        }

    };

    getResponse(type){

        if (type == "valid"){
            return new IdentityResponse(
                this.getRequest("valid"),
                this.getProof("validOwner"),
                null
            );
        } else if (type = "invalidRequestSignature"){
            return new IdentityResponse(
                this.getRequest("invalidSignature"),
                this.getProof("valid")
            )
        } else {
            throw new Error(type + "is not a valid type");
        };
    };
}

module.exports = TestBuilder;