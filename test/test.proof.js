const fs = require('fs');
const chai = require('chai');

const Proof = require("../public/proof.js");
const InvalidSignatureError = require("../public/invalidSignatureError.js");
const PublicKey = require('../public/publicKey.js');

// load test data from file
var testDataDir = './test/data'
let ownerPubKey = new PublicKey(fs.readFileSync(testDataDir + '/secp256k1-owner.pub'),'secp256k1');
let verifierPubKey = new PublicKey(fs.readFileSync(testDataDir + '/secp256k1-verifier.pub'),'secp256k1');
let verifierMessage = fs.readFileSync(testDataDir + '/verifier.txt');
let verifierSignature = fs.readFileSync(testDataDir + '/verifier.sig');
let ownerMessage = fs.readFileSync(testDataDir + '/owner.txt');
let ownerSignature = fs.readFileSync(testDataDir + '/owner.sig');
let hashAlgorithm = "SHA256";

describe('hooks', function(){

    let validProof = new Proof(verifierMessage,verifierPubKey,hashAlgorithm,verifierSignature);
    let invalidPubKeyProof = new Proof(verifierMessage,ownerPubKey,hashAlgorithm,verifierSignature);
    let invalidSignatureProof = new Proof(verifierMessage,verifierPubKey,hashAlgorithm,ownerSignature);
    let invalidMessageProof = new Proof(verifierMessage,ownerPubKey,hashAlgorithm,ownerSignature);

    describe("isValid", function(){
        it("should return true for a valid proof",function(){
            console.log(validProof);
            chai.expect(validProof.isValid()).to.equal(true);
        });
        it("should return false for a invalid public key",function(){
            chai.expect(invalidPubKeyProof.isValid()).to.equal(false);
        });
        it("should return false for a invalid signature",function(){
            chai.expect(invalidSignatureProof.isValid()).to.equal(false);
        });
        it("should return false for a invalid message",function(){
            chai.expect(invalidMessageProof.isValid()).to.equal(false);
        });
    });
});