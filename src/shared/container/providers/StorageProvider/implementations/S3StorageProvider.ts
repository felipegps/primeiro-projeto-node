import IStorageProvider from "../models/IStorageProvider";
import fs from 'fs';
import aws, { S3 } from 'aws-sdk';
import path from 'path';
import uploadConfig from '@config/upload';



export default class S3StorageProvider implements IStorageProvider {

    private client: S3;

    constructor() {
        this.client = new aws.S3({
            region: 'us-east-1'
        });
    }

    public async saveFile(file: string): Promise<string> {
        const originalPath = path.resolve(uploadConfig.tmpFolder, file);

        const fileContent = await fs.promises.readFile(originalPath);

        await this.client.putObject({
            Bucket: uploadConfig.config.aws.bucket,
            Key: file,
            ACL: 'public-read',
            Body: fileContent,
            ContentType: path.extname(file),
        }).promise();

        await fs.promises.unlink(originalPath);

        return file;
    }

    public async deleteFile(file: string): Promise<void> {
        await this.client.deleteObject({
            Bucket: 'esquadros-bi',
            Key: file
        }).promise();
    }
}