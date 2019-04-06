var express = require("express");
var bodyParser = require("body-parser");
// var routes = require("./routes/routes.js");
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes(app);

var server = app.listen(3001, function () {
    console.log("app running on port.", server.address().port);
});

// app.get("/getCredential", function (req, res) {
    
//     res.status(200).send("success");
//   });

app.post('/getCredential', function(request, response){
    let unverifiedChannelId = request.body.channelId;
    console.log(request.body);      // your JSON

    const util = require('util');
    const exec = util.promisify(require('child_process').exec);

    async function ls() {
        const { stdout, stderr } = await exec('lncli --network=testnet listchannels');
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
    }

    let signedCredential = request.body;
    response.send(stdout);    // echo the result back but signed
  });

  //curl -vX POST localhost:3001/getCredential -d @tempExampleTemplate.json --header "Content-Type: application/json"