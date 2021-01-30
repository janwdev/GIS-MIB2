"use strict";
var Twitter;
(function (Twitter) {
    // export let url: string = "http://localhost:8100";
    Twitter.url = "https://twitterclonegis.herokuapp.com";
    let KEYLASTLOCATION = "lastLocation";
    Twitter.KEYLOGINREDIRECTMESSAGE = "loginRedirectMessage";
    Twitter.KEYALERTERROR = 0;
    Twitter.KEYALERTWARNING = 1;
    Twitter.KEYALERTOK = 2;
    async function ping() {
        let params = new URLSearchParams({ command: "ping" });
        await fetch(Twitter.url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: params
        });
    }
    Twitter.ping = ping;
    async function delay(ms) {
        return new Promise(res => setTimeout(res, ms));
    }
    Twitter.delay = delay;
    async function postToServer(requestData) {
        if (requestData.email) {
            if (!validateEmail(requestData.email)) {
                return { status: -1, message: "Email is not valid" };
            }
        }
        let params = new URLSearchParams();
        let authKey = getAuthCode();
        if (authKey.length > 0) {
            params.append("authKey", authKey);
            Object.keys(requestData).forEach((key) => {
                params.append(key, requestData[key]);
            });
            let response = await fetch(Twitter.url, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: params
            });
            let responseFromServer = await response.json();
            return responseFromServer;
        }
        else {
            console.log("Need to Login again");
            redirectToLogin();
        }
        return null;
    }
    Twitter.postToServer = postToServer;
    async function postToServerWithoutAuth(requestData) {
        if (requestData.email) {
            if (!validateEmail(requestData.email)) {
                return { status: -1, message: "Email is not valid" };
            }
        }
        let params = new URLSearchParams();
        Object.keys(requestData).forEach((key) => {
            params.append(key, requestData[key]);
        });
        let response = await fetch(Twitter.url, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: params
        });
        let responseFromServer = await response.json();
        return responseFromServer;
    }
    Twitter.postToServerWithoutAuth = postToServerWithoutAuth;
    function redirectToLogin() {
        let actLoc = window.location.href;
        sessionStorage.setItem(KEYLASTLOCATION, actLoc);
        sessionStorage.setItem(Twitter.KEYLOGINREDIRECTMESSAGE, "Need to Login again!");
        window.location.replace("login.html");
    }
    Twitter.redirectToLogin = redirectToLogin;
    function redirectToLastLocation() {
        let lastLoc = sessionStorage.getItem(KEYLASTLOCATION);
        if (lastLoc) {
            if (lastLoc.length > 0) {
                window.location.replace(lastLoc);
                return;
            }
        }
        let authCode = getAuthCode();
        if (authCode != null && authCode.length > 0) {
            window.location.replace("chamois.html");
        }
        else {
            sessionStorage.removeItem(KEYLASTLOCATION);
            window.location.replace("login.html");
        }
    }
    Twitter.redirectToLastLocation = redirectToLastLocation;
    async function saveAuthCookie(authCookieString) {
        document.cookie = authCookieString + "; path=/; SameSite=Lax";
        console.log("Saved");
        await delay(1500);
        redirectToLastLocation();
    }
    Twitter.saveAuthCookie = saveAuthCookie;
    function getAuthCode() {
        return getCookie("Authorization");
    }
    Twitter.getAuthCode = getAuthCode;
    //######Code from https://www.w3schools.com/js/js_cookies.asp ######################
    function deleteAuthCookie(shouldRedirect) {
        document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        if (shouldRedirect) {
            redirectToLogin();
        }
    }
    Twitter.deleteAuthCookie = deleteAuthCookie;
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
    //######Code from https://www.w3docs.com/snippets/javascript/how-to-validate-an-e-mail-using-javascript.html ######################
    function validateEmail(email) {
        let res = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return res.test(email);
    }
    Twitter.validateEmail = validateEmail;
    function createAlertElement(message, alertStatus) {
        let alert = document.createElement("div");
        if (alertStatus == Twitter.KEYALERTERROR)
            alert.className = "alert-bad";
        else if (alertStatus == Twitter.KEYALERTWARNING)
            alert.className = "alert-warning";
        else if (alertStatus == Twitter.KEYALERTOK)
            alert.className = "alert-good";
        let closeBtn = document.createElement("span");
        closeBtn.addEventListener("click", function () {
            alert.style.display = "none";
        });
        closeBtn.textContent = "X";
        closeBtn.className = "alert-closebtn";
        let text = document.createElement("span");
        text.textContent = message;
        alert.appendChild(text);
        alert.appendChild(closeBtn);
        return alert;
    }
    Twitter.createAlertElement = createAlertElement;
    async function suscribeUnsuscribeToUserWithId(id, command) {
        console.log("Try to suscribe to User with id: " + id);
        let requestData = { command: command, _id: id };
        let responseFromServer = await postToServer(requestData);
        if (responseFromServer) {
            console.log("Answer:");
            console.log(responseFromServer);
        }
        else {
            console.log("No Response");
        }
    }
    Twitter.suscribeUnsuscribeToUserWithId = suscribeUnsuscribeToUserWithId;
    function createTweetElement(tweet) {
        let element = document.createElement("div");
        let htmlUserTextSec = document.createElement("div");
        htmlUserTextSec.className = "col-4";
        let htmlUserName = document.createElement("a");
        htmlUserName.textContent = tweet.userName;
        if (tweet.userName != "Admin") {
            htmlUserName.href = "userdetails.html?email=" + tweet.userEmail;
        }
        let htmlUserEmail = document.createElement("p");
        htmlUserEmail.textContent = tweet.userEmail;
        let htmlUserImg;
        if (tweet.userPicture) {
            if (tweet.userPicture.length > 0) {
                htmlUserImg = document.createElement("img");
                htmlUserImg.src = tweet.userPicture;
                htmlUserImg.className = "col-4 profPicS";
            }
        }
        let htmlText = document.createElement("p");
        htmlText.textContent = tweet.text;
        let htmlCreationDate = document.createElement("p");
        htmlCreationDate.textContent = new Date(tweet.creationDate).toDateString();
        let htmlUserRow = document.createElement("div");
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
            let btDelete = document.createElement("button");
            let spanDelete = document.createElement("span");
            spanDelete.textContent = "Delete";
            btDelete.appendChild(spanDelete);
            btDelete.addEventListener("click", async function () {
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
    Twitter.createTweetElement = createTweetElement;
    async function deleteTweet(id) {
        let request = { command: "deleteTweet", tweetID: id };
        let answer = await postToServer(request);
        if (answer != null) {
            if (answer.status) {
                // let status: number = <number>answer.status;
                let message = answer.message;
                console.log(message);
            }
        }
        else {
            console.log("Something went wrong, maybe need to login again");
        }
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=exportMethods.js.map