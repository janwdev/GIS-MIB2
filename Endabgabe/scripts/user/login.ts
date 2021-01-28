namespace Twitter {

    let form: HTMLFormElement = <HTMLFormElement>document.getElementById("form");

    let btLogin: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendLogin");
    btLogin.addEventListener("click", login);

    let answerSec: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");

    redirectIfLoggedIn();
    showMessageIfWasRedirected();

    function showMessageIfWasRedirected(): void {
        let message: string = sessionStorage.getItem(KEYLOGINREDIRECTMESSAGE);
        if (message) {
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            let alert: HTMLDivElement = createAlertElement(message, KEYALERTWARNING);
            answerSec.appendChild(alert);
        }
    }

    function redirectIfLoggedIn(): void {
        let authKey: string = getAuthCode();
        if (authKey != null && authKey.length > 0) {
            window.location.replace("tweet.html");
        }
    }

    async function login(): Promise<void> {
        console.log("Login");
        let formdata: FormData = new FormData(form);
        let request: RequestToServerInterface = {};
        formdata.forEach(function (value: FormDataEntryValue, key: string): void {
            request[key] = value.toString();
        });
        request["command"] = "login";
        let answer: ResponseFromServer = await postToServerWithoutAuth(request);
        if (answer) {
            if ("status" in answer) {
                let status: number = <number>answer.status;
                let message: string = <string>answer.message;
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                if (status != 0) {
                    let alert: HTMLDivElement = createAlertElement(message, KEYALERTERROR);
                    answerSec.appendChild(alert);
                } else {
                    let alert: HTMLDivElement = createAlertElement(message, KEYALERTOK);
                    answerSec.appendChild(alert);
                    let cookieString: string = answer.authCookieString;
                    saveAuthCookie(cookieString);
                    sessionStorage.setItem("email", request["email"]);
                }
            }
        } else {
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            let alert: HTMLDivElement = createAlertElement("No Answer", KEYALERTWARNING);
            answerSec.appendChild(alert);
        }
    }
}