import { GoogleGenerativeAI } from '@google/generative-ai';

// Types
export type AIProvider = 'gemini' | 'openai' | 'groq' | 'openrouter' | 'ollama';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// API Keys & URLs from env
const API_KEYS = {
  gemini: import.meta.env.VITE_GEMINI_API_KEY || '',
  openai: import.meta.env.VITE_OPENAI_API_KEY || '',
  groq: import.meta.env.VITE_GROQ_API_KEY || '',
  openrouter: import.meta.env.VITE_OPENROUTER_API_KEY || '',
  ollama: import.meta.env.VITE_OLLAMA_URL || 'http://localhost:11434',
};

// Helper to check if a key is a placeholder
const isPlaceholder = (key: string) => !key || key.includes('your-') || key.includes('api-key');

// Initialize Gemini
const genAI = API_KEYS.gemini && !isPlaceholder(API_KEYS.gemini) ? new GoogleGenerativeAI(API_KEYS.gemini) : null;

/**
 * Generic function for OpenAI-compatible APIs
 */
const callOpenAICompatibleAPI = async (
  provider: AIProvider,
  messages: any[],
  systemPrompt: string
): Promise<string> => {
  let url = '';
  let key = '';
  let model = '';

  switch (provider) {
    case 'openai':
      url = 'https://api.openai.com/v1/chat/completions';
      key = API_KEYS.openai;
      model = 'gpt-3.5-turbo';
      break;
    case 'groq':
      url = 'https://api.groq.com/openai/v1/chat/completions';
      key = API_KEYS.groq;
      model = 'llama-3.3-70b-versatile';
      break;
    case 'openrouter':
      url = 'https://openrouter.ai/api/v1/chat/completions';
      key = API_KEYS.openrouter;
      model = 'meta-llama/llama-3.1-8b-instruct:free'; // Free tier model
      break;
    case 'ollama':
      url = `${API_KEYS.ollama}/api/chat`;
      model = 'llama3';
      break;
  }

  if (provider !== 'ollama' && (!key || isPlaceholder(key))) {
    throw new Error(`Missing or invalid API key for ${provider}. Please update your .env file.`);
  }

  const payload = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    stream: false,
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (key) {
    headers['Authorization'] = `Bearer ${key}`;
  }

  // OpenRouter requires extra headers
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = window.location.origin;
    headers['X-Title'] = 'Shikshak';
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API Error: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (provider === 'ollama') {
    return data.message.content;
  }
  
  return data.choices[0].message.content;
};

/**
 * Send a message to AI with PDF context
 */
export const chatWithPDF = async (
  message: string,
  pdfText: string,
  chatHistory: ChatMessage[] = [],
  provider: AIProvider = 'gemini'
): Promise<string> => {
  try {
    const systemPrompt = pdfText 
      ? `You are an AI assistant helping users understand their PDF documents. 

PDF CONTENT:
${pdfText.substring(0, 15000)} 

INSTRUCTIONS:
- Answer questions based on the PDF content provided above
- If the answer is not in the PDF, say so clearly
- Provide clear, concise, and helpful responses
- Use formatting (bullet points, numbered lists) when appropriate
- Stay focused on the PDF content`
      : `You are a helpful and knowledgeable AI assistant called Shikshak. You can help with math, science, coding, and general questions. 
         Provide clear, concise, and accurate answers. Use Markdown for formatting and math equations where appropriate.`;

    if (provider === 'gemini') {
      if (!genAI) {
        return `⚠️ Gemini API key is missing or invalid. Please add your VITE_GEMINI_API_KEY to the .env file.
        
You can get a free key at: https://aistudio.google.com/apikey
        
Alternatively, switch to another provider like Groq if you have that configured.`;
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      // Gemini requires the first message in history to be from 'user'.
      // If our history starts with an assistant summary, we skip it for the API call.
      const validHistory = chatHistory[0]?.role === 'assistant' ? chatHistory.slice(1) : chatHistory;

      const historyMessages = validHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const chat = model.startChat({
        history: historyMessages,
      });

      const result = await chat.sendMessage(`${systemPrompt}\n\nUSER QUESTION: ${message}`);
      const response = await result.response;
      return response.text();
    } else {
      const messages = [
        ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: message }
      ];
      return await callOpenAICompatibleAPI(provider, messages, systemPrompt);
    }
  } catch (error: any) {
    console.error(`Error with ${provider}:`, error);
    return `❌ Error: ${error.message || 'Something went wrong.'}`;
  }
};

/**
 * Generate a summary of the PDF
 */
export const summarizePDF = async (
  pdfText: string,
  provider: AIProvider = 'gemini'
): Promise<string> => {
  const prompt = `Please provide a comprehensive summary of the following document:

${pdfText.substring(0, 15000)}

Please include:
1. Main topic/theme
2. Key points
3. Important details
4. Conclusion (if applicable)`;

  try {
    if (provider === 'gemini') {
      if (!genAI) return '⚠️ Gemini API key missing or invalid. Please check your .env file or switch to another provider (like Groq) before uploading.';
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } else {
      return await callOpenAICompatibleAPI(provider, [{ role: 'user', content: prompt }], 'You are a helpful assistant that summarizes documents.');
    }
  } catch (error: any) {
    console.error(`Error summarizing with ${provider}:`, error);
    return `❌ Summary Error: ${error.message}`;
  }
};
