"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthCookie = exports.authWithKey = exports.createToken = void 0;
const jwt = require("jsonwebtoken");
const u = require("./user");
//######Code from https://wanago.io/2018/12/24/typescript-express-registering-authenticating-jwt/ ######################
function createToken(email) {
    let expiresIn = 60 * 60; // an hour
    // let expiresIn: number = 60; // 60 Sekunden
    let secret = process.env.JWT_SECRET;
    let dataStoredInToken = {
        email: email
    };
    return {
        expiresIn,
        token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    };
}
exports.createToken = createToken;
//######Code from https://wanago.io/2018/12/24/typescript-express-registering-authenticating-jwt/ ######################
async function authWithKey(authKey) {
    if (authKey) {
        const secret = process.env.JWT_SECRET;
        const verificationResponse = jwt.verify(authKey, secret);
        const email = verificationResponse.email;
        let user = await u.findUserByEmail(email);
        if (user) {
            return user;
        }
        console.log("Benutzer mit Email nicht gefunden: " + email);
    }
    console.log("Auth mit Key ist Fehlgeschlagen");
    return null;
}
exports.authWithKey = authWithKey;
//######Code from https://wanago.io/2018/12/24/typescript-express-registering-authenticating-jwt/ ######################
function createAuthCookie(tokenData) {
    return `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}`;
}
exports.createAuthCookie = createAuthCookie;
//# sourceMappingURL=auth.js.map