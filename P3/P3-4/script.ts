namespace P3_4 {

    let url: string = "http://localhost:8100";
    //let url: string = "https://gis2020jw.herokuapp.com";

    let form: HTMLFormElement = <HTMLFormElement>document.getElementById("form");
    let answerSection: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");

    let btSendPost: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendPost");
    btSendPost.addEventListener("click", insertData);

    let btRetrieve: HTMLButtonElement = <HTMLButtonElement>document.getElementById("retrieve");
    btRetrieve.addEventListener("click", retrieveData);

    interface AnswerDataIf {
        [type: string]: string;
    }

    function createHTMLTableFromJSONArray(array: JSON[]): void {
        let table: HTMLTableElement = document.createElement("table");
        let col: Array<string> = [];
        let obj: AnswerDataIf = <AnswerDataIf><unknown>array[0];
        for (let key in obj) {
            if (key != "_id") {
                col.push(key);
            }
        }
        obj = undefined;
        // Header
        let tr: HTMLTableRowElement = table.insertRow(0);
        for (let i: number = 0; i < col.length; i++) {
            let th: HTMLTableHeaderCellElement = document.createElement("th");
            th.textContent = col[i].toUpperCase();
            tr.appendChild(th);
        }
        // Delete Header
        let thDel: HTMLTableHeaderCellElement = document.createElement("th");
        tr.appendChild(thDel);

        for (let i: number = 0; i < array.length; i++) {
            obj = <AnswerDataIf><unknown>array[i];
            let tr: HTMLTableRowElement = table.insertRow();
            for (let key in obj) {
                if (key != "_id") {
                    let tabCell: HTMLTableCellElement = tr.insertCell();
                    tabCell.textContent = obj[key];
                }
            }
            // Delete
            let tabCellDel: HTMLTableCellElement = tr.insertCell();
            let btDel: HTMLButtonElement = document.createElement("button");
            btDel.textContent = "Delete";
            tabCellDel.appendChild(btDel);
            btDel.addEventListener("click", function (): void {
                deleteDatabaseElementFromArray(i, array);
            });
        }
        answerSection.appendChild(table);
    }

    function deleteDatabaseElementFromArray(i: number, array: JSON[]): void {
        let obj: AnswerDataIf = <AnswerDataIf><unknown>array[i];
        let id: string = undefined;
        for (let key in obj) {
            if (key == "_id") {
                id = obj[key];
                break;
            }
        }
        if (id != undefined) {
            //Delete element with id
            deleteDatabaseElementWithID(id);
        } else {
            alert("Error no id found");
        }
    }

    async function deleteDatabaseElementWithID(id: string): Promise<void> {
        console.log("Try to delete Element with id: " + id);
        let params: URLSearchParams = new URLSearchParams("command=delete");
        params.append("_id", id);
        let response: Response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: params
        });
        let json: JSON = await response.json();
        console.log("Answer:");
        console.log(json);
        retrieveData(); // Fuer reload
    }

    async function insertData(): Promise<void> {
        let formdata: FormData = new FormData(form);
        let formstring: URLSearchParams = new URLSearchParams(<URLSearchParams>formdata);
        formstring.append("command", "insert");
        let response: Response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: formstring
        });
        let json: JSON = await response.json();
        console.log("Answer:");
        console.log(json);
        retrieveData(); // Fuer reload
    }

    async function retrieveData(): Promise<void> {
        let response: Response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: new URLSearchParams("command=retrieve")
        });
        let jsonArray: JSON[] = await response.json();
        console.log("Answer:");
        console.log(jsonArray);
        while (answerSection.firstChild) {
            answerSection.removeChild(answerSection.lastChild);
        }
        createHTMLTableFromJSONArray(jsonArray);
    }
}