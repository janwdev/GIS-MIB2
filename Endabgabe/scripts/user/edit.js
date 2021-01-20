"use strict";
var Twitter;
(function (Twitter) {
    let form = document.getElementById("form");
    let btSendEdit = document.getElementById("sendEdit");
    btSendEdit.addEventListener("click", edit);
    let inputLastName = document.getElementsByName("lastname")[0];
    let inputFirstName = document.getElementsByName("firstname")[0];
    let inputEmail = document.getElementsByName("email")[0];
    //Password muss anders geändert werden
    let inputStudyCourse = document.getElementsByName("studycourse")[0];
    let inputSemester = document.getElementsByName("semester")[0];
    let formPWEdit = document.getElementById("editPWForm");
    let btEditPW = document.getElementById("editPassword");
    btEditPW.addEventListener("click", editPW);
    let inputEmailPW = document.getElementsByName("emailPW")[0];
    let answerSec = document.getElementById("answerSection");
    let userEmail = "";
    fillFormWithActData();
    async function fillFormWithActData() {
        let me = await getUserDetailsFromServer();
        if (me != null) {
            inputLastName.value = me.lastname;
            inputFirstName.value = me.firstname;
            inputEmail.value = me.email;
            inputStudyCourse.value = me.studycourse;
            inputSemester.value = me.semester;
            userEmail = me.email;
            inputEmailPW.value = userEmail;
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
            if (request.email == userEmail) {
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
                            p.style.color = "green";
                            removeValuesFromInput();
                            Twitter.deleteAuthCookie(false);
                            if (answer.authCookieString) {
                                Twitter.saveAuthCookie(answer.authCookieString);
                            }
                            fillFormWithActData();
                        }
                    }
                }
                else {
                    console.log("No answer");
                }
            }
            else {
                let p = document.createElement("p");
                p.innerText = "Wrong Email";
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                answerSec.appendChild(p);
                p.style.color = "red";
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
    async function editPW() {
        let formdata = new FormData(formPWEdit);
        let request = {};
        formdata.forEach(function (value, key) {
            //TODO if key == email schauen ob wirklich email eingegeben wurde
            request[key] = value.toString();
        });
        if (request.emailPW && request.oldPW && request.newPW && request.newPW2) {
            if (request.emailPW == userEmail) {
                if (request.newPW == request.newPW2) {
                    request["command"] = "editUserPW";
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
                                p.style.color = "green";
                                Twitter.deleteAuthCookie(true);
                            }
                        }
                    }
                    else {
                        console.log("No answer");
                    }
                }
                else {
                    let p = document.createElement("p");
                    p.innerText = "Passwords need to be the same";
                    while (answerSec.firstChild) {
                        answerSec.removeChild(answerSec.lastChild);
                    }
                    answerSec.appendChild(p);
                    p.style.color = "red";
                }
            }
            else {
                let p = document.createElement("p");
                p.innerText = "Wrong Email";
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                answerSec.appendChild(p);
                p.style.color = "red";
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