const { DIDDocument } = require('did-document')
const fs = require('fs')
const chai = require('chai');
const verify = require("../public/verfiy.js");
const IdentityRequest = require("../public/identityRequest.js");
const IdentityResponse = require("../public/identityResponse.js");

function readVar(f){
    fs.readFile(f, 'utf-8', (err,data) => {
        if (err) throw err;
        return data;
    });
}

var testDataDir = './test/data'
var issuerPubKey = readVar(testDataDir + '/secp256k1-issuer.pub');
var issuerPriKey = readVar(testDataDir + '/secp256k1-issuer.key');
var ownerPubKey = readVar(testDataDir + '/secp256k1-owner.pub');
var ownerPriKey = readVar(testDataDir + '/secp256k1-owner.key');
var challengeMessage = readVar(testDataDir + '/challenge.txt');
var challengeSignature = readVar(testDataDir + '/challenge.sig');
var responseMessage = readVar(testDataDir + '/response.txt');
var responseSignature = readVar(testDataDir + '/response.sig');


describe("request",function(){
    it("should return a IdentityRequest object", function(){
        chai.expect(verify.request()).to.be.an.instanceOf(IdentityRequest);
    })
});

describe("respond",function(){
    it("should return an IdentityResponse object", function(){
        chai.expect(verify.request()).to.be.an.instanceOf(IdentityResponse);
    })
});

describe("verify",function(){

    it("should not verify an invalid signature", function(){
        var request = new IdentityRequest("0123456789abcdef",null);
        var response = new IdentityResponse(
            new DIDDocument,
            "mypublickey",
            "0123456789abcdeedcba9876543210",
            "my signature"
        )
        chai.expect(verify.check.bind(request,response)).to.throw(InvalidSignatureError);
    });

    it("should not verify if IdentityRequest wasn't signed with our key", function(){
        var request = new IdentityRequest("0123456789abcdef",null);
        var response = new IdentityResponse(
            new DIDDocument,
            "mypublickey",
            "0123456789abcdeedcba9876543210",
            "my signature"
        )
        chai.expect(verify.check.bind(request,response)).to.throw(InvalidSignatureError);
    });

    it("should not verify if message in IdentityResponse does not begin with the message in IdentityRequest", function(){
        var request = new IdentityRequest("0123456789abcdef",null);
        var response = new IdentityResponse(
            new DIDDocument,
            "mypublickey",
            "0123456789abcdeedcba9876543210",
            "my signature"
        )
        chai.expect(verify.check.bind(request,response)).to.throw(InvalidIdentityRequestError);
    });

});