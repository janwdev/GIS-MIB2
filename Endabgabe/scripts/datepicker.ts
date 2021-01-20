// class from https://github.com/NomisIV/js-datepicker, aber angepasst
namespace Twitter {
    /* ======== Time Constants ======== */
    /* exported SECOND MINUTE HOUR DAY WEEK WEEKDAYS WEEKDAYS_SHORT MONTHS MONTHS_SHORT*/
    const SECOND: number = 1000;
    const MINUTE: number = SECOND * 60;
    const HOUR: number = MINUTE * 60;
    const DAY: number = HOUR * 24;

    const WEEKDAYS_SHORT: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const MONTHS: string[] = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    const MONTHS_SHORT: string[] = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    /* ======== Datepicker Class ======== */
    export interface DatepickerSettings {
        first_date?: Date;
        last_date: Date;
        initial_date?: Date;
        first_day_of_week?: string;
        enabled_days(d: Date): boolean;
        format(d: Date): string;
    }

    /* exported Datepicker */
    export class Datepicker {
        host: HTMLInputElement;
        frame: HTMLDivElement;

        firstDate: Date;
        lastDate: Date;

        enabledDays: Function;
        format: Function;
        protected date: Date;
        protected sunday: boolean;
        private displayState: boolean;

        constructor(host: HTMLInputElement, s: DatepickerSettings) {
            this.host = host;
            this.frame = document.createElement("div");
            this.frame.id = host.id + "-datepicker";
            this.frame.className = "datepicker";

            // Run config if settings are present
            if (s) this.config(s);

            // Show conditions
            window.onresize = () => {
                if (this.displayState) this.show(true);
            };

            this.host.onclick = () => {
                if (this.displayState) this.show(false);
                else {
                    this.load("days");
                    this.show(true);
                }
            };
        }
        show(state: boolean): void {
            if (state) {
                const hostRect: DOMRect = this.host.getBoundingClientRect();
                this.host.insertAdjacentElement("afterend", this.frame);
                const frameRect: DOMRect = this.frame.getBoundingClientRect();

                const x: number = hostRect.x + (hostRect.width - frameRect.width) / 2;
                const y: number = hostRect.y + hostRect.height + 16;

                this.frame.style.setProperty("top", y + "px");
                this.frame.style.setProperty("left", x + "px");
            } else this.frame.remove();
            this.displayState = state;
        }

        config(s: DatepickerSettings): void {
            // Error checking
            if (s.initial_date && !(s.initial_date instanceof Date))
                console.error("Date is not of type Date");

            if (s.first_date && !(s.first_date instanceof Date))
                console.error("Firstdate is not of type Date");

            if (s.last_date && !(s.last_date instanceof Date))
                console.error("Lastdate is not of type Date");

            if (
                s.first_date &&
                s.last_date &&
                s.first_date.getTime() >= s.last_date.getTime()
            )
                console.error("Lastdate cannot precede Firstdate");

            if (s.enabled_days && typeof s.enabled_days != "function")
                console.error("enabled_days is not of type function");

            if (s.enabled_days && typeof s.format != "function")
                console.error("format is not of type function");

            if (s.first_day_of_week && typeof s.first_day_of_week != "string")
                console.error("First day of week is not a string");

            // Set default settins
            this.firstDate = s.first_date || this.firstDate;
            this.lastDate = s.last_date || this.lastDate;
            this.enabledDays =
                s.enabled_days ||
                this.enabledDays ||
                (() => {
                    return true;
                });
            this.format =
                s.format ||
                this.format ||
                ((d: Date) => {
                    return d.toString();
                });
            // If the string includes "sun" (case insensitive)
            if (s.first_day_of_week)
                this.sunday = s.first_day_of_week.search(/sun/gi) != -1;
            else this.sunday = false;

            // Set the default date
            if (s.initial_date) this.date = s.initial_date;
            else if (
                (this.lastDate ? Date.now() < this.lastDate.getTime() : true) &&
                (this.firstDate ? Date.now() > this.firstDate.getTime() : true)
            )
                this.date = new Date();
            else if (this.firstDate && Date.now() < this.firstDate.getTime())
                this.date = this.firstDate;
            else this.date = this.lastDate;

            if (this.enabledDays(this.date))
                this.host.value = this.format(this.date);
        }

