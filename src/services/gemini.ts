import { OPENROUTER_API_KEY as MANUAL_KEY } from '../config/env_manual';

const API_KEY = (MANUAL_KEY && !MANUAL_KEY.includes('PASTE')) ? MANUAL_KEY : '';
const API_URL = "https://openrouter.ai/api/v1/chat/completions";
// Using the specific model requested by user
const MODEL = "google/gemini-2.0-flash-001";

export const geminiService = {
    async chat(message: string, conversationHistory: any[] = []) {
        try {
            // Build messages array
            const messages = [
                {
                    role: "system",
                    content: `You are Naledi AI, a compassionate mental health assistant specializing in cognitive reframing and positive thinking. 
Your role is to help users reframe negative thoughts into positive ones, provide emotional support, and guide them toward mental wellness.

Guidelines:
- Be empathetic, warm, and supportive
- Help users identify and challenge negative thought patterns
- Suggest practical cognitive reframing techniques
- Encourage self-compassion and growth mindset
- Keep responses extremely concise (maximum 50 words, 2-3 sentences)
- If user expresses crisis thoughts, gently suggest professional help with contact details.`
                }
            ];

            // Add conversation history
            if (conversationHistory.length > 0) {
                // Take last 5 messages for context
                conversationHistory.slice(-5).forEach((msg: any) => {
                    // Start of history might be different format, ensure role is mapped
                    // Supabase 'assistant' -> OpenRouter 'assistant'
                    messages.push({
                        role: msg.role === 'user' ? 'user' : 'assistant',
                        content: msg.content || ''
                    });
                });
            }

            // Add current message
            messages.push({ role: "user", content: message });

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "HTTP-Referer": "https://naledi.ai",
                    "X-Title": "Naledi AI",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": MODEL,
                    "messages": messages
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('OpenRouter API Error:', errorData);
                throw new Error(`OpenRouter API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.choices && data.choices[0] && data.choices[0].message) {
                return data.choices[0].message.content;
            }

            throw new Error('No response from OpenRouter AI');

        } catch (error: any) {
            console.error('AI Service Error:', error);

            // Helpful error handling
            if (error.message?.includes('429')) {
                return "I'm currently receiving too many requests. Please try again in a moment.";
            }

            // Fallback response
            return "I'm here to support you. Could you tell me more about what you're experiencing? I want to help you reframe your thoughts in a more positive way.";
        }
    }
};
