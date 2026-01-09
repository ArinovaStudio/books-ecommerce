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
                <p>You can now login to view details.</p>
            </div>
        `
    };
};

export const schoolAdminCreatedTemplate = (name: string, email: string, password: string) => ({
    subject: "School Admin Account Created - Glow Nest",
    html: `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Welcome to Glow Nest</h2>
            <p>Dear ${name},</p>
            <p>Your school has been registered successfully. Here are your login credentials:</p>
            <ul>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Password:</strong> ${password}</li>
            </ul>
            <p>Please login and change your password immediately.</p>
        </div>
    `
});


export const orderReceiptTemplate = (
    userName: string, 
    orderId: string, 
    studentName: string, 
    totalAmount: number, 
    items: { name: string, quantity: number, price: number }[]
) => {
    
    const itemsList = items.map(item => 
        `<tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px;">${item.name}</td>
            <td style="padding: 10px; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px; text-align: right;">₹${item.price}</td>
        </tr>`
    ).join('');

    return {
        subject: `Order Receipt - #${orderId.toUpperCase()}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #333;">Order Confirmation</h2>
                <p>Hi ${userName},</p>
                <p>Thank you for your order! Here is the receipt for the items purchased for <strong>${studentName}</strong>.</p>
                
                <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
                    <p style="margin: 0;"><strong>Order ID:</strong> ${orderId}</p>
                    <p style="margin: 5px 0 0;"><strong>Total Amount:</strong> <span style="color: green; font-size: 1.2em;">₹${totalAmount}</span></p>
                </div>

                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #eee;">
                            <th style="padding: 10px; text-align: left;">Item</th>
                            <th style="padding: 10px; text-align: center;">Qty</th>
                            <th style="padding: 10px; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsList}
                    </tbody>
                </table>

                <p style="margin-top: 30px; font-size: 0.9em; color: #666;">If you have any questions, please contact our support team.</p>
            </div>
        `
    };
};


export const newOrderAlertTemplate = (
    adminName: string,
    orderId: string,
    studentName: string,
    className: string,
    totalAmount: number
) => ({
    subject: `New Order Received - #${orderId.toUpperCase()}`,
    html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #333;">New Order Alert</h2>
            <p>Hello ${adminName},</p>
            <p>A new order has been placed in your school.</p>
            
            <div style="background-color: #f0f8ff; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p><strong>Student:</strong> ${studentName}</p>
                <p><strong>Class:</strong> ${className}</p>
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
            </div>

            <p>Please login to your dashboard to view the full details and manage the order.</p>
        </div>
    `
});

export const newContactQueryTemplate = (
    name: string,
    email: string,
    phone: string | null | undefined,
    message: string
) => ({
    subject: `New Contact Inquiry from ${name}`,
    html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #333;">New Contact Form Submission</h2>
            <p>You have received a new message via the contact form.</p>
            
            <div style="background-color: #f9f9f9; padding: 15px; margin: 20px 0; border-radius: 5px;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Phone:</strong> ${phone || "N/A"}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
                <p><strong>Message:</strong></p>
                <p style="white-space: pre-wrap; color: #555;">${message}</p>
            </div>

            <p style="font-size: 0.9em; color: #888;">This is an automated notification from your website.</p>
        </div>
    `
});