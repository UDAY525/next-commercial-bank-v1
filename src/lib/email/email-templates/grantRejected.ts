import { baseTemplate } from "./base";

export function grantRejectedTemplate({
  name,
  reason,
}: {
  name: string;
  reason?: string;
}) {
  return {
    subject: "Update on your blood request",
    html: baseTemplate(`
      <h2>Hello ${name},</h2>
      <p>Unfortunately, your blood request could not be fulfilled at this time.</p>

      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}

      <p>Please feel free to submit another request.</p>
    `),
  };
}
