<div align="center">

# 🎙️ AI Interview Platform

**A Next-Generation AI-Powered Mock Interview Simulator**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-007ACC?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vapi AI](https://img.shields.io/badge/Vapi_Voice_AI-Agents-5dfeca?style=for-the-badge)](https://vapi.ai/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<br />

<!-- 🚀 SPACE FOR HERO SCREENSHOT / GIF -->
<img src="https://via.placeholder.com/1200x600/171532/cac5fe?text=Awesome+Hero+Screenshot+Here" alt="AI Interview Platform Hero Image" style="border-radius: 12px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);" />

<br />
<br />

[View Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ✨ Overview

The **AI Interview Platform** is a state-of-the-art mock interview application designed to simulate real-world job interviews using highly advanced conversational AI. Prepare for your dream job with customized, role-specific technical and behavioral interviews conducted entirely by an intelligent voice agent.

This platform completely overhauls traditional interview prep by providing an immersive voice-first experience, instant granular feedback, and actionable insights to help you land the perfect role.

---

## 🚀 Key Features

*   **🗣️ Real-time Voice AI:** Experience fluid, two-way conversational interviews powered by **Vapi AI**.
*   **🎯 Role-Specific Customization:** Generate custom mock interviews based on the exact job role, experience level, and tech stack.
*   **🧠 Intelligent Assessment:** Detailed, category-by-category feedback on communication skills, technical knowledge, problem-solving, and culture fit.
*   **📊 Comprehensive Dashboards:** Track your past interviews, review transcripts, and monitor your overall progress and scores.
*   **💅 Premium User Interface:** Sleek, modern, and highly responsive dark-mode design with smooth animations and intuitive controls.

<!-- 🚀 SPACE FOR FEATURES SCREENSHOTS -->
<div align="center">
    <img src="https://via.placeholder.com/800x450/24273a/d6e0ff?text=Dashboard+Screenshot" alt="Dashboard View" style="border-radius: 8px; margin-bottom: 20px;" width="80%" />
    <br/>
    <img src="https://via.placeholder.com/800x450/24273a/d6e0ff?text=Interview+Session+Screenshot" alt="Active Interview Session View" style="border-radius: 8px; margin-bottom: 20px;" width="80%" />
    <br/>
    <img src="https://via.placeholder.com/800x450/24273a/d6e0ff?text=Feedback+Analysis+Screenshot" alt="Detailed Feedback Analysis" style="border-radius: 8px; margin-bottom: 20px;" width="80%" />
</div>

---

## 🛠️ Technology Stack

| Category | Technologies |
| :--- | :--- |
| **Frontend Framework** | Next.js (App Router), React 19 |
| **Styling & UI** | Tailwind CSS v4, shadcn/ui, Radix UI |
| **Language** | TypeScript |
| **AI Integration** | Vapi (Voice Agent), Google Gemini (Question/Feedback parsing) |
| **Validation & State** | Zod, React Hook Form |
| **Database & Auth** | *(Mocked for local development / Bring your own backend)* |

---

## ⚙️ Quick Start

Follow these simple steps to run the AI Interview Platform locally:

### 1. Clone the Repository

```bash
git clone https://github.com/RachakondaGagan/AI-Interview-Platform.git
cd AI-Interview-Platform
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory and add your keys:

```env
# Vapi AI Keys
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_public_key
NEXT_PUBLIC_VAPI_WORKFLOW_ID=your_vapi_assistant_id

# Google Gemini API Keys (For Assessment Generation)
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# App URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to experience the platform.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/RachakondaGagan">Gagan Rachakonda</a></p>
</div>
