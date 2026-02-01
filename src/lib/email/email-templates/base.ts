export function baseTemplate(content: string) {
  return `
  <div style="
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
    background-color: #f3f4f6;
    padding: 16px;
  ">
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
    >
      <tr>
        <td align="center">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              max-width: 800px;
              background-color: #ffffff;
              border-radius: 14px;
              overflow: hidden;
              box-shadow: 0 10px 30px rgba(0,0,0,0.08);
            "
          >

            <!-- Header -->
            <tr>
              <td
                style="
                  background: linear-gradient(135deg, #dc2626, #b91c1c);
                  padding: 24px 16px;
                  text-align: center;
                  color: #ffffff;
                "
              >
                <h1 style="margin: 0; font-size: 24px;">
                  Blood Bank Reserve
                </h1>
                <p style="margin-top: 8px; font-size: 14px; opacity: 0.9;">
                  Connecting donors, hospitals & lives
                </p>
              </td>
            </tr>

            <!-- Hero Image -->
            <tr>
              <td>
                <img
                  src="https://parkhospital.in/storage/app/public/upload/bVpUZUp5LjIPVY0FPJiko4LvxuJSC2zSsSLraEeU.png"
                  alt="Blood Donation"
                  style="
                    width: 100%;
                    height: auto;
                    display: block;
                  "
                />
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td style="padding: 24px 16px; color: #111827;">
                ${content}

                <!-- Info Section -->
                <div style="margin-top: 24px;">
                  <h3 style="margin-bottom: 8px; font-size: 18px;">
                    Why your contribution matters
                  </h3>
                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #374151;">
                    Blood availability is critical during emergencies.
                    Your participation helps ensure timely treatment
                    for patients across hospitals and care centers.
                  </p>
                </div>

                <!-- Highlight Box -->
                <div style="
                  margin-top: 24px;
                  padding: 16px;
                  background-color: #fef2f2;
                  border-left: 4px solid #dc2626;
                  border-radius: 8px;
                ">
                  <p style="margin: 0; font-size: 14px; color: #7f1d1d; line-height: 1.6;">
                    🩸 <strong>Did you know?</strong><br />
                    One blood donation can save up to
                    <strong>three lives</strong> and supports multiple
                    critical treatments.
                  </p>
                </div>

                <!-- Steps Section -->
                <div style="margin-top: 28px;">
                  <h3 style="margin-bottom: 12px; font-size: 18px;">
                    What happens next?
                  </h3>
                  <ol style="padding-left: 18px; font-size: 14px; color: #374151;">
                    <li style="margin-bottom: 6px;">
                      Your donation/request is verified by our team
                    </li>
                    <li style="margin-bottom: 6px;">
                      Hospitals and partners are notified in real time
                    </li>
                    <li>
                      We track fulfillment and keep you informed
                    </li>
                  </ol>
                </div>

                <!-- Animated GIF -->
                <div style="text-align: center; margin-top: 32px;">
                  <img
                    src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmwxOGthdHdrdjJiYzZvNHkxZXY3M2RkNHhscXVuYzJ6MTdrbDJnaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kxUc3bdlKbe8v2CQNc/giphy.gif"
                    alt="Thank You"
                    width="110"
                    style="display: inline-block;"
                  />
                </div>

                <!-- CTA Button -->
                <div style="text-align: center; margin-top: 32px;">
                  <a
                    href="https://your-app-url.com"
                    style="
                      display: inline-block;
                      background-color: #dc2626;
                      color: #ffffff;
                      padding: 14px 28px;
                      border-radius: 999px;
                      font-size: 14px;
                      font-weight: bold;
                      text-decoration: none;
                    "
                  >
                    View Dashboard
                  </a>
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                style="
                  padding: 16px;
                  background-color: #f9fafb;
                  text-align: center;
                  font-size: 12px;
                  color: #6b7280;
                "
              >
                <p style="margin: 4px 0;">
                  © ${new Date().getFullYear()} Blood Bank Reserve
                </p>
                <p style="margin: 4px 0;">
                  Saving lives, one drop at a time ❤️
                </p>
                <p style="margin-top: 8px;">
                  Need help?
                  <a
                    href="mailto:support@bloodbankreserve.org"
                    style="color:#dc2626;text-decoration:none;"
                  >
                    support@bloodbankreserve.org
                  </a>
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
  `;
}
