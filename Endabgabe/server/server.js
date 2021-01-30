"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Http = require("http");
const querystring = require("querystring");
const auth = require("./auth");
const db = require("./db");
const secret = require("./secrets");
const t = require("./tweet");
const u = require("./user");
process.env.JWT_SECRET = secret.jwtSecret;
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
console.log("Starting server"); // Konsolenausgabe
let port = Number(process.env.PORT); // Holt aktuellen Port
if (!port)
    port = 8100; // Wenn kein Port, Port = 8100
startServer(port);
db.connectToDatabase();
function startServer(_port) {
    let server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(_port);
}
function handleListen() {
    console.log("Listening");
}
function handleRequest(_request, _response) {
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
                if (command != "ping") {
                    console.log("Command: " + command);
                    if (db.dbUsers && db.dbTweets) {
                        let validEmail = true;
                        if (data.email) {
                            let email = data.email;
                            let res = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                            validEmail = res.test(email);
                        }
                        if (validEmail) {
                            if (command == KEYCOMMANDREGISTER) {
                                if (data.email && data.password && data.firstname && data.lastname && data.studycourse && data.semester) {
                                    let tokenData = await u.registration(data);
                                    if (tokenData) {
                                        response = {
                                            status: 0,
                                            message: "Account created successful",
                                            authCookieString: auth.createAuthCookie(tokenData)
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
                                    let tokenData = await u.login(data);
                                    if (tokenData) {
                                        response = {
                                            status: 0,
                                            message: "Login successful",
                                            authCookieString: auth.createAuthCookie(tokenData)
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
                                    let user = await auth.authWithKey(authKey);
                                    if (user != null) {
                                        if (await u.deleteUser(user)) {
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
                                    let user = await auth.authWithKey(authKey);
                                    if (user != null) {
                                        if (data.lastname && data.firstname && data.email && data.studycourse && data.semester) {
                                            let tokenData = await u.editUser(user, data);
                                            if (tokenData && tokenData != null) {
                                                response = {
                                                    status: 0,
                                                    message: "Account edited successful",
                                                    authCookieString: auth.createAuthCookie(tokenData)
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
                                    let user = await auth.authWithKey(authKey);
                                    if (user != null) {
                                        if (data.emailPW && data.oldPW && data.newPW) {
                                            let oldPW = data.oldPW;
                                            let newPW = data.newPW;
                                            if (await u.editUserPW(user, oldPW, newPW)) {
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
                                    let user = await auth.authWithKey(authKey);
                                    if (user != null) {
                                        let allUsers = await u.getAllUsers(user.email);
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
                                    let requestingUser = await auth.authWithKey(authKey);
                                    if (requestingUser) {
                                        if (data.email) {
                                            email = data.email;
                                        }
                                        else {
                                            email = requestingUser.email;
                                        }
                                        let user = await u.findUserByEmail(email);
                                        if (user) {
                                            delete user.password;
                                            let users = [];
                                            users.push(user);
                                            let tweets = await t.getTweetsFromUser(user);
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
                                    let user = await auth.authWithKey(authKey);
                                    if (user != null) {
                                        await u.suscribe(user, idToSuscribe);
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
                                    let user = await auth.authWithKey(authKey);
                                    if (user != null) {
                                        await u.unsuscribe(user, idToUnSuscribe);
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
                                    let suc = await t.postTweet(authKey, tweet);
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
                                    let suc = await t.deleteTweet(authKey, tweetID);
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
                                    if (auth.authWithKey(authKey) != null) {
                                        let tweets = await t.getTweetTimeline(authKey, oldestDate);
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
                            response = { status: -1, message: "Not a valid Email" };
                        }
                    }
                    else {
                        response = { status: -1, message: "DBConnection not Ready" };
                        console.log("DBConnection not Ready");
                    }
                }
                else {
                    response = { status: 0, message: "Ping" };
                }
            }
            else {
                response = { status: -1, message: "Error, no Command given" };
                console.log("Error, no Command given");
            }
            _response.setHeader("content-type", "application/json"); // Antwort als JSON
            _response.write(JSON.stringify(response));
            _response.end(); // Antwort abschliessen
        });
    }
}
//# sourceMappingURL=server.js.map