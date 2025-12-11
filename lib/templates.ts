export const emailOtpTemplate = (otp: string) => ({
    subject: "OTP Verification",
    html: `<p>Your OTP is <strong>${otp}</strong></p>`,
});
