"use strict";
let cookieBanner = document.getElementById("cookie-banner");
let btClose = document.getElementById("close");
btClose.addEventListener("click", closeCookies);
if (localStorage.getItem("cookies") != "accepted") {
    cookieBanner.classList.toggle("fadeIn");
}
function closeCookies() {
    cookieBanner.classList.toggle("fadeOut");
    localStorage.setItem("cookies", "accepted");
}
//# sourceMappingURL=cookieBanner.js.map