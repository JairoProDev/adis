export declare class CreateBusinessInput {
    name: string;
    slug?: string;
    tagline?: string;
    description?: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    website?: string;
    address?: string;
    city?: string;
    country?: string;
}
export declare class UpdateBusinessInput {
    name?: string;
    tagline?: string;
    description?: string;
    email?: string;
    phone?: string;
    logo?: string;
    coverImage?: string;
}
export declare class UpdatePageConfigInput {
    businessId: string;
    theme: any;
}
//# sourceMappingURL=business.input.d.ts.map