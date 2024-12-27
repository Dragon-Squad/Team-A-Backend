require("dotenv").config();
const { readFile } = require("fs").promises;
const { privateDecrypt } = require("crypto");
const { compactDecrypt, importPKCS8 } = require("jose");

class CryptService {
    async getAsymmetricPublicKey() {
        const publicKey = await readFile(
            process.env.ASYM_PUBLIC_KEY,
            "utf8"
        );
        return publicKey;
    }

    async decryptAsymmetric(data) {
        const privateKey = await readFile(
            process.env.ASYM_PRIVATE_KEY,
            "utf8"
        );
        const decrypted = privateDecrypt(
            {
                key: privateKey,
                passphrase: process.env.ASYM_PASSPHRASE,
            },
            Buffer.from(data, "base64")
        );
        return decrypted.toString();
    }

    async getJwePublicKey() {
        const publicKey = await readFile(process.env.JWE_PUBLIC_KEY, "utf8");
        return publicKey;
    }

    async getJweCertificate() {
        const certificate = await readFile(
            process.env.JWE_CERTIFICATE,
            "utf8"
        );
        return certificate;
    }

    async decryptJwe(data) {
        const privateKey = await readFile(
            process.env.JWE_PRIVATE_KEY,
            "utf8"
        );
        const privateKeyObject = await importPKCS8(privateKey, "RS256");
        const { plaintext } = await compactDecrypt(data, privateKeyObject);
        return plaintext.toString();
    }
}

module.exports = new CryptService();
