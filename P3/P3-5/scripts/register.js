"use strict";
var P3_5;
(function (P3_5) {
    let url = "http://localhost:8100";
    //let url: string = "https://gis2020jw.herokuapp.com";
    let form = document.getElementById("form");
    let btSendPost = document.getElementById("sendPost");
    btSendPost.addEventListener("click", insertData);
    let answerSec = document.getElementById("answerSection");
    async function insertData() {
        let formdata = new FormData(form);
        let formstring = new URLSearchParams(formdata);
        formstring.append("command", "insert");
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: formstring
        });
        let answer = await response.json();
        if ("status" in answer) {
            let status = answer.status;
            let words = answer.words;
            let p = document.createElement("p");
            p.innerText = words;
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            answerSec.appendChild(p);
            if (status != 0) {
                p.style.color = "red";
            }
            else {
                p.style.color = "green";
            }
        }
    }
})(P3_5 || (P3_5 = {}));
//# sourceMappingURL=register.js.map