"use strict";
var P3_5;
(function (P3_5) {
    // let url: string = "http://localhost:8100";
    let url = "https://gis2020jw.herokuapp.com";
    let btRetrieve = document.getElementById("retrieve");
    btRetrieve.addEventListener("click", retrieveData);
    let answerSection = document.getElementById("answerSection");
    async function retrieveData() {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: new URLSearchParams("command=retrieve")
        });
        let jsonArray = await response.json();
        console.log("Answer:");
        console.log(jsonArray);
        while (answerSection.firstChild) {
            answerSection.removeChild(answerSection.lastChild);
        }
        createHTMLTableFromJSONArray(jsonArray);
    }
    function createHTMLTableFromJSONArray(array) {
        let table = document.createElement("table");
        let col = [];
        let obj = array[0];
        for (let key in obj) {
            if (key != "_id") {
                col.push(key);
            }
        }
        obj = undefined;
        // Header
        let tr = table.insertRow(0);
        for (let i = 0; i < col.length; i++) {
            let th = document.createElement("th");
            th.textContent = col[i].toUpperCase();
            tr.appendChild(th);
        }
        for (let i = 0; i < array.length; i++) {
            obj = array[i];
            let tr = table.insertRow();
            for (let key in obj) {
                if (key != "_id") {
                    let tabCell = tr.insertCell();
                    tabCell.textContent = obj[key];
                }
            }
            // Delete
            // let tabCellDel: HTMLTableCellElement = tr.insertCell();
            let btDel = document.createElement("button");
            btDel.textContent = "Delete";
            // tabCellDel.appendChild(btDel);
            btDel.addEventListener("click", function () {
                deleteDatabaseElementFromArray(i, array);
            });
        }
        //### Delete Header
        //let thDel: HTMLTableHeaderCellElement = document.createElement("th");
        //tr.appendChild(thDel);
        //###
        answerSection.appendChild(table);
    }
    //###Delete
    function deleteDatabaseElementFromArray(i, array) {
        let obj = array[i];
        let id = undefined;
        for (let key in obj) {
            if (key == "_id") {
                id = obj[key];
                break;
            }
        }
        if (id != undefined) {
            //Delete element with id
            deleteDatabaseElementWithID(id);
        }
        else {
            alert("Error no id found");
        }
    }
    async function deleteDatabaseElementWithID(id) {
        console.log("Try to delete Element with id: " + id);
        let params = new URLSearchParams("command=delete");
        params.append("_id", id);
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
        retrieveData(); // Fuer reload
    }
})(P3_5 || (P3_5 = {}));
//# sourceMappingURL=showAllUsers.js.map