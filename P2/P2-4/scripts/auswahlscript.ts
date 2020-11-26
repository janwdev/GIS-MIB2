namespace P2_4 {
    let selected: Posibility;
    let htmlImgs: HTMLImageElement[] = [];
    let path: string = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);

    let imageTop: HTMLImageElement = <HTMLImageElement>document.getElementById("picTop");
    let imageMiddle: HTMLImageElement = <HTMLImageElement>document.getElementById("picMiddle");
    let imageButtom: HTMLImageElement = <HTMLImageElement>document.getElementById("picBottom");

    window.addEventListener("load", loadContent);

    function loadContent(): void {
        let json: string = sessionStorage.getItem(keyConfig);
        if (json != null) {
            selectedFromJSON(json);
        }
        loadImages();
        if (path == "selTop.html") {
            selected = selectedElements.top;
            addContentToDetailWindow(posibilityTop);
        } else if (path == "selMiddle.html") {
            selected = selectedElements.middle;
            addContentToDetailWindow(posibilityMiddle);
        } else if (path == "selBottom.html") {
            selected = selectedElements.bottom;
            addContentToDetailWindow(posibilityBottom);
        }
    }

    function loadImages(): void {
        if (selectedElements.top != undefined) {
            imageTop.src = selectedElements.top.link;
        }
        if (selectedElements.middle != undefined) {
            imageMiddle.src = selectedElements.middle.link;
        }
        if (selectedElements.bottom != undefined) {
            imageButtom.src = selectedElements.bottom.link;
        }
        console.log(selectedElements);
    }

    function addContentToDetailWindow(images: Posibility[]): void {
        let divToAdd: HTMLDivElement = <HTMLDivElement>document.getElementById("selectDetailImgSection");
        images.forEach(img => {
            let imgElement: HTMLImageElement = document.createElement("img");
            htmlImgs.push(imgElement);
            imgElement.src = img.link;
            if (img == selected) {
                setSelected(img, imgElement);
            }
            imgElement.addEventListener("click", function (): void {
                setSelected(img, imgElement);
            });
            divToAdd.appendChild(imgElement);
        });
    }

    function setSelected(img: Posibility, imgElement: HTMLImageElement): void {
        selected = img;
        imgElement.className += " selectedImage";
        console.log("selected: " + img.name);
        htmlImgs.forEach(htmlImg => {
            if (htmlImg != imgElement) {
                htmlImg.classList.remove("selectedImage");
            }
        });
    }

    let btSave: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btSave");
    btSave.addEventListener("click", saveSelection);
    let btCancel: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btAbort");
    btCancel.addEventListener("click", cancel);

    function saveSelection(): void {
        if (path == "selTop.html") {
            selectedElements.top = selected;
        } else if (path == "selMiddle.html") {
            selectedElements.middle = selected;
        } else if (path == "selBottom.html") {
            selectedElements.bottom = selected;
        }
        selectedToJSON();
        window.open("index.html", "_self");
        console.log("selected: " + selected.name);
    }

    function cancel(): void {
        window.open("index.html", "_self");
        console.log("Abgebrochen");
    }
}