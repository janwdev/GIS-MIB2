"use strict";
var Twitter;
(function (Twitter) {
    let form = document.getElementById("form");
    let btSendRegister = document.getElementById("sendRegister");
    btSendRegister.addEventListener("click", register);
    let answerSec = document.getElementById("answerSection");
    redirectIfLoggedIn();
    function redirectIfLoggedIn() {
        let authKey = Twitter.getAuthCode();
        if (authKey != null && authKey.length > 0) {
            window.location.replace("tweet.html");
        }
    }
    async function register() {
        let formdata = new FormData(form);
        let request = {};
        formdata.forEach(function (value, key) {
            request[key] = value.toString();
        });
        request["command"] = "register";
        let answer = await Twitter.postToServerWithoutAuth(request);
        if (answer) {
            if ("status" in answer) {
                let status = answer.status;
                let message = answer.message;
                if (status == 0) {
                    Twitter.saveAuthCookie(answer.authCookieString);
                    sessionStorage.setItem("email", request["email"]);
                }
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                if (status < 0) {
                    let alert = Twitter.createAlertElement(message, Twitter.KEYALERTERROR);
                    answerSec.appendChild(alert);
                }
                else {
                    let alert = Twitter.createAlertElement(message, Twitter.KEYALERTOK);
                    answerSec.appendChild(alert);
                }
            }
        }
        else {
            console.log("No answer");
        }
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=register.js.map