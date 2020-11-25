namespace P2_3_2_3 {
    let selected: Posibility;
    let htmlImgs: HTMLImageElement[] = [];

    window.addEventListener("load", loadContent);

    function loadContent(): void {
        if (window.location.pathname == "/P2/P2-3/A2-3/selTop.html") {
            selected = selectedElements.top;
            addContentToDetailWindow(posibilityTop);
        } else if (window.location.pathname == "/P2/P2-3/A2-3/selMiddle.html") {
            selected = selectedElements.middle;
            addContentToDetailWindow(posibilityMiddle);
        } else if (window.location.pathname == "/P2/P2-3/A2-3/selBottom.html") {
            selected = selectedElements.bottom;
            addContentToDetailWindow(posibilityBottom);
        }
    }

    function addContentToDetailWindow(images: Posibility[]): void {
        let divToAdd: HTMLDivElement = <HTMLDivElement>document.getElementById("selectDetailImgSection");
        images.forEach(img => {
            let imgElement: HTMLImageElement = document.createElement("img");
            htmlImgs.push(imgElement);
            imgElement.className += "detailImg";
            imgElement.src = img.link;
            if (img == selected) {
                setSelected(img, imgElement);
            }
            imgElement.addEventListener("click", function(): void {
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
        if (window.location.pathname == "/P2/P2-3/A2-3/selTop.html") {
            selectedElements.top = selected;
        } else if (window.location.pathname == "/P2/P2-3/A2-3/selMiddle.html") {
            selectedElements.middle = selected;
        } else if (window.location.pathname == "/P2/P2-3/A2-3/selBottom.html") {
            selectedElements.bottom = selected;
        }
        window.open("index.html", "_self");
        console.log("selected: " + selected.name);
    }

    function cancel(): void {
        window.open("index.html", "_self");
        console.log("Abgebrochen");
    }
}