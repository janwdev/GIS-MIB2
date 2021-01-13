"use strict";
var Twitter;
(function (Twitter) {
    let url = "http://localhost:8100";
    //let url: string = "https://gis2020jw.herokuapp.com";
    let oldestDateS = "2017-05-01"; //TODO aus Oberflaeche holen
    let inputForm = document.getElementById("inputForm");
    let btSendTweet = document.getElementById("sendTweet");
    btSendTweet.addEventListener("click", sendTweet);
    let btGetTweetTimeline = document.getElementById("getTweetTimeline");
    btGetTweetTimeline.addEventListener("click", getTweetTimeline);
    let answerSec = document.getElementById("answerSection");
    async function getTweetTimeline() {
        let tweets = await getTweetTimelineFromServer();
        if (tweets != null) {
            for (let i = 0; i < tweets.length; i++) {
                const tweet = tweets[i];
                //TODO
                console.log(tweet);
            }
        }
        else {
            //TODO
            console.log("Error getting tweets, maybe need to login again");
        }
    }
    async function getTweetTimelineFromServer() {
        console.log("Get Tweet Timeline");
        let authCode = Twitter.getAuthCode();
        if (authCode.length > 0) {
            let params = new URLSearchParams();
            params.append("command", "getTweetTimeline");
            params.append("authKey", authCode);
            let oldestDateString = new Date(oldestDateS).toDateString();
            params.append("oldestDate", oldestDateString);
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: params
            });
            let answer = await response.json();
            if (answer.tweets) {
                return answer.tweets;
            }
            else {
                console.log(answer.message);
            }
        }
        else {
            //TODO weiterleitung
            console.log("Need to Login again");
        }
        return null;
    }
    async function sendTweet() {
        console.log("send Tweet");
        let formdata = new FormData(inputForm);
        let formstring = new URLSearchParams(formdata);
        let authCode = Twitter.getAuthCode();
        if (authCode.length > 0) {
            formstring.append("command", "postTweet");
            formstring.append("authKey", authCode);
            let response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: formstring
            });
            let answer = await response.json();
            if ("status" in answer) {
                let status = answer.status;
                let message = answer.message;
                let p = document.createElement("p");
                p.innerText = message;
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                answerSec.appendChild(p);
                if (status != 0) {
                    p.style.color = "red";
                }
                else {
                    p.style.color = "green";
                }
            }
        }
        else {
            //TODO weiterleitung
            console.log("Need to login again");
            let p = document.createElement("p");
            p.innerText = "Need to login again";
            p.style.color = "red";
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            answerSec.appendChild(p);
        }
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=tweets.js.map