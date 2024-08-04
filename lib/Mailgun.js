import Mailgun from "mailgun.js";

export default function MailgunClient() {
  const API_KEY = process.env.MAILGUN_API_KEY || "";
  const DOMAIN = process.env.MAILGUN_DOMAIN || "";

  if (API_KEY === "" || DOMAIN === "") {
    return null;
  }

  return {
    domain: DOMAIN,
    mailgun: new Mailgun(FormData).client({
      url: "https://api.eu.mailgun.net",
      username: "api",
      key: API_KEY,
    }),
  };
}
