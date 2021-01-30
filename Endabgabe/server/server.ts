import * as Http from "http";
import * as querystring from "querystring";

import * as auth from "./auth";
import * as db from "./db";
import * as secret from "./secrets";
import * as t from "./tweet";
import * as u from "./user";


process.env.JWT_SECRET = secret.jwtSecret;

let KEYCOMMANDREGISTER: string = "register";
let KEYCOMMANDLOGIN: string = "login";
let KEYCOMMANDGETALLUSERS: string = "showAllUsers";
let KEYCOMMANDPOSTTWEET: string = "postTweet";
let KEYCOMMANDGETTWEETTIMELINE: string = "getTweetTimeline";
let KEYCOMMANDSUSCRIBETOUSER: string = "subscribe";
let KEYCOMMANDUNSUSCRIBETOUSER: string = "unsubscribe";
let KEYCOMMANDSHOWUSERDETAIL: string = "showUserDetail";
let KEYCOMMANDEDITUSER: string = "editUser";
let KEYCOMMANDEDITUSERPW: string = "editUserPW";
let KEYCOMMANDDELETETWEET: string = "deleteTweet";
let KEYCOMMANDDELETEUSER: string = "deleteUser";


console.log("Starting server"); // Konsolenausgabe
let port: number = Number(process.env.PORT); // Holt aktuellen Port
if (!port)
    port = 8100; // Wenn kein Port, Port = 8100
startServer(port);
db.connectToDatabase();

function startServer(_port: number): void {
    let server: Http.Server = Http.createServer();
    server.addListener("request", handleRequest);
    server.addListener("listening", handleListen);
    server.listen(_port);
}

function handleListen(): void {
    console.log("Listening");
}

export interface RequestData {
    [type: string]: string | string[];
}

interface ResponseToClient {
    status: number;
    message: string;
    authCookieString?: string;
    data?: string[];
    tweets?: t.TweetAnswer[];
    users?: u.User[];
}


