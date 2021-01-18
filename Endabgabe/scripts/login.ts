namespace Twitter {

    let form: HTMLFormElement = <HTMLFormElement>document.getElementById("form");

    let btLogin: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendLogin");
    btLogin.addEventListener("click", login);

    let answerSec: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");

    async function login(): Promise<void> {
        // if (getAuthCode().length == 0) {
        console.log("Login");
        let formdata: FormData = new FormData(form);
        let request: RequestToServerInterface = {};
        formdata.forEach(function (value: FormDataEntryValue, key: string): void {
            //TODO if key == email schauen ob wirklich email eingegeben wurde
            request[key] = value.toString();
        });
        request["command"] = "login";
        let answer: ResponseFromServer = await postToServerWithoutAuth(request);
        if (answer) {
            if ("status" in answer) {
                let status: number = <number>answer.status;
                let message: string = <string>answer.message;
                let p: HTMLParagraphElement = document.createElement("p");
                p.innerText = message;
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                answerSec.appendChild(p);
                if (status != 0) {
                    p.style.color = "red";
                } else {
                    p.style.color = "green";
                    let cookieString: string = answer.authCookieString;
                    saveAuthCookie(cookieString);
                }
            }
        } else {
            console.log("No answer");
        }
        // } else {
        //     console.log("Already logged in");
        //     let p: HTMLParagraphElement = document.createElement("p");
        //     p.innerText = "Already logged in";
        //     while (answerSec.firstChild) {
        //         answerSec.removeChild(answerSec.lastChild);
        //     }
        //     answerSec.appendChild(p);
        //     p.style.color = "red";
        // }
    }
}