import { message } from 'antd';

export const checkGeminiApiKey = (): boolean => {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!geminiApiKey) {
    message.error('AI services are not available. Please configure your Gemini API key in the .env file.');
    return false;
  }
  return true;
};

export const getGeminiApiKey = (): string | null => {
  return import.meta.env.VITE_GEMINI_API_KEY || null;
};