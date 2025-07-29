export const verifyEmailTemplate = (name: string, token: string) => {
  const verifyURL = `https://your-frontend-url.com/verify-email?token=${token}`;
  const readmeLink = `https://github.com/your-username/your-repo-name#readme`;

  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2>Hi ${name},</h2>
      <p>Thank you for registering. Please verify your email by clicking the button below:</p>
      <a href="${verifyURL}" style="
          display: inline-block;
          padding: 10px 20px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 15px 0;
        ">Verify Email</a>
      <p style="color: #e63946;"><strong>Note:</strong> Since this is a backend-only assignment, the link above may not work as expected. Please refer to the README file on GitHub to manually verify your account:</p>
      <p><a href="${readmeLink}" target="_blank" style="color: #1d3557;">${readmeLink}</a></p>
      <br/>
      <p>Regards,<br/>Your Project Team</p>
    </div>
  `;
};
