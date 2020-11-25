namespace P2_3_2_3 {
    export let posibilityTop: Posibility[] = [];
    export let posibilityMittle: Posibility[] = [];
    export let posibilityBottom: Posibility[] = [];

    // Oben
    let lt1Top: Posibility = new Posibility("Leuchtturm1 - Oben", 0, "/P2/P2-3/A2-3/assets/oben/Leuchtturm1_o.png");
    // Mitte
    let lt1Middle: Posibility = new Posibility("Leuchtturm1 - Mitte", 1, "/P2/P2-3/A2-3/assets/mitte/Leuchtturm1_m.png");
    // Unten
    let lt1Bottom: Posibility = new Posibility("Leuchtturm1 - Unten", 2, "/P2/P2-3/A2-3/assets/unten/Leuchtturm1_u.png");

    export let selectedElements: Selected = {top: posibilityTop[0], middle: posibilityMittle[0], bottom: posibilityBottom[0]};
}