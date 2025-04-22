import {
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import transporter, { sender } from "./nodemailer.js";


export const sendVerificationEmail = async (email, verificationToken) => {
	const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken);
  
	try {
	  const info = await transporter.sendMail({
		from: `"${sender.name}" <${sender.email}>`,
		to: email,
		subject: "Verify your email",
		html: htmlContent,
	  });
  
	  console.log("Email sent:", info.messageId);
	} catch (error) {
	  console.error("Failed to send email:", error);
	  throw new Error("Could not send verification email");
	}
  };

  export const sendWelcomeEmail = async (email, name) => {
	const htmlContent = `
		<h1>Welcome to Fuel finder Company</h1>
		<p>Hi ${name},</p>
		<p>We're excited to have you on board. Let us know if you need anything!</p>
	`;

	try {
		const info = await transporter.sendMail({
			from: `"${sender.name}" <${sender.email}>`,
			to: email,
			subject: "Welcome to Fuel finder Company!",
			html: htmlContent,
		});

		console.log("Welcome email sent:", info.messageId);
	} catch (error) {
		console.error("Failed to send welcome email:", error);
		throw new Error("Could not send welcome email");
	}
};


export const sendPasswordResetEmail = async (email, resetURL) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Reset your password",
			html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
			category: "Password Reset",
		});
	} catch (error) {
		console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
	}
};

export const sendResetSuccessEmail = async (email) => {
	const recipient = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};