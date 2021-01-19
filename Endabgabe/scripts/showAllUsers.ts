namespace Twitter {
    showAllUsers();

    let answerSection: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");

    async function showAllUsers(): Promise<void> {
        let authCode: string = getAuthCode();
        if (authCode.length > 0) {
            let requestData: RequestToServerInterface = { command: "showAllUsers" };
            let responseFromServer: ResponseFromServer = await postToServer(requestData);
            if (responseFromServer) {
                let userArray: User[] = responseFromServer.users;
                console.log("Answer:");
                console.log(userArray);
                while (answerSection.firstChild) {
                    answerSection.removeChild(answerSection.lastChild);
                }
                if (userArray) {
                    createHTMLTableFromUserArray(userArray);
                }

            } else {
                console.log("No Response");
            }
        } else {
            //TODO weiterleitung
            console.log("Need to Login again");
        }
    }

    function createHTMLTableFromUserArray(array: User[]): void {
        if (array.length > 1) {
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

            let thisUserFollowing: string[] = array[0].following;

            for (let i: number = 1; i < array.length; i++) {
                let user: User = array[i];
                let tr: HTMLTableRowElement = table.insertRow();
                let tabCellName: HTMLTableCellElement = tr.insertCell();
                tabCellName.textContent = user.firstname + " " + user.lastname;
                let tabCellEmail: HTMLTableCellElement = tr.insertCell();
                tabCellEmail.textContent = user.email;
                let tabCellSuscribe: HTMLTableCellElement = tr.insertCell();

                let following: boolean = false;
                for (let j: number = 0; j < thisUserFollowing.length; j++) {
                    if (user._id == thisUserFollowing[j]) {
                        following = true;
                        break;
                    }
                }
                if (following) {
                    let btUnSuscribe: HTMLButtonElement = document.createElement("button");
                    btUnSuscribe.textContent = "Unsuscribe";
                    tabCellSuscribe.appendChild(btUnSuscribe);
                    btUnSuscribe.addEventListener("click", function (): void {
                        suscribeUnsuscribeToUserWithId(user._id, "unsubscribe");
                    });
                } else {
                    let btSuscribe: HTMLButtonElement = document.createElement("button");
                    btSuscribe.textContent = "Suscribe";
                    tabCellSuscribe.appendChild(btSuscribe);
                    btSuscribe.addEventListener("click", function (): void {
                        suscribeUnsuscribeToUserWithId(user._id, "subscribe");
                    });
                }
            }
            answerSection.appendChild(table);
        }
    }

    async function suscribeUnsuscribeToUserWithId(id: string, command: string): Promise<void> {
        console.log("Try to suscribe to User with id: " + id);

        let authCode: string = getAuthCode();
        if (authCode.length > 0) {
            let requestData: RequestToServerInterface = { command: command, _id: id };
            let responseFromServer: ResponseFromServer = await postToServer(requestData);
            if (responseFromServer) {
                console.log("Answer:");
                console.log(responseFromServer);
            } else {
                console.log("No Response");
            }
        } else {
            //TODO weiterleitung
            console.log("Need to Login again");
        }

    }
}