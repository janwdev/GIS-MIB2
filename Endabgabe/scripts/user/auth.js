"use strict";
var Twitter;
(function (Twitter) {
    function saveAuthCookie(authCookieString) {
        document.cookie = authCookieString + "; path=/; SameSite=Lax";
        console.log("Saved");
    }
    Twitter.saveAuthCookie = saveAuthCookie;
    function getAuthCode() {
        return getCookie("Authorization");
    }
    Twitter.getAuthCode = getAuthCode;
    //######Code from https://www.w3schools.com/js/js_cookies.asp ######################
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=auth.js.map