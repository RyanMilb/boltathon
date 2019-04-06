const Twitter = require('twitter');
const config = require('./config.js');
const fetch = require('node-fetch');
const fs = require('fs')
const path = require('path')

const text = fs.readFileSync(path.resolve(__dirname, 'output6.txt'), 'utf8')

let T = new Twitter(config);

async function testFetch() {
    console.log('Starting Fetch Test')
    fetch("https://tippin.me/buttons/send-lite.php?u=LightningK0ala&eh=yes&t=1098692883056652288", {"credentials":"include","headers":{"accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8","accept-language":"en-US,en;q=0.9","cache-control":"max-age=0","upgrade-insecure-requests":"1"},"referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"})

    .then(res => {
        console.log('res: ' + JSON.stringify(res))
        console.log('pulled this: ' + pullUserIdFromResponse(res))
    })

}
testFetch();

var params = {
    q: '#bitcoin #stackingsats',
    count: 1,
    result_type: 'recent',
    lang: 'en'
}
function pullUserIdFromResponse(blob) {
    console.log('blog recieved: ' + JSON.stringify(blob))
    const re = new RegExp('(var_userid = )[0-9]+');
    let result = re.exec(blob);
    const formattedResult = result ? result.toString().substring(13, 17) : "";
    console.log('PulledUserId: ' + formattedResult)
    return formattedResult;
}
function fetchInvoice(userName, twitterUserId, tweetId) {

    console.log('Fetching Invoice for: userId: ' + twitterUserId + " userName: " + userName + " tweetId: " + tweetId)
    //Ajax request
    let tippinUserId = '';

    
    fetch('https://tippin.me/@' + userName, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(res => {
            tippinUserId = pullUserIdFromResponse(res)
            const body = {
                userid: pullUserIdFromResponse(res),
                username: userName,
                istaco: 0,
                tweet: 0,
            };

            console.log(body)

            fetch("https://tippin.me/lndreq/newinvoice.php",
            {
                "credentials": "include", "headers":
                    { "accept": "application/json, text/javascript, */*; q=0.01", "accept-language": "en-US,en;q=0.9", "content-type": "application/x-www-form-urlencoded; charset=UTF-8", "x-requested-with": "XMLHttpRequest" }
                    , "referrer": "https://tippin.me/buttons/send-lite.php?u=Prediction_Feed&eh=yes&t=1099212914022440961", "referrerPolicy": "no-referrer-when-downgrade", "body": "userid="+ userId +"&username=" + userName + "&istaco=0&tweet=0", "method": "POST", "mode": "cors"
            })
                .then(res => res.json())
                .then(json => console.log(json.message));
        })


    //THEN PAY INVOICE 
}

function payInvoice(invoice) {
    request({
        method: 'POST',
        url: 'https://dev-api.opennode.co/v1/withdrawals',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': config.open_node_secret
        },
        body: JSON.stringify({ type: "ln", address: invoice })
    }, function (error, response, body) {
        if (error) { return console.log(error); }

        console.log('Status:', response.statusCode);
        console.log('Headers:', JSON.stringify(response.headers));
        console.log('Response:', body);
        if (response.statusCode === 201) {
            console.log('Success in paying InvoiceId: ' + inputs.invoiceId)
        } else {
            return response
        }
    });
}
console.log('Starting Tweet Search')
// T.get('search/tweets', params, async function (err, data, response) {
//     if (!err) {
//         console.log('Found : ' + data.statuses.length)

//         // Loop through the returned tweets
//         for (let i = 0; i < data.statuses.length; i++) {
//             console.log('Found : ' + data.statuses.length)
//             // Get the tweet Id from the returned data
//             let id = { id: data.statuses[i].id_str }
//             // Try to Favorite the selected Tweet
//             T.post('favorites/create', id, function (err, response) {
//                 // If the favorite fails, log the error message
//                 if (err) {
//                     console.log('Failure to Fav')
//                     console.log(err[0].message);
//                 }
//                 // If the favorite is successful, log the url of the tweet
//                 else {
//                     //https://tippin.me/buttons/send-lite.php?u=ryanmilb
//                     let userName = response.user.screen_name;
//                     let tweetId = response.id_str;
//                     let userId = response.user.id;
//                     //console.log('Succes: Name: ' + JSON.stringify(response));
//                     fetchInvoice(userName, userId, tweetId)
//                     console.log('executed once, exiting...')
//                     return;
//                 }

//             });

//         }
//     } else {
//         console.log(err);
//     }
// })

