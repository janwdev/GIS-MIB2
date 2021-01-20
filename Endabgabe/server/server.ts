import * as Http from "http";
import * as Mongo from "mongodb";
import * as querystring from "querystring";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

export namespace TwitterServer {

    process.env.JWT_SECRET = "Z6uZvbQhjgNYSb";

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

    let dbUsers: Mongo.Collection;
    let dbTweets: Mongo.Collection;

    let databaseUrl: string;
    let databaseName: string = "Twitter";

    let dbUsersCollectionName: string = "Users";
    let dbTweetsCollectionName: string = "Tweets";

    let startArgs: string[] = process.argv.slice(2);
    console.log(startArgs);
    switch (startArgs[0]) {
        case "local":
            databaseUrl = "mongodb://localhost:27017";
            console.log("running local");
            break;
        case "remote":
            // TODO Anpassen
            let userName: string = "user";
            let pw: string = "onlineUser";
            databaseUrl = "mongodb+srv://" + userName + ":" + pw + "@gismib2.wulcs.mongodb.net/" + databaseName + "?retryWrites=true&w=majority";
            console.log("running remote");
            break;
        default:
            console.log("no or wrong argument given, running local");
            databaseUrl = "mongodb://localhost:27017";
    }

    console.log("Starting server"); // Konsolenausgabe
    let port: number = Number(process.env.PORT); // Holt aktuellen Port
    if (!port)
        port = 8100; // Wenn kein Port, Port = 8100
    startServer(port);
    connectToDatabase(databaseUrl);

    function startServer(_port: number): void {
        let server: Http.Server = Http.createServer();
        server.addListener("request", handleRequest);
        server.addListener("listening", handleListen);
        server.listen(_port);
    }

    function handleListen(): void {
        console.log("Listening");
    }

