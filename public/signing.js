$(document).ready(function () {

    //on button click
    $("#btn").click(function (e) {

	//initialize data
        var jsonData = {};
        var dataObj;

	//extract the form data
        var dataArray = $("#myform").serializeArray(),
            dataObj = {};

	// for each form field
        $(dataArray).each(function (i, field) {
            dataObj[field.name] = field.value;
        });

	
	// create JSON
        var documentJson = JSON.parse(dataObj['json']);
	
	console.log(documentJson);

	// add signers public key
        documentJson.publicKey.push({
		"id": dataObj['did'] + "#keys-1",
		"publicKeyHex": dataObj['pubKey'],
		"type": "secp256k1"
	});

	var signature = "placeholder signature";
	//var created = $.datepicker.formatDate("YYYY-MM-DDThh:mm:ssZ", new Date());
	var created = new Date().toJSON();

        documentJson['proof'] = {
		"type" : "LinkedDataSignature2015",
        	"created" : created,
        	"creator" : dataObj['did'],
        	"signatureValue" : signature
	};
            
        console.log(documentJson);

        //download Updated credential
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(documentJson));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "signed-credential.json");
        dlAnchorElem.click();

        e.preventDefault();
    });

});
