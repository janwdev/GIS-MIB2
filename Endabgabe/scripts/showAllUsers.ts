namespace Twitter {
    showAllUsers();

    let answerSection: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");
    answerSection.className = "container-m";

    async function showAllUsers(): Promise<void> {
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
            while (answerSection.firstChild) {
                answerSection.removeChild(answerSection.lastChild);
            }
            let alert: HTMLDivElement = createAlertElement("No Answer", KEYALERTWARNING);
            answerSection.appendChild(alert);
        }
    }

    function createHTMLTableFromUserArray(array: User[]): void {
        if (array.length > 1) {
            let table: HTMLTableElement = document.createElement("table");
            let col: Array<string> = [];
            col.push("Name");
            col.push("Email");
            col.push("Suscribe");
            col.push("Picture");
            // Header
            let tr: HTMLTableRowElement = table.insertRow(0);
            for (let i: number = 0; i < col.length; i++) {
                let th: HTMLTableHeaderCellElement = document.createElement("th");
                let p: HTMLParagraphElement = document.createElement("p");
                p.textContent = col[i];
                th.appendChild(p);
                tr.appendChild(th);
            }

            let thisUserFollowing: string[] = array[0].following;

            for (let i: number = 1; i < array.length; i++) {
                let user: User = array[i];
                let tr: HTMLTableRowElement = table.insertRow();
                let tabCellName: HTMLTableCellElement = tr.insertCell();
                let htmlName: HTMLAnchorElement = document.createElement("a");
                htmlName.textContent = user.firstname + " " + user.lastname;
                htmlName.href = "userdetails.html?email=" + user.email;
                tabCellName.appendChild(htmlName);
                let tabCellEmail: HTMLTableCellElement = tr.insertCell();
                let pEmail: HTMLParagraphElement = document.createElement("p");
                pEmail.textContent = user.email;
                tabCellEmail.appendChild(pEmail);
                let tabCellSuscribe: HTMLTableCellElement = tr.insertCell();

                let following: boolean = false;
                for (let j: number = 0; j < thisUserFollowing.length; j++) {
                    if (user._id == thisUserFollowing[j]) {
                        following = true;
                        break;
                    }
                }
                if (following) {
                    let btUnSubscribe: HTMLButtonElement = document.createElement("button");
                    let span: HTMLSpanElement = document.createElement("span");
                    span.textContent = "Unsubscribe";
                    btUnSubscribe.appendChild(span);
                    btUnSubscribe.className = "btn col";
                    tabCellSuscribe.appendChild(btUnSubscribe);
                    btUnSubscribe.addEventListener("click", function (): void {
                        suscribeUnsuscribeToUserWithId(user._id, "unsubscribe");
                    });
                } else {
                    let btSubscribe: HTMLButtonElement = document.createElement("button");
                    let span: HTMLSpanElement = document.createElement("span");
                    span.textContent = "Subscribe";
                    btSubscribe.appendChild(span);
                    btSubscribe.className = "btn col";
                    tabCellSuscribe.appendChild(btSubscribe);
                    btSubscribe.addEventListener("click", function (): void {
                        suscribeUnsuscribeToUserWithId(user._id, "subscribe");
                    });
                }

                let tabCellPic: HTMLTableCellElement = tr.insertCell();
                if (user.pictureLink) {
                    if (user.pictureLink.length > 0) {
                        let img: HTMLImageElement = document.createElement("img");
                        img.src = user.pictureLink;
                        img.className = "col-4 profPicS";
                        tabCellPic.appendChild(img);
                    }
                }
            }
            answerSection.appendChild(table);
        }
    }

    async function suscribeUnsuscribeToUserWithId(id: string, command: string): Promise<void> {
        console.log("Try to suscribe to User with id: " + id);
        let requestData: RequestToServerInterface = { command: command, _id: id };
        let responseFromServer: ResponseFromServer = await postToServer(requestData);
        if (responseFromServer) {
            console.log("Answer:");
            console.log(responseFromServer);
        } else {
            console.log("No Response");
            while (answerSection.firstChild) {
                answerSection.removeChild(answerSection.lastChild);
            }
            let alert: HTMLDivElement = createAlertElement("No Answer", KEYALERTWARNING);
            answerSection.appendChild(alert);
            delay(3000);
        }
        showAllUsers();
    }
}