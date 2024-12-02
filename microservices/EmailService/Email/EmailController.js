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

    // Send donor an email for successful donation
    static async sendDonorDonationSuccessEmail(req, res) {
        try {
            const { receiver, name, projectTitle, projectUrl, amount } =
                req.body;
            if (!receiver || !name || !projectTitle || !projectUrl || !amount) {
                return res.status(400).json({
                    message:
                        "Receiver, name, project title, project URL, and amount are required",
                });
            }

            await EmailService.sendDonorDonationSuccessEmail(
                receiver,
                name,
                projectTitle,
                projectUrl,
                amount
            );
            return res.status(200).json({
                message: "Donation success email sent successfully!",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to send donation success email",
                error: error.message,
            });
        }
    }

    // Send donors an email for new project
    static async sendDonorProjectCreatedEmail(req, res) {
        try {
            const {
                receiver,
                name,
                projectTitle,
                projectUrl,
                projectRegion,
                projectCategory,
                projectDescription,
                projectGoal,
            } = req.body;
            if (
                !receiver ||
                !name ||
                !projectTitle ||
                !projectUrl ||
                !projectRegion ||
                !projectCategory ||
                !projectDescription ||
                !projectGoal
            ) {
                return res.status(400).json({
                    message: `Receiver, name, project title, project URL, project region, project category,
						project description, and project goal are required`,
                });
            }

            await EmailService.sendDonorProjectCreatedEmail(
                receiver,
                name,
                projectTitle,
                projectUrl,
                projectRegion,
                projectCategory,
                projectDescription,
                projectGoal
            );
            return res.status(200).json({
                message: "Project created email sent successfully!",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to send project created email",
                error: error.message,
            });
        }
    }

    // Send donors an email for halted project
    static async sendDonorProjectHaltedEmail(req, res) {
        try {
            const { receiver, name, projectTitle, projectUrl, haltReason } =
                req.body;
            if (
                !receiver ||
                !name ||
                !projectTitle ||
                !projectUrl ||
                !haltReason
            ) {
                return res.status(400).json({
                    message:
                        "Receiver, name, project title, project URL, and halt reason are required",
                });
            }

            await EmailService.sendDonorProjectHaltedEmail(
                receiver,
                name,
                projectTitle,
                projectUrl,
                haltReason
            );
            return res.status(200).json({
                message: "Project halted email sent successfully!",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to send project halted email",
                error: error.message,
            });
        }
    }

    // Send charity an email on project creation
    static async sendCharityProjectCreatedEmail(req, res) {
        try {
            const {
                receiver,
                name,
                projectTitle,
                projectUrl,
                projectRegion,
                projectCategory,
                projectDescription,
                projectGoal,
            } = req.body;
            if (
                !receiver ||
                !name ||
                !projectTitle ||
                !projectUrl ||
                !projectRegion ||
                !projectCategory ||
                !projectDescription ||
                !projectGoal
            ) {
                return res.status(400).json({
                    message: `Receiver, name, project title, project URL, project region, project category,
						project description, and project goal are required`,
                });
            }

            await EmailService.sendCharityProjectCreatedEmail(
                receiver,
                name,
                projectTitle,
                projectUrl,
                projectRegion,
                projectCategory,
                projectDescription,
                projectGoal
            );
            return res.status(200).json({
                message: "Project created email sent successfully!",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to send project created email",
                error: error.message,
            });
        }
    }

    // Send charity an email on project halt
    static async sendCharityProjectHaltedEmail(req, res) {
        try {
            const { receiver, name, projectTitle, projectUrl, haltReason } =
                req.body;
            if (
                !receiver ||
                !name ||
                !projectTitle ||
                !projectUrl ||
                !haltReason
            ) {
                return res.status(400).json({
                    message:
                        "Receiver, name, project title, project URL, and halt reason are required",
                });
            }

            await EmailService.sendCharityProjectHaltedEmail(
                receiver,
                name,
                projectTitle,
                projectUrl,
                haltReason
            );
            return res.status(200).json({
                message: "Project halted email sent successfully!",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to send project halted email",
                error: error.message,
            });
        }
    }

    // Send charity an email on project completion
    static async sendCharityProjectCompletedEmail(req, res) {
        try {
            const { receiver, name, projectTitle, projectUrl } = req.body;
            if (!receiver || !name || !projectTitle || !projectUrl) {
                return res.status(400).json({
                    message:
                        "Receiver, name, project title, and project URL are required",
                });
            }

            await EmailService.sendCharityProjectCompletedEmail(
                receiver,
                name,
                projectTitle,
                projectUrl
            );
            return res.status(200).json({
                message: "Project completed email sent successfully!",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Failed to send project completed email",
                error: error.message,
            });
        }
    }
}

module.exports = EmailController;
