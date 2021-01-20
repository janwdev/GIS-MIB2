"use strict";
var Twitter;
(function (Twitter) {
    Twitter.url = "http://localhost:8100";
    //  let url: string = "https://gis2020jw.herokuapp.com";
    let KEYLASTLOCATION = "lastLocation";
    async function postToServer(requestData) {
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
            window.location.replace("tweet.html");
        }
        else {
            sessionStorage.removeItem(KEYLASTLOCATION);
            window.location.replace("login.html");
        }
    }
    Twitter.redirectToLastLocation = redirectToLastLocation;
    function saveAuthCookie(authCookieString) {
        document.cookie = authCookieString + "; path=/; SameSite=Lax";
        console.log("Saved");
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
    function createTweetElement(tweet) {
        let element = document.createElement("div");
        //TODO styling
        let htmlUserName = document.createElement("a");
        htmlUserName.textContent = tweet.userName;
        if (tweet.userName != "Admin") {
            htmlUserName.href = "userdetails.html?email=" + tweet.userEmail;
        }
        let htmlUserEmail = document.createElement("p");
        htmlUserEmail.textContent = tweet.userEmail;
        let htmlUserImg;
        if (tweet.userPicture) {
            htmlUserImg = document.createElement("img");
            htmlUserImg.src = tweet.userPicture;
        }
        let htmlText = document.createElement("p");
        htmlText.textContent = tweet.text;
        let htmlCreationDate = document.createElement("p");
        htmlCreationDate.textContent = new Date(tweet.creationDate).toDateString();
        element.appendChild(htmlUserName);
        element.appendChild(htmlUserEmail);
        if (tweet.userPicture) {
            element.appendChild(htmlUserImg);
        }
        element.appendChild(htmlText);
        element.appendChild(htmlCreationDate);
        if (sessionStorage.getItem("email") == tweet.userEmail) {
            let btDelete = document.createElement("button");
            btDelete.textContent = "Delete";
            btDelete.addEventListener("click", async function () {
                await deleteTweet(tweet._id);
                window.location.reload();
            });
            element.appendChild(btDelete);
            //TODO Edit
        }
        //TODO media
        return element;
    }
    Twitter.createTweetElement = createTweetElement;
    async function deleteTweet(id) {
        //TODO
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