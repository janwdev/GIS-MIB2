"use strict";
var P2_4;
(function (P2_4) {
    class Posibility {
        constructor(_name, _type, _link) {
            this.name = _name;
            this.type = _type;
            this.link = _link;
            if (this.type == 0) {
                this.removeSameFromArray(P2_4.posibilityTop, this.name);
                P2_4.posibilityTop.unshift(this);
            }
            else if (this.type == 1) {
                this.removeSameFromArray(P2_4.posibilityMiddle, this.name);
                P2_4.posibilityMiddle.unshift(this);
            }
            else if (this.type == 2) {
                this.removeSameFromArray(P2_4.posibilityBottom, this.name);
                P2_4.posibilityBottom.unshift(this);
            }
        }
        removeSameFromArray(posArray, name) {
            posArray.forEach((element, i) => {
                if (element.name === name) {
                    posArray.splice(i, 1);
                }
            });
        }
        getInterface() {
            return { name: this.name, type: this.type, link: this.link };
        }
    }
    P2_4.Posibility = Posibility;
    function selectedToJSON() {
        let json;
        json = JSON.stringify(P2_4.selectedElements);
        console.log(json);
        sessionStorage.setItem(P2_4.keyConfig, json);
    }
    P2_4.selectedToJSON = selectedToJSON;
    function selectedFromJSON(jsonStr) {
        let json = JSON.parse(jsonStr);
        Object.keys(json).forEach(key => {
            if (key == "top") {
                let pos = json[key];
                let topPos = new Posibility(pos.name, pos.type, pos.link);
                P2_4.selectedElements.top = topPos;
            }
            else if (key == "middle") {
                let pos = json[key];
                let middlePos = new Posibility(pos.name, pos.type, pos.link);
                P2_4.selectedElements.middle = middlePos;
            }
            else if (key == "bottom") {
                let pos = json[key];
                let bottomPos = new Posibility(pos.name, pos.type, pos.link);
                P2_4.selectedElements.bottom = bottomPos;
            }
        });
    }
    P2_4.selectedFromJSON = selectedFromJSON;
    let path = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
    if (path == "index.html" || path == "") {
        let imageTop = document.getElementById("picTop");
        let imageMiddle = document.getElementById("picMiddle");
        let imageButtom = document.getElementById("picBottom");
        window.addEventListener("load", finishedLoading);
        function finishedLoading() {
            let json = sessionStorage.getItem(P2_4.keyConfig);
            if (json != null) {
                selectedFromJSON(json);
                loadImages();
            }
            else {
                //TODO Message auf Statusfeld schreiben
                console.log("Keine Auswahl getroffen");
                loadImages();
            }
        }
        function loadImages() {
            if (P2_4.selectedElements.top != undefined) {
                imageTop.src = P2_4.selectedElements.top.link;
            }
            if (P2_4.selectedElements.middle != undefined) {
                imageMiddle.src = P2_4.selectedElements.middle.link;
            }
            if (P2_4.selectedElements.bottom != undefined) {
                imageButtom.src = P2_4.selectedElements.bottom.link;
            }
            console.log(P2_4.selectedElements);
        }
        let btEditTop = document.getElementById("btTop");
        btEditTop.addEventListener("click", openDetailTop);
        let btEditMiddle = document.getElementById("btMiddle");
        btEditMiddle.addEventListener("click", openDetailMiddle);
        let btEditBottom = document.getElementById("btBottom");
        btEditBottom.addEventListener("click", openDetailBottom);
        function openDetailTop() {
            window.open("selTop.html", "_self");
            console.log("Open Detail Top");
        }
        function openDetailMiddle() {
            window.open("selMiddle.html", "_self");
            console.log("Open Detail Middle");
        }
        function openDetailBottom() {
            window.open("selBottom.html", "_self");
            console.log("Open Detail Bottom");
        }
    }
})(P2_4 || (P2_4 = {}));
//# sourceMappingURL=script.js.map