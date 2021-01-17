namespace Twitter {

    let form: HTMLFormElement = <HTMLFormElement>document.getElementById("form");

    let btSendRegister: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendRegister");
    btSendRegister.addEventListener("click", register);

    let answerSec: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");

    interface ResponseFromServer {
        status: number;
        message: string;
        authCookieString?: string;
        data?: string[];
    }

    async function register(): Promise<void> {
        let formdata: FormData = new FormData(form);
        let request: RequestToServerInterface = {};
        formdata.forEach(function (value: FormDataEntryValue, key: string): void {
            //TODO if key == email schauen ob wirklich email eingegeben wurde
            request[key] = value.toString();
        });
        request["command"] = "register";
        let answer: ResponseFromServer = await postToServerWithoutAuth(request);
        if (answer) {
            if ("status" in answer) {
                let status: number = answer.status;
                let message: string = answer.message;
                let p: HTMLParagraphElement = document.createElement("p");
                p.innerText = message;
                if (status == 0) {
                    saveAuthCookie(answer.authCookieString);
                }
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                answerSec.appendChild(p);
                if (status < 0) {
                    p.style.color = "red";
                } else {
                    p.style.color = "green";
                }
            }
        } else {
            console.log("No answer");
        }
    }
}