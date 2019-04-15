const chai = require('chai');

const Proof = require("../public/proof.js");
const InvalidProofError = require("../public/invalidProofError.js");
const PublicKey = require('../public/publicKey.js');

const TestBuilder = require('./testbuilder.js');

describe("IdentityResponse", function(){

describe("isValid",function(){

        before( function() {
            this.testbuilder = new TestBuilder();
        })

        it("should return true for valid request and proof without DIDDocument", function(){
            // owner reposnds with proof
            response = this.testbuilder.getResponse("valid");
            // verifier verifies the request and response
            chai.expect(response.isValid()).to.equal(true);
        });

        it("should not verify an invalid signature on request", function(){
            response = this.testbuilder.getResponse("invalidRequestSignature");
            // verifier verifies the request and response
            chai.expect(response.isValid()).to.equal(false);
        });

        it("should not verify an invalid signature on response", function(){
            response = this.testbuilder.getResponse("valid");
            // verifier verifies the request and response
            chai.expect(response.isValid()).to.equal(false);
        });

        it("should not verify an invalid signature on request and response", function(){
            response = this.testbuilder.getResponse("valid");
            // verifier verifies the request and response
            chai.expect(response.isValid()).to.equal(false);
        });

        it("should not verify if IdentityRequest wasn't signed with our key", function(){
            response = this.testbuilder.getResponse("valid");
            // verifier verifies the request and response
            chai.expect(response.isValid()).to.equal(false);
        });

        it("should not verify if the message in IdentityResponse and IdentityRequest are the same",function(){
            response = this.testbuilder.getResponse("valid");
            // verifier verifies the request and response
            chai.expect(response.isValid()).to.equal(false);
        })

        it("should not verify if message in IdentityResponse does not begin with the message in IdentityRequest", function(){
            response = this.testbuilder.getResponse("valid");
            // verifier verifies the request and response
            chai.expect(response.isValid()).to.equal(false);
        });
    });
});