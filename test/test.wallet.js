const fs = require('fs');
const chai = require('chai');
const { DIDDocument } = require('did-document');

const IdentityRequest = require("../public/identityRequest");
const IdentityResponse = require("../public/identityResponse");
const Proof = require("../public/proof");
const InvalidSignatureError = require("../public/invalidSignatureError.js");

const PublicKey = require('../public/publicKey.js');

var hashAlgorithm = "SHA256";

let wallets = require("../public/wallet");
let Wallet = wallets.Wallet;

// load test data from file
var testDataDir = './test/data'
// public keys
let issuerPubKey = new PublicKey(fs.readFileSync(testDataDir + '/secp256k1-issuer.pub'),'secp256k1');
let ownerPubKey = new PublicKey(fs.readFileSync(testDataDir + '/secp256k1-owner.pub'),'secp256k1');
let verifierPubKey = new PublicKey(fs.readFileSync(testDataDir + '/secp256k1-verifier.pub'),'secp256k1');
//private keys
var issuerPriKey = fs.readFileSync(testDataDir + '/secp256k1-issuer.key');
var ownerPriKey = fs.readFileSync(testDataDir + '/secp256k1-owner.key');
var verifierPriKey = fs.readFileSync(testDataDir + '/secp256k1-verifier.key');
// messages and signatures
var issuerMessage = fs.readFileSync(testDataDir + '/issuer.txt');
var issuerSignature = fs.readFileSync(testDataDir + '/issuer.sig');

var verifierMessage = fs.readFileSync(testDataDir + '/verifier.txt');
var verifierSignature = fs.readFileSync(testDataDir + '/verifier.sig');

var ownerMessage = fs.readFileSync(testDataDir + '/owner.txt');
var ownerSignature =fs.readFileSync(testDataDir + '/owner.sig');
var ownerInvalidNMessageSame = fs.readFileSync(testDataDir + '/invalid-owner-same.txt');
var ownerInvalidSignatureSame = fs.readFileSync(testDataDir + '/invalid-owner-same.sig');
var ownerInvalidNMessageDiff = fs.readFileSync(testDataDir + '/invalid-owner-diff.txt');
var ownerInvalidSignatureDiff =fs.readFileSync(testDataDir + '/invalid-owner-diff.sig');

describe('hooks', function(){

    let owner = new Wallet(ownerPriKey,ownerPubKey);
    let issuer = new Wallet(issuerPriKey,issuerPubKey);
    let verifier = new Wallet(verifierPriKey,verifierPubKey);

    /*
    *  REQUESTS
    *
    *   Requests are made by the verifier
    */
    //valid proofs
    let validVerifierProof = new Proof(verifierMessage,verifierPubKey,hashAlgorithm,verifierSignature);
    //invalid requests
    let invalidRequestSignature = new Proof(verifierMessage,verifierPubKey,hashAlgorithm,ownerSignature);
    let invalidRequestPubKey = new Proof(verifierMessage,ownerPubKey,hashAlgorithm,verifierSignature);

    /*
    *  RESPONSES
    *
    *   Responses are provided by the owner
    */
    // valid proof
    let validOwnerProof = new Proof(ownerMessage,ownerPubKey,hashAlgorithm,ownerSignature);
    // invalid requests
    let invalidResponseSignature = new Proof(ownerInvalidNMessageSame,verifierPubKey,hashAlgorithm,ownerSignature);

    /*
    *  Responses provided by issuer
    */
    let validIssuerProof = new Proof(issuerMessage,issuerPubKey,hashAlgorithm,issuerSignature);

    before(function(){

    });

    describe("request",function(){
        it("should return a IdentityRequest object", function(){
            //verifier requests a proof
            chai.expect(verifier.request()).to.be.an.instanceOf(IdentityRequest);
        })
    });

    describe("respond",function(){
        it("should return an IdentityResponse object", function(){
            // verifier requests a proof
            let req = new IdentityRequest(validVerifierProof,null);
            //owner responds
            chai.expect(owner.respond(req)).to.be.an.instanceOf(IdentityResponse);
        })
    });

    describe("verify",function(){

        it("should verify a valid IdentityRequest and IdentityResponse without DIDDocument",function(){
            // verifier requests a proof
            let request = new IdentityRequest(validVerifierProof,null);
            // owner reposnds with proof
            let response = new IdentityResponse(validOwnerProof,null);
            // verifier verifies the request and response
            chai.expect(verifier.verify(request,response)).to.equal(true);
        });

        it("should not verify an invalid signature on request", function(){
            // verifier requests a proof
            let request = new IdentityRequest(invalidRequestSignature,null);
            // owner responds
            let response = new IdentityResponse(validOwnerProof,null);
            // verifier verifies the request and response
            chai.expect(verifier.verify.bind(request,response)).to.throw(InvalidSignatureError);
        });

        it("should not verify an invalid signature on response", function(){
            // verifier requests a proof
            let request = new IdentityRequest(validProof,null);
            // owner responds
            let response = new IdentityResponse(invalidSignatureProof,null);
            // verifier verifies the request and response
            chai.expect(verifier.verify.bind(request,response)).to.throw(InvalidSignatureError);
        });

        it("should not verify an invalid signature on request and response", function(){
            // verifier requests a proof
            let request = new IdentityRequest(invalidRequestSignature,null);
            // owner responds
            let response = new IdentityResponse(invalidResponseSignature,null);
            // verifier verifies the request and response
            chai.expect(verifier.verify.bind(request,response)).to.throw(InvalidSignatureError);
        });

        it("should not verify if IdentityRequest wasn't signed with our key", function(){
            // verifier requests a proof
            let request = new IdentityRequest(validIssuerProof,null);
            // owner responds
            let response = new IdentityResponse(validOwnerProof,null);
            // verifier verifies the request and response
            chai.expect(verifier.verify.bind(request,response)).to.throw(InvalidSignatureError);
        });

        it("should not verify if the message in IdentityResponse and IdentityRequest are the same",function(){
            //message should not match the request message
            let invalidResponseMessage = new Proof(ownerMessage,ownerPubKey,hashAlgorithm,ownerSignature);
            // verifier requests a proof
            let request = new IdentityRequest(validOwnerProof,null);
            // owner responds
            let response = new IdentityResponse(invalidResponseMessage,null);
            // verifier verifies the request and response
            chai.expect(verifier.verify.bind(request,response)).to.throw(InvalidMessageError);
        })

        it("should not verify if message in IdentityResponse does not begin with the message in IdentityRequest", function(){
            //message should not match the request message
            let request = new IdentityRequest(validVerifierProof,null);
            //message should not match the request message
            let reponse = new IdentityResponse(invalidOwner,null);
            chai.expect(verifier.verify.bind(request,response)).to.throw(InvalidIdentityRequestError);
        });
    });
});