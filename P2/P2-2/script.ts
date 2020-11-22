namespace P2_2_1 {
    console.log("Aufgabe 2-2_1");

    console.log("Min ist: " + min(0, 2, 3, -1, 5));

    function min(...nr: number[]): number {
        let smallest: number = nr[0];
        for (let index: number = 0; index < nr.length; index++) {
            const actNr: number = nr[index];
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

    function isEven(nr: number): boolean {
        // Loesung fuer negative Zahlen
        if (nr < 0) {
            nr = 0 - nr;
        }
        // Normale Aufgabe
        if (nr == 0) {
            return true;
        } else if (nr == 1) {
            return false;
        } else {
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
        surName: String;
        lastName: String;
        age: number;
        matNr: number;
        sex: String;

        constructor (_surName: String, _lastName: String, _age: number, _matNr: number, _sex: String) {
            this.surName = _surName;
            this.lastName = _lastName;
            this.age = _age;
            this.matNr = _matNr;
            this.sex = _sex;
        }

        showInfo(): void {
            console.log("Name: " + this.surName + " " + this.lastName);
            console.log("Alter: " + this.age);
            console.log("Geschlecht: " + this.sex);
            console.log("Mat.-Nr.: " + this.matNr);
        }
    }
    let stAnna: Student = new Student("Anna", "Peters", 22, 12345, "female");
    stAnna.showInfo();
}

namespace P2_2_2 {
    console.log();
    console.log("Aufgabe 2-2_2");

    function backwards(array: number[]): number[] {
        let backwardArray: number[];
        for (let index: number = 0; index < array.length; index++) {
            const element = array[index];
            
        }
        return backwardArray;
    }
}