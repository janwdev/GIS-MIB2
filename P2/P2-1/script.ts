// Aufgabe 5
console.log("Aufgabe 5");

let erg: number = multiply(2, 7);
console.log("Ergebnis von 2*7\n" + erg);

console.log("Größere Zahl von 2 und 3");
erg = max(2, 3);
if (erg != undefined) {
    console.log("Größer ist: " + erg);
} else {
    console.log("Zahlen gleich groß");
}

console.log("Alle Werte von 0 bis 100 aufaddiert");
erg = 0;
let i: number = 1;
while (i <= 100) {
    erg = erg + i;
    i++;
}
console.log(erg);

console.log("10 Zufallswerte zwischen 0 und 100");
for (let index: number = 0; index < 10; index++) {
    let max: number = 100;
    let min: number = 0;
    min = Math.ceil(min);
    max = Math.floor(max);
    console.log((Math.floor(Math.random() * (max - min + 1)) + min));
}

console.log("Factorial of 4 (24)");
erg = factorial(4);
console.log(erg);

leapyears();

function leapyears(): void {
    console.log("Alle Schaltjahre von 1900 bis heute");
    let date: Date = new Date();
    let today: number = date.getFullYear();
    for (let year: number = 1900; year <= today; year++) {
        if (((year % 4) == 0 && (year % 100) != 0) || (year % 400) == 0) {
            console.log(year);
        }
    }
}

function factorial(n: number): number {
    if (n < 1) {
        return 1;
    }
    let erg: number = 1;
    for (let index: number = 1; index <= n; index++) {
        erg = erg * index;
    }
    return erg;
}


function multiply(x1: number, x2: number): number {
    return(x1 * x2);
}

function max(x1: number, x2: number): number {
    let bigger: number;
    if (x1 > x2) {
        bigger = x1;
    } else if (x2 > x1) {
        bigger = x2;
    } else {
        bigger = undefined;
    }
    return bigger;
}


// Aufgabe 6
console.log("\nAufgabe 6\n");

for (let zeilen: number = 0; zeilen < 7; zeilen++) {
    let output: string = "";
    for (let index: number = 0; index <= zeilen; index++) {
        output = output + "#";
    }
    console.log(output);
}

/*
for (let index: number = 1; index <= 100; index++) {
    let output: string = index.toString();
    if ((index % 3) == 0) {
        output = "Fizz";
    } else if ((index % 5) == 0) {
        output = "Buzz";
    }
    console.log(output);
}
*/

for (let index: number = 1; index <= 100; index++) {
    let output: string = index.toString();
    if ((index % 3) == 0 && (index % 5) == 0) { // Oder durch 15
        output = "FizzBuzz";
    } else if ((index % 3) == 0) {
        output = "Fizz";
    } else if ((index % 5) == 0) {
        output = "Buzz";
    }
    console.log(output);
}

let size: number = 8;
let output: string = "";
for (let zeile: number = 0; zeile < size; zeile++) {
    for (let spalte: number = 0; spalte < size; spalte++) {
        if ((zeile + spalte) % 2) {
            output = output + " ";
        } else {
            output = output + "#";
        }
    }
    output += "\n";
}
// console.log(output);
output = "";
chessintelligent(8, 8);

function chessintelligent(sizeZ: number, sizeS: number): void {
    for (let zeile: number = 0; zeile < sizeZ; zeile++) {
        for (let spalte: number = 0; spalte < sizeS; spalte++) {
            if ((zeile + spalte) % 2) {
                output = output + " ";
            } else {
                output = output + "#";
            }
        }
        output += "\n";
    }
    console.log(output);
}