namespace P2_4 {
    export let posibilityTop: Posibility[] = [];
    export let posibilityMiddle: Posibility[] = [];
    export let posibilityBottom: Posibility[] = [];

    // allPosArrayFromJSON('{"top":[{"name":"Leuchtturm4 - Oben","type":0,"link":"assets/oben/Leuchtturm4_o.png"},{"name":"Leuchtturm3 - Oben","type":0,"link":"assets/oben/Leuchtturm3_o.png"},{"name":"Leuchtturm2 - Oben","type":0,"link":"assets/oben/Leuchtturm2_o.png"},{"name":"Leuchtturm1 - Oben","type":0,"link":"assets/oben/Leuchtturm1_o.png"}],"middle":[{"name":"Leuchtturm4 - Mitte","type":1,"link":"assets/mitte/Leuchtturm4_m.png"},{"name":"Leuchtturm3 - Mitte","type":1,"link":"assets/mitte/Leuchtturm3_m.png"},{"name":"Leuchtturm2 - Mitte","type":1,"link":"assets/mitte/Leuchtturm2_m.png"},{"name":"Leuchtturm1 - Mitte","type":1,"link":"assets/mitte/Leuchtturm1_m.png"}],"bottom":[{"name":"Leuchtturm4 - Unten","type":2,"link":"assets/unten/Leuchtturm4_u.png"},{"name":"Leuchtturm3 - Unten","type":2,"link":"assets/unten/Leuchtturm3_u.png"},{"name":"Leuchtturm2 - Unten","type":2,"link":"assets/unten/Leuchtturm2_u.png"},{"name":"Leuchtturm1 - Unten","type":2,"link":"assets/unten/Leuchtturm1_u.png"}]}');

    // Oben
    let lt1Top: Posibility = new Posibility("Leuchtturm1 - Oben", 0, "assets/oben/Leuchtturm1_o.png");
    // Mitte
    let lt1Middle: Posibility = new Posibility("Leuchtturm1 - Mitte", 1, "assets/mitte/Leuchtturm1_m.png");
    // Unten
    let lt1Bottom: Posibility = new Posibility("Leuchtturm1 - Unten", 2, "assets/unten/Leuchtturm1_u.png");

    // Leuchtturm 2
    let lt2Top: Posibility = new Posibility("Leuchtturm2 - Oben", 0, "assets/oben/Leuchtturm2_o.png");
    let lt2Middle: Posibility = new Posibility("Leuchtturm2 - Mitte", 1, "assets/mitte/Leuchtturm2_m.png");
    let lt2Bottom: Posibility = new Posibility("Leuchtturm2 - Unten", 2, "assets/unten/Leuchtturm2_u.png");
    // Leuchtturm 3
    let lt3Top: Posibility = new Posibility("Leuchtturm3 - Oben", 0, "assets/oben/Leuchtturm3_o.png");
    let lt3Middle: Posibility = new Posibility("Leuchtturm3 - Mitte", 1, "assets/mitte/Leuchtturm3_m.png");
    let lt3Bottom: Posibility = new Posibility("Leuchtturm3 - Unten", 2, "assets/unten/Leuchtturm3_u.png");
    // Leuchtturm 4
    let lt4Top: Posibility = new Posibility("Leuchtturm4 - Oben", 0, "assets/oben/Leuchtturm4_o.png");
    let lt4Middle: Posibility = new Posibility("Leuchtturm4 - Mitte", 1, "assets/mitte/Leuchtturm4_m.png");
    let lt4Bottom: Posibility = new Posibility("Leuchtturm4 - Unten", 2, "assets/unten/Leuchtturm4_u.png");

    allPosArrayFromJSON(allPosArrayToJSON());

    export function allPosArrayToJSON(): string {
        let allPosArray: AllPosArrayInterface = {top: posibilityTop, middle: posibilityMiddle, bottom: posibilityBottom};
        let json: string =  JSON.stringify(allPosArray);
        console.log(json);
        return json;
    }

    export function allPosArrayFromJSON(jsonStr: string): void {
        posibilityTop = [];
        posibilityMiddle = [];
        posibilityBottom = [];
        let json: AllPosArrayInterface = JSON.parse(jsonStr);
        Object.keys(json).forEach(key => {
            if (key == "top" || key == "middle" || key == "bottom") {
                let posIf: PosibilityInterface[] = json[key];
                posIf.forEach(pos => {
                    new Posibility(pos.name, pos.type, pos.link);
                });
            }
        });
    }
}