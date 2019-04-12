const fs = require('fs');
const chai = require('chai');

const IdentityRequest = require("../public/identityRequest.js");
const IdentityResponse = require("../public/identityResponse.js");

var testDataDir = './test/data'
var issuerPubKey = fs.readFileSync(testDataDir + '/secp256k1-issuer.pub');
var issuerPriKey = fs.readFileSync(testDataDir + '/secp256k1-issuer.key');
var ownerPubKey = fs.readFileSync(testDataDir + '/secp256k1-owner.pub');
var ownerPriKey = fs.readFileSync(testDataDir + '/secp256k1-owner.key');
var challengeMessage = fs.readFileSync(testDataDir + '/challenge.txt');
var challengeSignature = fs.readFileSync(testDataDir + '/challenge.sig');
var responseMessage = fs.readFileSync(testDataDir + '/response.txt');
var responseSignature =fs.readFileSync(testDataDir + '/response.sig');
var hashAlgorithm = "SHA256";

let wallets = require("../public/wallet");
let Wallet = wallets.Wallet;

const { DIDDocument } = require('did-document');


describe('hooks', function(){

    let owner = new Wallet(ownerPriKey,ownerPubKey);
    let issuer = new Wallet(issuerPriKey,issuerPubKey);

    before(function(){

    });

    describe("request",function(){
        it("should return a IdentityRequest object", function(){
            chai.expect(issuer.request()).to.be.an.instanceOf(IdentityRequest);
        })
    });

    describe("respond",function(){
        it("should return an IdentityResponse object", function(){
            var req = new IdentityRequest(challengeMessage,issuer.getPublicKey(),hashAlgorithm,challengeSignature,null);
            console.log(req);
            chai.expect(owner.respond(req)).to.be.an.instanceOf(IdentityResponse);
        })
    });

    describe("check",function(){

        it("should not verify an invalid signature", function(){
            var request = new IdentityRequest("0123456789abcdef",null);
            var response = new IdentityResponse(
                new DIDDocument(Wallet.TESTDOCUMENT),
                "mypublickey",
                "0123456789abcdeedcba9876543210",
                "my signature"
            )
            chai.expect(issuer.check.bind(request,response)).to.throw(InvalidSignatureError);
        });

        it("should not verify if IdentityRequest wasn't signed with our key", function(){
            var request = new IdentityRequest("0123456789abcdef",null);
            var response = new IdentityResponse(
                new DIDDocument,
                "mypublickey",
                "0123456789abcdeedcba9876543210",
                "my signature"
            )
            chai.expect(issuer.check.bind(request,response)).to.throw(InvalidSignatureError);
        });

        it("should not verify if message in IdentityResponse does not begin with the message in IdentityRequest", function(){
            var request = new IdentityRequest("0123456789abcdef",null);
            var response = new IdentityResponse(
                new DIDDocument,
                "mypublickey",
                "0123456789abcdeedcba9876543210",
                "my signature"
            )
            chai.expect(issuer.check.bind(request,response)).to.throw(InvalidIdentityRequestError);
        });
    });
});