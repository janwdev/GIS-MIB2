"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P_3_5Server = void 0;
const Http = require("http");
const Mongo = require("mongodb");
const querystring = require("querystring");
var P_3_5Server;
(function (P_3_5Server) {
    let databaseUrl;
    let databaseName = "Test"; // TODO
    let collectionName = "Students"; // TODO
    let startArgs = process.argv.slice(2);
    console.log(startArgs);
    switch (startArgs[0]) {
        case "local":
            databaseUrl = "mongodb://localhost:27017";
            console.log("running local");
            break;
        case "remote":
            //TODO Werte ueberpruefen
            let userName = "user";
            let pw = "onlineUser";
            databaseUrl = "mongodb+srv://" + userName + ":" + pw + "@gismib2.wulcs.mongodb.net/" + databaseName + "?retryWrites=true&w=majority";
            console.log("running remote");
            break;
        default:
            console.log("no or wrong argument given, running local");
            databaseUrl = "mongodb://localhost:27017";
    }
    let collection;
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
        collection = mongoClient.db(databaseName).collection(collectionName);
        console.log("Database connection", collection != undefined);
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
                if ("command" in data) {
                    let command = data.command;
                    let answer = "";
                    let s;
                    let email;
                    switch (command) {
                        case "retrieve":
                            console.log("Command was retrieve");
                            // evtl mehr argumente abfragen und uebergeben was abgefragt werden soll
                            answer = await retrieveData();
                            break;
                        case "insert":
                            delete data.command; // Wichtig, sonst wird das Kommando mit eingefuegt
                            console.log("insert");
                            email = data.email;
                            if (email) {
                                console.log(email);
                                let exists = await accountExistAlready(email);
                                if (!exists) {
                                    storeData(data);
                                    console.log("Post-Data:");
                                    console.log(data);
                                    s = '{ "status":' + 0 + ', "words":' + '"created' + '"}';
                                }
                                else {
                                    s = '{ "status":' + 1 + ', "words":' + '"Account with email exists already' + '"}';
                                }
                            }
                            else {
                                s = '{ "status":' + 2 + ', "words":' + '"No Email' + '"}';
                            }
                            console.log(s);
                            answer = JSON.stringify(JSON.parse(s));
                            break;
                        case "delete":
                            let id = data._id;
                            deleteData(id);
                            s = '{ "delid":"' + id + '"}';
                            answer = JSON.stringify(JSON.parse(s));
                            break;
                        //TODO Login
                        case "login":
                            console.log("login");
                            email = data.email;
                            let pw = data.password;
                            if (email && pw) {
                                console.log(email);
                                let rightCombo = await login(email, pw);
                                if (rightCombo) {
                                    s = '{ "status":' + 0 + ', "words":' + '"Login successful' + '"}';
                                }
                                else {
                                    s = '{ "status":' + 1 + ', "words":' + '"Wrong Combination or no User with this Email' + '"}';
                                }
                            }
                            else {
                                s = '{ "status":' + 2 + ', "words":' + '"No Email or Password' + '"}';
                            }
                            console.log(s);
                            answer = JSON.stringify(JSON.parse(s));
                            break;
                        default:
                            console.log("Wrong command given");
                            console.log("Command: ", command);
                    }
                    _response.setHeader("content-type", "application/json"); // Antwort als JSON
                    _response.write(answer);
                    _response.end(); // Antwort abschliessen
                }
                else {
                    console.log("No command given");
                }
            });
        }
    }
    async function accountExistAlready(email) {
        let exists = await collection.findOne({ email: email });
        if (exists != null) {
            return true;
        }
        return false;
    }
    async function login(email, pw) {
        let exists = await collection.findOne({ email: email, password: pw });
        if (exists) {
            return true;
        }
        return false;
    }
    function storeData(_data) {
        collection.insertOne(_data);
    }
    function deleteData(id) {
        console.log("Try to delete: " + id);
        collection.deleteOne({ _id: new Mongo.ObjectID(id) }, function (err) {
            if (err) {
                console.log("failed to delete element with id: " + id);
                throw err;
            }
            console.log("success to delete element with id: " + id);
        });
    }
    async function retrieveData() {
        let data = await collection.find().toArray();
        let retData = [];
        data.forEach(element => {
            let dataElement = JSON.parse(JSON.stringify(element)); //TODO typedef mit interface
            delete dataElement.password;
            //delete dataElement._id;
            retData.push(dataElement);
        });
        // console.log(retData);
        return JSON.stringify(retData);
    }
})(P_3_5Server = exports.P_3_5Server || (exports.P_3_5Server = {}));
//# sourceMappingURL=server.js.map