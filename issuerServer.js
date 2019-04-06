var express = require("express");
var bodyParser = require("body-parser");
// var routes = require("./routes/routes.js");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes(app);
//define util function.
const exec = util.promisify(require('child_process').exec);

var server = app.listen(3001, function () {
    console.log("app running on port.", server.address().port);
});

// app.get("/getCredential", function (req, res) {
    
//     res.status(200).send("success");
//   });

async function fetchChannelList() {
    const { stdout, stderr } = await exec('lncli --network=testnet listchannels');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    return stdout;
}

app.post('/getCredential', function(request, response){
    let unverifiedChannelId = request.body.channelId;
    console.log(request.body);      // your JSON

    const util = require('util');
    

    let channelList = fetchChannelList();

    let signedCredential = request.body;
    response.send(channelList);    // echo the result back but signed
  });

  //curl -vX POST localhost:3001/getCredential -d @tempExampleTemplate.json --header "Content-Type: application/json"