"use strict";
var P2_3_2_3;
(function (P2_3_2_3) {
    let selected;
    let htmlImgs = [];
    let path = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
    window.addEventListener("load", loadContent);
    function loadContent() {
        if (path == "selTop.html") {
            selected = P2_3_2_3.selectedElements.top;
            addContentToDetailWindow(P2_3_2_3.posibilityTop);
        }
        else if (path == "selMiddle.html") {
            selected = P2_3_2_3.selectedElements.middle;
            addContentToDetailWindow(P2_3_2_3.posibilityMiddle);
        }
        else if (path == "selBottom.html") {
            selected = P2_3_2_3.selectedElements.bottom;
            addContentToDetailWindow(P2_3_2_3.posibilityBottom);
        }
    }
    function addContentToDetailWindow(images) {
        let divToAdd = document.getElementById("selectDetailImgSection");
        images.forEach(img => {
            let imgElement = document.createElement("img");
            htmlImgs.push(imgElement);
            imgElement.className += "detailImg";
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
    let btSave = document.getElementById("btSave");
    btSave.addEventListener("click", saveSelection);
    let btCancel = document.getElementById("btAbort");
    btCancel.addEventListener("click", cancel);
    function saveSelection() {
        if (path == "selTop.html") {
            P2_3_2_3.selectedElements.top = selected;
        }
        else if (path == "selMiddle.html") {
            P2_3_2_3.selectedElements.middle = selected;
        }
        else if (path == "selBottom.html") {
            P2_3_2_3.selectedElements.bottom = selected;
        }
        window.open("index.html", "_self");
        console.log("selected: " + selected.name);
    }
    function cancel() {
        window.open("index.html", "_self");
        console.log("Abgebrochen");
    }
})(P2_3_2_3 || (P2_3_2_3 = {}));
//# sourceMappingURL=auswahlscript.js.map