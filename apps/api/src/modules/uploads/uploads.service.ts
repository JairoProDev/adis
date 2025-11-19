import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PrismaService } from '@/common/services/prisma.service';

@Injectable()
export class UploadsService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Initialize S3/R2 client
    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${this.configService.get('CLOUDFLARE_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: this.configService.get('CLOUDFLARE_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get('CLOUDFLARE_SECRET_ACCESS_KEY') || '',
      },
    });

    this.bucketName = this.configService.get('CLOUDFLARE_BUCKET_NAME') || '';
  }

  async getUploadUrl(filename: string, contentType: string): Promise<string> {
    const key = `uploads/${Date.now()}-${filename}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    // Generate presigned URL valid for 5 minutes
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });

    return url;
  }

  async createMediaRecord(userId: string, data: any) {
    return this.prisma.media.create({
      data: {
        userId,
        ...data,
        status: 'UPLOADED',
      },
    });
  }
}
