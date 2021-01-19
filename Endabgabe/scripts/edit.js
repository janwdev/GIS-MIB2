"use strict";
var Twitter;
(function (Twitter) {
    let form = document.getElementById("form");
    let btSendEdit = document.getElementById("sendEdit");
    btSendEdit.addEventListener("click", edit);
    let answerSec = document.getElementById("answerSection");
    let inputLastName = document.getElementsByName("lastname")[0];
    let inputFirstName = document.getElementsByName("firstname")[0];
    let inputEmail = document.getElementsByName("email")[0];
    //Password muss anders geändert werden
    let inputStudyCourse = document.getElementsByName("studycourse")[0];
    let inputSemester = document.getElementsByName("semester")[0];
    fillFormWithActData();
    async function fillFormWithActData() {
        let me = await getUserDetailsFromServer();
        if (me != null) {
            inputLastName.value = me.lastname;
            inputFirstName.value = me.firstname;
            inputEmail.value = me.email;
            inputStudyCourse.value = me.studycourse;
            inputSemester.value = me.semester;
        }
        else {
            console.log("Error: Me is null");
        }
    }
    function removeValuesFromInput() {
        inputLastName.value = "";
        inputFirstName.value = "";
        inputEmail.value = "";
        inputStudyCourse.value = "";
        inputSemester.value = "";
    }
    async function getUserDetailsFromServer() {
        let request = { command: "showUserDetail" };
        let answer = await Twitter.postToServer(request);
        if (answer) {
            if (answer.users != null && answer.users.length > 0) {
                return answer.users[0];
            }
            else {
                console.log(answer.message + ", No Users");
            }
        }
        return null;
    }
    async function edit() {
        let formdata = new FormData(form);
        let request = {};
        formdata.forEach(function (value, key) {
            //TODO if key == email schauen ob wirklich email eingegeben wurde
            request[key] = value.toString();
        });
        if (request.lastname && request.firstname && request.email && request.studycourse && request.semester) {
            request["command"] = "editUser";
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
                        fillFormWithActData();
                    }
                    else {
                        p.innerText = message + ", need to Login again";
                        p.style.color = "green";
                        removeValuesFromInput();
                        Twitter.deleteAuthCookie();
                    }
                }
            }
            else {
                console.log("No answer");
            }
        }
        else {
            let p = document.createElement("p");
            p.innerText = "Need to Fill out all Fields";
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            answerSec.appendChild(p);
            p.style.color = "red";
        }
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=edit.js.map