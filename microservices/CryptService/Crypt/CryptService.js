require("dotenv").config();
const fs = require("fs").promises;
const crypto = require("crypto");
const jose = require("jose");

class CryptService {
    async getAsymmetricPublicKey() {
        const publicKey = await fs.readFile(process.env.ASYM_PUBLIC_KEY, "utf8");
        return publicKey;
    }

    async decryptAsymmetric(data) {
        const privateKey = await fs.readFile(process.env.ASYM_PRIVATE_KEY, "utf8");
        const decrypted = crypto.privateDecrypt(
            {
                key: privateKey,
                passphrase: process.env.ASYM_PASSPHRASE,
            },
            Buffer.from(data, "base64")
        );
        return decrypted.toString();
    }

    async getJwePublicKey() {
        const publicKey = await fs.readFile(process.env.JWE_PUBLIC_KEY, "utf8");
        return publicKey;
    }

    async getJweCertificate() {
        const certificate = await fs.readFile(process.env.JWE_CERTIFICATE, "utf8");
        return certificate;
    }

    async decryptJwe(data) {
        const privateKey = await fs.readFile(process.env.JWE_PRIVATE_KEY, "utf8");
        const privateKeyObject = await jose.importPKCS8(privateKey, "RS256");
        const { plaintext } = await jose.compactDecrypt(data, privateKeyObject);
        return plaintext.toString();
    }
}

module.exports = new CryptService();
