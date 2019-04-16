const chai = require('chai');

const Proof = require("../public/proof.js");
const InvalidProofError = require("../public/invalidProofError.js");
const PublicKey = require('../public/publicKey.js');

const TestBuilder = require('./testbuilder.js');

let hashAlgorithm = "SHA256";

describe('Proof', function(){

    before(function(){
        this.testbuilder = new TestBuilder();
    })

        describe("isValid", function(){
        it("should return true for a valid proof",function(){
            let proof = this.testbuilder.getProof("valid");
            chai.expect(proof.isValid()).to.equal(true);
        });
        it("should return false for a invalid public key",function(){
            let proof = this.testbuilder.getProof("invalidPubKey");
            chai.expect(proof.isValid()).to.equal(false);
        });
        it("should return false for a invalid signature",function(){
            let proof = this.testbuilder.getProof("invalidSignature");
            chai.expect(proof.isValid()).to.equal(false);
        });
        it("should return false for a invalid message",function(){
            let proof = this.testbuilder.getProof("invalidMessage");
            chai.expect(proof.isValid()).to.equal(false);
        });
    });
});