import IMailProvider from "../models/IMailProvider";
import nodemailer, { Transporter } from 'nodemailer';

export default class EtherealMailProvider implements IMailProvider {

    private client: Transporter;

    constructor() {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });
            this.client = transporter;
        });
    }

    public async sendMail(to: string, body: string): Promise<void> {
        const info = await this.client.sendMail({
            from: 'Felipe <informatica3@esquadros.com.br>',
            to,
            subject: 'Recuperação de senha',
            text: body,
        });

        console.log('Message sent %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
}