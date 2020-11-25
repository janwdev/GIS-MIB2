"use strict";
var P2_3_2_3;
(function (P2_3_2_3) {
    class Posibility {
        constructor(_name, _type, _link) {
            this.name = _name;
            this.type = _type;
            this.link = _link;
            if (this.type == 0) {
                P2_3_2_3.posibilityTop.push(this);
            }
            else if (this.type == 1) {
                P2_3_2_3.posibilityMiddle.push(this);
            }
            else if (this.type == 2) {
                P2_3_2_3.posibilityBottom.push(this);
            }
        }
    }
    P2_3_2_3.Posibility = Posibility;
    console.log("Path: " + window.location.pathname);
    if (window.location.pathname == "/P2/P2-3/A2-3/index.html") {
        let imageTop = document.getElementById("picTop");
        let imageMiddle = document.getElementById("picMiddle");
        let imageButtom = document.getElementById("picBottom");
        window.addEventListener("load", loadImages);
        function loadImages() {
            imageTop.src = P2_3_2_3.selectedElements.top.link;
            imageMiddle.src = P2_3_2_3.selectedElements.middle.link;
            imageButtom.src = P2_3_2_3.selectedElements.bottom.link;
            console.log(P2_3_2_3.selectedElements);
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
})(P2_3_2_3 || (P2_3_2_3 = {}));
//# sourceMappingURL=script.js.map