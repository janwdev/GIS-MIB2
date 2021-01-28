"use strict";
var Twitter;
(function (Twitter) {
    showAllUsers();
    let answerSection = document.getElementById("answerSection");
    async function showAllUsers() {
        let requestData = { command: "showAllUsers" };
        let responseFromServer = await Twitter.postToServer(requestData);
        if (responseFromServer) {
            let userArray = responseFromServer.users;
            console.log("Answer:");
            console.log(userArray);
            while (answerSection.firstChild) {
                answerSection.removeChild(answerSection.lastChild);
            }
            if (userArray) {
                createHTMLTableFromUserArray(userArray);
            }
        }
        else {
            while (answerSection.firstChild) {
                answerSection.removeChild(answerSection.lastChild);
            }
            let alert = Twitter.createAlertElement("No Answer", Twitter.KEYALERTWARNING);
            answerSection.appendChild(alert);
        }
    }
    function createHTMLTableFromUserArray(array) {
        if (array.length > 1) {
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
            let thisUserFollowing = array[0].following;
            for (let i = 1; i < array.length; i++) {
                let user = array[i];
                let tr = table.insertRow();
                let tabCellName = tr.insertCell();
                let htmlName = document.createElement("a");
                htmlName.textContent = user.firstname + " " + user.lastname;
                htmlName.href = "userdetails.html?email=" + user.email;
                tabCellName.appendChild(htmlName);
                let tabCellEmail = tr.insertCell();
                tabCellEmail.textContent = user.email;
                let tabCellSuscribe = tr.insertCell();
                let following = false;
                for (let j = 0; j < thisUserFollowing.length; j++) {
                    if (user._id == thisUserFollowing[j]) {
                        following = true;
                        break;
                    }
                }
                if (following) {
                    let btUnSuscribe = document.createElement("button");
                    btUnSuscribe.textContent = "Unsuscribe";
                    tabCellSuscribe.appendChild(btUnSuscribe);
                    btUnSuscribe.addEventListener("click", function () {
                        suscribeUnsuscribeToUserWithId(user._id, "unsubscribe");
                    });
                }
                else {
                    let btSuscribe = document.createElement("button");
                    btSuscribe.textContent = "Suscribe";
                    tabCellSuscribe.appendChild(btSuscribe);
                    btSuscribe.addEventListener("click", function () {
                        suscribeUnsuscribeToUserWithId(user._id, "subscribe");
                    });
                }
            }
            answerSection.appendChild(table);
        }
    }
    async function suscribeUnsuscribeToUserWithId(id, command) {
        console.log("Try to suscribe to User with id: " + id);
        let requestData = { command: command, _id: id };
        let responseFromServer = await Twitter.postToServer(requestData);
        if (responseFromServer) {
            console.log("Answer:");
            console.log(responseFromServer);
        }
        else {
            console.log("No Response");
            while (answerSection.firstChild) {
                answerSection.removeChild(answerSection.lastChild);
            }
            let alert = Twitter.createAlertElement("No Answer", Twitter.KEYALERTWARNING);
            answerSection.appendChild(alert);
        }
        showAllUsers();
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=showAllUsers.js.map