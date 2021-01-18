"use strict";
var Twitter;
(function (Twitter) {
    let oldestDateS = "2017-05-01"; //TODO aus Oberflaeche holen
    let inputForm = document.getElementById("inputForm");
    let btSendTweet = document.getElementById("sendTweet");
    btSendTweet.addEventListener("click", sendTweet);
    let btGetTweetTimeline = document.getElementById("getTweetTimeline");
    btGetTweetTimeline.addEventListener("click", getTweetTimeline);
    let answerSec = document.getElementById("answerSection");
    let tweetTimeline = document.getElementById("tweetTimeline");
    async function getTweetTimeline() {
        let tweets = await getTweetTimelineFromServer();
        if (tweets != null) {
            for (let i = 0; i < tweets.length; i++) {
                let tweet = tweets[i];
                let htmlTweet = Twitter.createTweetElement(tweet);
                tweetTimeline.appendChild(htmlTweet);
            }
        }
        else {
            //TODO
            console.log("Error getting tweets, maybe need to login again");
        }
    }
    async function getTweetTimelineFromServer() {
        console.log("Get Tweet Timeline");
        let oldestDateString = new Date(oldestDateS).toDateString();
        let data = { command: "getTweetTimeline", oldestDate: oldestDateString };
        let answer = await Twitter.postToServer(data);
        if (answer != null) {
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
        let request = {};
        formdata.forEach(function (value, key) {
            //TODO if key == email schauen ob wirklich email eingegeben wurde
            request[key] = value.toString();
        });
        request["command"] = "postTweet";
        let answer = await Twitter.postToServer(request);
        if (answer != null) {
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