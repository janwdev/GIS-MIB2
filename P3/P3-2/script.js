"use strict";
var P3_2;
(function (P3_2) {
    let formData = new FormData(document.forms[0]);
    let btSend = document.getElementById("send");
    btSend.addEventListener("click", send);
    async function send() {
        //let url: string = "https://gis2020jw.herokuapp.com/";
        let url = "http://localhost:8100/";
        let query = new URLSearchParams(formData);
        url = url + "?" + query.toString();
        let response = await fetch(url);
        let text = await response.text();
        console.log("Answer:");
        console.log(text);
    }
})(P3_2 || (P3_2 = {}));
//# sourceMappingURL=script.js.map