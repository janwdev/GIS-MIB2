namespace Twitter {

    let url: string = "http://localhost:8100";
    //let url: string = "https://gis2020jw.herokuapp.com";

    let oldestDateS: string = "2017-05-01"; //TODO aus Oberflaeche holen

    let inputForm: HTMLFormElement = <HTMLFormElement>document.getElementById("inputForm");

    let btSendTweet: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendTweet");
    btSendTweet.addEventListener("click", sendTweet);

    let btGetTweetTimeline: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getTweetTimeline");
    btGetTweetTimeline.addEventListener("click", getTweetTimeline);

    let answerSec: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");

    interface Tweet {
        text: string;
        creationDate: Date;
        media?: string;
        userName: string;
        userEmail: string;
        userPicture?: string;
    }

    async function getTweetTimeline(): Promise<void> {
        let tweets: Tweet[] = await getTweetTimelineFromServer();
        if (tweets != null) {
            for (let i: number = 0; i < tweets.length; i++) {
                const tweet: Tweet = tweets[i];
                //TODO
                console.log(tweet);
            }
        } else {
            //TODO
            console.log("Error getting tweets, maybe need to login again");
        }
    }

    async function getTweetTimelineFromServer(): Promise<Tweet[]> {
        console.log("Get Tweet Timeline");
        let authCode: string = getAuthCode();
        if (authCode.length > 0) {
            let params: URLSearchParams = new URLSearchParams();
            params.append("command", "getTweetTimeline");
            params.append("authKey", authCode);
            let oldestDateString: string = new Date(oldestDateS).toDateString();
            params.append("oldestDate", oldestDateString);
            let response: Response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: params
            });
            let answer: ServerResponse = await response.json();
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

    interface ServerResponse {
        status: number;
        message: string;
        authCookieString?: string;
        data?: string[];
        tweets?: Tweet[];
    }

    async function sendTweet(): Promise<void> {
        console.log("send Tweet");
        let formdata: FormData = new FormData(inputForm);
        let formstring: URLSearchParams = new URLSearchParams(<URLSearchParams>formdata);
        let authCode: string = getAuthCode();
        if (authCode.length > 0) {
            formstring.append("command", "postTweet");
            formstring.append("authKey", authCode);
            let response: Response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: formstring
            });
            let answer: ServerResponse = await response.json();
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