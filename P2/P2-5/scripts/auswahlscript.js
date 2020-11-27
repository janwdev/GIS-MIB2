"use strict";
var P2_5;
(function (P2_5) {
    let selected;
    let htmlImgs = [];
    let path = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
    let imageTop = document.getElementById("picTop");
    let imageMiddle = document.getElementById("picMiddle");
    let imageButtom = document.getElementById("picBottom");
    let btSave = document.getElementById("btSave");
    btSave.addEventListener("click", saveSelection);
    let btCancel = document.getElementById("btAbort");
    window.addEventListener("load", loadContent);
    async function loadContent() {
        // Moeglichkeiten aus JSON laden
        await P2_5.getPossibilitysFromURL("data.json");
        let json = sessionStorage.getItem(P2_5.keyConfig);
        if (json != null) {
            P2_5.selectedFromJSON(json);
        }
        loadImages();
        if (path == "selTop.html") {
            selected = P2_5.selectedElements.top;
            addContentToDetailWindow(P2_5.posibilityTop);
        }
        else if (path == "selMiddle.html") {
            selected = P2_5.selectedElements.middle;
            addContentToDetailWindow(P2_5.posibilityMiddle);
        }
        else if (path == "selBottom.html") {
            selected = P2_5.selectedElements.bottom;
            addContentToDetailWindow(P2_5.posibilityBottom);
        }
        if (P2_5.selectedElements.top == undefined || P2_5.selectedElements.middle == undefined || P2_5.selectedElements.bottom == undefined) {
            btSave.textContent = "Weiter";
            btCancel.textContent = "Zurück";
            if (path == "selTop.html") {
                btCancel.disabled = true;
            }
            btCancel.addEventListener("click", back);
        }
        else {
            btSave.textContent = "Speichern";
            btCancel.textContent = "Abbrechen";
            btCancel.addEventListener("click", cancel);
        }
    }
    function loadImages() {
        if (P2_5.selectedElements.top != undefined) {
            imageTop.src = P2_5.selectedElements.top.link;
        }
        if (P2_5.selectedElements.middle != undefined) {
            imageMiddle.src = P2_5.selectedElements.middle.link;
        }
        if (P2_5.selectedElements.bottom != undefined) {
            imageButtom.src = P2_5.selectedElements.bottom.link;
        }
        console.log(P2_5.selectedElements);
    }
    function addContentToDetailWindow(images) {
        let divToAdd = document.getElementById("selectDetailImgSection");
        images.forEach(img => {
            let imgElement = document.createElement("img");
            htmlImgs.push(imgElement);
            imgElement.src = img.link;
            if (img == selected) {
                setSelected(img, imgElement);
            }
            imgElement.addEventListener("click", function () {
                setSelected(img, imgElement);
            });
            divToAdd.appendChild(imgElement);
        });
    }
    function setSelected(img, imgElement) {
        selected = img;
        imgElement.className += " selectedImage";
        console.log("selected: " + img.name);
        htmlImgs.forEach(htmlImg => {
            if (htmlImg != imgElement) {
                htmlImg.classList.remove("selectedImage");
            }
        });
    }
    function saveSelection() {
        if (path == "selTop.html") {
            P2_5.selectedElements.top = selected;
        }
        else if (path == "selMiddle.html") {
            P2_5.selectedElements.middle = selected;
        }
        else if (path == "selBottom.html") {
            P2_5.selectedElements.bottom = selected;
        }
        P2_5.selectedToJSON();
        window.open("index.html", "_self");
        console.log("selected: " + selected.name);
    }
    function cancel() {
        window.open("index.html", "_self");
        console.log("Abgebrochen");
    }
    function back() {
        let pathToOpen;
        if (path == "selMiddle.html") {
            pathToOpen = "selTop.html";
        }
        else if (path == "selBottom.html") {
            pathToOpen = "selMiddle.html";
        }
        window.open(pathToOpen, "_self");
    }
})(P2_5 || (P2_5 = {}));
//# sourceMappingURL=auswahlscript.js.map