function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {
    _response.setHeader("Access-Control-Allow-Origin", "*");

    if (_request.method == "POST") {
        let body: string = "";
        _request.on("data", data => {
            body += data;
        });
        _request.on("end", async () => {
            let data: RequestData = querystring.parse(body);
            let response: ResponseToClient;
            if (data.command) {
                let command: string = <string>data.command;
                if (command != "ping") {
                    console.log("Command: " + command);
                    if (db.dbUsers && db.dbTweets) {
                        let validEmail: boolean = true;
                        if (data.email) {
                            let email: string = <string>data.email;
                            let res: RegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                            validEmail = res.test(email);
                        }
                        if (validEmail) {
                            if (command == KEYCOMMANDREGISTER) {
                                if (data.email && data.password && data.firstname && data.lastname && data.studycourse && data.semester) {
                                    let tokenData: auth.TokenData = await u.registration(data);
                                    if (tokenData) {
                                        response = {
                                            status: 0,
                                            message: "Account created successful",
                                            authCookieString: auth.createAuthCookie(tokenData)
                                        };
                                    } else {
                                        response = { status: -1, message: "Email already exists" };
                                    }
                                } else {
                                    response = { status: -1, message: "Error, not all required params given" };
                                }
                            }

                            else if (command == KEYCOMMANDLOGIN) {
                                if (data.email && data.password) {
                                    let tokenData: auth.TokenData = await u.login(data);
                                    if (tokenData) {
                                        response = {
                                            status: 0,
                                            message: "Login successful",
                                            authCookieString: auth.createAuthCookie(tokenData)
                                        };
                                    } else {
                                        response = { status: -1, message: "Login went wrong" };
                                    }
                                } else {
                                    response = { status: -1, message: "Error, not all required params given" };
                                }
                            }

                            else if (command == KEYCOMMANDDELETEUSER) {
                                if (data.authKey) {
                                    let authKey: string = <string>data.authKey;
                                    let user: u.User = await auth.authWithKey(authKey);
                                    if (user != null) {
                                        if (await u.deleteUser(user)) {
                                            console.log("Deleted User with Email: " + user.email + " and ID: " + user._id);
                                            response = { status: 0, message: "Delete Successfull" };
                                        } else {
                                            response = { status: -1, message: "Delete went wrong" };
                                        }
                                    } else {
                                        response = { status: -1, message: "Delete went wrong" };
                                    }
                                } else {
                                    response = { status: -1, message: "Error, not all required params given" };
                                }
                            }

                            else if (command == KEYCOMMANDEDITUSER) {
                                if (data.authKey) {
                                    let authKey: string = <string>data.authKey;
                                    let user: u.User = await auth.authWithKey(authKey);
                                    if (user != null) {
                                        if (data.lastname && data.firstname && data.email && data.studycourse && data.semester) {
                                            let tokenData: auth.TokenData = await u.editUser(user, data);
                                            if (tokenData && tokenData != null) {
                                                response = {
                                                    status: 0,
                                                    message: "Account edited successful",
                                                    authCookieString: auth.createAuthCookie(tokenData)
                                                };
                                            } else {
                                                response = { status: -3, message: "Update went wrong" };
                                            }
                                        }
                                        else {
                                            response = { status: -1, message: "Error, not all required params given" };
                                        }
                                    } else {
                                        response = { status: -2, message: "Need to Login again" };
                                    }
                                } else {
                                    response = { status: -1, message: "Error, not all required params given" };
                                }
                            }

                            else if (command == KEYCOMMANDEDITUSERPW) {
                                if (data.authKey) {
                                    let authKey: string = <string>data.authKey;
                                    let user: u.User = await auth.authWithKey(authKey);
                                    if (user != null) {
                                        if (data.emailPW && data.oldPW && data.newPW) {
                                            let oldPW: string = <string>data.oldPW;
                                            let newPW: string = <string>data.newPW;
                                            if (await u.editUserPW(user, oldPW, newPW)) {
                                                response = {
                                                    status: 0,
                                                    message: "Account edited successful"
                                                };
                                            } else {
                                                response = { status: -3, message: "Update went wrong" };
                                            }
                                        }
                                        else {
                                            response = { status: -1, message: "Error, not all required params given" };
                                        }
                                    } else {
                                        response = { status: -2, message: "Need to Login again" };
                                    }
                                } else {
                                    response = { status: -1, message: "Error, not all required params given" };
                                }
                            }

                            else if (command == KEYCOMMANDGETALLUSERS) {
                                if (data.authKey) {
                                    let authKey: string = <string>data.authKey;
                                    let user: u.User = await auth.authWithKey(authKey);
                                    if (user != null) {
                                        let allUsers: u.User[] = await u.getAllUsers(user.email);
                                        response = { status: 0, message: "All Users given", users: allUsers };
                                    } else {
                                        response = { status: -2, message: "Need to Login again" };
                                    }
                                } else {
                                    response = { status: -1, message: "Error, not all required params given" };
                                }
                            }

                            else if (command == KEYCOMMANDSHOWUSERDETAIL) {
                                if (data.authKey) {
                                    let authKey: string = <string>data.authKey;
                                    let email: string;
                                    let requestingUser: u.User = await auth.authWithKey(authKey);
                                    if (requestingUser) {
                                        if (data.email) {
                                            email = <string>data.email;
                                        } else {
                                            email = requestingUser.email;
                                        }
                                        let user: u.User = await u.findUserByEmail(email);
                                        if (user) {
                                            delete user.password;
                                            let users: u.User[] = [];
                                            users.push(user);
                                            let tweets: t.TweetAnswer[] = await t.getTweetsFromUser(user);
                                            response = { status: 0, message: "Get User Details Successfull", users: users, tweets: tweets };
                                        } else {
                                            response = { status: -1, message: "Something went Wrong,cant get User" };
                                        }
                                    } else {
                                        response = { status: -2, message: "Need to Login again" };
                                    }
                                } else {
                                    response = { status: -2, message: "Not all Params given" };
                                }
                            }

                            else if (command == KEYCOMMANDSUSCRIBETOUSER) {
                                if (data.authKey && data._id) {
                                    let authKey: string = <string>data.authKey;
                                    let idToSuscribe: string = <string>data._id;
                                    let user: u.User = await auth.authWithKey(authKey);
                                    if (user != null) {
                                        await u.suscribe(user, idToSuscribe);
                                        response = { status: 0, message: "Finished" };
                                    } else {
                                        response = { status: -2, message: "Need to Login again" };
                                    }
                                } else {
                                    response = { status: -1, message: "Error, not all required params given" };
                                }
                            }

                            else if (command == KEYCOMMANDUNSUSCRIBETOUSER) {
                                if (data.authKey && data._id) {
                                    let authKey: string = <string>data.authKey;
                                    let idToUnSuscribe: string = <string>data._id;
                                    let user: u.User = await auth.authWithKey(authKey);
                                    if (user != null) {
                                        await u.unsuscribe(user, idToUnSuscribe);
                                        response = { status: 0, message: "Finished" };
                                    } else {
                                        response = { status: -2, message: "Need to Login again" };
                                    }
                                } else {
                                    response = { status: -1, message: "Error, not all required params given" };
                                }
                            }

                            else if (command == KEYCOMMANDPOSTTWEET) {
                                if (data.authKey && data.tweet) {
                                    let authKey: string = <string>data.authKey;
                                    let tweet: string = <string>data.tweet;
                                    let suc: number = await t.postTweet(authKey, tweet);
                                    if (suc == 0) {
                                        response = { status: 0, message: "Posted successful" };
                                    } else if (suc == -1) {
                                        response = { status: -1, message: "Need to Login again" };
                                    } else {
                                        response = { status: -2, message: "Post went wrong" };
                                    }
                                } else {
                                    response = { status: -3, message: "Error, not all required params given" };
                                }
                            }

                            else if (command == KEYCOMMANDDELETETWEET) {
                                if (data.authKey && data.tweetID) {
                                    let authKey: string = <string>data.authKey;
                                    let tweetID: string = <string>data.tweetID;
                                    let suc: number = await t.deleteTweet(authKey, tweetID);
                                    if (suc == 0) {
                                        response = { status: 0, message: "Posted successful" };
                                    } else if (suc == -1) {
                                        response = { status: -1, message: "Need to Login again" };
                                    } else {
                                        response = { status: -2, message: "Delete went wrong" };
                                    }
                                } else {
                                    response = { status: -3, message: "Error, not all required params given" };
                                }
                            }

                            else if (command == KEYCOMMANDGETTWEETTIMELINE) {
                                if (data.authKey && data.oldestDate) {
                                    let authKey: string = <string>data.authKey;
                                    let oldestDateString: string = <string>data.oldestDate;
                                    let oldestDate: Date = new Date(Date.parse(oldestDateString));
                                    if (auth.authWithKey(authKey) != null) {
                                        let tweets: t.TweetAnswer[] = await t.getTweetTimeline(authKey, oldestDate);
                                        if (tweets != null) {
                                            response = { status: 0, message: "Get latest Tweets successful", tweets: tweets };
                                        } else {
                                            response = { status: -2, message: "Something went wrong" };
                                        }
                                    } else {
                                        response = { status: -1, message: "Need to Login again" };
                                    }
                                } else {
                                    response = { status: -3, message: "Error, not all required params given" };
                                }
                            }


                            else {
                                response = { status: -1, message: "Wrong Command given" };
                            }
                        } else {
                            response = { status: -1, message: "Not a valid Email" };
                        }
                    } else {
                        response = { status: -1, message: "DBConnection not Ready" };
                        console.log("DBConnection not Ready");
                    }
                } else {
                    response = { status: 0, message: "Ping" };
                }
            } else {
                response = { status: -1, message: "Error, no Command given" };
                console.log("Error, no Command given");
            }

            _response.setHeader("content-type", "application/json"); // Antwort als JSON
            _response.write(JSON.stringify(response));
            _response.end(); // Antwort abschliessen

        });

    }

}
