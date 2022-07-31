let fs = require("fs")
let path = require("path")
let jose = require("jose")


let generateKeyPair = async() => {
    //Generate a public and a private key
    const { publicKey, privateKey } = await jose.generateKeyPair('RS256');

    const publicKeyString = await jose.exportSPKI(publicKey);
    const privateKeyString = await jose.exportPKCS8(privateKey);

    fs.writeFileSync(path.join(__dirname, './../public.key'),publicKeyString)
    fs.writeFileSync(path.join(__dirname, './../private.key'),privateKeyString)

}

generateKeyPair()