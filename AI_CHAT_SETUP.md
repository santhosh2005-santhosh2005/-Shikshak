# AI Chat with PDF - Setup Instructions

## 🚀 Quick Start

### Step 1: Get Your Free Gemini API Key

1. Go to: https://aistudio.google.com/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Add API Key to Your Project

1. Create a `.env` file in the project root (same level as `package.json`)
2. Add the following:

```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI Providers API Keys
VITE_GEMINI_API_KEY=your-gemini-api-key
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_GROQ_API_KEY=your-groq-api-key
VITE_OPENROUTER_API_KEY=your-openrouter-api-key
VITE_OLLAMA_URL=http://localhost:11434
```

3. Replace `your-gemini-api-key-here` with your actual API key

### Step 3: Restart Your Development Server

```bash
npm run dev
```

### Step 4: Access AI Chat

1. Navigate to: http://localhost:8080/ai-chat
2. OR click "AI Chat" in the navbar
3. Upload a PDF file
4. Start asking questions!

---

## ✨ Features

- **PDF Upload**: Upload any PDF (max 10MB)
- **Auto Summary**: Automatically generates a summary when you upload
- **Smart Q&A**: Ask any question about the PDF content
- **Chat History**: Maintains conversation context
- **TTS Integration**: Click on any text to hear it spoken (when TTS is enabled)
- **Theme Support**: Works with both Calm and Neo-Brutalism themes

---

## 🎯 How to Use

1. **Upload PDF**: Click the upload area or drag & drop
2. **Wait for Summary**: AI will automatically summarize the document
3. **Ask Questions**: Type your question in the chat input
4. **Get Answers**: AI will respond based on the PDF content
5. **Continue Chating**: Ask follow-up questions - context is maintained

---

## 💡 Example Questions

---

## 🛠️ Multi-Provider Support

You can now switch between multiple AI models:
- **Gemini Pro**: (Default) Google's powerful multimodal model.
- **OpenAI**: Requires `VITE_OPENAI_API_KEY`.
- **Groq**: Ultra-fast inference. Requires `VITE_GROQ_API_KEY`.
- **OpenRouter**: Access any model. Requires `VITE_OPENROUTER_API_KEY`.
- **Ollama**: Run locally! Ensure Ollama is running and has the `llama3` model pulled (`ollama pull llama3`).

- "What is the main topic of this document?"
- "Summarize chapter 3"
- "What are the key points?"
- "Explain the conclusion"
- "What recommendations are made?"

---

## ⚠️ Important Notes

- **API Key Required**: You MUST add your Gemini API key to use this feature
- **Free Tier**: Gemini provides a generous free tier (60 requests/minute)
- **PDF Size**: Maximum 10MB per PDF
- **Text Limit**: Processes up to 15,000 characters of PDF text
- **Accuracy**: AI responses are based on extracted text - complex formatting may not be fully captured

---

## 🔧 Troubleshooting

### "Please add your Gemini API key" message
- Make sure you created the `.env` file
- Check that `VITE_GEMINI_API_KEY` is set correctly
- Restart your dev server after adding the key

### PDF upload fails
- Ensure the file is a valid PDF
- Check file size (must be under 10MB)
- Try a different PDF file

### AI responses are incorrect
- The PDF may have complex formatting
- Text extraction might miss some content
- Try asking more specific questions

---

## 📚 Tech Stack

- **PDF Processing**: PDF.js
- **AI Model**: Google Gemini Pro
- **UI**: React + Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion

---

## 🎉 Enjoy AI-Powered PDF Chat!

If you have any questions or issues, feel free to reach out!
