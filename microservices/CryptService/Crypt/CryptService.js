require("dotenv").config();
const fs = require("fs").promises;
const crypto = require("crypto");

class CryptService {
    async getPublicKey() {
        const publicKey = await fs.readFile(process.env.RSA_PUBLIC_KEY, "utf8");
        return publicKey;
    }

    async decrypt(data) {
        const privateKey = await fs.readFile(process.env.RSA_PRIVATE_KEY, "utf8");
        const decrypted = crypto.privateDecrypt(
            {
                key: privateKey,
                passphrase: process.env.RSA_PASSPHRASE,
            },
            Buffer.from(data, "base64")
        );
        return decrypted.toString();
    }
}

module.exports = new CryptService();
