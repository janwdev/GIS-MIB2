"use strict";
var P3_5;
(function (P3_5) {
    // let url: string = "http://localhost:8100";
    let url = "https://gis2020jw.herokuapp.com";
    let form = document.getElementById("form");
    let btLogin = document.getElementById("login");
    btLogin.addEventListener("click", login);
    let answerSec = document.getElementById("answerSection");
    async function login() {
        console.log("Login");
        let formdata = new FormData(form);
        let formstring = new URLSearchParams(formdata);
        formstring.append("command", "login");
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
//# sourceMappingURL=login.js.map