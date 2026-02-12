import { CategoriesService } from './categories.service';
export declare class CategoriesResolver {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<({
        fields: {
            id: string;
            name: string;
            categoryId: string;
            type: import(".prisma/client").$Enums.FieldType;
            order: number;
            label: string;
            required: boolean;
            options: string[];
            placeholder: string | null;
            helpText: string | null;
        }[];
        _count: {
            listings: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        order: number;
        icon: string | null;
        parentId: string | null;
        active: boolean;
        fieldsSchema: import("@prisma/client/runtime/library").JsonValue | null;
    })[]>;
    findOne(slug: string): Promise<({
        fields: {
            id: string;
            name: string;
            categoryId: string;
            type: import(".prisma/client").$Enums.FieldType;
            order: number;
            label: string;
            required: boolean;
            options: string[];
            placeholder: string | null;
            helpText: string | null;
        }[];
        children: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            slug: string;
            description: string | null;
            order: number;
            icon: string | null;
            parentId: string | null;
            active: boolean;
            fieldsSchema: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        slug: string;
        description: string | null;
        order: number;
        icon: string | null;
        parentId: string | null;
        active: boolean;
        fieldsSchema: import("@prisma/client/runtime/library").JsonValue | null;
    }) | null>;
}
//# sourceMappingURL=categories.resolver.d.ts.map