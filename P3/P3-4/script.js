"use strict";
var P3_4;
(function (P3_4) {
    let url = "http://localhost:8100";
    //let url: string = "https://gis2020jw.herokuapp.com";
    let form = document.getElementById("form");
    let answerSec = document.getElementById("answerSec");
    let btSendPost = document.getElementById("sendPost");
    btSendPost.addEventListener("click", sendPost);
    let btRetrieve = document.getElementById("retrieve");
    btRetrieve.addEventListener("click", retrieve);
    async function retrieve() {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: new URLSearchParams("command=retrieve")
        });
        let json = await response.json();
        console.log("Answer:");
        console.log(json);
        answerSec.innerHTML = "<pre>" + JSON.stringify(json, undefined, 2) + "</pre>";
    }
    async function sendPost() {
        let formdata = new FormData(form);
        let formstring = new URLSearchParams(formdata);
        formstring.append("command", "insert");
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: formstring
        });
        let json = await response.json();
        console.log("Answer:");
        console.log(json);
        answerSec.innerHTML = "<pre>" + JSON.stringify(json, undefined, 2) + "</pre>";
    }
})(P3_4 || (P3_4 = {}));
//# sourceMappingURL=script.js.map