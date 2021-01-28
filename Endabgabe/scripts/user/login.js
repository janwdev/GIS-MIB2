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
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            let alert = Twitter.createAlertElement(message, Twitter.KEYALERTWARNING);
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
        console.log("Login");
        let formdata = new FormData(form);
        let request = {};
        formdata.forEach(function (value, key) {
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
                    let alert = Twitter.createAlertElement(message, Twitter.KEYALERTERROR);
                    answerSec.appendChild(alert);
                }
                else {
                    let alert = Twitter.createAlertElement(message, Twitter.KEYALERTOK);
                    answerSec.appendChild(alert);
                    let cookieString = answer.authCookieString;
                    Twitter.saveAuthCookie(cookieString);
                    sessionStorage.setItem("email", request["email"]);
                }
            }
        }
        else {
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            let alert = Twitter.createAlertElement("No Answer", Twitter.KEYALERTWARNING);
            answerSec.appendChild(alert);
        }
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=login.js.map