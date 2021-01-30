namespace Twitter {
    // export let url: string = "http://localhost:8100";
    export let url: string = "https://twitterclonegis.herokuapp.com";

    let KEYLASTLOCATION: string = "lastLocation";
    export let KEYLOGINREDIRECTMESSAGE: string = "loginRedirectMessage";

    export let KEYALERTERROR: number = 0;
    export let KEYALERTWARNING: number = 1;
    export let KEYALERTOK: number = 2;

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
        _id?: string;
        text: string;
        creationDate: Date;
        media?: string;
        userName: string;
        userEmail: string;
        userPicture?: string;
    }

    export async function ping(): Promise<void> {
        let params: URLSearchParams = new URLSearchParams({ command: "ping" });
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: params
        });
    }

    export async function delay(ms: number): Promise<void> {
        return new Promise(res => setTimeout(res, ms));
    }

    export async function postToServer(requestData: RequestToServerInterface): Promise<ResponseFromServer> {
        if (requestData.email) {
            if (!validateEmail(requestData.email)) {
                return { status: -1, message: "Email is not valid" };
            }
        }
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
        } else {
            console.log("Need to Login again");
            redirectToLogin();
        }
        return null;
    }
    export async function postToServerWithoutAuth(requestData: RequestToServerInterface): Promise<ResponseFromServer> {
        if (requestData.email) {
            if (!validateEmail(requestData.email)) {
                return { status: -1, message: "Email is not valid" };
            }
        }
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

    export function redirectToLogin(): void {
        let actLoc: string = window.location.href;
        sessionStorage.setItem(KEYLASTLOCATION, actLoc);
        sessionStorage.setItem(KEYLOGINREDIRECTMESSAGE, "Need to Login again!");
        window.location.replace("login.html");
    }

    export function redirectToLastLocation(): void {
        let lastLoc: string = sessionStorage.getItem(KEYLASTLOCATION);
        if (lastLoc) {
            if (lastLoc.length > 0) {
                window.location.replace(lastLoc);
                return;
            }
        }
        let authCode: string = getAuthCode();
        if (authCode != null && authCode.length > 0) {
            window.location.replace("chamois.html");
        } else {
            sessionStorage.removeItem(KEYLASTLOCATION);
            window.location.replace("login.html");
        }
    }

    export async function saveAuthCookie(authCookieString: string): Promise<void> {
        document.cookie = authCookieString + "; path=/; SameSite=Lax";
        console.log("Saved");
        await delay(1500);
        redirectToLastLocation();
    }

    export function getAuthCode(): string {
        return getCookie("Authorization");
    }

    //######Code from https://www.w3schools.com/js/js_cookies.asp ######################
    export function deleteAuthCookie(shouldRedirect: boolean): void {
        document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        if (shouldRedirect) {
            redirectToLogin();
        }
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
    //######Code from https://www.w3docs.com/snippets/javascript/how-to-validate-an-e-mail-using-javascript.html ######################
    export function validateEmail(email: string): boolean {
        let res: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return res.test(email);
    }

    export function createAlertElement(message: string, alertStatus: number): HTMLDivElement {
        let alert: HTMLDivElement = document.createElement("div");
        if (alertStatus == KEYALERTERROR)
            alert.className = "alert-bad";
        else if (alertStatus == KEYALERTWARNING)
            alert.className = "alert-warning";
        else if (alertStatus == KEYALERTOK)
            alert.className = "alert-good";
        let closeBtn: HTMLSpanElement = document.createElement("span");
        closeBtn.addEventListener("click", function (): void {
            alert.style.display = "none";
        });
        closeBtn.textContent = "X";
        closeBtn.className = "alert-closebtn";
        let text: HTMLSpanElement = document.createElement("span");
        text.textContent = message;
        alert.appendChild(text);
        alert.appendChild(closeBtn);
        return alert;
    }

    export async function suscribeUnsuscribeToUserWithId(id: string, command: string): Promise<void> {
        console.log("Try to suscribe to User with id: " + id);
        let requestData: RequestToServerInterface = { command: command, _id: id };
        let responseFromServer: ResponseFromServer = await postToServer(requestData);
        if (responseFromServer) {
            console.log("Answer:");
            console.log(responseFromServer);
        } else {
            console.log("No Response");
        }
    }

    export function createTweetElement(tweet: Tweet): HTMLDivElement {
        let element: HTMLDivElement = document.createElement("div");
        let htmlUserTextSec: HTMLDivElement = document.createElement("div");
        htmlUserTextSec.className = "col-4";
        let htmlUserName: HTMLAnchorElement = document.createElement("a");
        htmlUserName.textContent = tweet.userName;
        if (tweet.userName != "Admin") {
            htmlUserName.href = "userdetails.html?email=" + tweet.userEmail;
        }
        let htmlUserEmail: HTMLParagraphElement = document.createElement("p");
        htmlUserEmail.textContent = tweet.userEmail;
        let htmlUserImg: HTMLImageElement;
        if (tweet.userPicture) {
            if (tweet.userPicture.length > 0) {
                htmlUserImg = document.createElement("img");
                htmlUserImg.src = tweet.userPicture;
                htmlUserImg.className = "col-4 profPicS";
            }
        }
        let htmlText: HTMLParagraphElement = document.createElement("p");
        htmlText.textContent = tweet.text;
        let htmlCreationDate: HTMLParagraphElement = document.createElement("p");
        htmlCreationDate.textContent = new Date(tweet.creationDate).toDateString();

        let htmlUserRow: HTMLDivElement = document.createElement("div");
        htmlUserRow.className = "row";

        htmlUserTextSec.appendChild(htmlUserName);
        htmlUserTextSec.appendChild(htmlUserEmail);
        if (tweet.userPicture) {
            htmlUserRow.appendChild(htmlUserImg);
        }
        htmlUserRow.appendChild(htmlUserTextSec);
        element.appendChild(htmlUserRow);
        element.appendChild(htmlText);
        element.appendChild(htmlCreationDate);

        if (sessionStorage.getItem("email") == tweet.userEmail) {
            let btDelete: HTMLButtonElement = document.createElement("button");
            let spanDelete: HTMLSpanElement = document.createElement("span");
            spanDelete.textContent = "Delete";
            btDelete.appendChild(spanDelete);
            btDelete.addEventListener("click", async function (): Promise<void> {
                await deleteTweet(tweet._id);
                window.location.reload();
            });
            htmlUserName.href = "userdetails.html";
            btDelete.className = "btn btnSec col";
            htmlUserRow.appendChild(btDelete);
            //TODO Edit
        }
        element.className = "tweet";

        //TODO media
        return element;
    }

    async function deleteTweet(id: string): Promise<void | boolean> {
        let request: RequestToServerInterface = { command: "deleteTweet", tweetID: id };
        let answer: ResponseFromServer = await postToServer(request);
        if (answer != null) {
            if (answer.status) {
                // let status: number = <number>answer.status;
                let message: string = <string>answer.message;
                console.log(message);
            }
        } else {
            console.log("Something went wrong, maybe need to login again");
        }
    }
}