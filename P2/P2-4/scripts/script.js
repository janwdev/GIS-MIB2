"use strict";
var P2_4;
(function (P2_4) {
    class Posibility {
        constructor(_name, _type, _link) {
            this.name = _name;
            this.type = _type;
            this.link = _link;
            if (this.type == 0) {
                P2_4.posibilityTop.push(this);
            }
            else if (this.type == 1) {
                P2_4.posibilityMiddle.push(this);
            }
            else if (this.type == 2) {
                P2_4.posibilityBottom.push(this);
            }
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
        return json;
    }
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
    let path = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
    if (path == "index.html" || path == "") {
        let imageTop = document.getElementById("picTop");
        let imageMiddle = document.getElementById("picMiddle");
        let imageButtom = document.getElementById("picBottom");
        window.addEventListener("load", finishedLoading);
        function finishedLoading() {
            //TODO only testing
            let json = selectedToJSON();
            P2_4.selectedElements.top = undefined;
            P2_4.selectedElements.middle = undefined;
            P2_4.selectedElements.bottom = undefined;
            selectedFromJSON(json);
            loadImages();
        }
        function loadImages() {
            imageTop.src = P2_4.selectedElements.top.link;
            imageMiddle.src = P2_4.selectedElements.middle.link;
            imageButtom.src = P2_4.selectedElements.bottom.link;
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