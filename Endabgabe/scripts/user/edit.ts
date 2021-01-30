namespace Twitter {

    let form: HTMLFormElement = <HTMLFormElement>document.getElementById("form");
    let btSendEdit: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendEdit");
    btSendEdit.addEventListener("click", edit);

    let inputLastName: HTMLInputElement = <HTMLInputElement>document.getElementsByName("lastname")[0];
    let inputFirstName: HTMLInputElement = <HTMLInputElement>document.getElementsByName("firstname")[0];
    let inputEmail: HTMLInputElement = <HTMLInputElement>document.getElementsByName("email")[0];
    let inputStudyCourse: HTMLInputElement = <HTMLInputElement>document.getElementsByName("studycourse")[0];
    let inputSemester: HTMLInputElement = <HTMLInputElement>document.getElementsByName("semester")[0];
    let inputProfPic: HTMLInputElement = <HTMLInputElement>document.getElementsByName("profPic")[0];

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
            if (me.pictureLink) {
                inputProfPic.value = me.pictureLink;
            }
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
        inputProfPic.value = "";
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
                        while (answerSec.firstChild) {
                            answerSec.removeChild(answerSec.lastChild);
                        }
                        if (status < 0) {
                            let alert: HTMLDivElement = createAlertElement(message, KEYALERTERROR);
                            answerSec.appendChild(alert);
                            fillFormWithActData();
                        } else {
                            let alert: HTMLDivElement = createAlertElement(message, KEYALERTOK);
                            answerSec.appendChild(alert);
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
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                let alert: HTMLDivElement = createAlertElement("Wrong Email", KEYALERTERROR);
                answerSec.appendChild(alert);
            }

        } else {
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            let alert: HTMLDivElement = createAlertElement("Need to Fill out all Fields", KEYALERTERROR);
            answerSec.appendChild(alert);
        }
    }

    async function editPW(): Promise<void> {
        let formdata: FormData = new FormData(formPWEdit);
        let request: RequestToServerInterface = {};
        formdata.forEach(function (value: FormDataEntryValue, key: string): void {
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
                            while (answerSec.firstChild) {
                                answerSec.removeChild(answerSec.lastChild);
                            }
                            if (status < 0) {
                                let alert: HTMLDivElement = createAlertElement(message, KEYALERTERROR);
                                answerSec.appendChild(alert);
                                fillFormWithActData();
                            } else {
                                let alert: HTMLDivElement = createAlertElement(message, KEYALERTOK);
                                answerSec.appendChild(alert);
                                deleteAuthCookie(true);
                            }
                        }
                    } else {
                        console.log("No answer");
                    }
                } else {
                    while (answerSec.firstChild) {
                        answerSec.removeChild(answerSec.lastChild);
                    }
                    let alert: HTMLDivElement = createAlertElement("Passwords need to be the same", KEYALERTERROR);
                    answerSec.appendChild(alert);
                }
            } else {
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                let alert: HTMLDivElement = createAlertElement("Wrong Email", KEYALERTERROR);
                answerSec.appendChild(alert);
            }

        } else {
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            let alert: HTMLDivElement = createAlertElement("Need to Fill out all Fields", KEYALERTERROR);
            answerSec.appendChild(alert);
        }
    }
}