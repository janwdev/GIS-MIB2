namespace P2_5 {
    let selected: Posibility;
    let htmlImgs: HTMLImageElement[] = [];
    let path: string = window.location.pathname.substring(window.location.pathname.lastIndexOf("/") + 1);

    let imageTop: HTMLImageElement = <HTMLImageElement>document.getElementById("picTop");
    let imageMiddle: HTMLImageElement = <HTMLImageElement>document.getElementById("picMiddle");
    let imageButtom: HTMLImageElement = <HTMLImageElement>document.getElementById("picBottom");

    let btSave: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btSave");
    btSave.addEventListener("click", saveSelection);
    let btCancel: HTMLButtonElement = <HTMLButtonElement>document.getElementById("btAbort");

    window.addEventListener("load", loadContent);

    async function loadContent(): Promise<void> {
        // Moeglichkeiten aus JSON laden
        await getPossibilitysFromURL("data.json");

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

        if (selectedElements.top == undefined || selectedElements.middle == undefined || selectedElements.bottom == undefined) {
            btSave.textContent = "Weiter";
            btCancel.textContent = "Zurück";
            if (path == "selTop.html") {
                btCancel.disabled = true;
            }
            btCancel.addEventListener("click", back);
        } else {
            btSave.textContent = "Speichern";
            btCancel.textContent = "Abbrechen";
            btCancel.addEventListener("click", cancel);
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

    function back(): void {
        let pathToOpen: string;
        if (path == "selMiddle.html") {
            pathToOpen = "selTop.html";
        } else if (path == "selBottom.html") {
            pathToOpen = "selMiddle.html";
        }
        window.open(pathToOpen, "_self");
    }
}