namespace Twitter {

    let oldestDateS: string = "2017-05-01"; //TODO aus Oberflaeche holen

    let inputForm: HTMLFormElement = <HTMLFormElement>document.getElementById("inputForm");

    let btSendTweet: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendTweet");
    btSendTweet.addEventListener("click", sendTweet);

    let btGetTweetTimeline: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getTweetTimeline");
    btGetTweetTimeline.addEventListener("click", getTweetTimeline);

    let answerSec: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");
    let tweetTimeline: HTMLDivElement = <HTMLDivElement>document.getElementById("tweetTimeline");

    async function getTweetTimeline(): Promise<void> {
        let tweets: Tweet[] = await getTweetTimelineFromServer();
        if (tweets != null) {
            for (let i: number = 0; i < tweets.length; i++) {
                let tweet: Tweet = tweets[i];
                let htmlTweet: HTMLDivElement = createTweetElement(tweet);
                tweetTimeline.appendChild(htmlTweet);
            }
        } else {
            //TODO
            console.log("Error getting tweets, maybe need to login again");
        }
    }

    async function getTweetTimelineFromServer(): Promise<Tweet[]> {
        console.log("Get Tweet Timeline");
        let oldestDateString: string = new Date(oldestDateS).toDateString();
        let data: RequestToServerInterface = { command: "getTweetTimeline", oldestDate: oldestDateString };
        let answer: ResponseFromServer = await postToServer(data);
        if (answer != null) {
            if (answer.tweets) {
                return answer.tweets;
            } else {
                console.log(answer.message);
            }
        } else {
            //TODO weiterleitung
            console.log("Need to Login again");
        }
        return null;
    }

    async function sendTweet(): Promise<void> {
        console.log("send Tweet");
        let formdata: FormData = new FormData(inputForm);
        let request: RequestToServerInterface = {};
        formdata.forEach(function (value: FormDataEntryValue, key: string): void {
            //TODO if key == email schauen ob wirklich email eingegeben wurde
            request[key] = value.toString();
        });
        request["command"] = "postTweet";
        let answer: ResponseFromServer = await postToServer(request);
        if (answer != null) {
            if ("status" in answer) {
                let status: number = <number>answer.status;
                let message: string = <string>answer.message;
                let p: HTMLParagraphElement = document.createElement("p");
                p.innerText = message;
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                answerSec.appendChild(p);
                if (status != 0) {
                    p.style.color = "red";
                } else {
                    p.style.color = "green";
                }
            }
        } else {
            //TODO weiterleitung
            console.log("Need to login again");
            let p: HTMLParagraphElement = document.createElement("p");
            p.innerText = "Need to login again";
            p.style.color = "red";
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            answerSec.appendChild(p);
        }
    }
}