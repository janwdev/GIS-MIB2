"use strict";
var Twitter;
(function (Twitter) {
    let oldestDateS = "2021-01-01";
    let inputForm = document.getElementById("inputForm");
    let btSendTweet = document.getElementById("sendTweet");
    btSendTweet.addEventListener("click", sendTweet);
    let answerSec = document.getElementById("answerSection");
    let tweetTimeline = document.getElementById("tweetTimeline");
    getTweetTimeline();
    //###### Datepicker from https://github.com/NomisIV/js-datepicker
    let dpSettings = {
        last_date: new Date(),
        initial_date: new Date(oldestDateS),
        first_date: new Date(oldestDateS),
        enabled_days: (d) => {
            return d.getDay() > 0 && d.getDay() < 6;
        },
        format: (d) => {
            return d.toDateString();
        }
    };
    let dateInput = document.getElementById("date-input");
    let d = new Twitter.Datepicker(dateInput, dpSettings);
    dateInput.addEventListener("change", function () {
        oldestDateS = d.getDate().toISOString();
        getTweetTimeline();
    });
    //#############################################################
    async function getTweetTimeline() {
        let tweets = await getTweetTimelineFromServer();
        while (tweetTimeline.firstChild) {
            tweetTimeline.removeChild(tweetTimeline.lastChild);
        }
        if (tweets != null) {
            for (let i = 0; i < tweets.length; i++) {
                let tweet = tweets[i];
                let htmlTweet = Twitter.createTweetElement(tweet);
                tweetTimeline.appendChild(htmlTweet);
            }
        }
        else {
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            let alert = Twitter.createAlertElement("Error getting tweets, maybe need to login again", Twitter.KEYALERTERROR);
            answerSec.appendChild(alert);
        }
    }
    async function getTweetTimelineFromServer() {
        console.log("Get Tweet Timeline");
        let oldestDateString = new Date(oldestDateS).toDateString();
        let data = { command: "getTweetTimeline", oldestDate: oldestDateString };
        let answer = await Twitter.postToServer(data);
        if (answer != null) {
            if (answer.tweets) {
                let tweets = answer.tweets.reverse();
                return tweets;
            }
            else {
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                let alert = Twitter.createAlertElement(answer.message, Twitter.KEYALERTERROR);
                answerSec.appendChild(alert);
                console.log(answer.message);
            }
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
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                if (status != 0) {
                    let alert = Twitter.createAlertElement(message, Twitter.KEYALERTERROR);
                    answerSec.appendChild(alert);
                }
                else {
                    let alert = Twitter.createAlertElement(message, Twitter.KEYALERTOK);
                    answerSec.appendChild(alert);
                    let input = document.getElementById("tweet");
                    input.value = "";
                    getTweetTimeline();
                }
            }
        }
        else {
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            let alert = Twitter.createAlertElement("Something went wrong, maybe need to login again", Twitter.KEYALERTERROR);
            answerSec.appendChild(alert);
            console.log("Something went wrong, maybe need to login again");
        }
    }
})(Twitter || (Twitter = {}));
//# sourceMappingURL=tweets.js.map