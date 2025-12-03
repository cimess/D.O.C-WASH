export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'Industrial' | 'Residential' | 'Specialized';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets?: {
            content: string;
        }[]
    }[]
  };
}

export interface QuoteRequest {
  sqFt: number;
  type: string;
  frequency: string;
}

export interface QuoteResponse {
  estimatedCost: number;
  estimatedTime: string;
  recommendedServices: string[];
  reasoning: string;
}
