import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  text: string;
  sources: GroundingChunk[];
}

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY is not set. Please provide the API key.");
      throw new Error("API_KEY environment variable not set.");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateContentWithSearch(prompt: string): Promise<SearchResult> {
    try {
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text;
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const sources: GroundingChunk[] = groundingMetadata?.groundingChunks || [];
      
      return { text, sources };

    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('জেমিনি এপিআই থেকে উত্তর পেতে সমস্যা হয়েছে।');
    }
  }
}
