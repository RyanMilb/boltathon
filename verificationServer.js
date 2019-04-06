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

var server = app.listen(3001, function () {
    console.log("app running on port.", server.address().port);
});

//setting up JS rpc
var grpc = require('grpc');
var fs = require("fs");

// Due to updated ECDSA generated tls.cert we need to let gprc know that
// we need to use that cipher suite otherwise there will be a handhsake
// error when we communicate with the lnd rpc server.
process.env.GRPC_SSL_CIPHER_SUITES = 'HIGH+ECDSA'

//  Lnd cert is at ~/.lnd/tls.cert on Linux and
//  ~/Library/Application Support/Lnd/tls.cert on Mac
var lndCert = fs.readFileSync("~/.lnd/tls.cert");
var credentials = grpc.credentials.createSsl(lndCert);
console.log('1')
var lnrpcDescriptor = grpc.load("rpc.proto");
var lnrpc = lnrpcDescriptor.lnrpc;
var lightning = new lnrpc.Lightning('localhost:10009', credentials);
console.log('2')
let base64EncodedCert = 'LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUI5ekNDQVoyZ0F3SUJBZ0lSQVArajUvcU9XVmV2d0FoU2tTRnRjYTR3Q2dZSUtvWkl6ajBFQXdJd05URWYKTUIwR0ExVUVDaE1XYkc1a0lHRjFkRzluWlc1bGNtRjBaV1FnWTJWeWRERVNNQkFHQTFVRUF4TUpZbTlzZEdGMAphRzl1TUI0WERURTVNRFF3TkRFNU1qYzFOMW9YRFRJd01EVXlPVEU1TWpjMU4xb3dOVEVmTUIwR0ExVUVDaE1XCmJHNWtJR0YxZEc5blpXNWxjbUYwWldRZ1kyVnlkREVTTUJBR0ExVUVBeE1KWW05c2RHRjBhRzl1TUZrd0V3WUgKS29aSXpqMENBUVlJS29aSXpqMERBUWNEUWdBRWgwUS83c3pZYnZpOWgrSFNqVHBxUnJ1bnJlVVZoVytEWTZqcgpDQ1BBdFpMNXFTTlZ0TFBRQ3dnNUI1aTllUXprOTdYT2t2SjVNdDRybVBnS045aVNYS09CalRDQmlqQU9CZ05WCkhROEJBZjhFQkFNQ0FxUXdEd1lEVlIwVEFRSC9CQVV3QXdFQi96Qm5CZ05WSFJFRVlEQmVnZ2xpYjJ4MFlYUm8KYjI2Q0NXeHZZMkZzYUc5emRJSUVkVzVwZUlJS2RXNXBlSEJoWTJ0bGRJY0Vmd0FBQVljUUFBQUFBQUFBQUFBQQpBQUFBQUFBQUFZY0VuZVp1bjRjRUNoTUFCWWNRL29BQUFBQUFBQURzK0dmLy9pZVYzVEFLQmdncWhrak9QUVFECkFnTklBREJGQWlBQzA2S00rVUxLQzA5UjlZd2VFNStPVjJjOGIrWHVlcDRQQjRadDB5ZE9oQUloQUljZElRc1gKR1dzM3MreXBKVXZIeXZkbG5ubkE4SHlSdDNDNXRNN2h5MkJSCi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K';
let base64EncodedMacaroon = 'AgEDbG5kAs8BAwoQuF600/9rMWnHPtgoVmmazhIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaFgoHbWVzc2FnZRIEcmVhZBIFd3JpdGUaFwoIb2ZmY2hhaW4SBHJlYWQSBXdyaXRlGhYKB29uY2hhaW4SBHJlYWQSBXdyaXRlGhQKBXBlZXJzEgRyZWFkEgV3cml0ZRoSCgZzaWduZXISCGdlbmVyYXRlAAAGINnL2Afi1j3mtVMmyGbaUdYjaS55nrWDaAiDaJHwqmGu';
const lnService = require('ln-service');
console.log('3')
const lnd = lnService.lightningDaemon({
  cert: base64EncodedCert,
  macaroon: base64EncodedMacaroon,
  socket: '127.0.0.1:10009',
});
console.log('4')
lnService.getWalletInfo({lnd}, (error, result) => {
  console.log(result);
  console.log(error);
});
console.log('5')
// var lightning = require("bitcoin-lightning-nodejs");
// var request = {
//   msg: 'message1'
// };
// lightning.ln.signMessage(request, function(err, response) {
//   console.log(response);
//   console.log(err);
// });

async function sendChallenge(credential) {
    let nodeId = credential.id;

    const { stdout, stderr } = await exec('lncli --network=testnet listchannels');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    return stdout;
}

//verifying node gets the DID document from provider
app.post('/verifyCredential', async function(request, response){
    let unverifiedCredential = request.body;

    // verifying node challenges provider of document to prove they are the subject (id) in the document : "987638276 sign this message"
    let challengeResults = sendChallenge(request.body)

    let signedCredential = request.body;

    if (isChannelVerified) {
        response.send(signedCredential);    
    } else {
        response.status(500).send('Channel not found');
    }
    
    response.send(channelList);    // echo the result back but signed
  });
