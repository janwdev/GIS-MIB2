import * as bcrypt from "bcrypt";
import * as Mongo from "mongodb";

import * as auth from "./auth";
import * as db from "./db";
import { RequestData } from "./server";

export interface User {
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

export async function login(data: RequestData): Promise<auth.TokenData> {
    let email: string = <string>data.email;
    let password: string = <string>data.password;
    if (email && password) {
        let user: User = await db.dbUsers.findOne({ email: data.email });
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                console.log("User: " + user.email + " logged in");
                return auth.createToken(email);
            } else {
                console.log("Wrong Login from User: " + user.email);
            }
        }
    }
    return null;
}

export async function registration(data: RequestData): Promise<auth.TokenData> {
    let email: string = <string>data.email;
    let password: string = <string>data.password;
    if (email && password) {
        if (!await db.dbUsers.findOne({ email: email })) {
            const hashedPassword: string = await bcrypt.hash(password, 10);
            let firstname: string = <string>data.firstname;
            let lastname: string = <string>data.lastname;
            let studycourse: string = <string>data.studycourse;
            let semester: string = <string>data.semester;
            if (firstname && lastname && studycourse && semester) {
                let user: User = { firstname: firstname, lastname: lastname, studycourse: studycourse, semester: semester, email: email, password: hashedPassword, followers: [], following: [] };
                await addUserToDB(user);
                let dbUser: User = await findUserByEmail(email);
                suscribe(dbUser, dbUser._id);
                console.log("Registration for User: " + user.email);
                return auth.createToken(user.email);
            }
        }
    }
    return null;
}

export async function editUser(user: User, data: RequestData): Promise<auth.TokenData> {
    let lastname: string = <string>data.lastname;
    let firstname: string = <string>data.firstname;
    let email: string = <string>data.email;
    let studycourse: string = <string>data.studycourse;
    let semester: string = <string>data.semester;
    let updated: Mongo.FindAndModifyWriteOpResultObject<User>;
    if (data.profPic) {
        let profPicLink: string = <string>data.profPic;
        updated = await db.dbUsers.findOneAndUpdate(
            { email: user.email },
            { $set: { lastname: lastname, firstname: firstname, email: email, studycourse: studycourse, semester: semester, pictureLink: profPicLink } },
            { returnOriginal: false }
        );
    } else {
        updated = await db.dbUsers.findOneAndUpdate(
            { email: user.email },
            { $set: { lastname: lastname, firstname: firstname, email: email, studycourse: studycourse, semester: semester, pictureLink: "" } },
            { returnOriginal: false }
        );
    }


    if (updated.ok == 1) {
        let updatedUser: User = updated.value;
        return auth.createToken(updatedUser.email);
    }
    return null;
}

export async function editUserPW(user: User, oldPW: string, newPW: string): Promise<boolean> {
    if (await bcrypt.compare(oldPW, user.password)) {
        const hashedPassword: string = await bcrypt.hash(newPW, 10);
        let updated: Mongo.FindAndModifyWriteOpResultObject<User> = await db.dbUsers.findOneAndUpdate(
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

export async function deleteUser(user: User): Promise<boolean> {
    let id: string = user._id + "";
    for (let i: number = 0; i < user.following.length; i++) {
        let idToChange: string = user.following[i];
        await db.dbUsers.updateOne({ _id: new Mongo.ObjectID(idToChange) }, { $pull: { followers: id } });
    }
    for (let i: number = 0; i < user.followers.length; i++) {
        let idToChange: string = user.followers[i];
        await db.dbUsers.updateOne({ _id: new Mongo.ObjectID(idToChange) }, { $pull: { following: id } });
    }

    let result1: Mongo.DeleteWriteOpResultObject = await db.dbTweets.deleteMany({ userID: new Mongo.ObjectID(id) });
    if (result1.result.ok == 1) {
        let result2: Mongo.DeleteWriteOpResultObject = await db.dbUsers.deleteOne({ email: user.email });
        if (result2.result.ok == 1) {
            await db.dbDeletedUsers.insertOne({ email: user.email });
            return true;
        }
    }
    return false;
}

export async function findUserByEmail(email: string): Promise<User> {
    let user: User = await db.dbUsers.findOne({ email: email });
    if (user)
        return user;
    else return null;
}

export async function addUserToDB(user: User): Promise<void> {
    db.dbUsers.insertOne(user);
}

export async function getAllUsers(email: string): Promise<User[]> {
    let users: User[] = [];
    let thisUser: User = await db.dbUsers.findOne({ email: email });
    users.push(thisUser);
    let otherUsers: User[] = await db.dbUsers.find({ email: { $ne: email } }).toArray();
    otherUsers.forEach(user => {
        delete user.password;
        users.push(user);
    });
    return users;
}

export async function suscribe(user: User, idToSubscribe: string): Promise<void> {
    let userToFollow: User = await db.dbUsers.findOne({ _id: new Mongo.ObjectID(idToSubscribe) });
    let userIDToSubscribe: string = userToFollow._id + "";

    user.following.push(userIDToSubscribe);
    let following: string[] = user.following;
    db.dbUsers.findOneAndUpdate({ email: user.email }, { $set: { following: following } });

    userToFollow.followers.push(user._id + "");
    let followers: string[] = userToFollow.followers;
    db.dbUsers.findOneAndUpdate({ email: userToFollow.email }, { $set: { followers: followers } });
}

export async function unsuscribe(user: User, idToUnSuscribe: string): Promise<void> {
    let userToUnFollow: User = await db.dbUsers.findOne({ _id: new Mongo.ObjectID(idToUnSuscribe) });
    if (userToUnFollow) {
        let userID: string = user._id + "";
        let userIdToUnSuscribe: string = userToUnFollow._id + "";

        let following: string[] = user.following;
        let index: number = following.indexOf(userIdToUnSuscribe);
        if (index !== -1) {
            following.splice(index, 1);
        }
        await db.dbUsers.findOneAndUpdate({ _id: new Mongo.ObjectID(userID) }, { $set: { following: following } });

        let followers: string[] = userToUnFollow.followers;
        let indexFollowers: number = followers.indexOf(userID);
        if (indexFollowers !== -1) {
            followers.splice(indexFollowers, 1);
        }
        await db.dbUsers.findOneAndUpdate({ _id: new Mongo.ObjectID(userIdToUnSuscribe) }, { $set: { followers: followers } });
    } else {
        console.log("User not found to Unsuscribe");
    }
}