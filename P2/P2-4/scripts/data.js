"use strict";
var P2_4;
(function (P2_4) {
    P2_4.posibilityTop = [];
    P2_4.posibilityMiddle = [];
    P2_4.posibilityBottom = [];
    // allPosArrayFromJSON('{"top":[{"name":"Leuchtturm4 - Oben","type":0,"link":"assets/oben/Leuchtturm4_o.png"},{"name":"Leuchtturm3 - Oben","type":0,"link":"assets/oben/Leuchtturm3_o.png"},{"name":"Leuchtturm2 - Oben","type":0,"link":"assets/oben/Leuchtturm2_o.png"},{"name":"Leuchtturm1 - Oben","type":0,"link":"assets/oben/Leuchtturm1_o.png"}],"middle":[{"name":"Leuchtturm4 - Mitte","type":1,"link":"assets/mitte/Leuchtturm4_m.png"},{"name":"Leuchtturm3 - Mitte","type":1,"link":"assets/mitte/Leuchtturm3_m.png"},{"name":"Leuchtturm2 - Mitte","type":1,"link":"assets/mitte/Leuchtturm2_m.png"},{"name":"Leuchtturm1 - Mitte","type":1,"link":"assets/mitte/Leuchtturm1_m.png"}],"bottom":[{"name":"Leuchtturm4 - Unten","type":2,"link":"assets/unten/Leuchtturm4_u.png"},{"name":"Leuchtturm3 - Unten","type":2,"link":"assets/unten/Leuchtturm3_u.png"},{"name":"Leuchtturm2 - Unten","type":2,"link":"assets/unten/Leuchtturm2_u.png"},{"name":"Leuchtturm1 - Unten","type":2,"link":"assets/unten/Leuchtturm1_u.png"}]}');
    // Oben
    let lt1Top = new P2_4.Posibility("Leuchtturm1 - Oben", 0, "assets/oben/Leuchtturm1_o.png");
    // Mitte
    let lt1Middle = new P2_4.Posibility("Leuchtturm1 - Mitte", 1, "assets/mitte/Leuchtturm1_m.png");
    // Unten
    let lt1Bottom = new P2_4.Posibility("Leuchtturm1 - Unten", 2, "assets/unten/Leuchtturm1_u.png");
    // Leuchtturm 2
    let lt2Top = new P2_4.Posibility("Leuchtturm2 - Oben", 0, "assets/oben/Leuchtturm2_o.png");
    let lt2Middle = new P2_4.Posibility("Leuchtturm2 - Mitte", 1, "assets/mitte/Leuchtturm2_m.png");
    let lt2Bottom = new P2_4.Posibility("Leuchtturm2 - Unten", 2, "assets/unten/Leuchtturm2_u.png");
    // Leuchtturm 3
    let lt3Top = new P2_4.Posibility("Leuchtturm3 - Oben", 0, "assets/oben/Leuchtturm3_o.png");
    let lt3Middle = new P2_4.Posibility("Leuchtturm3 - Mitte", 1, "assets/mitte/Leuchtturm3_m.png");
    let lt3Bottom = new P2_4.Posibility("Leuchtturm3 - Unten", 2, "assets/unten/Leuchtturm3_u.png");
    // Leuchtturm 4
    let lt4Top = new P2_4.Posibility("Leuchtturm4 - Oben", 0, "assets/oben/Leuchtturm4_o.png");
    let lt4Middle = new P2_4.Posibility("Leuchtturm4 - Mitte", 1, "assets/mitte/Leuchtturm4_m.png");
    let lt4Bottom = new P2_4.Posibility("Leuchtturm4 - Unten", 2, "assets/unten/Leuchtturm4_u.png");
    allPosArrayFromJSON(allPosArrayToJSON());
    function allPosArrayToJSON() {
        let allPosArray = { top: P2_4.posibilityTop, middle: P2_4.posibilityMiddle, bottom: P2_4.posibilityBottom };
        let json = JSON.stringify(allPosArray);
        console.log(json);
        return json;
    }
    P2_4.allPosArrayToJSON = allPosArrayToJSON;
    function allPosArrayFromJSON(jsonStr) {
        P2_4.posibilityTop = [];
        P2_4.posibilityMiddle = [];
        P2_4.posibilityBottom = [];
        let json = JSON.parse(jsonStr);
        Object.keys(json).forEach(key => {
            if (key == "top" || key == "middle" || key == "bottom") {
                let posIf = json[key];
                posIf.forEach(pos => {
                    new P2_4.Posibility(pos.name, pos.type, pos.link);
                });
            }
        });
    }
    P2_4.allPosArrayFromJSON = allPosArrayFromJSON;
})(P2_4 || (P2_4 = {}));
//# sourceMappingURL=data.js.map