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
                posibilityMittle.push(this);
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

    let imageTop: HTMLImageElement = <HTMLImageElement>document.getElementById("picTop");
    let imageMiddle: HTMLImageElement = <HTMLImageElement>document.getElementById("picMiddle");
    let imageButtom: HTMLImageElement = <HTMLImageElement>document.getElementById("picBottom");

    window.onload = function (): void {
        //TODO geht das anders
        loadImages();
    };

    function loadImages(): void {
        imageTop.src = selectedElements.top.link;
        imageMiddle.src = selectedElements.middle.link;
        imageButtom.src = selectedElements.bottom.link;
    }
}