import { P2_3_2_3_script as script } from "./script";

namespace P2_3_2_3_data {
    let actId: number = 0;
    let testPosibility: script.Posibility = {id: actId, name: "oben1", link: "/assets/oben1.jpg", category: 0, form: "rund", color: "brown"};
    actId++;
    
    let testSelected: script.Selected = {idTop: testPosibility.id, idBottom: undefined, idMiddle: undefined};
}