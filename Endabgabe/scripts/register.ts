namespace Twitter {

    let url: string = "http://localhost:8100";
    //let url: string = "https://gis2020jw.herokuapp.com";

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
        let formstring: URLSearchParams = new URLSearchParams(<URLSearchParams>formdata);
        formstring.append("command", "register");
        let response: Response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: formstring
        });
        let answer: ResponseFromServer = await response.json();
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
    }
}