namespace P2_3_1 {

    console.log("Aufgabe P2-3_1");
    let drawDiv: HTMLDivElement = <HTMLDivElement>document.getElementById("zeichenflaeche");
    drawDiv.style.position = "relative";
    drawDiv.style.width = "800px";
    drawDiv.style.height = "600px";
    
    // Himmel
    let sky: HTMLParagraphElement = document.createElement("div");
    sky.style.backgroundColor = "blue";
    sky.style.width = "100%";
    sky.style.height = "100%";
    drawDiv.appendChild(sky);

    // Wiese
    let grass: HTMLParagraphElement = document.createElement("div");
    grass.style.backgroundColor = "green";
    grass.style.width = "100%";
    grass.style.height = "200px";
    grass.style.position = "absolute";
    grass.style.bottom = "0px";
    drawDiv.appendChild(grass);

    // Haus
    let roof: HTMLParagraphElement = document.createElement("div");
    roof.setAttribute("style", "width: 0; height: 0; border-style: solid; border-width: 0 130px 200px 130px; border-color: transparent transparent #ff0000 transparent;");
    roof.style.position = "absolute";
    roof.style.top = "70px";
    roof.style.right = "50px";
    drawDiv.appendChild(roof);
    let house: HTMLParagraphElement = document.createElement("div");
    house.style.backgroundColor = "yellow";
    house.style.width = "200px";
    house.style.height = "200px";
    house.style.position = "absolute";
    house.style.top = "270px";
    house.style.left = "520px";
    drawDiv.appendChild(house);

    // Baum
    let treeBottom: HTMLParagraphElement = document.createElement("div");
    treeBottom.style.backgroundColor = "brown";
    treeBottom.style.width = "50px";
    treeBottom.style.height = "400px";
    treeBottom.style.position = "absolute";
    treeBottom.style.top = "140px";
    treeBottom.style.left = "175px";
    drawDiv.appendChild(treeBottom);
    let treeTop: HTMLParagraphElement = document.createElement("div");
    treeTop.style.backgroundColor = "green";
    treeTop.style.width = "200px";
    treeTop.style.height = "200px";
    treeTop.style.position = "absolute";
    treeTop.style.borderRadius = "50%";
    treeTop.style.top = "80px";
    treeTop.style.left = "100px";
    drawDiv.appendChild(treeTop);

    let resetBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("reset");
    resetBtn.addEventListener("click", reset);

    let newRectBtn: HTMLButtonElement = <HTMLButtonElement>document.getElementById("newRect");
    newRectBtn.addEventListener("click", newRect);

    let divs: HTMLDivElement[] = [];

    function reset(): void {
        console.log("Reset");
        divs.forEach(element => {
            drawDiv.removeChild(element);
        });
        divs = [];
    }

    function getRandomInt(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function newRect(): void {
        console.log("New Rect");
        let rect: HTMLParagraphElement = document.createElement("div");
        rect.style.position = "absolute";
        rect.style.backgroundColor = "gray";
        rect.style.border = "solid";
        let width: number = getRandomInt(10, 300);
        let height: number = getRandomInt(10, 200);
        rect.style.width = width + "px";
        rect.style.height = height + "px";
        rect.style.top = getRandomInt(0, 600 - height) + "px";
        rect.style.left = getRandomInt(0, 800 - width) + "px";
        drawDiv.appendChild(rect);
        divs.push(rect);
    }
}