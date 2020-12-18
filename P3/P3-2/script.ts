namespace P3_2 {

    //let url: string = "http://localhost:8100";
    let url: string = "https://gis2020jw.herokuapp.com";

    let formData: FormData = new FormData(document.forms[0]);
    let answerSec: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("answerSec");

    let btSend: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendHTML");
    btSend.addEventListener("click", sendHTML);
    let btSendJSON: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendJSON");
    btSendJSON.addEventListener("click", sendJSON);
    let btSendPostJSON: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendPostJSON");
    btSendPostJSON.addEventListener("click", sendPostJSON);

    async function sendHTML(): Promise<void> {
        let response: Response = await send(url + "/html");
        let text: string = await response.text();
        answerSec.innerHTML = "ServerAntwort:<br/>" + text;
    }

    async function sendJSON(): Promise<void> {
        let response: Response = await send(url + "/json");
        let json: JSON = await response.json();
        console.log("Answer:");
        console.log(json);
        answerSec.innerHTML = "<pre>" + JSON.stringify(json, undefined, 2) + "</pre>";
    }

    async function send(_url: string): Promise<Response> {
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        _url = _url + "?" + query.toString();
        let response: Response = await fetch(_url);
        return response;
    }

    async function sendPostJSON(): Promise<void> {
        let data: string = JSON.stringify(Object.fromEntries(formData));
        let response: Response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: data
        });
        let json: JSON = await response.json();
        console.log("Answer:");
        console.log(json);
        answerSec.innerHTML = "<pre>" + JSON.stringify(json, undefined, 2) + "</pre>";

    }
}