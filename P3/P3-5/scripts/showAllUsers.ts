namespace P3_5 {
    let url: string = "http://localhost:8100";
    //let url: string = "https://gis2020jw.herokuapp.com";
    
    let btRetrieve: HTMLButtonElement = <HTMLButtonElement>document.getElementById("retrieve");
    btRetrieve.addEventListener("click", retrieveData);

    let answerSection: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");
    interface AnswerDataIf {
        [type: string]: string;
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

        for (let i: number = 0; i < array.length; i++) {
            obj = <AnswerDataIf><unknown>array[i];
            let tr: HTMLTableRowElement = table.insertRow();
            for (let key in obj) {
                if (key != "_id") {
                    let tabCell: HTMLTableCellElement = tr.insertCell();
                    tabCell.textContent = obj[key];
                }
            }
        }
        answerSection.appendChild(table);
    }
}