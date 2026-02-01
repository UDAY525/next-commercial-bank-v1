import { baseTemplate } from "./base";

export function donationTemplate({
  name,
  bloodGroup,
  quantity,
}: {
  name: string;
  bloodGroup: string;
  quantity: number;
}) {
  return {
    subject: "Thank you for donating blood ❤️",
    html: baseTemplate(`
      <h2>Thank you, ${name}!</h2>
      <p>Your blood donation has been successfully recorded.</p>

      <p><strong>Blood Group:</strong> ${bloodGroup}</p>
      <p><strong>Quantity:</strong> ${quantity} units</p>

      <p>You are making a real difference.</p>
    `),
  };
}
