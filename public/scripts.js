$(document).ready(function () {
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