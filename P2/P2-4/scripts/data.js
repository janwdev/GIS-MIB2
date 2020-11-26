"use strict";
var P2_4;
(function (P2_4) {
    P2_4.keyConfig = "ConfigJson";
    P2_4.posibilityTop = [];
    P2_4.posibilityMiddle = [];
    P2_4.posibilityBottom = [];
    let path = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1);
    // Oben
    let lt1Top = new P2_4.Posibility("Leuchtturm1 - Oben", 0, path + "assets/oben/Leuchtturm1_o.png");
    // Mitte
    let lt1Middle = new P2_4.Posibility("Leuchtturm1 - Mitte", 1, path + "assets/mitte/Leuchtturm1_m.png");
    // Unten
    let lt1Bottom = new P2_4.Posibility("Leuchtturm1 - Unten", 2, path + "assets/unten/Leuchtturm1_u.png");
    //TODO durch dummy ersetzen
    P2_4.selectedElements = { top: undefined, middle: undefined, bottom: undefined };
    // Leuchtturm 2
    let lt2Top = new P2_4.Posibility("Leuchtturm2 - Oben", 0, path + "assets/oben/Leuchtturm2_o.png");
    let lt2Middle = new P2_4.Posibility("Leuchtturm2 - Mitte", 1, path + "assets/mitte/Leuchtturm2_m.png");
    let lt2Bottom = new P2_4.Posibility("Leuchtturm2 - Unten", 2, path + "assets/unten/Leuchtturm2_u.png");
    // Leuchtturm 3
    let lt3Top = new P2_4.Posibility("Leuchtturm3 - Oben", 0, path + "assets/oben/Leuchtturm3_o.png");
    let lt3Middle = new P2_4.Posibility("Leuchtturm3 - Mitte", 1, path + "assets/mitte/Leuchtturm3_m.png");
    let lt3Bottom = new P2_4.Posibility("Leuchtturm3 - Unten", 2, path + "assets/unten/Leuchtturm3_u.png");
    // Leuchtturm 4
    let lt4Top = new P2_4.Posibility("Leuchtturm4 - Oben", 0, path + "assets/oben/Leuchtturm4_o.png");
    let lt4Middle = new P2_4.Posibility("Leuchtturm4 - Mitte", 1, path + "assets/mitte/Leuchtturm4_m.png");
    let lt4Bottom = new P2_4.Posibility("Leuchtturm4 - Unten", 2, path + "assets/unten/Leuchtturm4_u.png");
})(P2_4 || (P2_4 = {}));
//# sourceMappingURL=data.js.map