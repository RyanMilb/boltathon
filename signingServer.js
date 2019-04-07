var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes(app);
//define util function.
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const crypto = require('crypto');
const { randomBytes } = require('crypto');
const secp256k1 = require('secp256k1');

const keyName = 'boltathon';
const privFile = keyName + '.key';
const pubFile = keyName + '.pub';

const enc = 'utf-8';
const hashAlgo = 'md5';

async function getPrivateKey() {
    //
    // try and open the private key file
    //
    var privateKey;

    try {

        privateKey = fs.readFileSync(privFile);

    } catch (e) {

        // create keys if not present
        console.log("Could not find keyfile: " + e);
        // generate privKey
        do {
            privateKey = randomBytes(32)
        } while (!secp256k1.privateKeyVerify(privateKey));

        console.log("generated keyfile");

        // write keyfile
        fs.writeFileSync(privFile,privateKey);

        // delete existing public key
        try {
    	    fs.unlinkSync(pubFile);
        } catch (e) {
            console.log("Can't delete public key as does not exist");
        }

    }

    var buf = Buffer.from(privateKey);
    console.log('buffer: ' + buf.toString('utf8'));

    return buf;
}

async function getPublicKey() {
    // load the public key from disk.  This is separate as the private
    // key may be on disk but not the pub key (for some reason) and we don't
    // want to regenerate the private key un-nesseccarily

    var publicKey;

    try {

        publicKey = fs.readFileSync(pubFile);

    } catch (e) {

        console.log("public keyfile not found: " + e );
	//read the private key from disk
        var privateKey = await getPrivateKey();
	console.log("Private key loaded " + privateKey);
        //generate public key
        publicKey = secp256k1.publicKeyCreate(privateKey);
        console.log("generated public key");
        //write public key to disk
        fs.writeFileSync(pubFile,publicKey);

    }

    return Buffer.from(publicKey);

}

//
// initialise the HTTP server
//
var server = app.listen(3001, function () {
    console.log("app running on port.", server.address().port);
});


//
// sign a message using the local private key
//
async function sign(message) {
    // was going to use lncli but verifymessage won't work as you can't specify the public key when verifying message
    console.log("message: " + message);
    var h = hash(message);
    var buf = Buffer.from(h);
    // read the private key from file
    var privateKey = await getPrivateKey();
    // sign the message
    sigObj = secp256k1.sign(buf, privateKey);
    signature = sigObj.signature.toString();
    console.log('signature:' + signature);
    return signature;
}

//
// given a message, signature and public key verify that the signature is valid
//
async function verify(message,signature,pubKey) {
    var h = hash(message);
    result = secp256k1.verify(h,signature,pubKey);
    console.log('result from verify : ' + result);
    return result;
}

function hash(message) {
    // need to hash the message down to 32 characters
    var h = crypto.createHash(hashAlgo).update(message).digest('hex');
    console.log("message hash: " + h);
    return h;
}

app.post('/getSignature', async function(request, response){
    // read message from post data
    let message = JSON.stringify(request.body);
    console.log(message);
    // sign the message
    var h = hash(message);
    signature = sign(h);
    // get the public key associated with the signature
    pubKey = getPublicKey();
    // create JSON response
    var jsondata = {
	"message" : message,
	"type" : hashAlgo,
        "publicKey" : pubKey,
	"signature" : signature,
    };
    // send the signature in response
    response.send(jsondata);
  });

app.post('/verify', async function(request, response){
    // read message from post data
    let message = Buffer.from(request.body.message);
    let signature = request.body.signature;
    let key = request.body.key;
    console.log(request.body);
    var jsondata = {
      "message" : message,
      "publicKey" : key,
      "type" : hashAlgo,
      "signature" : signature,
      "isValid" : verify(message,signature,key)
    };
    response.send(jsondata);
});

  //curl -vX POST localhost:3001/getCredential -d @tempExampleTemplate.json --header "Content-Type: application/json"
  //curl -vX POST 139.59.213.116:3001/getSignature -d @tempExampleTemplate.json --header "Content-Type: application/json"
