import { UploadsService } from './uploads.service';
export declare class UploadsResolver {
    private uploadsService;
    constructor(uploadsService: UploadsService);
    getUploadUrl(filename: string, contentType: string): Promise<string>;
}
//# sourceMappingURL=uploads.resolver.d.ts.map