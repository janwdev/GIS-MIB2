"use strict";
var Twitter;
(function (Twitter) {
    let url = "http://localhost:8100";
    //let url: string = "https://gis2020jw.herokuapp.com";
    let form = document.getElementById("form");
    let btSendRegister = document.getElementById("sendRegister");
    btSendRegister.addEventListener("click", register);
    let answerSec = document.getElementById("answerSection");
    async function register() {
        let formdata = new FormData(form);
        let formstring = new URLSearchParams(formdata);
        formstring.append("command", "register");
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
            let message = answer.message;
            let p = document.createElement("p");
            p.innerText = message;
            if (status == 0) {
                Twitter.saveAuthCookie(answer.authCookieString);
            }
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            answerSec.appendChild(p);
            if (status < 0) {
                p.style.color = "red";
            }
            else {
                p.style.color = "green";
            }
        }
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=register.js.map