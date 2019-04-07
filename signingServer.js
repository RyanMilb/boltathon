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

// app.get("/getCredential", function (req, res) {
    
//     res.status(200).send("success");
//   });

async function signMessage(message) {
    const { stdout, stderr } = await exec('lightning-cli listchannels ' + channelId);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    return stdout.length > 0;
}

app.post('/getCredential', async function(request, response){
    let unverifiedChannelId = request.body.channelId;
    console.log(request.body);

//TODO: test this
    let isChannelVerified = await isChannelActive(unverifiedChannelId);
    
    let signedCredential = request.body;

    if (isChannelVerified) {
        response.send(signedCredential);    
    } else {
        response.status(500).send('Channel not found');
    }
    
    response.send(channelList);    // echo the result back but signed
  });

  //curl -vX POST localhost:3001/getCredential -d @tempExampleTemplate.json --header "Content-Type: application/json"
