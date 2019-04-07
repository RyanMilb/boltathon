function showProfile(profile) {
  var person = new blockstack.Person(profile)
  console.log('profile ' + JSON.stringify(person))
  document.getElementById('heading-name').innerHTML = 'User:' + person.name();
  // document.getElementById('avatar-image').setAttribute('src', person.avatarUrl())
  document.getElementById('section-1').style.display = 'none';
  document.getElementById('section-2').style.display = 'block';
}

async function fetchUserZoneFileData (blockstackId) {
  // https://registrar.blockstack.org/v1/names/thanks_for_playing.id.blockstack

  fetch(`https://registrar.blockstack.org/v1/names/${blockstackId}.id.blockstack`)
  .then(response => {
    return response.json()
  })
  .then(data => {
    // Work with JSON data here
    console.log(data)
    return data;
  })
  .catch(err => {
    // Do something for an error here
  })

  return 'no data';
}
let globalDid = null;
$(document).ready(async function () {
  console.log('starting test')
  console.log( await fetchUserZoneFileData('thanks_for_playing'))
  console.log('end test')


  if (blockstack.isUserSignedIn()) {

    const userData = blockstack.loadUserData()
    showProfile(userData.profile)
    // globalDid = 
  } else if (blockstack.isSignInPending()) {
    blockstack.handlePendingSignIn()
      .then(userData => {
        showProfile(userData.profile)
      })
  }

  document.getElementById('signin-button').addEventListener('click', function () {
    blockstack.redirectToSignIn()
  })
  document.getElementById('signout-button').addEventListener('click', function () {
    blockstack.signUserOut(window.location.origin)
    document.getElementById('section-2').style.display = 'none'
    document.getElementById('section-1').style.display = 'block'
  })
  $("#btn").click(function (e) {
    var jsonData = {};
    var dataObj;
    var dataArray = $("#myform").serializeArray(),
      dataObj = {};

    $(dataArray).each(function (i, field) {
      dataObj[field.name] = field.value;
    });

    var templateJson = '';
    $.ajaxSetup({
      scriptCharset: "utf-8",
      contentType: "application/json; charset=utf-8"
    });
    $.getJSON('tempExampleTemplate.json', function (data) {
      templateJson = data;
      templateJson.id = 'did:ln:' + dataObj['publicNodeId'];
      templateJson.channelId = dataObj['channelId'];

      console.log(templateJson);
      //download Updated credential
      var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templateJson));
      var dlAnchorElem = document.getElementById('downloadAnchorElem');
      dlAnchorElem.setAttribute("href", dataStr);
      dlAnchorElem.setAttribute("download", "credential.json");
      dlAnchorElem.click();
    });
    e.preventDefault();
  });
});