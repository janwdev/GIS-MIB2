namespace P2_4 {
    export let keyConfig: string = "ConfigJson";
    export let posibilityTop: Posibility[] = [];
    export let posibilityMiddle: Posibility[] = [];
    export let posibilityBottom: Posibility[] = [];

    let path: string = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1);

    // Oben
    let lt1Top: Posibility = new Posibility("Leuchtturm1 - Oben", 0, path + "assets/oben/Leuchtturm1_o.png");
    // Mitte
    let lt1Middle: Posibility = new Posibility("Leuchtturm1 - Mitte", 1, path + "assets/mitte/Leuchtturm1_m.png");
    // Unten
    let lt1Bottom: Posibility = new Posibility("Leuchtturm1 - Unten", 2, path + "assets/unten/Leuchtturm1_u.png");

    //TODO durch dummy ersetzen
    export let selectedElements: Selected = {top: undefined, middle: undefined, bottom: undefined};

    // Leuchtturm 2
    let lt2Top: Posibility = new Posibility("Leuchtturm2 - Oben", 0, path + "assets/oben/Leuchtturm2_o.png");
    let lt2Middle: Posibility = new Posibility("Leuchtturm2 - Mitte", 1, path + "assets/mitte/Leuchtturm2_m.png");
    let lt2Bottom: Posibility = new Posibility("Leuchtturm2 - Unten", 2, path + "assets/unten/Leuchtturm2_u.png");
    // Leuchtturm 3
    let lt3Top: Posibility = new Posibility("Leuchtturm3 - Oben", 0, path + "assets/oben/Leuchtturm3_o.png");
    let lt3Middle: Posibility = new Posibility("Leuchtturm3 - Mitte", 1, path + "assets/mitte/Leuchtturm3_m.png");
    let lt3Bottom: Posibility = new Posibility("Leuchtturm3 - Unten", 2, path + "assets/unten/Leuchtturm3_u.png");
    // Leuchtturm 4
    let lt4Top: Posibility = new Posibility("Leuchtturm4 - Oben", 0, path + "assets/oben/Leuchtturm4_o.png");
    let lt4Middle: Posibility = new Posibility("Leuchtturm4 - Mitte", 1, path + "assets/mitte/Leuchtturm4_m.png");
    let lt4Bottom: Posibility = new Posibility("Leuchtturm4 - Unten", 2, path + "assets/unten/Leuchtturm4_u.png");
}