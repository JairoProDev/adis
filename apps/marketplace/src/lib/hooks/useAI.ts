'use client';

import { useMutation, useQuery } from '@apollo/client';
import {
  AI_CHAT,
  AI_GENERATE_BUSINESS_DESCRIPTION,
  AI_GENERATE_LISTING_DESCRIPTION,
  AI_ADD_KNOWLEDGE_BASE,
  AI_SEARCH_KNOWLEDGE_BASE,
  AI_AUTO_GENERATE_KNOWLEDGE_BASE,
  AI_SUGGEST_KNOWLEDGE_BASE,
} from '../apollo/queries';

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatOptions {
  businessId: string;
  message: string;
  conversationHistory?: ConversationMessage[];
}

interface GenerateDescriptionOptions {
  businessName: string;
  category: string;
  keywords?: string[];
}

interface GenerateListingDescriptionOptions {
  title: string;
  category: string;
  price?: number;
  features?: string[];
}

interface AddKnowledgeBaseOptions {
  businessId: string;
  question: string;
  answer: string;
  category?: string;
}

interface SearchKnowledgeBaseOptions {
  businessId: string;
  query: string;
  limit?: number;
}

interface SuggestKBOptions {
  businessName: string;
  description: string;
  category: string;
}

export function useAI() {
  // Chat mutation
  const [chatMutation, { loading: chatLoading }] = useMutation(AI_CHAT);

  const chat = async (options: ChatOptions): Promise<string> => {
    const { data } = await chatMutation({
      variables: {
        input: {
          businessId: options.businessId,
          message: options.message,
          conversationHistory: options.conversationHistory || [],
        },
      },
    });
    return data?.aiChat || '';
  };

  // Generate business description
  const [generateBusinessDescMutation, { loading: generateBusinessLoading }] = useMutation(
    AI_GENERATE_BUSINESS_DESCRIPTION,
  );

  const generateBusinessDescription = async (
    options: GenerateDescriptionOptions,
  ): Promise<string> => {
    const { data } = await generateBusinessDescMutation({
      variables: {
        input: {
          businessName: options.businessName,
          category: options.category,
          keywords: options.keywords,
        },
      },
    });
    return data?.aiGenerateBusinessDescription || '';
  };

  // Generate listing description
  const [generateListingDescMutation, { loading: generateListingLoading }] = useMutation(
    AI_GENERATE_LISTING_DESCRIPTION,
  );

  const generateListingDescription = async (
    options: GenerateListingDescriptionOptions,
  ): Promise<string> => {
    const { data } = await generateListingDescMutation({
      variables: {
        input: {
          title: options.title,
          category: options.category,
          price: options.price,
          features: options.features,
        },
      },
    });
    return data?.aiGenerateListingDescription || '';
  };

  // Add knowledge base entry
  const [addKBMutation, { loading: addKBLoading }] = useMutation(AI_ADD_KNOWLEDGE_BASE);

  const addKnowledgeBase = async (options: AddKnowledgeBaseOptions): Promise<boolean> => {
    const { data } = await addKBMutation({
      variables: {
        input: {
          businessId: options.businessId,
          question: options.question,
          answer: options.answer,
          category: options.category,
        },
      },
    });
    return data?.aiAddKnowledgeBase || false;
  };

  // Auto-generate knowledge base
  const [autoGenerateKBMutation, { loading: autoGenerateLoading }] = useMutation(
    AI_AUTO_GENERATE_KNOWLEDGE_BASE,
  );

  const autoGenerateKnowledgeBase = async (businessId: string): Promise<number> => {
    const { data } = await autoGenerateKBMutation({
      variables: {
        input: { businessId },
      },
    });
    return data?.aiAutoGenerateKnowledgeBase || 0;
  };

  // Suggest knowledge base entries
  const [suggestKBMutation, { loading: suggestKBLoading }] = useMutation(
    AI_SUGGEST_KNOWLEDGE_BASE,
  );

  const suggestKnowledgeBase = async (
    options: SuggestKBOptions,
  ): Promise<Array<{ question: string; answer: string; category: string }>> => {
    const { data } = await suggestKBMutation({
      variables: {
        input: {
          businessName: options.businessName,
          description: options.description,
          category: options.category,
        },
      },
    });
    return data?.aiSuggestKnowledgeBase || [];
  };

  // Search knowledge base query hook
  const useSearchKnowledgeBase = (options?: SearchKnowledgeBaseOptions) => {
    return useQuery(AI_SEARCH_KNOWLEDGE_BASE, {
      variables: {
        input: {
          businessId: options?.businessId || '',
          query: options?.query || '',
          limit: options?.limit || 5,
        },
      },
      skip: !options?.businessId || !options?.query,
    });
  };

  return {
    chat,
    chatLoading,
    generateBusinessDescription,
    generateBusinessLoading,
    generateListingDescription,
    generateListingLoading,
    addKnowledgeBase,
    addKBLoading,
    autoGenerateKnowledgeBase,
    autoGenerateLoading,
    suggestKnowledgeBase,
    suggestKBLoading,
    useSearchKnowledgeBase,
  };
}
