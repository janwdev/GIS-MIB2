namespace Twitter {

    export function saveAuthCookie(authCookieString: string): void {
        document.cookie = authCookieString + "; path=/; SameSite=Lax";
        console.log("Saved");
    }

    export function getAuthCode(): string{
        return getCookie("Authorization");
    }

    //######Code from https://www.w3schools.com/js/js_cookies.asp ######################
    function getCookie(cname: string): string {
        let name: string = cname + "=";
        let decodedCookie: string = decodeURIComponent(document.cookie);
        let ca: string[] = decodedCookie.split(";");
        for (let i: number = 0; i < ca.length; i++) {
            let c: string = ca[i];
            while (c.charAt(0) == " ") {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
}