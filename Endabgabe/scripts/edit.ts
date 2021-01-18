namespace Twitter {

    let form: HTMLFormElement = <HTMLFormElement>document.getElementById("form");

    let btSendEdit: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendEdit");
    btSendEdit.addEventListener("click", edit);

    let answerSec: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");

    //TODO Elemente mit Daten von Benutzer fuellen

    async function edit(): Promise<void> {
        let formdata: FormData = new FormData(form);
        let request: RequestToServerInterface = {};
        formdata.forEach(function (value: FormDataEntryValue, key: string): void {
            //TODO if key == email schauen ob wirklich email eingegeben wurde
            request[key] = value.toString();
        });
        request["command"] = "edit";
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
                } else {
                    p.style.color = "green";
                }
            }
        } else {
            console.log("No answer");
        }
    }
}