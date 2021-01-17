"use strict";
var Twitter;
(function (Twitter) {
    let form = document.getElementById("form");
    let btSendRegister = document.getElementById("sendRegister");
    btSendRegister.addEventListener("click", register);
    let answerSec = document.getElementById("answerSection");
    async function register() {
        let formdata = new FormData(form);
        let request = {};
        formdata.forEach(function (value, key) {
            //TODO if key == email schauen ob wirklich email eingegeben wurde
            request[key] = value.toString();
        });
        request["command"] = "register";
        let answer = await Twitter.postToServerWithoutAuth(request);
        if (answer) {
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
        else {
            console.log("No answer");
        }
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=register.js.map