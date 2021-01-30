import * as Mongo from "mongodb";

import * as u from "./user";
import * as auth from "./auth";
import * as db from "./db";

export interface Tweet {
    _id?: string;
    text: string;
    userID: string;
    creationDate: Date;
    media?: string; //Dateilink
}

export interface TweetAnswer {
    _id?: string;
    text: string;
    creationDate: Date;
    media?: string;
    userName: string;
    userEmail: string;
    userPicture?: string;
}

export async function postTweet(authKey: string, tweetText: string): Promise<number> {
    let user: u.User = await auth.authWithKey(authKey);
    if (user != null) {
        let tweet: Tweet = { text: tweetText, userID: user._id, creationDate: new Date(Date.now()) };
        db.dbTweets.insertOne(tweet);
        console.log("User " + user.email + " posted a tweet: " + tweetText);
        return 0;
    }
    return -1;
}

export async function deleteTweet(authKey: string, tweetID: string): Promise<number> {
    let user: u.User = await auth.authWithKey(authKey);
    if (user != null) {
        let tweet: Tweet = await db.dbTweets.findOne({ _id: new Mongo.ObjectID(tweetID) });
        if (tweet) {
            let tweetUserID: string = "" + tweet.userID;
            let userUserID: string = "" + user._id;
            if (tweetUserID && userUserID) {
                if (tweetUserID == userUserID) {
                    let result: Mongo.DeleteWriteOpResultObject = await db.dbTweets.deleteOne({ _id: new Mongo.ObjectID(tweetID) });
                    if (result.deletedCount > 0) {
                        console.log("User " + user.email + " deleted a tweet: " + tweetID);
                        return 0;
                    }
                }
            }
        } else {
            console.log("No tweed found with id: " + tweetID);
        }
        return -2;
    }
    return -1;
}

export async function getTweetTimeline(authKey: string, oldestDate: Date): Promise<TweetAnswer[]> {
    let user: u.User = await auth.authWithKey(authKey);
    if (user != null) {
        let followingUsersTweets: TweetAnswer[] = [];
        for (let i: number = 0; i < user.following.length; i++) {
            let followingUser: u.User = await db.dbUsers.findOne({ _id: new Mongo.ObjectID(user.following[i]) });
            if (followingUser) {
                let tweets: Tweet[] = await db.dbTweets.find({ userID: followingUser._id, creationDate: { $gt: oldestDate } }).toArray();
                for (let j: number = 0; j < tweets.length; j++) {
                    let answerTweed: TweetAnswer = {
                        _id: tweets[j]._id,
                        text: tweets[j].text,
                        creationDate: tweets[j].creationDate,
                        userName: followingUser.firstname + " " + followingUser.lastname,
                        userEmail: followingUser.email
                    };
                    if (followingUser.pictureLink) {
                        answerTweed.userPicture = followingUser.pictureLink;
                    }
                    if (tweets[j].media) {
                        answerTweed.media = tweets[j].media;
                    }
                    followingUsersTweets.push(answerTweed);
                }
            } else {
                console.log("Error, can't get User with id: " + user.following[i]);
            }
        }
        if (followingUsersTweets.length > 0) {
            followingUsersTweets.sort(function (a: TweetAnswer, b: TweetAnswer): number {
                return a.creationDate.getTime() - b.creationDate.getTime();
            });
        }

        if (user.following.length == 0) {
            let adminTweet: TweetAnswer = {
                text: "You need to follow Users to see Tweets",
                creationDate: new Date(Date.now()),
                userEmail: "admin",
                userName: "Admin"
            };
            followingUsersTweets.push(adminTweet);
        }
        return followingUsersTweets;
    } else {
        console.log("Error user not exist");
    }

    return null;
}

export async function getTweetsFromUser(user: u.User): Promise<TweetAnswer[]> {
    let retArray: TweetAnswer[] = [];
    let tweets: Tweet[] = await db.dbTweets.find({ userID: user._id }).toArray();
    for (let i: number = 0; i < tweets.length; i++) {
        let answerTweed: TweetAnswer = {
            _id: tweets[i]._id,
            text: tweets[i].text,
            creationDate: tweets[i].creationDate,
            userName: user.firstname + " " + user.lastname,
            userEmail: user.email
        };
        if (user.pictureLink) {
            answerTweed.userPicture = user.pictureLink;
        }
        if (tweets[i].media) {
            answerTweed.media = tweets[i].media;
        }
        retArray.push(answerTweed);
    }
    if (retArray.length > 0) {
        retArray.sort(function (a: TweetAnswer, b: TweetAnswer): number {
            return a.creationDate.getTime() - b.creationDate.getTime();
        });
    } else {
        let t: TweetAnswer = { creationDate: new Date(Date.now()), text: "This User hasn't Posted anything yet", userName: "Admin", userEmail: "Admin" };
        retArray.push(t);
    }
    return retArray;
}