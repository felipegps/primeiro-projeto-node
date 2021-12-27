import nodemailer, { Transporter } from 'nodemailer';
import aws from 'aws-sdk';
import mailConfig from '@config/mail';
import ISendMailDTO from "../dtos/ISendMailDTO";
import IMailProvider from "../models/IMailProvider";
import IMailTemplateProvider from "../../MailTemplateProvider/models/IMailTemplateProvider";
import { inject, injectable } from "tsyringe";

@injectable()
class SESMailProvider implements IMailProvider {

    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider) {
        this.client = nodemailer.createTransport({
            SES: new aws.SES({ apiVersion: '2010-12-01', region: 'us-east-1' })
        })
    }

    public async sendMail({ to, from, subject, templateData }: ISendMailDTO): Promise<void> {

        const { name, email } = mailConfig.default.from;

        await this.client.sendMail({
            from: {
                name: from?.name || name,
                address: from?.email || email
            },
            to: {
                name: to.name,
                address: to.email
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData),
        });
    }

}

export default SESMailProvider