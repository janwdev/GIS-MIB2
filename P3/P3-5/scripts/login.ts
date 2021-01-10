namespace P3_5 {

    // let url: string = "http://localhost:8100";
    let url: string = "https://gis2020jw.herokuapp.com";

    let form: HTMLFormElement = <HTMLFormElement>document.getElementById("form");

    let btLogin: HTMLButtonElement = <HTMLButtonElement>document.getElementById("login");
    btLogin.addEventListener("click", login);

    let answerSec: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");

    interface Answer {
        [type: string]: string | number;
    }

    async function login(): Promise<void> {
        console.log("Login");
        let formdata: FormData = new FormData(form);
        let formstring: URLSearchParams = new URLSearchParams(<URLSearchParams>formdata);
        formstring.append("command", "login");
        let response: Response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: formstring
        });
        let answer: Answer = await response.json();
        if ("status" in answer) {
            let status: number = <number>answer.status;
            let words: string = <string>answer.words;
            let p: HTMLParagraphElement = document.createElement("p");
            p.innerText = words;
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            answerSec.appendChild(p);
            if (status != 0) {
                p.style.color = "red";
            } else {
                p.style.color = "green";
            }
        }
    }
}