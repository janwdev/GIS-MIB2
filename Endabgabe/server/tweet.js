"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTweetsFromUser = exports.getTweetTimeline = exports.deleteTweet = exports.postTweet = void 0;
const Mongo = require("mongodb");
const auth = require("./auth");
const db = require("./db");
async function postTweet(authKey, tweetText) {
    let user = await auth.authWithKey(authKey);
    if (user != null) {
        let tweet = { text: tweetText, userID: user._id, creationDate: new Date(Date.now()) };
        db.dbTweets.insertOne(tweet);
        console.log("User " + user.email + " posted a tweet: " + tweetText);
        return 0;
    }
    return -1;
}
exports.postTweet = postTweet;
async function deleteTweet(authKey, tweetID) {
    let user = await auth.authWithKey(authKey);
    if (user != null) {
        let tweet = await db.dbTweets.findOne({ _id: new Mongo.ObjectID(tweetID) });
        if (tweet) {
            let tweetUserID = "" + tweet.userID;
            let userUserID = "" + user._id;
            if (tweetUserID && userUserID) {
                if (tweetUserID == userUserID) {
                    let result = await db.dbTweets.deleteOne({ _id: new Mongo.ObjectID(tweetID) });
                    if (result.deletedCount > 0) {
                        console.log("User " + user.email + " deleted a tweet: " + tweetID);
                        return 0;
                    }
                }
            }
        }
        else {
            console.log("No tweed found with id: " + tweetID);
        }
        return -2;
    }
    return -1;
}
exports.deleteTweet = deleteTweet;
async function getTweetTimeline(authKey, oldestDate) {
    let user = await auth.authWithKey(authKey);
    if (user != null) {
        let followingUsersTweets = [];
        for (let i = 0; i < user.following.length; i++) {
            let followingUser = await db.dbUsers.findOne({ _id: new Mongo.ObjectID(user.following[i]) });
            if (followingUser) {
                let tweets = await db.dbTweets.find({ userID: followingUser._id, creationDate: { $gt: oldestDate } }).toArray();
                for (let j = 0; j < tweets.length; j++) {
                    let answerTweed = {
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
            }
            else {
                console.log("Error, can't get User with id: " + user.following[i]);
            }
        }
        if (followingUsersTweets.length > 0) {
            followingUsersTweets.sort(function (a, b) {
                return a.creationDate.getTime() - b.creationDate.getTime();
            });
        }
        if (user.following.length == 0) {
            let adminTweet = {
                text: "You need to follow Users to see Tweets",
                creationDate: new Date(Date.now()),
                userEmail: "admin",
                userName: "Admin"
            };
            followingUsersTweets.push(adminTweet);
        }
        return followingUsersTweets;
    }
    else {
        console.log("Error user not exist");
    }
    return null;
}
exports.getTweetTimeline = getTweetTimeline;
async function getTweetsFromUser(user) {
    let retArray = [];
    let tweets = await db.dbTweets.find({ userID: user._id }).toArray();
    for (let i = 0; i < tweets.length; i++) {
        let answerTweed = {
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
        retArray.sort(function (a, b) {
            return a.creationDate.getTime() - b.creationDate.getTime();
        });
    }
    else {
        let t = { creationDate: new Date(Date.now()), text: "This User hasn't Posted anything yet", userName: "Admin", userEmail: "Admin" };
        retArray.push(t);
    }
    return retArray;
}
exports.getTweetsFromUser = getTweetsFromUser;
//# sourceMappingURL=tweet.js.map