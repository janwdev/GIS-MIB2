namespace P3_2 {
    let formData: FormData = new FormData(document.forms[0]);

    let btSend: HTMLButtonElement = <HTMLButtonElement>document.getElementById("send");
    btSend.addEventListener("click", send);

    async function send(): Promise<void> {
        //let url: string = "https://gis2020jw.herokuapp.com/";
        let url: string = "http://localhost:8100/";
        let query: URLSearchParams = new URLSearchParams(<any>formData);
        url = url + "?" + query.toString();
        let response: Response = await fetch(url);
        let text: string = await response.text();
        console.log("Answer:");
        console.log(text);
    }
}