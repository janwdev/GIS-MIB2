import * as jwt from "jsonwebtoken";
import * as u from "./user";

export interface TokenData {
    token: string;
    expiresIn: number;
}
export interface DataStoredInToken {
    email: string;
}


//######Code from https://wanago.io/2018/12/24/typescript-express-registering-authenticating-jwt/ ######################
export function createToken(email: string): TokenData {
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
export async function authWithKey(authKey: string): Promise<u.User> {
    if (authKey) {
        const secret: string = process.env.JWT_SECRET;
        const verificationResponse: DataStoredInToken = <DataStoredInToken>jwt.verify(authKey, secret);

        const email: string = verificationResponse.email;
        let user: u.User = await u.findUserByEmail(email);
        if (user) {
            return user;
        }
        console.log("Benutzer mit Email nicht gefunden: " + email);
    }
    console.log("Auth mit Key ist Fehlgeschlagen");
    return null;
}

//######Code from https://wanago.io/2018/12/24/typescript-express-registering-authenticating-jwt/ ######################
export function createAuthCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}`;
}