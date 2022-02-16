(function () {
    /**
     * Check and set a global guard variable.
     * This will stop injecting this content script twice
     */
    if (window.hasRun) {
        return;
    }
    window.hasRun = true;

    document.addEventListener('DOMContentLoaded', function () {
        if (localStorage["spfxPatronPortNumber"] == undefined || localStorage["spfxPatronPortNumber"] == '')
            document.getElementById("port").defaultValue = "4321";
        else
            document.getElementById("port").defaultValue = localStorage["spfxPatronPortNumber"];
        var reloadButton = document.getElementById('btnReload');
        reloadButton.addEventListener('click', function () {
            document.getElementById("port").defaultValue = localStorage["spfxPatronPortNumber"];
            let portNumber = document.getElementById("port").value;
            localStorage["spfxPatronPortNumber"] = portNumber;
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function (arrayOfTabs) {
                let code;
                //get seperator based on the actual page url, if url contains query string paramenter, use & as seperator else use ?
                let seperator = arrayOfTabs[0].url.indexOf("?") == -1 ? "?" : (arrayOfTabs[0].url.indexOf("?loadSPFX") == -1 ? "&" : "?");
                //generate localSPFX url using seperator and port number
                let _localDebuggingUrl = "" + seperator + "loadSPFX=true&debugManifestsFile=https://localhost:" + portNumber + "/temp/manifests.js";
                //check if the url already has the loadSPFX parameter
                if (arrayOfTabs[0].url.indexOf(_localDebuggingUrl) == -1) {

                    let checkIfLoadSPFxIsInURL = seperator + "loadSPFX=true";
                    let pageUrl = arrayOfTabs[0].url.split(checkIfLoadSPFxIsInURL)[0]; // get the url without loadSPFX parameter
                    code = 'window.location.href= "' + pageUrl + '' + seperator + 'loadSPFX=true&debugManifestsFile=https://localhost:' + portNumber + '/temp/manifests.js";';

                }
                //if the url already has the loadSPFX parameter and the port number is not changed, just reload the page
                else {
                    code = 'window.location.reload();';
                }
                chrome.tabs.executeScript(arrayOfTabs[0].id, {
                    code: code
                });
            });

        }, false);
    }, false);
})();
/**
 * @ SPFx Patron v2.0
 * https://github.com/prauveenn/SPFx-Patron/blob/master/README.md
 * (c) 2022 Praveen Kanamarlapudi
 */