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


export const statusTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Tracking – Glow-nest.in</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      background-color: #FFF5EE;
      font-family: 'Inter', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      max-width: 600px;
      margin: 0 auto;
      padding: 32px 16px;
    }

    .header {
      background: #1C1008;
      border-radius: 16px 16px 0 0;
      padding: 32px 40px 28px;
      text-align: center;
    }

    .brand {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #FF7A2F;
      margin-bottom: 10px;
    }

    .brand span { color: #FFAB76; }

    .header h1 {
      font-size: 24px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: -0.5px;
    }

    .header p {
      margin-top: 6px;
      font-size: 14px;
      color: #9C8070;
    }

    .body {
      background: #FFFFFF;
      padding: 36px 40px;
    }

    .greeting {
      font-size: 15px;
      color: #4A3728;
      margin-bottom: 28px;
      line-height: 1.7;
    }

    .greeting strong { color: #1C1008; }

    .order-info {
      display: table;
      width: 100%;
      background: #FFF8F3;
      border: 1px solid #FFD9BF;
      border-radius: 10px;
      padding: 16px 20px;
      margin-bottom: 36px;
    }

    .order-info-item {
      display: table-cell;
      vertical-align: top;
      width: 100%;
    }

    .order-info-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      color: #C47A4A;
      margin-bottom: 4px;
    }

    .order-info-value {
      font-size: 16px;
      font-weight: 700;
      color: #1C1008;
    }

    .tracker-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #C47A4A;
      margin-bottom: 24px;
    }

    .steps {
      position: relative;
      padding-left: 0;
      list-style: none;
    }

    .step {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 0;
    }

    .step-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      width: 36px;
    }

    .step-dot {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .step-dot.done {
      background: #FF7A2F;
      border: none;
    }

    .step-dot.active {
      background: #FFFFFF;
      border: 2.5px solid #FF7A2F;
      box-shadow: 0 0 0 5px rgba(255,122,47,0.15);
    }

    .step-dot.pending {
      background: #FFFFFF;
      border: 2px solid #E5D0C4;
    }

    .step-dot.done::after {
      content: '';
      display: block;
      width: 10px;
      height: 6px;
      border-left: 2px solid #FFFFFF;
      border-bottom: 2px solid #FFFFFF;
      transform: rotate(-45deg) translate(1px, -1px);
    }

    .step-dot.active::after {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #FF7A2F;
    }

    .step-line {
      width: 2px;
      flex: 1;
      min-height: 28px;
      background: #E5D0C4;
    }

    .step-line.filled { background: #FF7A2F; }

    .step:last-child .step-line { display: none; }

    .step-content {
      padding-top: 6px;
      padding-bottom: 24px;
      flex: 1;
    }

    .step:last-child .step-content { padding-bottom: 4px; }

    .step-name {
      font-size: 15px;
      font-weight: 600;
      color: #C4A898;
      margin-bottom: 2px;
    }

    .step-name.done,
    .step-name.active { color: #1C1008; }

    .step-badge {
      display: inline-block;
      margin-top: 6px;
      background: rgba(255,122,47,0.12);
      color: #E05A10;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      padding: 3px 10px;
      border-radius: 20px;
    }

    .divider {
      border: none;
      border-top: 1px solid #FFE8D6;
      margin: 32px 0 28px;
    }

    .cta-note {
      text-align: center;
      font-size: 13px;
      color: #9C8070;
      line-height: 1.6;
    }

    .footer {
      background: #FFF8F3;
      border-top: 1px solid #FFD9BF;
      border-radius: 0 0 16px 16px;
      padding: 24px 40px;
      text-align: center;
    }

    .footer p {
      font-size: 12px;
      color: #C4A898;
      line-height: 1.7;
    }

    .footer a { color: #FF7A2F; text-decoration: none; }

    @media only screen and (max-width: 480px) {
      .body       { padding: 28px 20px; }
      .header     { padding: 24px 20px 20px; }
      .footer     { padding: 20px; }
      .order-info { padding: 14px 16px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">

    <div class="header">
      <div class="brand">✦ Glow-nest<span>.in</span></div>
      <h1>Order Update</h1>
      <p>Here's the latest on your shipment</p>
    </div>

    <div class="body">

      <p class="greeting">
        Hi <strong>{{customerName}}</strong>, great news! Your order is on its way.
        We'll keep you updated every step of the journey. 🧡
      </p>

      <div class="order-info">
        <div class="order-info-item">
          <div class="order-info-label">Order ID</div>
          <div class="order-info-value">#{{orderId}}</div>
        </div>
      </div>

      <div class="tracker-title">Tracking Progress</div>

      {{STATUS}}

      <hr class="divider"/>
      <p class="cta-note">You'll receive another email the moment your order is delivered.</p>

    </div>

    <div class="footer">
      <p>
        Questions? Reply to this email or visit our
        <a href="{{supportUrl}}">Help Centre</a>.<br/>
        © 2026 Glow-nest.in · <a href="{{unsubscribeUrl}}">Unsubscribe</a>
      </p>
    </div>

  </div>
</body>
</html>
`