"use strict";
var Twitter;
(function (Twitter) {
    Twitter.url = "http://localhost:8100";
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
    function createTweetElement(tweet) {
        let element = document.createElement("div");
        //TODO styling
        let htmlUserName = document.createElement("p");
        htmlUserName.textContent = tweet.userName;
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
        htmlCreationDate.textContent = new Date(tweet.creationDate).toString();
        element.appendChild(htmlUserName);
        element.appendChild(htmlUserEmail);
        if (tweet.userPicture) {
            element.appendChild(htmlUserImg);
        }
        element.appendChild(htmlText);
        element.appendChild(htmlCreationDate);
        //TODO media
        return element;
    }
    Twitter.createTweetElement = createTweetElement;
})(Twitter || (Twitter = {}));
//# sourceMappingURL=exportMethods.js.map