# Naledi AI: Your Mental Health Companion

> **Note:** Please visit [tlhalefang](https://github.com/tlhalefang) GitHub, that's my main GitHub account currently logged out of. This one that I'm using is a temporary one for this submission.

**Built for the Gemini 3 Hackathon**

Naledi (meaning "Star" in Setswana) is an AI-powered mental health companion designed to make cognitive behavioral therapy (CBT) techniques accessible to everyone. By leveraging the advanced reasoning capabilities of **Google's Gemini 3 API**, Naledi provides personalized, empathetic, and actionable guidance to help users reframe negative thoughts and build mental resilience.

## 🌟 Key Features

*   **AI Cognitive Reframing Chat**: A safe space to vent where the AI actively helps you challenge negative self-talk using CBT principles.
*   **Daily Mood Check-ins**: Track your emotional well-being over time with simple, intuitive check-ups.
*   **Wisdom Library**: Structured lessons on mental resilience, positive anchoring, and gratitude, complete with interactive quizzes.
*   **Affirmations**: Daily doses of positivity to start your day right.
*   **Crisis Support**: Immediate access to emergency resources when needed.
*   **Privacy First**: Built with Supabase Row Level Security (RLS) to ensure your private thoughts stay private.

## 🚀 Tech Stack

*   **AI Engine**: Google Gemini 3 (via OpenRouter/Google AI Studio)
*   **Frontend**: React Native (Expo)
*   **Backend**: Supabase (PostgreSQL, Auth, RLS)
*   **Language**: TypeScript

## 📸 Screenshots



## 🛠️ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/naledi-ai.git
    cd naledi-ai
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory and add your keys:
    ```env
    EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    EXPO_PUBLIC_OPENROUTER_API_KEY=your_gemini_api_key
    ```
    *Note: Ensure your API key has access to Gemini 2.0/3.0 models.*

4.  **Run the app**
    ```bash
    npx expo start
    ```

## 🧠 Why Gemini?

We chose **Gemini 3** for its exceptional reasoning capabilities and long context window. In a mental health context, remembering previous parts of a conversation and understanding nuances is critical. Gemini's ability to "reason" allows Naledi to not just reply, but to *guide* the user effectively through cognitive reframing exercises without sounding robotic.

## 🛑 Proprietary & Legal Notice

**© 2026 DevGen Botswana. All Rights Reserved.**

This project is **PROPRIETARY** and was built exclusively for the Gemini 3 Hackathon. 

*   **PRIVATE USE ONLY**: This repository is for submission review purposes only. 
*   **NO CLONING/COPYING**: Cloning this repository for personal, commercial, or educational use is strictly prohibited. 
*   **NO DERIVATIVE WORKS**: You are not allowed to copy, modify, or redistribute any part of this codebase, design, or logic.
*   **OWNERSHIP**: All intellectual property rights belong to [DevGen Botswana](https://devgenbotswana.co.bw). 

**CAUTION**: Unauthorized use, copying, or redistribution of this project will result in legal action. 

---
*Built with ❤️ by [DevGen Botswana](https://devgenbotswana.co.bw)*
