const CryptService = require("./CryptService");

class CryptController {
    static async getAsymmetricPublicKey(req, res) {
        try {
            const publicKey = await CryptService.getAsymmetricPublicKey();
            return res.status(200).json({ publicKey: publicKey });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to get public key",
                error: error.message,
            });
        }
    }

    static async decryptAsymmetric(req, res) {
        try {
            const { encryptedData } = req.body;
            if (!encryptedData) {
                return res.status(400).json({
                    message: "Data is required",
                });
            }

            const decryptedData = await CryptService.decryptAsymmetric(
                encryptedData
            );
            return res.status(200).json({ decryptedData: decryptedData });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to decrypt data",
                error: error.message,
            });
        }
    }

    static async getJwePublicKey(req, res) {
        try {
            const publicKey = await CryptService.getJwePublicKey();
            return res.status(200).json({ publicKey: publicKey });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to get public key",
                error: error.message,
            });
        }
    }

    static async getJweCertificate(req, res) {
        try {
            const certificate = await CryptService.getJweCertificate();
            return res.status(200).json({ certificate: certificate });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to get certificate",
                error: error.message,
            });
        }
    }

    static async decryptJwe(req, res) {
        try {
            const { encryptedData } = req.body;
            if (!encryptedData) {
                return res.status(400).json({
                    message: "Data is required",
                });
            }

            const decryptedData = await CryptService.decryptJwe(encryptedData);
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
