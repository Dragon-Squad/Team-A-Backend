const sender = "Charitan <EEET2582.Charitan@gmail.com>";
const header = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Charitan</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                background-color: #ffffff;
                padding: 20px;
                text-align: center;
            }
            .header {
                background-color: #4CAF50;
                color: white;
                padding: 20px;
                font-size: 30px;
                border-radius: 8px;
            }
            .content {
                padding: 30px;
                background-color: #f9f9f9;
                border-radius: 8px;
                margin-top: 20px;
                text-align: left;
                line-height: 1.6;
            }
            .otp-code {
                font-size: 24px;
                font-weight: bold;
                color: #4CAF50;
                margin: 20px 0;
            }
            .cta-button {
                background-color: #4CAF50;
                color: white;
                padding: 15px 30px;
                font-size: 18px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                margin-top: 20px;
            }
            .cta-button:hover {
                background-color: #45a049;
            }
            .footer {
                margin-top: 40px;
                font-size: 14px;
                color: #777;
                text-align: center;
            }
            .footer a {
                color: #4CAF50;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
`;

const footer = `
                <p>If you have any questions, feel free to <a href="mailto:EEET2582.Charitan@gmail.com">contact us</a>.</p>
                <p>The Charitan Team</p>
            </div>
        </div>
    </body>
    </html>
`;

const verifyMail = (receiver, name, OTP) => {
    const otpDigits = OTP.toString().split("");

    return {
        from: sender,
        to: receiver,
        subject: "Verify Your Account",
        html: `
        ${header}
            <div class="container">
                <div class="header">
                    Verify Your Account
                </div>

                <div class="content">
                    <p>Dear ${name},</p>
                    <p>Thank you for signing up with Charitan!
                    To complete your registration and secure your account,
                    please verify your email address by entering the following
                    One-Time Password (OTP) in the provided field on our website:</p>

                    <div class="otp-code">
                        ${OTP}
                    </div>

                    <p>For your security, this OTP is valid for the next 10 minutes. If you did not request this, please ignore this email.</p>
                </div>

                <div class="footer">
        ${footer}
        `,
    };
};

const welcomeMail = (receiver, name, role) => ({
    from: sender,
    to: receiver,
    subject: "Welcome to Charitan!",
    html: `
    ${header}
        <div class="container">
            <div class="header">
                Welcome to Charitan!
            </div>

            <div class="content">
                <p>Dear ${name},</p>

                <p>We are thrilled to have you as part of our growing community.
                By joining Charitan, you've taken the first step toward making
                a meaningful impact in the lives of individuals and communities in need.
                Whether you're here to donate, volunteer, or support a charity,
                your presence helps us build a more compassionate and connected world.</p>

                <p>At Charitan, we believe in the power of collective goodwill.
                Our platform connects donors, volunteers, and charitable initiatives across the globe,
                making it easier for you to discover and contribute to causes that resonate with your values.
                From local to international efforts, you can now help create positive change by supporting projects
                in sectors such as Food, Health, Education, Environment, Humanitarian work, and more.</p>

                ${
                    role.localeCompare("donor", undefined, {
                        sensitivity: "accent",
                    }) === 0
                        ? "<p>As a DONOR, you can donate to meaningful charity projects.</p>"
                        : ""
                }
                ${
                    role.localeCompare("charity", undefined, {
                        sensitivity: "accent",
                    }) === 0
                        ? "<p>As a CHARITY, you can crowdfund and promote your own charitable initiatives.</p>"
                        : ""
                }

                <p>We are committed to making your experience on Charitan seamless and impactful,
                and we are here to guide you every step of the way.
                Together, we can create a ripple effect of kindness, support, and hope across the globe.</p>
            </div>

            <div class="footer">
                <p>Thank you for joining us in this journey of giving. We can't wait to see the change we will create together!</p>
    ${footer}
    `,
});

module.exports = { verifyMail, welcomeMail };
