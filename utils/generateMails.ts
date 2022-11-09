import { MailDataRequired } from "@sendgrid/mail";
import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import { API_ROUTES, DOMAIN, EMAIL_FROM } from "../libs/constants";

export function loginMail(toMail: string, token: string) {
  try {
    const magicLink = DOMAIN + API_ROUTES.callback + "?token=" + token;

    const file = fs.readFileSync(
      path.join(process.cwd(), `/templates/login.hbs`),
      "utf-8"
    );
    const template = handlebars.compile(file);
    const emailBody = template({
      callbackLink: magicLink,
    });

    const msg: MailDataRequired = {
      to: toMail,
      from: EMAIL_FROM,
      subject: "You have just login to FT store",
      html: emailBody,
    };

    return msg;
  } catch (e) {
    return undefined;
  }
}
