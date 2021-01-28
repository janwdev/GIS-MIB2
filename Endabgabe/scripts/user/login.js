"use strict";
var Twitter;
(function (Twitter) {
    let form = document.getElementById("form");
    let btLogin = document.getElementById("sendLogin");
    btLogin.addEventListener("click", login);
    let answerSec = document.getElementById("answerSection");
    redirectIfLoggedIn();
    showMessageIfWasRedirected();
    function showMessageIfWasRedirected() {
        let message = sessionStorage.getItem(Twitter.KEYLOGINREDIRECTMESSAGE);
        if (message) {
            let alert = Twitter.createAlertElement(message, true);
            answerSec.appendChild(alert);
        }
    }
    function redirectIfLoggedIn() {
        let authKey = Twitter.getAuthCode();
        if (authKey != null && authKey.length > 0) {
            window.location.replace("tweet.html");
        }
    }
    async function login() {
        // if (getAuthCode().length == 0) {
        console.log("Login");
        let formdata = new FormData(form);
        let request = {};
        formdata.forEach(function (value, key) {
            //TODO if key == email schauen ob wirklich email eingegeben wurde
            request[key] = value.toString();
        });
        request["command"] = "login";
        let answer = await Twitter.postToServerWithoutAuth(request);
        if (answer) {
            if ("status" in answer) {
                let status = answer.status;
                let message = answer.message;
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                if (status != 0) {
                    let alert = Twitter.createAlertElement(message, true);
                    answerSec.appendChild(alert);
                }
                else {
                    let alert = Twitter.createAlertElement(message, false);
                    answerSec.appendChild(alert);
                    let cookieString = answer.authCookieString;
                    Twitter.saveAuthCookie(cookieString);
                    sessionStorage.setItem("email", request["email"]);
                }
            }
        }
        else {
            console.log("No answer");
        }
        // } else {
        //     console.log("Already logged in");
        //     let p: HTMLParagraphElement = document.createElement("p");
        //     p.innerText = "Already logged in";
        //     while (answerSec.firstChild) {
        //         answerSec.removeChild(answerSec.lastChild);
        //     }
        //     answerSec.appendChild(p);
        //     p.style.color = "red";
        // }
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=login.js.map