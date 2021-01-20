namespace Twitter {

    let form: HTMLFormElement = <HTMLFormElement>document.getElementById("form");
    let btSendEdit: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendEdit");
    btSendEdit.addEventListener("click", edit);

    let inputLastName: HTMLInputElement = <HTMLInputElement>document.getElementsByName("lastname")[0];
    let inputFirstName: HTMLInputElement = <HTMLInputElement>document.getElementsByName("firstname")[0];
    let inputEmail: HTMLInputElement = <HTMLInputElement>document.getElementsByName("email")[0];
    //Password muss anders geändert werden
    let inputStudyCourse: HTMLInputElement = <HTMLInputElement>document.getElementsByName("studycourse")[0];
    let inputSemester: HTMLInputElement = <HTMLInputElement>document.getElementsByName("semester")[0];

    let formPWEdit: HTMLFormElement = <HTMLFormElement>document.getElementById("editPWForm");
    let btEditPW: HTMLButtonElement = <HTMLButtonElement>document.getElementById("editPassword");
    btEditPW.addEventListener("click", editPW);
    let inputEmailPW: HTMLInputElement = <HTMLInputElement>document.getElementsByName("emailPW")[0];

    let answerSec: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");

    let userEmail: string = "";

    fillFormWithActData();

    async function fillFormWithActData(): Promise<void> {
        let me: User = await getUserDetailsFromServer();
        if (me != null) {
            inputLastName.value = me.lastname;
            inputFirstName.value = me.firstname;
            inputEmail.value = me.email;
            inputStudyCourse.value = me.studycourse;
            inputSemester.value = me.semester;
            userEmail = me.email;
            inputEmailPW.value = userEmail;
        } else {
            console.log("Error: Me is null");
        }
    }

    function removeValuesFromInput(): void {
        inputLastName.value = "";
        inputFirstName.value = "";
        inputEmail.value = "";
        inputStudyCourse.value = "";
        inputSemester.value = "";
    }

    async function getUserDetailsFromServer(): Promise<User> {
        let request: RequestToServerInterface = { command: "showUserDetail" };
        let answer: ResponseFromServer = await postToServer(request);
        if (answer) {
            if (answer.users != null && answer.users.length > 0) {
                return answer.users[0];
            } else {
                console.log(answer.message + ", No Users");
            }
        }
        return null;
    }

    async function edit(): Promise<void> {
        let formdata: FormData = new FormData(form);
        let request: RequestToServerInterface = {};
        formdata.forEach(function (value: FormDataEntryValue, key: string): void {
            //TODO if key == email schauen ob wirklich email eingegeben wurde
            request[key] = value.toString();
        });
        if (request.lastname && request.firstname && request.email && request.studycourse && request.semester) {
            if (request.email == userEmail) {
                request["command"] = "editUser";
                let answer: ResponseFromServer = await postToServer(request);
                if (answer) {
                    if ("status" in answer) {
                        let status: number = answer.status;
                        let message: string = answer.message;
                        let p: HTMLParagraphElement = document.createElement("p");
                        p.innerText = message;
                        while (answerSec.firstChild) {
                            answerSec.removeChild(answerSec.lastChild);
                        }
                        answerSec.appendChild(p);
                        if (status < 0) {
                            p.style.color = "red";
                            fillFormWithActData();
                        } else {
                            p.style.color = "green";
                            removeValuesFromInput();
                            deleteAuthCookie(false);
                            if (answer.authCookieString) {
                                saveAuthCookie(answer.authCookieString);
                            }
                            fillFormWithActData();
                        }
                    }
                } else {
                    console.log("No answer");
                }
            } else {
                let p: HTMLParagraphElement = document.createElement("p");
                p.innerText = "Wrong Email";
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                answerSec.appendChild(p);
                p.style.color = "red";
            }

        } else {
            let p: HTMLParagraphElement = document.createElement("p");
            p.innerText = "Need to Fill out all Fields";
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            answerSec.appendChild(p);
            p.style.color = "red";
        }
    }

    async function editPW(): Promise<void> {
        let formdata: FormData = new FormData(formPWEdit);
        let request: RequestToServerInterface = {};
        formdata.forEach(function (value: FormDataEntryValue, key: string): void {
            //TODO if key == email schauen ob wirklich email eingegeben wurde
            request[key] = value.toString();
        });
        if (request.emailPW && request.oldPW && request.newPW && request.newPW2) {
            if (request.emailPW == userEmail) {
                if (request.newPW == request.newPW2) {
                    request["command"] = "editUserPW";
                    let answer: ResponseFromServer = await postToServer(request);
                    if (answer) {
                        if ("status" in answer) {
                            let status: number = answer.status;
                            let message: string = answer.message;
                            let p: HTMLParagraphElement = document.createElement("p");
                            p.innerText = message;
                            while (answerSec.firstChild) {
                                answerSec.removeChild(answerSec.lastChild);
                            }
                            answerSec.appendChild(p);
                            if (status < 0) {
                                p.style.color = "red";
                                fillFormWithActData();
                            } else {
                                p.style.color = "green";
                                deleteAuthCookie(true);
                            }
                        }
                    } else {
                        console.log("No answer");
                    }
                } else {
                    let p: HTMLParagraphElement = document.createElement("p");
                    p.innerText = "Passwords need to be the same";
                    while (answerSec.firstChild) {
                        answerSec.removeChild(answerSec.lastChild);
                    }
                    answerSec.appendChild(p);
                    p.style.color = "red";
                }
            } else {
                let p: HTMLParagraphElement = document.createElement("p");
                p.innerText = "Wrong Email";
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                answerSec.appendChild(p);
                p.style.color = "red";
            }

        } else {
            let p: HTMLParagraphElement = document.createElement("p");
            p.innerText = "Need to Fill out all Fields";
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            answerSec.appendChild(p);
            p.style.color = "red";
        }
    }
}