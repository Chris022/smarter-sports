import * as jose from 'jose'
import fs from "fs"
import path from "path"

/**
 * Takes a user_id and creates a jwt that stores the token. The jwt is valid for 1h
 * @param   {number}            user_id     The user id that should be stored in the jwt
 * @returns {Promise<string>}               The token as a string
 */
export let encrypt_user_id = async (user_id: number) : Promise<string> => {
    let privateKey = await jose.importPKCS8(fs.readFileSync(
        path.join(__dirname, './../../private.key'),'utf8'),
        "RS256"
    )

    //login
    const token = await new jose.SignJWT({
        user_id: user_id,
    })
    .setProtectedHeader({
        typ: 'JWT',
        alg: 'RS256',
    })
    .setExpirationTime('0.5h')
    .sign(privateKey);

    return token;
}

/**
 * Takes a user_id_jwt, decrypts it and returns the user_id stored in it
 * @param   {string}              token     The jwt as a string
 * @returns {Promise<number<null>}          The user_id stored in the token - null if the token is invalid
 */
export let decrypt_user_id = async (token: string) : Promise<number|null> => {

    let publicKey = await jose.importSPKI(
        fs.readFileSync(path.join(__dirname, './../../public.key'), 'utf8'),
        "RS256"
    )

    try {
        let { payload, protectedHeader } = await jose.jwtVerify(token, publicKey);
        return payload.user_id as number;
    } catch (error) {
        return null;
    }
}

