import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Send a message to Gemini AI with PDF context
 * @param message - User's question
 * @param pdfText - Extracted PDF text content
 * @param chatHistory - Previous chat messages
 * @returns Promise<string> - AI response
 */
export const chatWithPDF = async (
  message: string,
  pdfText: string,
  chatHistory: ChatMessage[] = []
): Promise<string> => {
  try {
    if (!API_KEY) {
      return '⚠️ Please add your Gemini API key to the .env file as VITE_GEMINI_API_KEY. You can get one free at: https://aistudio.google.com/apikey';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Build conversation history
    const historyMessages = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Create system prompt with PDF context
    const systemPrompt = `You are an AI assistant helping users understand their PDF documents. 

PDF CONTENT:
${pdfText.substring(0, 15000)} 

INSTRUCTIONS:
- Answer questions based on the PDF content provided above
- If the answer is not in the PDF, say so clearly
- Provide clear, concise, and helpful responses
- Use formatting (bullet points, numbered lists) when appropriate
- If asked to summarize, provide a comprehensive overview
- Stay focused on the PDF content
- If the PDF content is cut off due to length, mention this limitation`;

    // Start chat with history
    const chat = model.startChat({
      history: historyMessages.length > 0 ? historyMessages : [],
    });

    // Send message with system context
    const result = await chat.sendMessage(`${systemPrompt}\n\nUSER QUESTION: ${message}`);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error: any) {
    console.error('Error chatting with AI:', error);
    
    if (error.message?.includes('API_KEY')) {
      return '⚠️ Invalid API key. Please check your Gemini API key configuration.';
    }
    
    return '❌ Sorry, I encountered an error. Please try again.';
  }
};

/**
 * Generate a summary of the PDF
 * @param pdfText - Extracted PDF text
 * @returns Promise<string> - PDF summary
 */
export const summarizePDF = async (pdfText: string): Promise<string> => {
  try {
    if (!API_KEY) {
      return '⚠️ Please add your Gemini API key to use this feature.';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Please provide a comprehensive summary of the following document:

${pdfText.substring(0, 15000)}

Please include:
1. Main topic/theme
2. Key points
3. Important details
4. Conclusion (if applicable)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error summarizing PDF:', error);
    return '❌ Failed to generate summary. Please try again.';
  }
};
