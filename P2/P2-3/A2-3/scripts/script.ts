namespace P2_3_2_3 {
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
    }

    export interface Selected {
        top: Posibility;
        middle: Posibility;
        bottom: Posibility;
    }

    if (window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1) == "index.html") {
        let imageTop: HTMLImageElement = <HTMLImageElement>document.getElementById("picTop");
        let imageMiddle: HTMLImageElement = <HTMLImageElement>document.getElementById("picMiddle");
        let imageButtom: HTMLImageElement = <HTMLImageElement>document.getElementById("picBottom");

        window.addEventListener("load", loadImages);

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