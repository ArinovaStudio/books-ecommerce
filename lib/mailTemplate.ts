export const mailTemplate = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Order Received</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background:#fbbf24;padding:28px 32px;text-align:center;">
                <h1 style="margin:0;font-size:22px;color:#1a1a1a;font-weight:700;">📦 New Order Received</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 8px;font-size:15px;color:#3d3d3a;">Hi Admin,</p>
                <p style="margin:0 0 24px;font-size:15px;color:#3d3d3a;">A new order has been placed. Here are the details:</p>

                <!-- Order Info -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f8;border-radius:6px;padding:0;margin-bottom:24px;">
                  <tr>
                    <td style="padding:12px 16px;border-bottom:1px solid #e5e5e3;">
                      <span style="font-size:13px;color:#888780;">Order ID</span><br/>
                      <span style="font-size:15px;color:#1a1a1a;font-weight:600;">{{orderId}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px;border-bottom:1px solid #e5e5e3;">
                      <span style="font-size:13px;color:#888780;">Parent Name</span><br/>
                      <span style="font-size:15px;color:#1a1a1a;">{{parentName}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px;border-bottom:1px solid #e5e5e3;">
                      <span style="font-size:13px;color:#888780;">Phone</span><br/>
                      <span style="font-size:15px;color:#1a1a1a;">{{phone}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px;border-bottom:1px solid #e5e5e3;">
                      <span style="font-size:13px;color:#888780;">School</span><br/>
                      <span style="font-size:15px;color:#1a1a1a;">{{school}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px;border-bottom:1px solid #e5e5e3;">
                      <span style="font-size:13px;color:#888780;">Class &amp; Section</span><br/>
                      <span style="font-size:15px;color:#1a1a1a;">{{class}} — {{section}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px;border-bottom:1px solid #e5e5e3;">
                      <span style="font-size:13px;color:#888780;">Delivery Address</span><br/>
                      <span style="font-size:15px;color:#1a1a1a;">{{landmark}}, {{pincode}}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px;">
                      <span style="font-size:13px;color:#888780;">Total Amount</span><br/>
                      <span style="font-size:18px;color:#1a1a1a;font-weight:700;">₹{{totalAmount}}</span>
                    </td>
                  </tr>
                </table>

                <!-- Items Table -->
                <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#1a1a1a;">Items Ordered</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e5e3;border-radius:6px;overflow:hidden;">
            <!-- Footer -->
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #e5e5e3;text-align:center;">
                <p style="margin:0;font-size:12px;color:#888780;">This is an automated notification. Please log in to the admin panel to manage this order.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

export const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8f8f8; padding: 20px;">
    <table width="600" align="center" bgcolor="#ffffff" cellpadding="0" cellspacing="0" style="border-radius: 8px; overflow: hidden;">
        <tr>
            <td style="background-color: #000000; color: #ffffff; padding: 20px; text-align: center;">
                <h1>GlowNest</h1>
            </td>
        </tr>

        <tr>
            <td style="padding: 30px;">
                <h2>Order Confirmation</h2>

                <p>Hi {{CUSTOMER_NAME}},</p>

                <p>Thank you for shopping with GlowNest!</p>

                <p>Your payment has been successfully received and your order has been confirmed.</p>

                <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                        <td><strong>Order ID</strong></td>
                        <td>{{ORDER_ID}}</td>
                    </tr>
                    <tr>
                        <td><strong>Amount Paid</strong></td>
                        <td>₹{{AMOUNT}}</td>
                    </tr>
                    <tr>
                        <td><strong>Payment Status</strong></td>
                        <td style="color: green;">Successful</td>
                    </tr>
                </table>

                <p style="margin-top:20px;">
                    We are now preparing your order for shipment. You'll receive tracking details once your order is dispatched.
                </p>

                <p>
                    Thank you for choosing GlowNest.
                </p>

                <p>
                    Regards,<br>
                    Team GlowNest
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
`;