const verifyAccountMail = (receiver, OTP) => {
    const otpDigits = OTP.toString().split('');

    return {
        from: 'EEET2582.Charitan@gmail.com',
        to: receiver,
        subject: 'Please Verify Yourself',
        html: `
          <p>Hello,</p>
          <p>Thank you for choosing Charitan!</p>
          <p>Please use the following OTP to complete the registration process:</p>
          <div style="text-align: center; margin: 20px 0;">
            ${otpDigits.map(digit => `
              <span style="
                display: inline-block;
                width: 40px;
                height: 40px;
                margin: 0 5px;
                font-size: 24px;
                font-weight: bold;
                background-color: #f3f4f6;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                line-height: 40px;
                text-align: center;
                color: #111827;
              ">
                ${digit}
              </span>
            `).join('')}
          </div>
          <p>This OTP is valid for a limited time. If you did not request this, please ignore this email.</p>
        `
    };
};
  
const welcomeMail = (receiver, name, role) => ({
  from: 'EEET2582.Charitan@gmail.com',
  to: receiver,
  subject: 'Welcome to Our Platform!',
  html: `<p>Hello ${name},</p><p>Thank you for registering as a ${role} on our platform!</p>`
});

const projectCreationMail = (receiver, projectTitle) => ({
  from: 'EEET2582.Charitan@gmail.com',
  to: receiver,
  subject: 'Welcome to Our Platform!',
  html: `<p>You have successfully create the project: ${projectTitle}</p>`
});
  
module.exports = { verifyAccountMail, welcomeMail, projectCreationMail };
  