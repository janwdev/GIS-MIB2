import * as Mongo from "mongodb";
import * as secret from "./secrets";

export let dbUsers: Mongo.Collection;
export let dbTweets: Mongo.Collection;
export let dbDeletedUsers: Mongo.Collection;

let dbUsersCollectionName: string = "Users";
let dbTweetsCollectionName: string = "Tweets";
let dbDeletedUsersCollectionName: string = "UsersDel";
let databaseName: string = "Twitter";

export async function connectToDatabase(): Promise<void> {
    let databaseUrl: string;
    let startArgs: string[] = process.argv.slice(2);
    console.log(startArgs);
    switch (startArgs[0]) {
        case "local":
            databaseUrl = "mongodb://localhost:27017";
            console.log("running local");
            break;
        case "remote":
            databaseUrl = "mongodb+srv://" + secret.dbServerUserName + ":" + secret.dbServerPW + "@gismib2.wulcs.mongodb.net/" + databaseName + "?retryWrites=true&w=majority";
            console.log("running remote");
            break;
        default:
            console.log("no or wrong argument given, running local");
            databaseUrl = "mongodb://localhost:27017";
    }
    let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true }; // Vorgegeben, danach suchen
    let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(databaseUrl, options);
    await mongoClient.connect();
    dbUsers = mongoClient.db(databaseName).collection(dbUsersCollectionName);
    dbTweets = mongoClient.db(databaseName).collection(dbTweetsCollectionName);
    dbDeletedUsers = mongoClient.db(databaseName).collection(dbDeletedUsersCollectionName);
    console.log("Database connection", dbUsers != undefined);
}