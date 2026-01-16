const headerStyle = `
    background-color: #111827; 
    padding: 24px; 
    text-align: center; 
    border-radius: 8px 8px 0 0;
`;
const logoStyle = `
    color: #ffffff; 
    font-size: 24px; 
    font-weight: bold; 
    text-decoration: none; 
    font-family: sans-serif;
`;
const bodyStyle = `
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
    background-color: #f3f4f6; 
    padding: 40px 20px;
`;
const containerStyle = `
    max-width: 600px; 
    margin: 0 auto; 
    background-color: #ffffff; 
    border-radius: 8px; 
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;
const footerStyle = `
    text-align: center; 
    padding: 20px; 
    font-size: 12px; 
    color: #9ca3af;
`;
const buttonStyle = `
    display: inline-block; 
    background-color: #06b6d4; 
    color: #ffffff; 
    padding: 12px 24px; 
    border-radius: 50px; 
    text-decoration: none; 
    font-weight: bold; 
    margin-top: 10px;
`;

export const emailOtpTemplate = (otp: string) => ({
    subject: "OTP Verification - Glow Nest",
    html: `
        <div style="${bodyStyle}">
            <div style="${containerStyle}">
                <div style="${headerStyle}">
                    <span style="${logoStyle}">Glow Nest</span>
                </div>
                <div style="padding: 40px 30px; text-align: center;">
                    <h2 style="color: #111827; margin-top: 0;">Verification Code</h2>
                    <p style="color: #6b7280; margin-bottom: 25px;">Please use the following OTP to verify your account. This code is valid for 10 minutes.</p>
                    <div style="background-color: #f0f9ff; border: 2px dashed #06b6d4; padding: 20px; border-radius: 8px; display: inline-block;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827;">${otp}</span>
                    </div>
                </div>
                <div style="${footerStyle}">
                    &copy; Glow Nest School Supplies. All rights reserved.
                </div>
            </div>
        </div>`,
});

export const studentAddedTemplate = (
    studentName: string, 
    parentName: string, 
    email: string, 
    schoolName: string,
    className: string,
    sectionName: string,
    password?: string
) => {
    
    const accountInfoSection = password 
        ? `
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin-top: 0; color: #0369a1; font-weight: bold; font-size: 16px; margin-bottom: 10px;">
                🆕 Parent Account Created
            </p>
            <p style="color: #334155; margin: 0 0 15px 0;">We have created an account for you. Please login with:</p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 6px; border: 1px dashed #0ea5e9;">
                <table style="width: 100%;">
                    <tr>
                        <td style="color: #64748b; width: 80px;">Email:</td>
                        <td style="font-weight: bold; color: #0f172a;">${email}</td>
                    </tr>
                    <tr>
                        <td style="color: #64748b;">Password:</td>
                        <td style="font-weight: bold; color: #0f172a;">${password}</td>
                    </tr>
                </table>
            </div>
            <p style="font-size: 0.85em; color: #64748b; margin-top: 10px;">*Please change your password after your first login.</p>
        </div>`
        : `
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin-top: 0; color: #15803d; font-weight: bold; font-size: 16px; margin-bottom: 10px;">
                ✅ Account Linked Successfully
            </p>
            <p style="color: #334155; margin: 0 0 10px 0;">This student has been linked to your existing parent account.</p>
            <p style="margin: 0; color: #374151;">Login ID: <strong>${email}</strong></p>
        </div>`;

    return {
        subject: "New Student Added - Glow Nest",
        html: `
            <div style="${bodyStyle}">
                <div style="${containerStyle}">
                    <div style="${headerStyle}">
                        <span style="${logoStyle}">Glow Nest</span>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="color: #111827; margin-top: 0;">Welcome, ${parentName}!</h2>
                        <p style="color: #4b5563; line-height: 1.6;">We are pleased to inform you that <strong>${studentName}</strong> has been successfully enrolled in our digital system.</p>
                        
                        <div style="background-color: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-top: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #06b6d4; font-size: 18px;">Student Details</h3>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280; width: 40%;">School:</td>
                                    <td style="padding: 8px 0; color: #111827; font-weight: 500;">${schoolName}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280;">Class:</td>
                                    <td style="padding: 8px 0; color: #111827; font-weight: 500;">${className}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280;">Section:</td>
                                    <td style="padding: 8px 0; color: #111827; font-weight: 500;">${sectionName}</td>
                                </tr>
                            </table>
                        </div>

                        ${accountInfoSection}

                        <div style="text-align: center; margin-top: 30px;">
                            <a href="https://glow-nest.in" style="${buttonStyle}">Login to Portal</a>
                        </div>
                    </div>
                    <div style="${footerStyle}">
                        You received this email because you are registered with Glow Nest.<br>
                        Please do not reply directly to this automated email.
                    </div>
                </div>
            </div>
        `
    };
};

export const schoolAdminCreatedTemplate = (name: string, email: string, password: string) => ({
    subject: "School Admin Access - Glow Nest",
    html: `
        <div style="${bodyStyle}">
            <div style="${containerStyle}">
                <div style="${headerStyle}">
                    <span style="${logoStyle}">Glow Nest</span>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #111827; margin-top: 0;">School Registration Successful</h2>
                    <p style="color: #4b5563;">Dear ${name},</p>
                    <p style="color: #4b5563; line-height: 1.6;">Your school account has been set up. You can now manage students, orders, and supplies through your admin dashboard.</p>
                    
                    <div style="background-color: #1e293b; color: #ffffff; padding: 25px; border-radius: 8px; margin: 25px 0;">
                        <p style="margin: 0 0 10px 0; color: #94a3b8; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;">Admin Credentials</p>
                        <div style="margin-bottom: 15px;">
                            <span style="color: #94a3b8;">Email:</span><br>
                            <span style="font-size: 16px;">${email}</span>
                        </div>
                        <div>
                            <span style="color: #94a3b8;">Temporary Password:</span><br>
                            <span style="font-size: 18px; font-weight: bold; color: #06b6d4;">${password}</span>
                        </div>
                    </div>

                    <div style="text-align: center;">
                        <a href="https://glow-nest.in" style="${buttonStyle}">Login to Admin Dashboard</a>
                        <p style="font-size: 13px; color: #ef4444; margin-top: 15px;">Important: Please change your password immediately after your first login.</p>
                    </div>
                </div>
                <div style="${footerStyle}">
                    &copy; Glow Nest School Supplies
                </div>
            </div>
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
    
    const itemsList = items.map((item, index) => 
        `<tr style="border-bottom: 1px solid #f3f4f6; background-color: ${index % 2 === 0 ? '#ffffff' : '#f9fafb'};">
            <td style="padding: 12px; color: #374151;">${item.name}</td>
            <td style="padding: 12px; text-align: center; color: #374151;">${item.quantity}</td>
            <td style="padding: 12px; text-align: right; color: #374151;">₹${item.price}</td>
        </tr>`
    ).join('');

    return {
        subject: `Order Receipt - #${orderId.toUpperCase()}`,
        html: `
            <div style="${bodyStyle}">
                <div style="${containerStyle}">
                    <div style="${headerStyle}">
                        <span style="${logoStyle}">Glow Nest</span>
                    </div>
                    <div style="padding: 30px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h2 style="color: #111827; margin: 0;">Order Confirmed</h2>
                            <p style="color: #06b6d4; font-weight: bold; margin-top: 5px;">#${orderId}</p>
                        </div>
                        
                        <p style="color: #4b5563;">Hi ${userName},</p>
                        <p style="color: #4b5563;">Thank you for your purchase for <strong>${studentName}</strong>. Here is your receipt.</p>
                        
                        <table style="width: 100%; border-collapse: collapse; margin: 25px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                            <thead>
                                <tr style="background-color: #f3f4f6;">
                                    <th style="padding: 12px; text-align: left; color: #4b5563; font-size: 14px;">Item</th>
                                    <th style="padding: 12px; text-align: center; color: #4b5563; font-size: 14px;">Qty</th>
                                    <th style="padding: 12px; text-align: right; color: #4b5563; font-size: 14px;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${itemsList}
                            </tbody>
                            <tfoot>
                                <tr style="background-color: #111827; color: #ffffff;">
                                    <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold;">Total Amount</td>
                                    <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">₹${totalAmount}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <p style="font-size: 0.9em; color: #6b7280; text-align: center;">If you have questions about your order, reply to this email.</p>
                    </div>
                    <div style="${footerStyle}">
                        &copy; Glow Nest School Supplies
                    </div>
                </div>
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
    subject: `💰 New Order - #${orderId.toUpperCase()}`,
    html: `
        <div style="${bodyStyle}">
            <div style="${containerStyle}">
                <div style="${headerStyle}">
                    <span style="${logoStyle}">Admin Alert</span>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #111827; margin-top: 0;">New Order Received</h2>
                    <p style="color: #4b5563;">Hello ${adminName},</p>
                    <p style="color: #4b5563;">A new order has been placed on your school portal.</p>
                    
                    <div style="background-color: #f0f9ff; border-left: 5px solid #06b6d4; padding: 20px; margin: 25px 0; border-radius: 4px;">
                        <table style="width: 100%;">
                            <tr>
                                <td style="padding: 5px 0; color: #64748b; font-size: 14px;">Order ID:</td>
                                <td style="padding: 5px 0; color: #0f172a; font-weight: bold;">${orderId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #64748b; font-size: 14px;">Student:</td>
                                <td style="padding: 5px 0; color: #0f172a; font-weight: bold;">${studentName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #64748b; font-size: 14px;">Class:</td>
                                <td style="padding: 5px 0; color: #0f172a; font-weight: bold;">${className}</td>
                            </tr>
                            <tr>
                                <td style="padding: 15px 0 0 0; color: #64748b; font-size: 14px;">Total Value:</td>
                                <td style="padding: 15px 0 0 0; color: #166534; font-weight: bold; font-size: 20px;">₹${totalAmount}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="text-align: center;">
                        <a href="https://glow-nest.in/admin" style="${buttonStyle}">View Order Details</a>
                    </div>
                </div>
            </div>
        </div>
    `
});

export const newContactQueryTemplate = (
    name: string,
    email: string,
    phone: string | null | undefined,
    message: string
) => ({
    subject: `New Inquiry from ${name}`,
    html: `
        <div style="${bodyStyle}">
            <div style="${containerStyle}">
                <div style="${headerStyle}">
                    <span style="${logoStyle}">Contact Form</span>
                </div>
                <div style="padding: 30px;">
                    <h2 style="color: #111827; margin-top: 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">New Message</h2>
                    
                    <div style="margin: 20px 0;">
                        <p style="margin: 5px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Sender Details</p>
                        <p style="margin: 0; color: #111827; font-weight: bold; font-size: 16px;">${name}</p>
                        <p style="margin: 5px 0; color: #06b6d4;"><a href="mailto:${email}" style="color: #06b6d4; text-decoration: none;">${email}</a></p>
                        <p style="margin: 0; color: #4b5563;">${phone || "No phone number provided"}</p>
                    </div>

                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                        <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message Content</p>
                        <p style="white-space: pre-wrap; color: #374151; line-height: 1.6; margin: 0;">${message}</p>
                    </div>
                </div>
                <div style="${footerStyle}">
                    Sent via Glow Nest Contact Form
                </div>
            </div>
        </div>
    `
});