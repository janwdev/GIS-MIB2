namespace Twitter {

    let oldestDateS: string = "2021-01-01";

    let inputForm: HTMLFormElement = <HTMLFormElement>document.getElementById("inputForm");

    let btSendTweet: HTMLButtonElement = <HTMLButtonElement>document.getElementById("sendTweet");
    btSendTweet.addEventListener("click", sendTweet);

    let answerSec: HTMLDivElement = <HTMLDivElement>document.getElementById("answerSection");
    let tweetTimeline: HTMLDivElement = <HTMLDivElement>document.getElementById("tweetTimeline");

    getTweetTimeline();

    //###### Datepicker from https://github.com/NomisIV/js-datepicker
    let dpSettings: DatepickerSettings = {
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
    let dateInput: HTMLInputElement = <HTMLInputElement>document.getElementById("date-input");
    let d: Datepicker = new Datepicker(dateInput, dpSettings);

    dateInput.addEventListener("change", function (): void {
        oldestDateS = d.getDate().toISOString();
        getTweetTimeline();
    });
    //#############################################################

    async function getTweetTimeline(): Promise<void> {
        let tweets: Tweet[] = await getTweetTimelineFromServer();
        while (tweetTimeline.firstChild) {
            tweetTimeline.removeChild(tweetTimeline.lastChild);
        }
        if (tweets != null) {
            for (let i: number = 0; i < tweets.length; i++) {
                let tweet: Tweet = tweets[i];
                let htmlTweet: HTMLDivElement = createTweetElement(tweet);
                tweetTimeline.appendChild(htmlTweet);
            }
        } else {
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            let alert: HTMLDivElement = createAlertElement("Error getting tweets, maybe need to login again", KEYALERTERROR);
            answerSec.appendChild(alert);
        }
    }

    async function getTweetTimelineFromServer(): Promise<Tweet[]> {
        console.log("Get Tweet Timeline");
        let oldestDateString: string = new Date(oldestDateS).toDateString();
        let data: RequestToServerInterface = { command: "getTweetTimeline", oldestDate: oldestDateString };
        let answer: ResponseFromServer = await postToServer(data);
        if (answer != null) {
            if (answer.tweets) {
                let tweets: Tweet[] = answer.tweets.reverse();
                return tweets;
            } else {
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                let alert: HTMLDivElement = createAlertElement(answer.message, KEYALERTERROR);
                answerSec.appendChild(alert);
                console.log(answer.message);
            }
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
                while (answerSec.firstChild) {
                    answerSec.removeChild(answerSec.lastChild);
                }
                if (status != 0) {
                    let alert: HTMLDivElement = createAlertElement(message, KEYALERTERROR);
                    answerSec.appendChild(alert);
                } else {
                    let alert: HTMLDivElement = createAlertElement(message, KEYALERTOK);
                    answerSec.appendChild(alert);
                    let input: HTMLInputElement = <HTMLInputElement>document.getElementById("tweet");
                    input.value = "";
                    getTweetTimeline();
                }
            }
        } else {
            while (answerSec.firstChild) {
                answerSec.removeChild(answerSec.lastChild);
            }
            let alert: HTMLDivElement = createAlertElement("Something went wrong, maybe need to login again", KEYALERTERROR);
            answerSec.appendChild(alert);
            console.log("Something went wrong, maybe need to login again");
        }
    }
}