        getDate(): Date {
            return this.date;
        }

        setDate(date: Date): void {
            // error checking
            if (date < this.firstDate || date > this.lastDate)
                console.error(date + " is outside date range");
            if (!this.enabledDays(date)) {
                date = new Date(date.getTime() + DAY);
                this.setDate(date);
                return;
            }
            this.date = date;
            this.host.value = this.format(date);
            this.host.dispatchEvent(new Event("change"));
        }

        // Load
        private load(mode: "days" | "months" | "years"): void {
            this.frame.innerHTML = "";

            // Head
            const head: HTMLDivElement = document.createElement("div");
            this.frame.append(head);
            head.className = "head";

            // Prev
            const prev: HTMLSpanElement = document.createElement("span");
            head.append(prev);
            prev.innerHTML = "<<";

            // Center
            const center: HTMLSpanElement = document.createElement("span");
            head.append(center);

            // Next
            const next: HTMLSpanElement = document.createElement("span");
            head.append(next);
            next.innerHTML = ">>";

            // Table
            const table: HTMLTableElement = document.createElement("table");
            this.frame.append(table);
            table.className = mode;

            const loadDays: Function = () => {
                // Prev
                if (
                    this.firstDate == undefined ||
                    this.date.getMonth() > this.firstDate.getMonth() ||
                    this.date.getFullYear() > this.firstDate.getFullYear()
                ) {
                    prev.onclick = () => {
                        this.date = new Date(
                            this.date.getFullYear(),
                            this.date.getMonth() - 1,
                            1
                        );
                        this.load("days");
                    };
                } else prev.classList.add("disabled");

                // Center
                center.innerHTML =
                    MONTHS[this.date.getMonth()] + " " + this.date.getFullYear();
                center.onclick = () => {
                    this.load("months");
                };

                // Next
                if (
                    this.lastDate == undefined ||
                    this.date.getMonth() < this.lastDate.getMonth() ||
                    this.date.getFullYear() < this.lastDate.getFullYear()
                ) {
                    next.onclick = () => {
                        this.date = new Date(
                            this.date.getFullYear(),
                            this.date.getMonth() + 1,
                            1
                        );
                        this.load("days");
                    };
                } else next.classList.add("disabled");

                // Header row (Weekdays)
                const row: HTMLTableRowElement = document.createElement("tr");
                table.append(row);
                for (let day: number = 0; day < 7; day++) {
                    const cell: HTMLTableHeaderCellElement = document.createElement("th");
                    cell.innerHTML =
                        WEEKDAYS_SHORT[this.sunday ? day : (day + 1) % 7];
                    row.append(cell);
                }

                // Dates
                const firstDayInMonth: Date = new Date(this.date.getTime());
                firstDayInMonth.setDate(1);
                let index: number =
                    (this.sunday ? 0 : 1) - (firstDayInMonth.getDay() || 7);
                for (let y: number = 0; y < 6; y++) {
                    const tr: HTMLTableRowElement = document.createElement("tr");
                    table.append(tr);
                    for (let x: number = 0; x < 7; x++) {
                        let day: Date = new Date(firstDayInMonth.getTime());
                        day.setDate(day.getDate() + index);

                        const td: HTMLTableDataCellElement = document.createElement("td");
                        tr.append(td);
                        td.innerHTML = day.getDate().toString();

                        // If available
                        if (
                            this.enabledDays(day) &&
                            day.getMonth() == this.date.getMonth() &&
                            (this.lastDate
                                ? day.getTime() <= this.lastDate.getTime()
                                : true) &&
                            (this.firstDate
                                ? day.getTime() >= this.firstDate.getTime()
                                : true)
                        ) {
                            td.onclick = () => {
                                this.setDate(day);
                                this.show(false);
                            };
                        } else td.classList.add("disabled");

                        // If today
                        if (day.toDateString() == new Date().toDateString())
                            td.classList.add("today");

                        index++;
                    }
                }
            };

            const loadMonths: Function = () => {
                // Prev
                if (
                    this.firstDate == undefined ||
                    this.date.getFullYear() > this.firstDate.getFullYear()
                ) {
                    prev.onclick = () => {
                        this.date = new Date(this.date.getFullYear() - 1, 1, 1);
                        this.load("months");
                    };
                } else prev.classList.add("disabled");

                // Year
                center.innerHTML = this.date.getFullYear().toString();
                center.onclick = () => {
                    this.load("years");
                };

                // Next
                if (
                    this.lastDate == undefined ||
                    this.date.getFullYear() < this.lastDate.getFullYear()
                ) {
                    next.onclick = () => {
                        this.date = new Date(this.date.getFullYear() + 1, 1, 1);
                        this.load("months");
                    };
                } else next.classList.add("disabled");

                // Months
                for (let y: number = 0; y < 3; y++) {
                    const row: HTMLTableRowElement = document.createElement("tr");
                    table.append(row);
                    for (let x: number = 0; x < 4; x++) {
                        const index: number = y * 4 + x;
                        const day: Date = new Date(this.date.getFullYear(), index, 1);

                        const cell: HTMLTableDataCellElement = document.createElement("td");
                        row.append(cell);
                        cell.innerHTML = MONTHS_SHORT[index];

                        if (
                            (this.firstDate
                                ? day.getTime() >=
                                new Date(this.firstDate.getTime()).setDate(1)
                                : true) &&
                            (this.lastDate
                                ? day.getTime() <=
                                new Date(this.lastDate.getTime()).setDate(1)
                                : true)
                        ) {
                            cell.onclick = () => {
                                this.date = new Date(
                                    this.date.getFullYear(),
                                    index,
                                    1
                                );
                                this.load("days");
                            };
                        } else cell.classList.add("disabled");
                        if (
                            day.getFullYear() == new Date().getFullYear() &&
                            day.getMonth() == new Date().getMonth()
                        )
                            cell.classList.add("today");
                    }
                }
            };

            const loadYears: Function = () => {
                // Prev
                if (
                    this.firstDate == undefined ||
                    this.date.getFullYear() > this.firstDate.getFullYear() + 25
                ) {
                    prev.onclick = () => {
                        this.date = new Date(this.date.getFullYear() - 25, 1, 1);
                        this.load("years");
                    };
                } else prev.classList.add("disabled");

                // Center
                center.innerHTML = this.date.getFullYear().toString();
                center.classList.add("disabled");

                // Next
                if (
                    this.lastDate == undefined ||
                    this.date.getFullYear() < this.lastDate.getFullYear() + 25
                ) {
                    next.onclick = () => {
                        this.date = new Date(this.date.getFullYear() + 25, 1, 1);
                        this.load("years");
                    };
                } else next.classList.add("disabled");

                // Years
                for (let y: number = 0; y < 5; y++) {
                    const row: HTMLTableRowElement = document.createElement("tr");
                    table.append(row);
                    for (let x: number = 0; x < 5; x++) {
                        const index: number =
                            this.date.getFullYear() -
                            (this.date.getFullYear() % 25) +
                            y * 5 +
                            x;
                        const day: Date = new Date(index, 0, 1);

                        const cell: HTMLTableDataCellElement = document.createElement("td");
                        row.append(cell);
                        cell.innerHTML = index.toString();

                        if (
                            (this.firstDate != undefined
                                ? day.getTime() >=
                                new Date(this.firstDate.getTime()).setDate(1)
                                : true) &&
                            (this.lastDate != undefined
                                ? day.getTime() <=
                                new Date(this.lastDate.getTime()).setDate(1)
                                : true)
                        ) {
                            cell.onclick = () => {
                                this.date = new Date(index, 0, 1);
                                this.load("months");
                            };
                        } else cell.classList.add("disabled");
                        if (day.getFullYear() == new Date().getFullYear())
                            cell.classList.add("today");
                    }
                }
            };

            switch (mode) {
                case "days":
                    loadDays();
                    break;
                case "months":
                    loadMonths();
                    break;
                case "years":
                    loadYears();
                    break;
                default:
                    console.error(mode + " is not a supported mode");
            }
        }
    }
}