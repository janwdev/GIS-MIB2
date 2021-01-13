"use strict";
var Twitter;
(function (Twitter) {
    let url = "http://localhost:8100";
    // let url: string = "https://gis2020jw.herokuapp.com";
    showAllUsers();
    let answerSection = document.getElementById("answerSection");
    async function showAllUsers() {
        let params = new URLSearchParams();
        params.append("command", "showAllUsers");
        let authCode = Twitter.getAuthCode();
        if (authCode.length > 0) {
            params.append("authKey", authCode);
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: params
            });
            let responseFromServer = await response.json();
            let userArray = responseFromServer.users;
            console.log("Answer:");
            console.log(userArray);
            while (answerSection.firstChild) {
                answerSection.removeChild(answerSection.lastChild);
            }
            createHTMLTableFromUserArray(userArray);
        }
        else {
            //TODO weiterleitung
            console.log("Need to Login again");
        }
    }
    // TODO Mehr Elemente einfügen
    function createHTMLTableFromUserArray(array) {
        let table = document.createElement("table");
        let col = [];
        col.push("Name");
        col.push("Email");
        col.push("Suscribe");
        // Header
        let tr = table.insertRow(0);
        for (let i = 0; i < col.length; i++) {
            let th = document.createElement("th");
            th.textContent = col[i];
            tr.appendChild(th);
        }
        for (let i = 0; i < array.length; i++) {
            let user = array[i];
            let tr = table.insertRow();
            let tabCellName = tr.insertCell();
            tabCellName.textContent = user.firstname + " " + user.lastname;
            let tabCellEmail = tr.insertCell();
            tabCellEmail.textContent = user.email;
            let tabCellSuscribe = tr.insertCell();
            let btSuscribe = document.createElement("button");
            btSuscribe.textContent = "Suscribe";
            tabCellSuscribe.appendChild(btSuscribe);
            btSuscribe.addEventListener("click", function () {
                suscribeToUserWithId(user._id);
            });
            //TODO Suscribebtn
        }
        answerSection.appendChild(table);
    }
    async function suscribeToUserWithId(id) {
        console.log("Try to suscribe to User with id: " + id);
        let authCode = Twitter.getAuthCode();
        if (authCode.length > 0) {
            let params = new URLSearchParams();
            params.append("command", "suscribe");
            params.append("_id", id);
            params.append("authKey", authCode);
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: params
            });
            let json = await response.json();
            console.log("Answer:");
            console.log(json);
        }
        else {
            //TODO weiterleitung
            console.log("Need to Login again");
        }
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=showAllUsers.js.map