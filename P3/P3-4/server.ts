import * as Http from "http";
import * as Mongo from "mongodb";
import * as querystring from "querystring";

export namespace P_3_4Server {

    let databaseUrl: string;
    let databaseName: string = "Test"; // TODO
    let collectionName: string = "Students"; // TODO

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
                        case "delete":
                            let id: string = <string>data._id;
                            deleteData(id);
                            let s: string = '{ "delid":"' + id + '"}';
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

    function storeData(_data: Data): void {
        collection.insertOne(_data);
    }

    async function retrieveData(): Promise<string> {
        let data: string[] = await collection.find().toArray();
        return JSON.stringify(data);
    }

    function deleteData(id: string): void {
        console.log("Try to delete: " + id);
        collection.deleteOne({_id: new Mongo.ObjectID(id)}, function(err: Mongo.MongoError): void {
            if (err){
              console.log("failed to delete element with id: " + id);
              throw err;
            }
            console.log("success to delete element with id: " + id);
         });
    }


}