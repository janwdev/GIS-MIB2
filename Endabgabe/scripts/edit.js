"use strict";
var Twitter;
(function (Twitter) {
    let form = document.getElementById("form");
    let btSendEdit = document.getElementById("sendEdit");
    btSendEdit.addEventListener("click", edit);
    let answerSec = document.getElementById("answerSection");
    //TODO Elemente mit Daten von Benutzer fuellen
    async function edit() {
        let formdata = new FormData(form);
        let request = {};
        formdata.forEach(function (value, key) {
            //TODO if key == email schauen ob wirklich email eingegeben wurde
            request[key] = value.toString();
        });
        request["command"] = "edit";
        let answer = await Twitter.postToServer(request);
        if (answer) {
            if ("status" in answer) {
                let status = answer.status;
                let message = answer.message;
                let p = document.createElement("p");
                p.innerText = message;
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
//# sourceMappingURL=edit.js.map