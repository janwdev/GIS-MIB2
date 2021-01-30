"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsuscribe = exports.suscribe = exports.getAllUsers = exports.addUserToDB = exports.findUserByEmail = exports.deleteUser = exports.editUserPW = exports.editUser = exports.registration = exports.login = void 0;
const bcrypt = require("bcrypt");
const Mongo = require("mongodb");
const auth = require("./auth");
const db = require("./db");
async function login(data) {
    let email = data.email;
    let password = data.password;
    if (email && password) {
        let user = await db.dbUsers.findOne({ email: data.email });
        if (user) {
            if (await bcrypt.compare(password, user.password)) {
                console.log("User: " + user.email + " logged in");
                return auth.createToken(email);
            }
            else {
                console.log("Wrong Login from User: " + user.email);
            }
        }
    }
    return null;
}
exports.login = login;
async function registration(data) {
    let email = data.email;
    let password = data.password;
    if (email && password) {
        if (!await db.dbUsers.findOne({ email: email })) {
            const hashedPassword = await bcrypt.hash(password, 10);
            let firstname = data.firstname;
            let lastname = data.lastname;
            let studycourse = data.studycourse;
            let semester = data.semester;
            if (firstname && lastname && studycourse && semester) {
                let user = { firstname: firstname, lastname: lastname, studycourse: studycourse, semester: semester, email: email, password: hashedPassword, followers: [], following: [] };
                await addUserToDB(user);
                let dbUser = await findUserByEmail(email);
                if (dbUser) {
                    await suscribe(dbUser, dbUser._id);
                    console.log("Registration for User: " + user.email);
                    return auth.createToken(user.email);
                }
            }
        }
    }
    return null;
}
exports.registration = registration;
async function editUser(user, data) {
    let lastname = data.lastname;
    let firstname = data.firstname;
    let email = data.email;
    let studycourse = data.studycourse;
    let semester = data.semester;
    let updated;
    if (data.profPic) {
        let profPicLink = data.profPic;
        updated = await db.dbUsers.findOneAndUpdate({ email: user.email }, { $set: { lastname: lastname, firstname: firstname, email: email, studycourse: studycourse, semester: semester, pictureLink: profPicLink } }, { returnOriginal: false });
    }
    else {
        updated = await db.dbUsers.findOneAndUpdate({ email: user.email }, { $set: { lastname: lastname, firstname: firstname, email: email, studycourse: studycourse, semester: semester, pictureLink: "" } }, { returnOriginal: false });
    }
    if (updated.ok == 1) {
        let updatedUser = updated.value;
        return auth.createToken(updatedUser.email);
    }
    return null;
}
exports.editUser = editUser;
async function editUserPW(user, oldPW, newPW) {
    if (await bcrypt.compare(oldPW, user.password)) {
        const hashedPassword = await bcrypt.hash(newPW, 10);
        let updated = await db.dbUsers.findOneAndUpdate({ email: user.email }, { $set: { password: hashedPassword } }, { returnOriginal: false });
        if (updated.ok == 1) {
            return true;
        }
    }
    return false;
}
exports.editUserPW = editUserPW;
async function deleteUser(user) {
    let id = user._id + "";
    for (let i = 0; i < user.following.length; i++) {
        let idToChange = user.following[i];
        await db.dbUsers.updateOne({ _id: new Mongo.ObjectID(idToChange) }, { $pull: { followers: id } });
    }
    for (let i = 0; i < user.followers.length; i++) {
        let idToChange = user.followers[i];
        await db.dbUsers.updateOne({ _id: new Mongo.ObjectID(idToChange) }, { $pull: { following: id } });
    }
    let result1 = await db.dbTweets.deleteMany({ userID: new Mongo.ObjectID(id) });
    if (result1.result.ok == 1) {
        let result2 = await db.dbUsers.deleteOne({ email: user.email });
        if (result2.result.ok == 1) {
            await db.dbDeletedUsers.insertOne({ email: user.email });
            return true;
        }
    }
    return false;
}
exports.deleteUser = deleteUser;
async function findUserByEmail(email) {
    let user = await db.dbUsers.findOne({ email: email });
    if (user)
        return user;
    else
        return null;
}
exports.findUserByEmail = findUserByEmail;
async function addUserToDB(user) {
    await db.dbUsers.insertOne(user);
}
exports.addUserToDB = addUserToDB;
async function getAllUsers(email) {
    let users = [];
    let thisUser = await db.dbUsers.findOne({ email: email });
    users.push(thisUser);
    let otherUsers = await db.dbUsers.find({ email: { $ne: email } }).toArray();
    otherUsers.forEach(user => {
        delete user.password;
        users.push(user);
    });
    return users;
}
exports.getAllUsers = getAllUsers;
async function suscribe(user, idToSubscribe) {
    let userToFollow = await db.dbUsers.findOne({ _id: new Mongo.ObjectID(idToSubscribe) });
    let userIDToSubscribe = userToFollow._id + "";
    user.following.push(userIDToSubscribe);
    let following = user.following;
    await db.dbUsers.findOneAndUpdate({ email: user.email }, { $set: { following: following } });
    userToFollow.followers.push(user._id + "");
    let followers = userToFollow.followers;
    await db.dbUsers.findOneAndUpdate({ email: userToFollow.email }, { $set: { followers: followers } });
}
exports.suscribe = suscribe;
async function unsuscribe(user, idToUnSuscribe) {
    let userToUnFollow = await db.dbUsers.findOne({ _id: new Mongo.ObjectID(idToUnSuscribe) });
    if (userToUnFollow) {
        let userID = user._id + "";
        let userIdToUnSuscribe = userToUnFollow._id + "";
        let following = user.following;
        let index = following.indexOf(userIdToUnSuscribe);
        if (index !== -1) {
            following.splice(index, 1);
        }
        await db.dbUsers.findOneAndUpdate({ _id: new Mongo.ObjectID(userID) }, { $set: { following: following } });
        let followers = userToUnFollow.followers;
        let indexFollowers = followers.indexOf(userID);
        if (indexFollowers !== -1) {
            followers.splice(indexFollowers, 1);
        }
        await db.dbUsers.findOneAndUpdate({ _id: new Mongo.ObjectID(userIdToUnSuscribe) }, { $set: { followers: followers } });
    }
    else {
        console.log("User not found to Unsuscribe");
    }
}
exports.unsuscribe = unsuscribe;
//# sourceMappingURL=user.js.map