const CryptService = require("./CryptService");

class CryptController {
    static async getPublicKey(req, res) {
        try {
            const publicKey = await CryptService.getPublicKey();
            return res.status(200).json({ publicKey: publicKey });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to get public key",
                error: error.message,
            });
        }
    }

    static async decrypt(req, res) {
        try {
            const { encryptedData } = req.body;
            if (!encryptedData) {
                return res.status(400).json({
                    message: "Data is required",
                });
            }

            const decryptedData = await CryptService.decrypt(encryptedData);
            return res.status(200).json({ decryptedData: decryptedData });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to decrypt data",
                error: error.message,
            });
        }
    }
}

module.exports = CryptController;
