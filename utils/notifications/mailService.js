const nodemailer = require("nodemailer");

function sendEmail(email, name, status, URL) {
	const transporter = nodemailer.createTransport({
		service: process.env.MAIL_SERVICE,
		auth: {
			user: process.env.NOTIFICATIONS_MAIL,
			pass: process.env.MAIL_PASS,
		},
	});

	const mailOptions = {
		from: process.env.NOTIFICATIONS_MAIL,
		to: email,
		subject: `Your URL Monitoring Update: Status - ${status}`,
		text: `
        Dear ${name},

        This mail to inform you that your monitored URL is turned ${status}.
        
        URL: ${URL}
        Status: ${status}
        
        We will continue to monitor the URL and keep you up to date with its status.
        
        If you have any questions or concerns, please feel free to reach out to our support team. Thank you for using our URL monitoring service.
        
        Best regards,
        Your Company
        `,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error("Error:", error);
		} else {
			console.log("Email sent:", info.response);
		}
	});
}

module.exports = sendEmail;
