namespace Twitter {

    let form: HTMLFormElement = <HTMLFormElement>document.getElementById("form");

    let btSendEdit: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendEdit");
    btSendEdit.addEventListener("click", edit);

    let answerSec: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");

    let inputLastName: HTMLInputElement = <HTMLInputElement>document.getElementsByName("lastname")[0];
    let inputFirstName: HTMLInputElement = <HTMLInputElement>document.getElementsByName("firstname")[0];
    let inputEmail: HTMLInputElement = <HTMLInputElement>document.getElementsByName("email")[0];
    //Password muss anders geändert werden
    let inputStudyCourse: HTMLInputElement = <HTMLInputElement>document.getElementsByName("studycourse")[0];
    let inputSemester: HTMLInputElement = <HTMLInputElement>document.getElementsByName("semester")[0];

    fillFormWithActData();

    async function fillFormWithActData(): Promise<void> {
        let me: User = await getUserDetailsFromServer();
        if (me != null) {
            inputLastName.value = me.lastname;
            inputFirstName.value = me.firstname;
            inputEmail.value = me.email;
            inputStudyCourse.value = me.studycourse;
            inputSemester.value = me.semester;
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
                        p.innerText = message + ", need to Login again";
                        p.style.color = "green";
                        removeValuesFromInput();
                        deleteAuthCookie();
                    }
                }
            } else {
                console.log("No answer");
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