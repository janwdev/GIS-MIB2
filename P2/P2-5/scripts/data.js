"use strict";
var P2_5;
(function (P2_5) {
    P2_5.posibilityTop = [];
    P2_5.posibilityMiddle = [];
    P2_5.posibilityBottom = [];
    function allPosArrayToJSON() {
        let allPosArray = { top: P2_5.posibilityTop, middle: P2_5.posibilityMiddle, bottom: P2_5.posibilityBottom };
        let json = JSON.stringify(allPosArray);
        console.log(json);
        return json;
    }
    P2_5.allPosArrayToJSON = allPosArrayToJSON;
    function allPosArrayFromJSON(jsonStr) {
        P2_5.posibilityTop = [];
        P2_5.posibilityMiddle = [];
        P2_5.posibilityBottom = [];
        let json = JSON.parse(jsonStr);
        Object.keys(json).forEach(key => {
            if (key == "top" || key == "middle" || key == "bottom") {
                let posIf = json[key];
                posIf.forEach(pos => {
                    new P2_5.Posibility(pos.name, pos.type, pos.link);
                });
            }
        });
    }
    P2_5.allPosArrayFromJSON = allPosArrayFromJSON;
    async function getPossibilitysFromURL(_url) {
        let response = await fetch(_url);
        let json = await response.text();
        allPosArrayFromJSON(json);
    }
    P2_5.getPossibilitysFromURL = getPossibilitysFromURL;
})(P2_5 || (P2_5 = {}));
//# sourceMappingURL=data.js.map