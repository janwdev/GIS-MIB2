namespace Twitter {
    export let url: string = "http://localhost:8100";
    //  let url: string = "https://gis2020jw.herokuapp.com";

    export interface RequestToServerInterface {
        [type: string]: string;
    }

    export interface ResponseFromServer {
        status: number;
        message: string;
        authCookieString?: string;
        data?: string[];
        tweets?: Tweet[];
        users?: User[];
    }

    export interface User {
        _id: string;
        firstname: string;
        lastname: string;
        studycourse: string;
        semester: string;
        email: string;
        pictureLink?: string;
        followers: string[];
        following: string[];
    }

    export interface Tweet {
        text: string;
        creationDate: Date;
        media?: string;
        userName: string;
        userEmail: string;
        userPicture?: string;
    }

    export async function postToServer(requestData: RequestToServerInterface): Promise<ResponseFromServer> {
        let params: URLSearchParams = new URLSearchParams();
        let authKey: string = getAuthCode();
        if (authKey.length > 0) {
            params.append("authKey", authKey);
            Object.keys(requestData).forEach((key: string) => {
                params.append(key, requestData[key]);
            });
            let response: Response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: params
            });
            let responseFromServer: ResponseFromServer = await response.json();
            return responseFromServer;
        }
        return null;
    }
    export async function postToServerWithoutAuth(requestData: RequestToServerInterface): Promise<ResponseFromServer> {
        let params: URLSearchParams = new URLSearchParams();
        Object.keys(requestData).forEach((key: string) => {
            params.append(key, requestData[key]);
        });
        let response: Response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: params
        });
        let responseFromServer: ResponseFromServer = await response.json();
        return responseFromServer;
    }

    export function saveAuthCookie(authCookieString: string): void {
        document.cookie = authCookieString + "; path=/; SameSite=Lax";
        console.log("Saved");
    }

    export function getAuthCode(): string {
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