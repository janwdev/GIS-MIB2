"use strict";
var P3_2;
(function (P3_2) {
    let url = "http://localhost:8100";
    //let url: string = "https://gis2020jw.herokuapp.com";
    let formData = new FormData(document.forms[0]);
    let answerSec = document.getElementById("answerSec");
    let btSend = document.getElementById("sendHTML");
    btSend.addEventListener("click", sendHTML);
    let btSendJSON = document.getElementById("sendJSON");
    btSendJSON.addEventListener("click", sendJSON);
    async function sendHTML() {
        let response = await send(url + "/html");
        let text = await response.text();
        answerSec.innerHTML = "ServerAntwort:<br/>" + text;
    }
    async function sendJSON() {
        let response = await send(url + "/json");
        let json = await response.json();
        console.log("Answer:");
        console.log(json);
        answerSec.innerHTML = "<pre>" + JSON.stringify(json, undefined, 2) + "</pre>";
    }
    async function send(_url) {
        let query = new URLSearchParams(formData);
        _url = _url + "?" + query.toString();
        let response = await fetch(_url);
        return response;
    }
})(P3_2 || (P3_2 = {}));
//# sourceMappingURL=script.js.map