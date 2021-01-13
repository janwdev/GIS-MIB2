namespace Twitter {

    let url: string = "http://localhost:8100";
    // let url: string = "https://gis2020jw.herokuapp.com";
    showAllUsers();

    let answerSection: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");

    interface User {
        _id: string;
        firstname: string;
        lastname: string;
        studycourse: string;
        semester: string;
        email: string;
        pictureLink?: string;
        followers: string[];
        following: string[];
    }

    interface ResponseFromServer {
        status: number;
        message: string;
        authCookieString?: string;
        data?: string[];
        users?: User[];
    }

    async function showAllUsers(): Promise<void> {
        let params: URLSearchParams = new URLSearchParams();
        params.append("command", "showAllUsers");
        let authCode: string = getAuthCode();
        if (authCode.length > 0) {
            params.append("authKey", authCode);
            let response: Response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: params
            });
            let responseFromServer: ResponseFromServer = await response.json();
            let userArray: User[] = responseFromServer.users;
            console.log("Answer:");
            console.log(userArray);
            while (answerSection.firstChild) {
                answerSection.removeChild(answerSection.lastChild);
            }
            createHTMLTableFromUserArray(userArray);
        } else {
            //TODO weiterleitung
            console.log("Need to Login again");
        }
    }

    // TODO Mehr Elemente einfügen
    function createHTMLTableFromUserArray(array: User[]): void {
        let table: HTMLTableElement = document.createElement("table");
        let col: Array<string> = [];
        col.push("Name");
        col.push("Email");
        col.push("Suscribe");
        // Header
        let tr: HTMLTableRowElement = table.insertRow(0);
        for (let i: number = 0; i < col.length; i++) {
            let th: HTMLTableHeaderCellElement = document.createElement("th");
            th.textContent = col[i];
            tr.appendChild(th);
        }

        for (let i: number = 0; i < array.length; i++) {
            let user: User = array[i];
            let tr: HTMLTableRowElement = table.insertRow();
            let tabCellName: HTMLTableCellElement = tr.insertCell();
            tabCellName.textContent = user.firstname + " " + user.lastname;
            let tabCellEmail: HTMLTableCellElement = tr.insertCell();
            tabCellEmail.textContent = user.email;
            let tabCellSuscribe: HTMLTableCellElement = tr.insertCell();

            let btSuscribe: HTMLButtonElement = document.createElement("button");
            btSuscribe.textContent = "Suscribe";
            tabCellSuscribe.appendChild(btSuscribe);
            btSuscribe.addEventListener("click", function (): void {
                suscribeToUserWithId(user._id);
            });
            //TODO Suscribebtn
        }
        answerSection.appendChild(table);
    }

    async function suscribeToUserWithId(id: string): Promise<void> {
        console.log("Try to suscribe to User with id: " + id);
        let authCode: string = getAuthCode();
        if (authCode.length > 0) {
            let params: URLSearchParams = new URLSearchParams();
            params.append("command", "subscribe");
            params.append("_id", id);
            params.append("authKey", authCode);
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
        } else {
            //TODO weiterleitung
            console.log("Need to Login again");
        }

    }
}