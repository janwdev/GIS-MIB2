
let cookieBanner: HTMLDivElement = <HTMLDivElement>document.getElementById("cookie-banner");
let btClose: HTMLButtonElement = <HTMLButtonElement>document.getElementById("close");
btClose.addEventListener("click", closeCookies);

if (localStorage.getItem("cookies") != "accepted") {
    cookieBanner.classList.toggle("fadeIn");
}

function closeCookies(): void {
    cookieBanner.classList.toggle("fadeOut");
    localStorage.setItem("cookies", "accepted");
}