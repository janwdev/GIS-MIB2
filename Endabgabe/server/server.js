"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterServer = void 0;
const Http = require("http");
const Mongo = require("mongodb");
const querystring = require("querystring");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var TwitterServer;
(function (TwitterServer) {
    process.env.JWT_SECRET = "Z6uZvbQhjgNYSb";
    let KEYCOMMANDREGISTER = "register";
    let KEYCOMMANDLOGIN = "login";
    let KEYCOMMANDGETALLUSERS = "showAllUsers";
    let KEYCOMMANDPOSTTWEET = "postTweet";
    let KEYCOMMANDGETTWEETTIMELINE = "getTweetTimeline";
    let KEYCOMMANDSUSCRIBETOUSER = "subscribe";
    let KEYCOMMANDUNSUSCRIBETOUSER = "unsubscribe";
    let KEYCOMMANDSHOWUSERDETAIL = "showUserDetail";
    let KEYCOMMANDEDITUSER = "editUser";
    let KEYCOMMANDEDITUSERPW = "editUserPW";
    let KEYCOMMANDDELETETWEET = "deleteTweet";
    let KEYCOMMANDDELETEUSER = "deleteUser";
    let dbUsers;
    let dbTweets;
    let databaseUrl;
    let databaseName = "Twitter";
    let dbUsersCollectionName = "Users";
    let dbTweetsCollectionName = "Tweets";
    let startArgs = process.argv.slice(2);
    console.log(startArgs);
    switch (startArgs[0]) {
        case "local":
            databaseUrl = "mongodb://localhost:27017";
            console.log("running local");
            break;
        case "remote":
            // TODO Anpassen
            let userName = "user";
            let pw = "onlineUser";
            databaseUrl = "mongodb+srv://" + userName + ":" + pw + "@gismib2.wulcs.mongodb.net/" + databaseName + "?retryWrites=true&w=majority";
            console.log("running remote");
            break;
        default:
            console.log("no or wrong argument given, running local");
            databaseUrl = "mongodb://localhost:27017";
    }
    console.log("Starting server"); // Konsolenausgabe
    let port = Number(process.env.PORT); // Holt aktuellen Port
    if (!port)
        port = 8100; // Wenn kein Port, Port = 8100
    startServer(port);
    connectToDatabase(databaseUrl);
    function startServer(_port) {
        let server = Http.createServer();
        server.addListener("request", handleRequest);
        server.addListener("listening", handleListen);
        server.listen(_port);
    }
    function handleListen() {
        console.log("Listening");
    }
    async function connectToDatabase(_url) {
        let options = { useNewUrlParser: true, useUnifiedTopology: true }; // Vorgegeben, danach suchen
        let mongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        dbUsers = mongoClient.db(databaseName).collection(dbUsersCollectionName);
        dbTweets = mongoClient.db(databaseName).collection(dbTweetsCollectionName);
        console.log("Database connection", dbUsers != undefined);
    }
    function handleRequest(_request, _response) {
        console.log("I hear voices!"); // Konsolenausgabe
        _response.setHeader("Access-Control-Allow-Origin", "*");
        if (_request.method == "POST") {
            let body = "";
            _request.on("data", data => {
                body += data;
            });
            _request.on("end", async () => {
                let data = querystring.parse(body);
                let response;
                if (data.command) {
                    let command = data.command;
                    if (command == KEYCOMMANDREGISTER) {
                        if (data.email && data.password && data.firstname && data.lastname && data.studycourse && data.semester) {
                            let tokenData = await registration(data);
                            if (tokenData) {
                                response = {
                                    status: 0,
                                    message: "Account created successful",
                                    authCookieString: createAuthCookie(tokenData)
                                };
                            }
                            else {
                                response = { status: -1, message: "Email already exists" };
                            }
                        }
                        else {
                            response = { status: -1, message: "Error, not all required params given" };
                        }
                    }
                    else if (command == KEYCOMMANDLOGIN) {
                        if (data.email && data.password) {
                            let tokenData = await login(data);
                            if (tokenData) {
                                response = {
                                    status: 0,
                                    message: "Login successful",
                                    authCookieString: createAuthCookie(tokenData)
                                };
                            }
                            else {
                                response = { status: -1, message: "Login went wrong" };
                            }
                        }
                        else {
                            response = { status: -1, message: "Error, not all required params given" };
                        }
                    }
                    else if (command == KEYCOMMANDDELETEUSER) {
                        if (data.authKey) {
                            let authKey = data.authKey;
                            let user = await authWithKey(authKey);
                            if (user != null) {
                                if (await deleteUser(user)) {
                                    console.log("Deleted User with Email: " + user.email + " and ID: " + user._id);
                                    response = { status: 0, message: "Delete Successfull" };
                                }
                                else {
                                    response = { status: -1, message: "Delete went wrong" };
                                }
                            }
                            else {
                                response = { status: -1, message: "Delete went wrong" };
                            }
                        }
                        else {
                            response = { status: -1, message: "Error, not all required params given" };
                        }
                    }
                    else if (command == KEYCOMMANDEDITUSER) {
                        if (data.authKey) {
                            let authKey = data.authKey;
                            let user = await authWithKey(authKey);
                            if (user != null) {
                                if (data.lastname && data.firstname && data.email && data.studycourse && data.semester) {
                                    let tokenData = await editUser(user, data);
                                    if (tokenData && tokenData != null) {
                                        response = {
                                            status: 0,
                                            message: "Account edited successful",
                                            authCookieString: createAuthCookie(tokenData)
                                        };
                                    }
                                    else {
                                        response = { status: -3, message: "Update went wrong" };
                                    }
                                }
                                else {
                                    response = { status: -1, message: "Error, not all required params given" };
                                }
                            }
                            else {
                                response = { status: -2, message: "Need to Login again" };
                            }
                        }
                        else {
                            response = { status: -1, message: "Error, not all required params given" };
                        }
                    }
                    else if (command == KEYCOMMANDEDITUSERPW) {
                        if (data.authKey) {
                            let authKey = data.authKey;
                            let user = await authWithKey(authKey);
                            if (user != null) {
                                if (data.emailPW && data.oldPW && data.newPW) {
                                    let oldPW = data.oldPW;
                                    let newPW = data.newPW;
                                    if (await editUserPW(user, oldPW, newPW)) {
                                        response = {
                                            status: 0,
                                            message: "Account edited successful"
                                        };
                                    }
                                    else {
                                        response = { status: -3, message: "Update went wrong" };
                                    }
                                }
                                else {
                                    response = { status: -1, message: "Error, not all required params given" };
                                }
                            }
                            else {
                                response = { status: -2, message: "Need to Login again" };
                            }
                        }
                        else {
                            response = { status: -1, message: "Error, not all required params given" };
                        }
                    }
                    else if (command == KEYCOMMANDGETALLUSERS) {
                        if (data.authKey) {
                            let authKey = data.authKey;
                            let user = await authWithKey(authKey);
                            if (user != null) {
                                let allUsers = await getAllUsers(user.email);
                                response = { status: 0, message: "All Users given", users: allUsers };
                            }
                            else {
                                response = { status: -2, message: "Need to Login again" };
                            }
                        }
                        else {
                            response = { status: -1, message: "Error, not all required params given" };
                        }
                    }
                    else if (command == KEYCOMMANDSHOWUSERDETAIL) {
                        if (data.authKey) {
                            let authKey = data.authKey;
                            let email;
                            let requestingUser = await authWithKey(authKey);
                            if (requestingUser) {
                                if (data.email) {
                                    email = data.email;
                                }
                                else {
                                    email = requestingUser.email;
                                }
                                let user = await findUserByEmail(email);
                                if (user) {
                                    delete user.password;
                                    let users = [];
                                    users.push(user);
                                    let tweets = await getTweetsFromUser(user);
                                    response = { status: 0, message: "Get User Details Successfull", users: users, tweets: tweets };
                                }
                                else {
                                    response = { status: -1, message: "Something went Wrong,cant get User" };
                                }
                            }
                            else {
                                response = { status: -2, message: "Need to Login again" };
                            }
                        }
                        else {
                            response = { status: -2, message: "Not all Params given" };
                        }
                    }
                    else if (command == KEYCOMMANDSUSCRIBETOUSER) {
                        if (data.authKey && data._id) {
                            let authKey = data.authKey;
                            let idToSuscribe = data._id;
                            let user = await authWithKey(authKey);
                            if (user != null) {
                                await suscribe(user, idToSuscribe);
                                response = { status: 0, message: "Finished" };
                            }
                            else {
                                response = { status: -2, message: "Need to Login again" };
                            }
                        }
                        else {
                            response = { status: -1, message: "Error, not all required params given" };
                        }
                    }
                    else if (command == KEYCOMMANDUNSUSCRIBETOUSER) {
                        if (data.authKey && data._id) {
                            let authKey = data.authKey;
                            let idToUnSuscribe = data._id;
                            let user = await authWithKey(authKey);
                            if (user != null) {
                                await unsuscribe(user, idToUnSuscribe);
                                response = { status: 0, message: "Finished" };
                            }
                            else {
                                response = { status: -2, message: "Need to Login again" };
                            }
                        }
                        else {
                            response = { status: -1, message: "Error, not all required params given" };
                        }
                    }
                    else if (command == KEYCOMMANDPOSTTWEET) {
                        if (data.authKey && data.tweet) {
                            let authKey = data.authKey;
                            let tweet = data.tweet;
                            let suc = await postTweet(authKey, tweet);
                            if (suc == 0) {
                                response = { status: 0, message: "Posted successful" };
                            }
                            else if (suc == -1) {
                                response = { status: -1, message: "Need to Login again" };
                            }
                            else {
                                response = { status: -2, message: "Post went wrong" };
                            }
                        }
                        else {
                            response = { status: -3, message: "Error, not all required params given" };
                        }
                    }
                    else if (command == KEYCOMMANDDELETETWEET) {
                        if (data.authKey && data.tweetID) {
                            let authKey = data.authKey;
                            let tweetID = data.tweetID;
                            let suc = await deleteTweet(authKey, tweetID);
                            if (suc == 0) {
                                response = { status: 0, message: "Posted successful" };
                            }
                            else if (suc == -1) {
                                response = { status: -1, message: "Need to Login again" };
                            }
                            else {
                                response = { status: -2, message: "Delete went wrong" };
                            }
                        }
                        else {
                            response = { status: -3, message: "Error, not all required params given" };
                        }
                    }
                    else if (command == KEYCOMMANDGETTWEETTIMELINE) {
                        if (data.authKey && data.oldestDate) {
                            let authKey = data.authKey;
                            let oldestDateString = data.oldestDate;
                            let oldestDate = new Date(Date.parse(oldestDateString));
                            if (authWithKey(authKey) != null) {
                                let tweets = await getTweetTimeline(authKey, oldestDate);
                                if (tweets != null) {
                                    response = { status: 0, message: "Get latest Tweets successful", tweets: tweets };
                                }
                                else {
                                    response = { status: -2, message: "Something went wrong" };
                                }
                            }
                            else {
                                response = { status: -1, message: "Need to Login again" };
                            }
                        }
                        else {
                            response = { status: -3, message: "Error, not all required params given" };
                        }
                    }
                    else {
                        response = { status: -1, message: "Wrong Command given" };
                    }
                }
                else {
                    response = { status: -1, message: "Error, no Command given" };
                }
                _response.setHeader("content-type", "application/json"); // Antwort als JSON
                _response.write(JSON.stringify(response));
                _response.end(); // Antwort abschliessen
            });
        }
    }
    async function login(data) {
        let email = data.email;
        let password = data.password;
        if (email && password) {
            let user = await dbUsers.findOne({ email: data.email });
            if (user) {
                if (await bcrypt.compare(password, user.password)) {
                    console.log("User: " + user.email + " logged in");
                    return createToken(email);
                }
                else {
                    console.log("Wrong Login from User: " + user.email);
                }
            }
        }
        return null;
    }
    async function registration(data) {
        let email = data.email;
        let password = data.password;
        if (email && password) {
            if (!await dbUsers.findOne({ email: data.email })) {
                const hashedPassword = await bcrypt.hash(password, 10);
                let firstname = data.firstname;
                let lastname = data.lastname;
                let studycourse = data.studycourse;
                let semester = data.semester;
                if (firstname && lastname && studycourse && semester) {
                    let user = { firstname: firstname, lastname: lastname, studycourse: studycourse, semester: semester, email: email, password: hashedPassword, followers: [], following: [] };
                    await addUserToDB(user);
                    let dbUser = await findUserByEmail(email);
                    suscribe(dbUser, dbUser._id);
                    console.log("Registration for User: " + user.email);
                    return createToken(user.email);
                }
            }
        }
        return null;
    }
    async function editUser(user, data) {
        let lastname = data.lastname;
        let firstname = data.firstname;
        let email = data.email;
        let studycourse = data.studycourse;
        let semester = data.semester;
        let updated = await dbUsers.findOneAndUpdate({ email: user.email }, { $set: { lastname: lastname, firstname: firstname, email: email, studycourse: studycourse, semester: semester } }, { returnOriginal: false });
        if (updated.ok == 1) {
            let updatedUser = updated.value;
            return createToken(updatedUser.email);
        }
        return null;
    }
    async function editUserPW(user, oldPW, newPW) {
        if (await bcrypt.compare(oldPW, user.password)) {
            const hashedPassword = await bcrypt.hash(newPW, 10);
            let updated = await dbUsers.findOneAndUpdate({ email: user.email }, { $set: { password: hashedPassword } }, { returnOriginal: false });
            if (updated.ok == 1) {
                return true;
            }
        }
        return false;
    }
    async function deleteUser(user) {
        let id = user._id + "";
        for (let i = 0; i < user.following.length; i++) {
            let idToChange = user.following[i];
            await dbUsers.updateOne({ _id: new Mongo.ObjectID(idToChange) }, { $pull: { followers: id } });
        }
        for (let i = 0; i < user.followers.length; i++) {
            let idToChange = user.followers[i];
            await dbUsers.updateOne({ _id: new Mongo.ObjectID(idToChange) }, { $pull: { following: id } });
        }
        let result1 = await dbTweets.deleteMany({ userID: new Mongo.ObjectID(id) });
        if (result1.result.ok == 1) {
            let result2 = await dbUsers.deleteOne({ email: user.email });
            if (result2.result.ok == 1) {
                return true;
            }
        }
        return false;
    }
    //######Code from https://wanago.io/2018/12/24/typescript-express-registering-authenticating-jwt/ ######################
    function createToken(email) {
        let expiresIn = 60 * 60; // an hour
        // let expiresIn: number = 60; // 60 Sekunden
        let secret = process.env.JWT_SECRET;
        let dataStoredInToken = {
            email: email
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn })
        };
    }
    //######Code from https://wanago.io/2018/12/24/typescript-express-registering-authenticating-jwt/ ######################
    async function authWithKey(authKey) {
        if (authKey) {
            const secret = process.env.JWT_SECRET;
            const verificationResponse = jwt.verify(authKey, secret);
            const email = verificationResponse.email;
            let user = await findUserByEmail(email);
            if (user) {
                return user;
            }
            console.log("Benutzer mit Email nicht gefunden: " + email);
        }
        console.log("Auth mit Key ist Fehlgeschlagen");
        return null;
    }
    //######Code from https://wanago.io/2018/12/24/typescript-express-registering-authenticating-jwt/ ######################
    function createAuthCookie(tokenData) {
        return `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}`;
    }
    async function findUserByEmail(email) {
        let user = await dbUsers.findOne({ email: email });
        if (user)
            return user;
        else
            return null;
    }
    async function addUserToDB(user) {
        dbUsers.insertOne(user);
    }
    async function getAllUsers(email) {
        let users = [];
        let thisUser = await dbUsers.findOne({ email: email });
        users.push(thisUser);
        let otherUsers = await dbUsers.find({ email: { $ne: email } }).toArray();
        otherUsers.forEach(user => {
            delete user.password;
            users.push(user);
        });
        return users;
    }
    async function suscribe(user, idToSubscribe) {
        let userToFollow = await dbUsers.findOne({ _id: new Mongo.ObjectID(idToSubscribe) });
        let userIDToSubscribe = userToFollow._id + "";
        user.following.push(userIDToSubscribe);
        let following = user.following;
        dbUsers.findOneAndUpdate({ email: user.email }, { $set: { following: following } });
        userToFollow.followers.push(user._id + "");
        let followers = userToFollow.followers;
        dbUsers.findOneAndUpdate({ email: userToFollow.email }, { $set: { followers: followers } });
    }
    async function unsuscribe(user, idToUnSuscribe) {
        let userToUnFollow = await dbUsers.findOne({ _id: new Mongo.ObjectID(idToUnSuscribe) });
        if (userToUnFollow) {
            let userID = user._id + "";
            let userIdToUnSuscribe = userToUnFollow._id + "";
            let following = user.following;
            let index = following.indexOf(userIdToUnSuscribe);
            if (index !== -1) {
                following.splice(index, 1);
            }
            await dbUsers.findOneAndUpdate({ _id: new Mongo.ObjectID(userID) }, { $set: { following: following } });
            let followers = userToUnFollow.followers;
            let indexFollowers = followers.indexOf(userID);
            if (indexFollowers !== -1) {
                followers.splice(indexFollowers, 1);
            }
            await dbUsers.findOneAndUpdate({ _id: new Mongo.ObjectID(userIdToUnSuscribe) }, { $set: { followers: followers } });
        }
        else {
            console.log("User not found to Unsuscribe");
        }
    }
    async function postTweet(authKey, tweetText) {
        let user = await authWithKey(authKey);
        if (user != null) {
            let tweet = { text: tweetText, userID: user._id, creationDate: new Date(Date.now()) };
            dbTweets.insertOne(tweet);
            console.log("User " + user.email + " posted a tweet: " + tweetText);
            return 0;
        }
        return -1;
    }
    async function deleteTweet(authKey, tweetID) {
        let user = await authWithKey(authKey);
        if (user != null) {
            let tweet = await dbTweets.findOne({ _id: new Mongo.ObjectID(tweetID) });
            if (tweet) {
                let tweetUserID = "" + tweet.userID;
                let userUserID = "" + user._id;
                if (tweetUserID && userUserID) {
                    if (tweetUserID == userUserID) {
                        let result = await dbTweets.deleteOne({ _id: new Mongo.ObjectID(tweetID) });
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
    async function getTweetTimeline(authKey, oldestDate) {
        let user = await authWithKey(authKey);
        if (user != null) {
            let followingUsersTweets = [];
            for (let i = 0; i < user.following.length; i++) {
                let followingUser = await dbUsers.findOne({ _id: new Mongo.ObjectID(user.following[i]) });
                if (followingUser) {
                    let tweets = await dbTweets.find({ userID: followingUser._id, creationDate: { $gt: oldestDate } }).toArray();
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
    async function getTweetsFromUser(user) {
        let retArray = [];
        let tweets = await dbTweets.find({ userID: user._id }).toArray();
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
})(TwitterServer = exports.TwitterServer || (exports.TwitterServer = {}));
//# sourceMappingURL=server.js.map