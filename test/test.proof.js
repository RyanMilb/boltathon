const fs = require('fs');
const chai = require('chai');

const Proof = require("../public/proof.js");
const InvalidSignatureError = require("../public/invalidSignatureError.js");

const PublicKey = require('../public/publicKey.js');

// load test data from file
var testDataDir = './test/data'
let ownerPubKey = new PublicKey(fs.readFileSync(testDataDir + '/secp256k1-owner.pub'),'secp256k1');
let verifierPubKey = new PublicKey(fs.readFileSync(testDataDir + '/secp256k1-verifier.pub'),'secp256k1');
let challengeMessage = fs.readFileSync(testDataDir + '/challenge.txt');
let challengeSignature = fs.readFileSync(testDataDir + '/challenge.sig');
let hashAlgorithm = "SHA256";

describe('hooks', function(){

    let validProof = new Proof(challengeMessage,issuerPubKey,hashAlgorithm,challengeSignature);
    let invalidPubKeyProof = new Proof(challengeMessage,ownerPubKey,hashAlgorithm,challengeSignature);
    let invalidSignatureProof = new Proof(challengeMessage,issuerPubKey,hashAlgorithm,respondSignature);
    let invalidMessageProof = new Proof(challengeMessage,ownerPubKey,hashAlgorithm,respondSignature);

    describe("_isValidProof", function(){
        it("should return true for a valid proof",function(){
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