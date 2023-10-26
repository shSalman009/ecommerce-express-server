const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const createError = require("http-errors");

const sendEmail = async (emailData) => {
  const config = {
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "My App",
      link: "http://localhost:3000/",
    },
  });

  // email template
  const response = {
    body: {
      name: emailData.name || "User",
      intro: "You have requested to reset your password for your account.",
      action: {
        instructions: "To reset your password, please click the button below:",
        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: emailData?.link,
        },
      },
      outro:
        "If you did not request this password reset or have any questions, please ignore this email.",
    },
  };

  const mail = mailGenerator.generate(response);

  const message = {
    from: process.env.SMTP_USER,
    to: emailData.email,
    subject: "Reset your password",
    html: mail,
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    throw createError(500, "Error sending email");
  }
};

module.exports = sendEmail;
