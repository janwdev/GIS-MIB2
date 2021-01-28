namespace Twitter {

    let form: HTMLFormElement = <HTMLFormElement>document.getElementById("form");

    let btSendRegister: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendRegister");
    btSendRegister.addEventListener("click", register);

    let answerSec: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");

    redirectIfLoggedIn();

    function redirectIfLoggedIn(): void {
        let authKey: string = getAuthCode();
        if (authKey != null && authKey.length > 0) {
            window.location.replace("tweet.html");
        }
    }

    async function register(): Promise<void> {
        let formdata: FormData = new FormData(form);
        let request: RequestToServerInterface = {};
        formdata.forEach(function (value: FormDataEntryValue, key: string): void {
            request[key] = value.toString();
        });
        request["command"] = "register";
        let answer: ResponseFromServer = await postToServerWithoutAuth(request);
        if (answer) {
            if ("status" in answer) {
                let status: number = answer.status;
                let message: string = answer.message;
                if (status == 0) {
                    saveAuthCookie(answer.authCookieString);
                    sessionStorage.setItem("email", request["email"]);
                }
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                if (status < 0) {
                    let alert: HTMLDivElement = createAlertElement(message, KEYALERTERROR);
                    answerSec.appendChild(alert);
                } else {
                    let alert: HTMLDivElement = createAlertElement(message, KEYALERTOK);
                    answerSec.appendChild(alert);
                }
            }
        } else {
            console.log("No answer");
        }
    }
}