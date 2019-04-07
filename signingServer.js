var express = require("express");
var bodyParser = require("body-parser");
// var routes = require("./routes/routes.js");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes(app);
//define util function.
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const { randomBytes } = require('crypto');
const secp256k1 = require('secp256k1');

const keyName = 'boltathon';
const privFile = keyName + '.key';
const pubFile = keyName + '.pub';

const enc = 'utf-8';

var privateKey, publicKey;

// 
// MANAGE LOCAL KEYS
//
// try and open the private key file
//
try {

    privateKey = fs.readFileSync(privFile, enc);

} catch (e) {

    // create keys if not present
    console.log("Could not find keyfile: " + e);
    // generate privKey
    let privKey
    do {
        privKey = randomBytes(32)
    } while (!secp256k1.privateKeyVerify(privKey));
    console.log("generated keyfile");
    privateKey = privKey;

    // write keyfile
    fs.write(privFile,privKey,enc);

    // generate public key
    genPubKey(privKey);
}

// load the public key from disk.  This is separate as the private
// key may be on disk but not the pub key (for some reason) and we don't
// want to regenerate the private key un-nesseccarily
try {

    publicKey = fs.readFileSync(pubFile, enc);

} catch (e) {

    console.log("public keyfile not found: " + e );
    publicKey = genPubKey(privateKey);

}

function genPubKey(privKey){
    // get the public key in a compressed format
    pubKey = secp256k1.publicKeyCreate(privKey);
    console.log("generated public key");
    fs.write(pubFile,pubKey,enc);
    return pubKey;
}

//
// initialise the HTTP server
//
var server = app.listen(3001, function () {
    console.log("app running on port.", server.address().port);
});


//
// return the public key used for signing
//
async function getPubKey() {
    var fileContents = fs.readFileSync('keys/tls.cert', 'utf8');
    console.log(fileContents);
    return fileContents;
}

//
// sign a message using the local private key
//
async function sign(message,privateKey) {
    // was going to use lncli but verifymessage won't work as you can't specify the public key when verifying message

    // sign the message
    sigObj = secp256k1.sign(message, privateKey)
    console.log('signature:' + sigObj.signature);
    return sigObj.signature;
}

async function verify(message,signature,pubKey) {
    result = secp256k1.verify(message,signature,pubKey);
    console.log('result from verify : ' + result);
    return result;
}

app.post('/getSignature', async function(request, response){
    // read message from post data
    let message = request.body.message;
    console.log(request.body);
    // sign the message
    signature = sign(message);
    // get the public key associated with the signature
    pubKey = getPubKey();
    // create JSON response
    var jsondata = {
	"message" : message,
	"type" : "sha256",
        "publicKey" : pubKey,
	"signature" : signature,
    };
    // send the signature in response
    response.send(jsondata);
  });

app.post('/verify', async function(request, response){
    // read message from post data
    let message = request.body.message;
    let signature = request.body.signature;
    let key = request.body.key;
    console.log(request.body);
    verify(message,signature,key);
});

  //curl -vX POST localhost:3001/getCredential -d @tempExampleTemplate.json --header "Content-Type: application/json"
