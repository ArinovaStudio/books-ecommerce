export const emailOtpTemplate = (otp: string) => ({
    subject: "OTP Verification",
    html: `<p>Your OTP is <strong>${otp}</strong></p>`,
});

export const studentAddedTemplate = (studentName: string, parentName: string, email: string, password?: string) => {

    const accountDetails = password 
        ? `<p>We have created a parent account for you. Login details:</p>
           <ul>
             <li><strong>Email:</strong> ${email}</li>
             <li><strong>Password:</strong> ${password}</li>
           </ul>`
        : `<p>This student has been linked to your existing parent account.</p>`;

    return {
        subject: "New Student Added - Glow Nest",
        html: `
            <div style="font-family: sans-serif; padding: 20px;">
                <h2>Welcome to Glow Nest</h2>
                <p>Dear ${parentName},</p>
                <p><strong>${studentName}</strong> has been successfully added to our school database.</p>
                ${accountDetails}
                <p>You can now login to view details, pay fees, and track progress.</p>
            </div>
        `
    };
};