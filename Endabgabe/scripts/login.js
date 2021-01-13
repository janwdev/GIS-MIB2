"use strict";
var Twitter;
(function (Twitter) {
    let url = "http://localhost:8100";
    //let url: string = "https://gis2020jw.herokuapp.com";
    let form = document.getElementById("form");
    let btLogin = document.getElementById("sendLogin");
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
            let message = answer.message;
            let p = document.createElement("p");
            p.innerText = message;
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            answerSec.appendChild(p);
            if (status != 0) {
                p.style.color = "red";
            }
            else {
                p.style.color = "green";
                let cookieString = answer.authCookieString;
                Twitter.saveAuthCookie(cookieString);
            }
        }
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=login.js.map