    async function connectToDatabase(_url: string): Promise<void> {
        let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true }; // Vorgegeben, danach suchen
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(_url, options);
        await mongoClient.connect();
        dbUsers = mongoClient.db(databaseName).collection(dbUsersCollectionName);
        dbTweets = mongoClient.db(databaseName).collection(dbTweetsCollectionName);
        console.log("Database connection", dbUsers != undefined);
    }


    interface RequestData {
        [type: string]: string | string[];
    }

    interface ResponseToClient {
        status: number;
        message: string;
        authCookieString?: string;
        data?: string[];
        tweets?: TweetAnswer[];
        users?: User[];
    }


    function handleRequest(_request: Http.IncomingMessage, _response: Http.ServerResponse): void {

        console.log("I hear voices!"); // Konsolenausgabe
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
                    if (command == KEYCOMMANDREGISTER) {
                        if (data.email && data.password && data.firstname && data.lastname && data.studycourse && data.semester) {
                            let tokenData: TokenData = await registration(data);
                            if (tokenData) {
                                response = {
                                    status: 0,
                                    message: "Account created successful",
                                    authCookieString: createAuthCookie(tokenData)
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
                            let tokenData: TokenData = await login(data);
                            if (tokenData) {
                                response = {
                                    status: 0,
                                    message: "Login successful",
                                    authCookieString: createAuthCookie(tokenData)
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
                            let user: User = await authWithKey(authKey);
                            if (user != null) {
                                if (await deleteUser(user)) {
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
                            let user: User = await authWithKey(authKey);
                            if (user != null) {
                                if (data.lastname && data.firstname && data.email && data.studycourse && data.semester) {
                                    let tokenData: TokenData = await editUser(user, data);
                                    if (tokenData && tokenData != null) {
                                        response = {
                                            status: 0,
                                            message: "Account edited successful",
                                            authCookieString: createAuthCookie(tokenData)
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
                            let user: User = await authWithKey(authKey);
                            if (user != null) {
                                if (data.emailPW && data.oldPW && data.newPW) {
                                    let oldPW: string = <string>data.oldPW;
                                    let newPW: string = <string>data.newPW;
                                    if (await editUserPW(user, oldPW, newPW)) {
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
                            let user: User = await authWithKey(authKey);
                            if (user != null) {
                                let allUsers: User[] = await getAllUsers(user.email);
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
                            let requestingUser: User = await authWithKey(authKey);
                            if (requestingUser) {
                                if (data.email) {
                                    email = <string>data.email;
                                } else {
                                    email = requestingUser.email;
                                }
                                let user: User = await findUserByEmail(email);
                                if (user) {
                                    delete user.password;
                                    let users: User[] = [];
                                    users.push(user);
                                    let tweets: TweetAnswer[] = await getTweetsFromUser(user);
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
                            let user: User = await authWithKey(authKey);
                            if (user != null) {
                                await suscribe(user, idToSuscribe);
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
                            let user: User = await authWithKey(authKey);
                            if (user != null) {
                                await unsuscribe(user, idToUnSuscribe);
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
                            let suc: number = await postTweet(authKey, tweet);
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
                            let suc: number = await deleteTweet(authKey, tweetID);
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
                            if (authWithKey(authKey) != null) {
                                let tweets: TweetAnswer[] = await getTweetTimeline(authKey, oldestDate);
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
                    response = { status: -1, message: "Error, no Command given" };
                }

                _response.setHeader("content-type", "application/json"); // Antwort als JSON
                _response.write(JSON.stringify(response));
                _response.end(); // Antwort abschliessen
            });
        }
    }

    interface User {
        _id?: string;
        firstname: string;
        lastname: string;
        studycourse: string;
        semester: string;
        email: string;
        password?: string;
        pictureLink?: string;
        followers: string[];
        following: string[];
    }
    interface TokenData {
        token: string;
        expiresIn: number;
    }
    interface DataStoredInToken {
        email: string;
    }

    async function login(data: RequestData): Promise<TokenData> {
        let email: string = <string>data.email;
        let password: string = <string>data.password;
        if (email && password) {
            let user: User = await dbUsers.findOne({ email: data.email });
            if (user) {
                if (await bcrypt.compare(password, user.password)) {
                    console.log("User: " + user.email + " logged in");
                    return createToken(email);
                } else {
                    console.log("Wrong Login from User: " + user.email);
                }
            }
        }
        return null;
    }

    async function registration(data: RequestData): Promise<TokenData> {
        let email: string = <string>data.email;
        let password: string = <string>data.password;
        if (email && password) {
            if (!await dbUsers.findOne({ email: data.email })) {
                const hashedPassword: string = await bcrypt.hash(password, 10);
                let firstname: string = <string>data.firstname;
                let lastname: string = <string>data.lastname;
                let studycourse: string = <string>data.studycourse;
                let semester: string = <string>data.semester;
                if (firstname && lastname && studycourse && semester) {
                    let user: User = { firstname: firstname, lastname: lastname, studycourse: studycourse, semester: semester, email: email, password: hashedPassword, followers: [], following: [] };
                    await addUserToDB(user);
                    console.log("Registration for User: " + user.email);
                    return createToken(user.email);
                }
            }
        }
        return null;
    }

    async function editUser(user: User, data: RequestData): Promise<TokenData> {
        let lastname: string = <string>data.lastname;
        let firstname: string = <string>data.firstname;
        let email: string = <string>data.email;
        let studycourse: string = <string>data.studycourse;
        let semester: string = <string>data.semester;
        let updated: Mongo.FindAndModifyWriteOpResultObject<User> = await dbUsers.findOneAndUpdate(
            { email: user.email },
            { $set: { lastname: lastname, firstname: firstname, email: email, studycourse: studycourse, semester: semester } },
            { returnOriginal: false }
        );

        if (updated.ok == 1) {
            let updatedUser: User = updated.value;
            return createToken(updatedUser.email);
        }
        return null;
    }

    async function editUserPW(user: User, oldPW: string, newPW: string): Promise<boolean> {
        if (await bcrypt.compare(oldPW, user.password)) {
            const hashedPassword: string = await bcrypt.hash(newPW, 10);
            let updated: Mongo.FindAndModifyWriteOpResultObject<User> = await dbUsers.findOneAndUpdate(
                { email: user.email },
                { $set: { password: hashedPassword } },
                { returnOriginal: false }
            );
            if (updated.ok == 1) {
                return true;
            }
        }
        return false;
    }

    async function deleteUser(user: User): Promise<boolean> {
        let id: string = user._id + "";
        for (let i: number = 0; i < user.following.length; i++) {
            let idToChange: string = user.following[i];
            await dbUsers.updateOne({ _id: new Mongo.ObjectID(idToChange) }, { $pull: { followers: id } });
        }
        for (let i: number = 0; i < user.followers.length; i++) {
            let idToChange: string = user.followers[i];
            await dbUsers.updateOne({ _id: new Mongo.ObjectID(idToChange) }, { $pull: { following: id } });
        }

        let result1: Mongo.DeleteWriteOpResultObject = await dbTweets.deleteMany({ userID: id });
        if (result1.result.ok == 1) {
            let result2: Mongo.DeleteWriteOpResultObject = await dbUsers.deleteOne({ email: user.email });
            if (result2.result.ok == 1) {
                return true;
            }
        }
        return false;
    }


    //######Code from https://wanago.io/2018/12/24/typescript-express-registering-authenticating-jwt/ ######################
    function createToken(email: string): TokenData {
        let expiresIn: number = 60 * 60; // an hour
        // let expiresIn: number = 60; // 60 Sekunden
        let secret: string = process.env.JWT_SECRET;
        let dataStoredInToken: DataStoredInToken = {
            email: email
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn })
        };
    }

    //######Code from https://wanago.io/2018/12/24/typescript-express-registering-authenticating-jwt/ ######################
    async function authWithKey(authKey: string): Promise<User> {
        if (authKey) {
            const secret: string = process.env.JWT_SECRET;
            const verificationResponse: DataStoredInToken = <DataStoredInToken>jwt.verify(authKey, secret);

            const email: string = verificationResponse.email;
            let user: User = await findUserByEmail(email);
            if (user) {
                return user;
            }
            console.log("Benutzer mit Email nicht gefunden: " + email);
        }
        console.log("Auth mit Key ist Fehlgeschlagen");
        return null;
    }

    //######Code from https://wanago.io/2018/12/24/typescript-express-registering-authenticating-jwt/ ######################
    function createAuthCookie(tokenData: TokenData): string {
        return `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}`;
    }

    async function findUserByEmail(email: string): Promise<User> {
        let user: User = await dbUsers.findOne({ email: email });
        if (user)
            return user;
        else return null;
    }

    async function addUserToDB(user: User): Promise<void> {
        dbUsers.insertOne(user);
    }

    async function getAllUsers(email: string): Promise<User[]> {
        let users: User[] = [];
        let thisUser: User = await dbUsers.findOne({ email: email });
        users.push(thisUser);
        let otherUsers: User[] = await dbUsers.find({ email: { $ne: email } }).toArray();
        otherUsers.forEach(user => {
            delete user.password;
            users.push(user);
        });
        return users;
    }

    async function suscribe(user: User, idToSubscribe: string): Promise<void> {
        let userToFollow: User = await dbUsers.findOne({ _id: new Mongo.ObjectID(idToSubscribe) });
        let userIDToSubscribe: string = userToFollow._id + "";

        user.following.push(userIDToSubscribe);
        let following: string[] = user.following;
        dbUsers.findOneAndUpdate({ email: user.email }, { $set: { following: following } });

        userToFollow.followers.push(user._id + "");
        let followers: string[] = userToFollow.followers;
        dbUsers.findOneAndUpdate({ email: userToFollow.email }, { $set: { followers: followers } });
    }

    async function unsuscribe(user: User, idToUnSuscribe: string): Promise<void> {
        let userToUnFollow: User = await dbUsers.findOne({ _id: new Mongo.ObjectID(idToUnSuscribe) });
        if (userToUnFollow) {
            let userID: string = user._id + "";
            let userIdToUnSuscribe: string = userToUnFollow._id + "";

            let following: string[] = user.following;
            let index: number = following.indexOf(userIdToUnSuscribe);
            if (index !== -1) {
                following.splice(index, 1);
            }
            await dbUsers.findOneAndUpdate({ _id: new Mongo.ObjectID(userID) }, { $set: { following: following } });

            let followers: string[] = userToUnFollow.followers;
            let indexFollowers: number = followers.indexOf(userID);
            if (indexFollowers !== -1) {
                followers.splice(indexFollowers, 1);
            }
            await dbUsers.findOneAndUpdate({ _id: new Mongo.ObjectID(userIdToUnSuscribe) }, { $set: { followers: followers } });
        } else {
            console.log("User not found to Unsuscribe");
        }
    }


    interface Tweet {
        _id?: string;
        text: string;
        userID: string;
        creationDate: Date;
        media?: string; //Dateilink
    }

    interface TweetAnswer {
        _id?: string;
        text: string;
        creationDate: Date;
        media?: string;
        userName: string;
        userEmail: string;
        userPicture?: string;
    }

    async function postTweet(authKey: string, tweetText: string): Promise<number> {
        let user: User = await authWithKey(authKey);
        if (user != null) {
            let tweet: Tweet = { text: tweetText, userID: user._id, creationDate: new Date(Date.now()) };
            dbTweets.insertOne(tweet);
            console.log("User " + user.email + " posted a tweet: " + tweetText);
            return 0;
        }
        return -1;
    }

    async function deleteTweet(authKey: string, tweetID: string): Promise<number> {
        let user: User = await authWithKey(authKey);
        if (user != null) {
            let tweet: Tweet = await dbTweets.findOne({ _id: new Mongo.ObjectID(tweetID) });
            if (tweet) {
                let tweetUserID: string = "" + tweet.userID;
                let userUserID: string = "" + user._id;
                if (tweetUserID && userUserID) {
                    if (tweetUserID == userUserID) {
                        let result: Mongo.DeleteWriteOpResultObject = await dbTweets.deleteOne({ _id: new Mongo.ObjectID(tweetID) });
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

    async function getTweetTimeline(authKey: string, oldestDate: Date): Promise<TweetAnswer[]> {
        let user: User = await authWithKey(authKey);
        if (user != null) {
            let followingUsersTweets: TweetAnswer[] = [];
            for (let i: number = 0; i < user.following.length; i++) {
                let followingUser: User = await dbUsers.findOne({ _id: new Mongo.ObjectID(user.following[i]) });
                if (followingUser) {
                    let tweets: Tweet[] = await dbTweets.find({ userID: followingUser._id, creationDate: { $gt: oldestDate } }).toArray();
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

    async function getTweetsFromUser(user: User): Promise<TweetAnswer[]> {
        let retArray: TweetAnswer[] = [];
        let tweets: Tweet[] = await dbTweets.find({ userID: user._id }).toArray();
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
}