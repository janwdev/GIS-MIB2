namespace P3_4 {

    let url: string = "http://localhost:8100";
    //let url: string = "https://gis2020jw.herokuapp.com";

    let form: HTMLFormElement = <HTMLFormElement>document.getElementById("form");
    let answerSec: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("answerSec");

    let btSendPost: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendPost");
    btSendPost.addEventListener("click", sendPost);

    let btRetrieve: HTMLButtonElement = <HTMLButtonElement>document.getElementById("retrieve");
    btRetrieve.addEventListener("click", retrieve);

    async function retrieve(): Promise<void> {
        let response: Response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: new URLSearchParams("command=retrieve")
        });
        let json: JSON = await response.json();
        console.log("Answer:");
        console.log(json);
        answerSec.innerHTML = "<pre>" + JSON.stringify(json, undefined, 2) + "</pre>";

    }

    async function sendPost(): Promise<void> {
        let formdata: FormData = new FormData(form);
        let formstring: URLSearchParams = new URLSearchParams(<URLSearchParams>formdata);
        formstring.append("command", "insert");
        let response: Response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
            },
            body: formstring
        });
        let json: JSON = await response.json();
        console.log("Answer:");
        console.log(json);
        answerSec.innerHTML = "<pre>" + JSON.stringify(json, undefined, 2) + "</pre>";

    }
}