import { transporter } from "./transporter";
import { EmailType, EmailPayloadMap } from "./types";
import { donationTemplate } from "./email-templates/donation";
import { grantApprovedTemplate } from "./email-templates/grantApproved";
import { grantRejectedTemplate } from "./email-templates/grantRejected";
import { grantPendingTemplate } from "./email-templates/grantPending";

export async function triggerEmail<T extends EmailType>(
  type: T,
  payload: EmailPayloadMap[T],
) {
  switch (type) {
    case EmailType.DONATION_SUCCESS: {
      const email = donationTemplate(
        payload as EmailPayloadMap[EmailType.DONATION_SUCCESS],
      );

      await transporter.sendMail({
        from: `"Blood Bank Reserve" <${process.env.SMTP_USER}>`,
        to: payload.to,
        subject: email.subject,
        html: email.html,
      });
      break;
    }

    case EmailType.GRANT_APPROVED: {
      const email = grantApprovedTemplate(
        payload as EmailPayloadMap[EmailType.GRANT_APPROVED],
      );

      await transporter.sendMail({
        from: `"Blood Bank Reserve" <${process.env.SMTP_USER}>`,
        to: payload.to,
        subject: email.subject,
        html: email.html,
      });
      break;
    }

    case EmailType.GRANT_REJECTED: {
      const email = grantRejectedTemplate(
        payload as EmailPayloadMap[EmailType.GRANT_REJECTED],
      );

      await transporter.sendMail({
        from: `"Blood Bank Reserve" <${process.env.SMTP_USER}>`,
        to: payload.to,
        subject: email.subject,
        html: email.html,
      });
      break;
    }

    case EmailType.GRANT_PENDING: {
      const email = grantPendingTemplate(
        payload as EmailPayloadMap[EmailType.GRANT_PENDING],
      );

      await transporter.sendMail({
        from: `"Blood Bank Reserve" <${process.env.SMTP_USER}>`,
        to: payload.to,
        subject: email.subject,
        html: email.html,
      });
      break;
    }

    default:
      throw new Error("Unsupported email type");
  }
}
