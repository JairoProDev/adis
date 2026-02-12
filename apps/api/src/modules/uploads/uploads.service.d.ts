import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/common/services/prisma.service';
export declare class UploadsService {
    private prisma;
    private configService;
    private s3Client;
    private bucketName;
    constructor(prisma: PrismaService, configService: ConfigService);
    getUploadUrl(filename: string, contentType: string): Promise<string>;
    createMediaRecord(userId: string, data: any): Promise<any>;
}
//# sourceMappingURL=uploads.service.d.ts.map