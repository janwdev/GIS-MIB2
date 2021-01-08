"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P_3_4Server = void 0;
const Http = require("http");
const Mongo = require("mongodb");
const querystring = require("querystring");
var P_3_4Server;
(function (P_3_4Server) {
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
                    switch (command) {
                        case "retrieve":
                            console.log("Command was retrieve");
                            // TODO evtl mehr argumente abfragen und uebergeben was abgefragt werden soll
                            answer = await retrieveData();
                            break;
                        case "insert":
                            delete data.command; // Wichtig, sonst wird das Kommando mit eingefuegt
                            storeData(data);
                            console.log("Post-Data:");
                            console.log(data);
                            answer = JSON.stringify(data);
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
    function storeData(_data) {
        collection.insertOne(_data);
    }
    async function retrieveData() {
        let data = await collection.find().toArray();
        return JSON.stringify(data);
    }
})(P_3_4Server = exports.P_3_4Server || (exports.P_3_4Server = {}));
//# sourceMappingURL=server.js.map