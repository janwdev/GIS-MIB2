namespace P2_5 {
    export let posibilityTop: Posibility[] = [];
    export let posibilityMiddle: Posibility[] = [];
    export let posibilityBottom: Posibility[] = [];

    export function allPosArrayToJSON(): string {
        let allPosArray: AllPosArrayInterface = { top: posibilityTop, middle: posibilityMiddle, bottom: posibilityBottom };
        let json: string = JSON.stringify(allPosArray);
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
                    let posibility: Posibility = new Posibility(pos.name, pos.type, pos.link);
                    if (posibility.type == 0) {
                        posibility.removeSameFromArray(posibilityTop, posibility.name);
                        posibilityTop.unshift(posibility);
                    } else if (posibility.type == 1) {
                        posibility.removeSameFromArray(posibilityMiddle, posibility.name);
                        posibilityMiddle.unshift(posibility);
                    } else if (posibility.type == 2) {
                        posibility.removeSameFromArray(posibilityBottom, posibility.name);
                        posibilityBottom.unshift(posibility);
                    }
                });
            }
        });
    }

    export async function getPossibilitysFromURL(_url: RequestInfo): Promise<void> {
        let response: Response = await fetch(_url);
        let json: string = await response.text();
        allPosArrayFromJSON(json);
    }

}