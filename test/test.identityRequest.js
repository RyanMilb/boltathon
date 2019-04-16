const chai = require('chai');

const Proof = require("../public/proof.js");
const InvalidProofError = require("../public/invalidProofError.js");
const PublicKey = require('../public/publicKey.js');

const TestBuilder = require('./testbuilder.js');

describe("IdentityRequest",function(){

    describe("isValid", function(){
        before( function() {
            this.testbuilder = new TestBuilder();
        })

        it("should return true for valid proof", function(){
            // owner reposnds with proof
            request = this.testbuilder.getRequest("valid");
            // verifier verifies the request and response
            chai.expect(request.isValid()).to.equal(true);
        });

    });
    
});
