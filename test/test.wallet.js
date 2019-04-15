const fs = require('fs');
const chai = require('chai');
const { DIDDocument } = require('did-document');

const IdentityRequest = require("../public/identityRequest");
const IdentityResponse = require("../public/identityResponse");
const Proof = require("../public/proof");

const PublicKey = require('../public/publicKey.js');
const TestBuilder = require('./testbuilder.js');

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

describe('wallet', function(){

    before(function(){
        this.wallet = new Wallet(ownerPriKey,ownerPubKey);
        this.testbuilder = new TestBuilder();
    });

    describe("request",function(){
        it("should return a IdentityRequest object", function(){
            //verifier requests a proof
            chai.expect(wallet.request()).to.be.an.instanceOf(IdentityRequest);
        })
    });

    describe("respond",function(){
        it("should return an IdentityResponse object", function(){
            // verifier requests a proof
            let req = this.testbuilder.getRequest("validVerifier");
            //owner responds
            chai.expect(wallet.respond(req)).to.be.an.instanceOf(IdentityResponse);
        })
    });
});