export declare class ConversationMessageInput {
    role: string;
    content: string;
}
export declare class ChatInput {
    businessId: string;
    message: string;
    conversationHistory?: ConversationMessageInput[];
}
export declare class GenerateDescriptionInput {
    businessName: string;
    category: string;
    keywords?: string[];
}
export declare class GenerateListingDescriptionInput {
    title: string;
    category: string;
    price?: number;
    features?: string[];
}
export declare class AddKnowledgeBaseInput {
    businessId: string;
    question: string;
    answer: string;
    category?: string;
}
export declare class SearchKnowledgeBaseInput {
    businessId: string;
    query: string;
    limit?: number;
}
export declare class AutoGenerateKBInput {
    businessId: string;
}
export declare class SuggestKBInput {
    businessName: string;
    description: string;
    category: string;
}
export declare class SearchResult {
    id: string;
    question: string;
    answer: string;
    score: number;
}
export declare class KnowledgeBaseSuggestion {
    question: string;
    answer: string;
    category: string;
}
//# sourceMappingURL=ai.input.d.ts.map