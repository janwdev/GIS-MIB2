namespace P2_3_2_3 {
    export let posibilityTop: Posibility[] = [];
    export let posibilityMiddle: Posibility[] = [];
    export let posibilityBottom: Posibility[] = [];

    // Oben
    let lt1Top: Posibility = new Posibility("Leuchtturm1 - Oben", 0, "/P2/P2-3/A2-3/assets/oben/Leuchtturm1_o.png");
    // Mitte
    let lt1Middle: Posibility = new Posibility("Leuchtturm1 - Mitte", 1, "/P2/P2-3/A2-3/assets/mitte/Leuchtturm1_m.png");
    // Unten
    let lt1Bottom: Posibility = new Posibility("Leuchtturm1 - Unten", 2, "/P2/P2-3/A2-3/assets/unten/Leuchtturm1_u.png");

    export let selectedElements: Selected = {top: posibilityTop[0], middle: posibilityMiddle[0], bottom: posibilityBottom[0]};

    // Leuchtturm 2
    let lt2Top: Posibility = new Posibility("Leuchtturm2 - Oben", 0, "/P2/P2-3/A2-3/assets/oben/Leuchtturm2_o.png");
    let lt2Middle: Posibility = new Posibility("Leuchtturm2 - Mitte", 1, "/P2/P2-3/A2-3/assets/mitte/Leuchtturm2_m.png");
    let lt2Bottom: Posibility = new Posibility("Leuchtturm2 - Unten", 2, "/P2/P2-3/A2-3/assets/unten/Leuchtturm2_u.png");
    // Leuchtturm 3
    let lt3Top: Posibility = new Posibility("Leuchtturm3 - Oben", 0, "/P2/P2-3/A2-3/assets/oben/Leuchtturm3_o.png");
    let lt3Middle: Posibility = new Posibility("Leuchtturm3 - Mitte", 1, "/P2/P2-3/A2-3/assets/mitte/Leuchtturm3_m.png");
    let lt3Bottom: Posibility = new Posibility("Leuchtturm3 - Unten", 2, "/P2/P2-3/A2-3/assets/unten/Leuchtturm3_u.png");
    // Leuchtturm 4
    let lt4Top: Posibility = new Posibility("Leuchtturm4 - Oben", 0, "/P2/P2-3/A2-3/assets/oben/Leuchtturm4_o.png");
    let lt4Middle: Posibility = new Posibility("Leuchtturm4 - Mitte", 1, "/P2/P2-3/A2-3/assets/mitte/Leuchtturm4_m.png");
    let lt4Bottom: Posibility = new Posibility("Leuchtturm4 - Unten", 2, "/P2/P2-3/A2-3/assets/unten/Leuchtturm4_u.png");
}