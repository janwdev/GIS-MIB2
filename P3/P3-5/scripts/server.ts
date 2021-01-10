import * as Http from "http";
import * as Mongo from "mongodb";
import * as querystring from "querystring";

export namespace P_3_5Server {

    let databaseUrl: string;
    let databaseName: string = "P3-5"; // TODO
    let collectionName: string = "Users"; // TODO

    let startArgs: string[] = process.argv.slice(2);
    console.log(startArgs);
    switch (startArgs[0]) {
        case "local":
            databaseUrl = "mongodb://localhost:27017";
            console.log("running local");
            break;
        case "remote":
            //TODO Werte ueberpruefen
            let userName: string = "user";
            let pw: string = "onlineUser";
            databaseUrl = "mongodb+srv://" + userName + ":" + pw + "@gismib2.wulcs.mongodb.net/" + databaseName + "?retryWrites=true&w=majority";
            console.log("running remote");
            break;
        default:
            console.log("no or wrong argument given, running local");
            databaseUrl = "mongodb://localhost:27017";
    }

    interface Data {
        [type: string]: string | string[];
    }

    let collection: Mongo.Collection;

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
        collection = mongoClient.db(databaseName).collection(collectionName);
        console.log("Database connection", collection != undefined);
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
                let data: Data = querystring.parse(body);
                if ("command" in data) {
                    let command: string | string[] = data.command;
                    let answer: string = "";
                    let s: string;
                    let email: string;
                    switch (command) {
                        case "retrieve":
                            console.log("Command was retrieve");
                            // evtl mehr argumente abfragen und uebergeben was abgefragt werden soll
                            answer = await retrieveData();
                            break;
                        case "insert":
                            delete data.command; // Wichtig, sonst wird das Kommando mit eingefuegt
                            console.log("insert");
                            email = <string>data.email;
                            if (email) {
                                console.log(email);
                                let exists: boolean = await accountExistAlready(email);
                                if (!exists) {
                                    storeData(data);
                                    console.log("Post-Data:");
                                    console.log(data);
                                    s = '{ "status":' + 0 + ', "words":' + '"created' + '"}';
                                } else {
                                    s = '{ "status":' + 1 + ', "words":' + '"Account with email exists already' + '"}';
                                }

                            } else {
                                s = '{ "status":' + 2 + ', "words":' + '"No Email' + '"}';
                            }
                            console.log(s);
                            answer = JSON.stringify(JSON.parse(s));
                            break;
                        case "delete":
                            let id: string = <string>data._id;
                            deleteData(id);
                            s = '{ "delid":"' + id + '"}';
                            answer = JSON.stringify(JSON.parse(s));
                            break;
                        //TODO Login
                        case "login":
                            console.log("login");
                            email = <string>data.email;
                            let pw: string = <string>data.password;
                            if (email && pw) {
                                console.log(email);
                                let rightCombo: boolean = await login(email, pw);
                                if (rightCombo) {
                                    s = '{ "status":' + 0 + ', "words":' + '"Login successful' + '"}';
                                } else {
                                    s = '{ "status":' + 1 + ', "words":' + '"Wrong Combination or no User with this Email' + '"}';
                                }
                            } else {
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
                } else {
                    console.log("No command given");
                }

            });

        }

    }

    async function accountExistAlready(email: string): Promise<boolean> {
        let exists: Mongo.CollationDocument = await collection.findOne({ email: email });
        if (exists != null) {
            return true;
        }
        return false;
    }

    async function login(email: string, pw: string): Promise<boolean> {
        let exists: Mongo.CollationDocument = await collection.findOne({ email: email, password: pw });
        if (exists) {
            return true;
        }
        return false;
    }

    function storeData(_data: Data): void {
        collection.insertOne(_data);
    }

    function deleteData(id: string): void {
        console.log("Try to delete: " + id);
        collection.deleteOne({ _id: new Mongo.ObjectID(id) }, function (err: Mongo.MongoError): void {
            if (err) {
                console.log("failed to delete element with id: " + id);
                throw err;
            }
            console.log("success to delete element with id: " + id);
        });
    }

    interface UserDatabaseContent {
        _id: string;
        password: string;
        name: string;
        firstname: string;
        email: string;
    }

    async function retrieveData(): Promise<string> {
        let data: string[] = await collection.find().toArray();
        let retData: UserDatabaseContent[] = [];
        data.forEach(element => {
            let dataElement: UserDatabaseContent = JSON.parse(JSON.stringify(element)); //TODO typedef mit interface
            delete dataElement.password;
            //delete dataElement._id;
            retData.push(dataElement);
        });
        // console.log(retData);
        return JSON.stringify(retData);
    }

}