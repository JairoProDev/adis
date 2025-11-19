import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RAGService } from './services/rag.service';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqChatResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private readonly apiKey: string;
  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly model = 'llama-3.1-70b-versatile'; // Fast and powerful

  constructor(
    private configService: ConfigService,
    private ragService: RAGService,
  ) {
    this.apiKey = this.configService.get<string>('GROQ_API_KEY') || '';
  }

  /**
   * Chat with ADIS AI using RAG context
   */
  async chat(
    businessId: string,
    userMessage: string,
    conversationHistory: ChatMessage[] = [],
  ): Promise<string> {
    try {
      // 1. Search knowledge base for relevant context
      const searchResults = await this.ragService.searchKnowledgeBase(
        businessId,
        userMessage,
        5,
      );

      // 2. Build context from search results
      const context = this.ragService.buildContext(searchResults);

      // 3. Build system prompt
      const systemPrompt = this.buildSystemPrompt(businessId, context);

      // 4. Prepare messages for Groq
      const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-10), // Last 10 messages for context
        { role: 'user', content: userMessage },
      ];

      // 5. Call Groq API
      const response = await this.callGroqAPI(messages);

      this.logger.log(
        `ADIS AI responded for business ${businessId} - Tokens: ${response.usage.total_tokens}`,
      );

      return response.choices[0].message.content;
    } catch (error) {
      this.logger.error(`Error in ADIS AI chat: ${error.message}`, error.stack);
      return 'Lo siento, estoy experimentando dificultades técnicas. Por favor, intenta nuevamente en unos momentos.';
    }
  }

  /**
   * Generate business description using AI
   */
  async generateBusinessDescription(
    businessName: string,
    category: string,
    keywords?: string[],
  ): Promise<string> {
    const prompt = `Genera una descripción profesional y atractiva para un negocio llamado "${businessName}" en la categoría "${category}".
    ${keywords ? `Palabras clave: ${keywords.join(', ')}` : ''}

    La descripción debe:
    - Ser concisa (máximo 150 palabras)
    - Destacar los beneficios principales
    - Usar un tono profesional y amigable
    - Incluir un llamado a la acción sutil
    - Estar en español`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content:
          'Eres un experto en marketing digital y redacción de contenido para negocios.',
      },
      { role: 'user', content: prompt },
    ];

    const response = await this.callGroqAPI(messages);
    return response.choices[0].message.content;
  }

  /**
   * Generate listing description using AI
   */
  async generateListingDescription(
    title: string,
    category: string,
    price?: number,
    features?: string[],
  ): Promise<string> {
    const prompt = `Genera una descripción atractiva para un anuncio clasificado:
    Título: "${title}"
    Categoría: "${category}"
    ${price ? `Precio: $${price}` : ''}
    ${features ? `Características: ${features.join(', ')}` : ''}

    La descripción debe:
    - Ser persuasiva y detallada (100-200 palabras)
    - Destacar los beneficios y características únicas
    - Incluir un llamado a la acción
    - Usar un tono conversacional
    - Estar en español`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content:
          'Eres un experto en copywriting para anuncios clasificados y e-commerce.',
      },
      { role: 'user', content: prompt },
    ];

    const response = await this.callGroqAPI(messages);
    return response.choices[0].message.content;
  }

  /**
   * Suggest knowledge base entries from business data
   */
  async suggestKnowledgeBase(
    businessName: string,
    description: string,
    category: string,
  ): Promise<Array<{ question: string; answer: string; category: string }>> {
    const prompt = `Basándote en esta información de negocio, sugiere 5 preguntas frecuentes (FAQ) con sus respuestas:

    Negocio: "${businessName}"
    Descripción: "${description}"
    Categoría: "${category}"

    Genera preguntas que los clientes comúnmente harían sobre este tipo de negocio.
    Devuelve SOLO un array JSON en este formato exacto:
    [
      {"question": "pregunta 1", "answer": "respuesta 1", "category": "categoria"},
      {"question": "pregunta 2", "answer": "respuesta 2", "category": "categoria"}
    ]`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content:
          'Eres un experto en atención al cliente y FAQs. Responde SOLO con JSON válido, sin texto adicional.',
      },
      { role: 'user', content: prompt },
    ];

    const response = await this.callGroqAPI(messages, 0.7); // Lower temperature for structured output

    try {
      // Extract JSON from response
      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      this.logger.error(`Error parsing KB suggestions: ${error.message}`);
      return [];
    }
  }

  /**
   * Build system prompt with RAG context
   */
  private buildSystemPrompt(businessId: string, context: string): string {
    return `Eres ADIS AI, un asistente virtual inteligente para negocios en la plataforma Publicadis.

Tu rol es ayudar a los visitantes del negocio respondiendo preguntas sobre:
- Información del negocio (horarios, ubicación, contacto)
- Productos y servicios
- Precios y promociones
- Proceso de compra o contratación
- Políticas y términos

IMPORTANTE:
- Usa SIEMPRE la información de la base de conocimientos cuando esté disponible
- Si no tienes información en la base de conocimientos, sé honesto y sugiere contactar directamente al negocio
- Sé amigable, profesional y conciso
- Responde en español
- Si te piden información de contacto, proporciona los datos que tengas en la base de conocimientos

${context}

Recuerda: Tu objetivo es ayudar a los visitantes a obtener la información que necesitan de manera rápida y precisa.`;
  }

  /**
   * Call Groq API
   */
  private async callGroqAPI(
    messages: ChatMessage[],
    temperature: number = 0.8,
  ): Promise<GroqChatResponse> {
    if (!this.apiKey) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  /**
   * Validate API key
   */
  async validateApiKey(): Promise<boolean> {
    try {
      const messages: ChatMessage[] = [
        { role: 'user', content: 'Test' },
      ];
      await this.callGroqAPI(messages);
      return true;
    } catch (error) {
      this.logger.error(`Groq API key validation failed: ${error.message}`);
      return false;
    }
  }
}
