import { baseTemplate } from "./base";

export function grantPendingTemplate({
  name,
  bloodGroup,
  quantity,
}: {
  name: string;
  bloodGroup: string;
  quantity: number;
}) {
  return {
    subject: "Your blood request is under review ⏳",
    html: baseTemplate(`
      <h2>Hello ${name},</h2>

      <p>
        We’ve received your blood request and it is currently
        <strong>under review</strong> by our medical and administrative team.
      </p>

      <p><strong>Request Details:</strong></p>
      <ul>
        <li><strong>Blood Group:</strong> ${bloodGroup}</li>
        <li><strong>Quantity:</strong> ${quantity} units</li>
      </ul>

      <p>
        Our team carefully evaluates each request based on
        availability, urgency, and medical priority to ensure
        fair and timely distribution.
      </p>

      <p>
        You’ll be notified as soon as a decision is made.
        Thank you for your patience and trust.
      </p>

      <p style="margin-top: 16px;">
        If this is an emergency or if you need to update your request,
        please contact our support team immediately.
      </p>
    `),
  };
}
