namespace P2_4 {
    export class Posibility {
        name: string;
        type: number;
        link: string;

        constructor(_name: string, _type: number, _link: string) {
            this.name = _name;
            this.type = _type;
            this.link = _link;
            if (this.type == 0) {
                posibilityTop.push(this);
            } else if (this.type == 1) {
                posibilityMiddle.push(this);
            } else if (this.type == 2) {
                posibilityBottom.push(this);
            }
        }

        getInterface(): PosibilityInterface {
            return { name: this.name, type: this.type, link: this.link };
        }
    }

    export interface PosibilityInterface {
        name: string;
        type: number;
        link: string;
    }

    export interface Selected {
        top: Posibility;
        middle: Posibility;
        bottom: Posibility;
    }
    
    function selectedToJSON(): string {
        let json: string;
        json = JSON.stringify(selectedElements);
        console.log(json);

        return json;
    }

    function selectedFromJSON(jsonStr: string): void {
        let json: Selected = JSON.parse(jsonStr);
        Object.keys(json).forEach(key => {
            if (key == "top") {
                let pos: PosibilityInterface = json[key];
                let topPos: Posibility = new Posibility(pos.name, pos.type, pos.link);
                selectedElements.top = topPos;
            } else if (key == "middle") {
                let pos: PosibilityInterface = json[key];
                let middlePos: Posibility = new Posibility(pos.name, pos.type, pos.link);
                selectedElements.middle = middlePos;
            } else if (key == "bottom") {
                let pos: PosibilityInterface = json[key];
                let bottomPos: Posibility = new Posibility(pos.name, pos.type, pos.link);
                selectedElements.bottom = bottomPos;
            }
        });
    }

    let path: string = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);
    if (path == "index.html" || path == "") {
        let imageTop: HTMLImageElement = <HTMLImageElement>document.getElementById("picTop");
        let imageMiddle: HTMLImageElement = <HTMLImageElement>document.getElementById("picMiddle");
        let imageButtom: HTMLImageElement = <HTMLImageElement>document.getElementById("picBottom");

        window.addEventListener("load", finishedLoading);

        function finishedLoading(): void {
            //TODO only testing
            let json: string = selectedToJSON();
            selectedElements.top = undefined;
            selectedElements.middle = undefined;
            selectedElements.bottom = undefined;
            selectedFromJSON(json);
            loadImages();
        }

        function loadImages(): void {
            imageTop.src = selectedElements.top.link;
            imageMiddle.src = selectedElements.middle.link;
            imageButtom.src = selectedElements.bottom.link;
            console.log(selectedElements);
        }

        let btEditTop: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btTop");
        btEditTop.addEventListener("click", openDetailTop);
        let btEditMiddle: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btMiddle");
        btEditMiddle.addEventListener("click", openDetailMiddle);
        let btEditBottom: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btBottom");
        btEditBottom.addEventListener("click", openDetailBottom);

        function openDetailTop(): void {
            window.open("selTop.html", "_self");
            console.log("Open Detail Top");
        }
        function openDetailMiddle(): void {
            window.open("selMiddle.html", "_self");
            console.log("Open Detail Middle");
        }
        function openDetailBottom(): void {
            window.open("selBottom.html", "_self");
            console.log("Open Detail Bottom");
        }
    }
}