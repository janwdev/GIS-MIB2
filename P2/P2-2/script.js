"use strict";
var P2_2_1;
(function (P2_2_1) {
    console.log("Aufgabe 2-2_1");
    console.log("Min ist: " + min(0, 2, 3, -1, 5));
    function min(...nr) {
        let smallest = nr[0];
        for (let index = 0; index < nr.length; index++) {
            const actNr = nr[index];
            if (actNr < smallest) {
                smallest = actNr;
            }
        }
        return smallest;
    }
    console.log("50 ist gerade: " + isEven(50));
    console.log("75 ist gerade: " + isEven(75));
    // console.log("-1 ist gerade: " + isEven(-1)); // geht eigentlich nicht, da minuswert und dadurch unendliche Rekursion
    console.log("-1 ist gerade: " + isEven(-1));
    function isEven(nr) {
        // Loesung fuer negative Zahlen
        if (nr < 0) {
            nr = 0 - nr;
        }
        // Normale Aufgabe
        if (nr == 0) {
            return true;
        }
        else if (nr == 1) {
            return false;
        }
        else {
            return isEven(nr - 2);
        }
    }
    // let stAnna: Student = {surName: "Anna", lastName: "Peters", age: 22, matNr: 12345, sex: "female"};
    // let stSaskia: Student = {surName: "Saskia", lastName: "Müller", age: 24, matNr: 5678, sex: "female"};
    // let stBruno: Student = {surName: "Bruno", lastName: "Mayer", age: 32, matNr: 1585, sex: "male"};
    // let stArray: Student[] = [stAnna, stSaskia, stBruno];
    // stArray.push({surName: "Paul", lastName: "Novac", age: 19, matNr: 44345, sex: "male"});
    // console.log(stAnna.surName + " ist " + stAnna.age + " Jahre alt");
    // interface Student {
    //     surName: String;
    //     lastName: String;
    //     age: number;
    //     matNr: number;
    //     sex: String;
    // }
    // for (const studi of stArray) {
    //     showInfo(studi);
    // }
    // function showInfo(studi: Student): void {
    //     console.log("Name: " + studi.surName + " " + studi.lastName);
    //     console.log("Alter: " + studi.age);
    //     console.log("Geschlecht: " + studi.sex);
    //     console.log("Mat.-Nr.: " + studi.matNr);
    //     console.log();
    // }
    class Student {
        constructor(_surName, _lastName, _age, _matNr, _sex) {
            this.surName = _surName;
            this.lastName = _lastName;
            this.age = _age;
            this.matNr = _matNr;
            this.sex = _sex;
        }
        showInfo() {
            console.log("Name: " + this.surName + " " + this.lastName);
            console.log("Alter: " + this.age);
            console.log("Geschlecht: " + this.sex);
            console.log("Mat.-Nr.: " + this.matNr);
        }
    }
    let stAnna = new Student("Anna", "Peters", 22, 12345, "female");
    stAnna.showInfo();
})(P2_2_1 || (P2_2_1 = {}));
var P2_2_2;
(function (P2_2_2) {
    console.log();
    console.log("Aufgabe 2-2_2");
    function backwards(array) {
        let backwardArray = [];
        for (let index = array.length - 1; index >= 0; index--) {
            backwardArray[index] = array[array.length - index - 1];
        }
        return backwardArray;
    }
    function join(...arrays) {
        let backArray = [];
        let retIndex = 0;
        arrays.forEach(array => {
            for (let index = 0; index < array.length; index++) {
                backArray[retIndex] = array[index];
                retIndex++;
            }
        });
        return backArray;
    }
    function split(array, i1, i2) {
        if (i1 < 0 || i2 < 0) {
            return undefined;
        }
        else if (i2 < i1) {
            let temp = i1;
            i1 = i2;
            i2 = temp;
        }
        else if (i2 > array.length) {
            return undefined;
        }
        let backArray = [];
        let i = 0;
        for (let index = i1; index <= i2; index++) {
            backArray[i] = array[index];
            i++;
        }
        return backArray;
    }
    let arr = [5, 42, 17, 2018, -10, 60, -10010];
    let arrBack = backwards(arr);
    console.log(arr);
    console.log(arrBack);
    console.log(join(arr, [15, 9001, -440]));
    console.log(join([123, 666, -911], arr, [15, 9001, -440, 1024])); // Bonus b)
    arr = split(arr, 0, 4);
    console.log(arr);
    console.log(split(arr, 1, 2));
    console.log(split(arr, 2, 0)); // Bonus c)
    console.log(split(arr, -1, 2)); // Bonus c)
    console.log(split(arr, 0, 7)); // Bonus c)
})(P2_2_2 || (P2_2_2 = {}));
var P2_2_3;
(function (P2_2_3) {
    let canvas = document.getElementById("myFirstCanvas");
    let context = canvas.getContext("2d");
    // Himmel
    context.fillStyle = "blue";
    context.fillRect(0, 0, 800, 600);
    // Grass
    context.fillStyle = "green";
    context.fillRect(0, 300, 800, 200);
    // Wolke
    context.beginPath();
    context.moveTo(170, 80);
    context.bezierCurveTo(130, 100, 130, 150, 230, 150);
    context.bezierCurveTo(250, 180, 320, 180, 340, 150);
    context.bezierCurveTo(420, 150, 420, 120, 390, 100);
    context.bezierCurveTo(430, 40, 370, 30, 340, 50);
    context.bezierCurveTo(320, 5, 250, 20, 250, 50);
    context.bezierCurveTo(200, 5, 150, 20, 170, 80);
    context.fillStyle = "#8ED6FF";
    context.fill();
    context.closePath();
    // Baum
    context.fillStyle = "brown";
    context.fillRect(175, 100, 50, 300);
    context.beginPath();
    context.fillStyle = "green";
    context.arc(200, 150, 75, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
    // Haus
    context.fillStyle = "yellow";
    context.fillRect(500, 250, 200, 200);
    context.beginPath();
    context.fillStyle = "red";
    context.moveTo(470, 250);
    context.lineTo(730, 250);
    context.lineTo(600, 50);
    context.fill();
    context.closePath();
    class Rechteck {
        constructor() {
            this.maxWidth = 750;
            this.maxHeight = 450;
            this.x1 = this.getRandomInt(0, this.maxWidth);
            this.x2 = this.getRandomInt(this.x1, this.maxWidth);
            this.y1 = this.getRandomInt(0, this.maxHeight);
            this.y2 = this.getRandomInt(this.y1, this.maxHeight);
        }
        getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        }
        drawRect() {
            context.beginPath();
            context.fillStyle = "purple";
            context.strokeStyle = "black";
            context.lineWidth = 5;
            context.moveTo(this.x1, this.y1);
            context.lineTo(this.x2, this.y1);
            context.lineTo(this.x2, this.y2);
            context.lineTo(this.x1, this.y2);
            context.closePath();
            context.stroke();
            context.fill();
            context.closePath();
        }
    }
    let rechtArray = [new Rechteck(), new Rechteck(), new Rechteck()];
    for (const recht of rechtArray) {
        recht.drawRect();
    }
    // TODO f und g
})(P2_2_3 || (P2_2_3 = {}));
//# sourceMappingURL=script.js.map