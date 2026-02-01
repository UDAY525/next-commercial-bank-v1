import { baseTemplate } from "./base";

export function grantApprovedTemplate({
  name,
  bloodGroup,
  quantity,
}: {
  name: string;
  bloodGroup: string;
  quantity: number;
}) {
  return {
    subject: "Your blood request has been approved ✅",
    html: baseTemplate(`
      <h2>Hello ${name},</h2>
      <p>Your blood request has been approved.</p>

      <p><strong>Blood Group:</strong> ${bloodGroup}</p>
      <p><strong>Quantity:</strong> ${quantity} units</p>

      <p>Our team will coordinate the next steps.</p>
    `),
  };
}
