const EmailService = require("./EmailService");

class EmailController {
    // Send a verification email
    static async sendVerifyEmail(req, res) {
        try {
            const { receiver, name, OTP } = req.body;
            if (!receiver || !name || !OTP) {
                return res.status(400).json({
                    message: "Receiver, name, and OTP are required",
                });
            }

            await EmailService.sendVerifyEmail(receiver, name, OTP);
            return res.status(200).json({
                message: "Verification email sent successfully!",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to send verification email",
                error: error.message,
            });
        }
    }

    // Send a welcome email
    static async sendWelcomeEmail(req, res) {
        try {
            const { receiver, name, role } = req.body;
            if (!receiver || !name || !role) {
                return res.status(400).json({
                    message: "Receiver, name, and role are required",
                });
            }

            await EmailService.sendWelcomeEmail(receiver, name, role);
            return res.status(200).json({
                message: "Welcome email sent successfully!",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to send welcome email",
                error: error.message,
            });
        }
    }
}

module.exports = EmailController;
