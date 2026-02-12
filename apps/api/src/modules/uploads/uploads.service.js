"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const prisma_service_1 = require("../../common/services/prisma.service");
let UploadsService = class UploadsService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        // Initialize S3/R2 client
        this.s3Client = new client_s3_1.S3Client({
            region: 'auto',
            endpoint: `https://${this.configService.get('CLOUDFLARE_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: this.configService.get('CLOUDFLARE_ACCESS_KEY_ID') || '',
                secretAccessKey: this.configService.get('CLOUDFLARE_SECRET_ACCESS_KEY') || '',
            },
        });
        this.bucketName = this.configService.get('CLOUDFLARE_BUCKET_NAME') || '';
    }
    async getUploadUrl(filename, contentType) {
        const key = `uploads/${Date.now()}-${filename}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
        });
        // Generate presigned URL valid for 5 minutes
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: 300 });
        return url;
    }
    async createMediaRecord(userId, data) {
        return this.prisma.media.create({
            data: {
                userId,
                ...data,
                status: 'UPLOADED',
            },
        });
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], UploadsService);
//# sourceMappingURL=uploads.service.js.map