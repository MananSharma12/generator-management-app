import formData from "form-data";

// Using dynamic imports for now due to mailgun error
let Mailgun: any;
let mailgun: any;
import("mailgun.js").then((module) => {
  Mailgun = module.default;
  initializeMailgun();
});

function initializeMailgun() {
  mailgun = new Mailgun(formData).client({
    username: "api",
    key: import.meta.env.VITE_MAILGUN_API_KEY,
  });
}

export async function sendServiceDueEmail(
  userEmail: string,
  generatorInfo: string,
) {
  const messageData = {
    from: "Vijay Sharma <noreply@shreehps@gmail.com>",
    to: userEmail,
    subject: "Generator Service Due",
    text: `Your generator ${generatorInfo} is due for service. Please schedule a service appointment as soon as possible.`,
  };

  try {
    const response = await mailgun.messages.create(
      import.meta.env.VITE_MAILGUN_DOMAIN,
      messageData,
    );
    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email notification");
  }
}
