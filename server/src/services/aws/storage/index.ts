import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Env } from "../../../utils/env";

class StorageService {
  private s3Client: S3Client;
  private bucketName: string;
  private static cdnDistributionUrl: string =
    Env.AWS_CLOUD_FRONT_DISTRIBUTION_URL;

  constructor(s3Client: S3Client, bucketName: string) {
    this.s3Client = s3Client;
    this.bucketName = bucketName;
  }

  async uploadObject(
    key: string,
    body: Buffer | Uint8Array | Blob | string,
    contentType?: string
  ): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(params));
      return key;
    } catch (error) {
      throw new Error(`Failed to upload object: ${error}`);
    }
  }

  async getObject(key: string): Promise<Buffer> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      const data = await this.s3Client.send(new GetObjectCommand(params));
      const streamToBuffer = (stream: any) => {
        return new Promise<Buffer>((resolve, reject) => {
          const chunks: any[] = [];
          stream.on("data", (chunk: any) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () => resolve(Buffer.concat(chunks)));
        });
      };
      return await streamToBuffer(data.Body);
    } catch (error) {
      throw new Error(`Failed to get object: ${error}`);
    }
  }

  async deleteObject(key: string): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      await this.s3Client.send(new DeleteObjectCommand(params));
    } catch (error) {
      throw new Error(`Failed to delete object: ${error}`);
    }
  }

  async generatePresignedUploadUrl(
    key: string,
    expiresInSeconds: number = 300
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });
      return url;
    } catch (error) {
      throw new Error(`Failed to generate presigned upload URL: ${error}`);
    }
  }

  async generatePresignedDownloadUrl(
    key: string,
    expiresInSeconds: number = 300
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    try {
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: expiresInSeconds,
      });
      return url;
    } catch (error) {
      throw new Error(`Failed to generate presigned download URL: ${error}`);
    }
  }

  async getUrlFromKey(key: string) {
    return StorageService.cdnDistributionUrl + key;
  }
}

export { StorageService };
