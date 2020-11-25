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
                P2_3_2_3.posibilityMittle.push(this);
            }
            else if (this.type == 2) {
                P2_3_2_3.posibilityBottom.push(this);
            }
        }
    }
    P2_3_2_3.Posibility = Posibility;
    let imageTop = document.getElementById("picTop");
    let imageMiddle = document.getElementById("picMiddle");
    let imageButtom = document.getElementById("picBottom");
    window.onload = function () {
        //TODO geht das anders
        loadImages();
    };
    function loadImages() {
        imageTop.src = P2_3_2_3.selectedElements.top.link;
        imageMiddle.src = P2_3_2_3.selectedElements.middle.link;
        imageButtom.src = P2_3_2_3.selectedElements.bottom.link;
    }
})(P2_3_2_3 || (P2_3_2_3 = {}));
//# sourceMappingURL=script.js.map