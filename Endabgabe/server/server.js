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
            if (await bcrypt.compare(password, user.password)) {
                return createToken(email);
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
                    return createToken(user.email);
                }
            }
        }
        return null;
    }
    //######Code from https://wanago.io/2018/12/24/typescript-express-registering-authenticating-jwt/ ######################
    function createToken(email) {
        // let expiresIn: number = 60 * 60; // an hour
        let expiresIn = 60; // 60 Sekunden
        let secret = process.env.JWT_SECRET;
        let dataStoredInToken = {
            email: email
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
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
        let users = await dbUsers.find({ email: { $ne: email } }).toArray();
        users.forEach(user => {
            delete user.password;
        });
        return users;
    }
    async function suscribe(user, idToSuscribe) {
        user.following.push(idToSuscribe);
        let following = user.following;
        dbUsers.findOneAndUpdate({ email: user.email }, { $set: { following: following } });
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
            console.log(followingUsersTweets);
            return followingUsersTweets;
        }
        else {
            console.log("Error user not exist");
        }
        return null;
    }
    //TODO get Tweets User
})(TwitterServer = exports.TwitterServer || (exports.TwitterServer = {}));
//# sourceMappingURL=server.js.map