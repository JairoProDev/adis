export declare class CreateListingInput {
    title: string;
    description: string;
    categoryId: string;
    businessId?: string;
    slug?: string;
    price?: number;
    priceType?: string;
    currency?: string;
    city?: string;
    country?: string;
    metadata?: any;
}
export declare class UpdateListingInput {
    title?: string;
    description?: string;
    price?: number;
    status?: string;
    metadata?: any;
}
export declare class ListingFilters {
    categoryId?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    query?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    skip?: number;
    take?: number;
}
//# sourceMappingURL=listing.input.d.ts.map