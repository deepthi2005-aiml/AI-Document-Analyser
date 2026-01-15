
export interface AnalysisResult {
  summary: string;
  topics: string[];
  entities: {
    people: string[];
    organizations: string[];
    dates: string[];
    locations: string[];
  };
  tone: string;
  action_items: string[];
  sentiment_score: number; // 0-100
}

export interface DocumentMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  wordCount: number;
  charCount: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface DocSession {
  id: string;
  metadata: DocumentMetadata;
  content: string;
  analysis?: AnalysisResult;
  history: ChatMessage[];
}

export enum TabType {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  PREVIEW = 'PREVIEW',
  HISTORY = 'HISTORY'
}
