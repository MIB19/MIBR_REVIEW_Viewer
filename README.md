<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MIBR Review Viewer

A responsive device preview application with AI-powered chat assistance. View and test your web applications across multiple device sizes simultaneously with real-time preview, screenshot capture, and integrated AI analysis powered by Google Gemini.

## ✨ Features

- **Multi-Device Preview**: View your website on multiple devices (mobile, tablet, desktop) simultaneously
- **Custom Device Configuration**: Add and customize your own device sizes
- **AI Chat Assistant**: Integrated Gemini AI to analyze screenshots and answer questions
- **Screenshot Capture**: Take full-page screenshots of all device previews at once
- **Theme Support**: Multiple theme options (cyber, minimal, ocean, sunset)
- **Responsive Controls**: Real-time URL updates and device size adjustments
- **Sync Scrolling**: Optional synchronized scrolling across all device frames

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd MIBR_REVIEW_Viewer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create or edit the `.env.local` file in the root directory
   - Add your Gemini API key:
     ```
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

## 📦 Build

To build the application for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Google Gemini AI** - AI chat assistant
- **html2canvas** - Screenshot capture
- **CSS Modules** - Styling

## 📁 Project Structure

```
MIBR_REVIEW_Viewer/
├── components/
│   ├── AIChat.tsx          # AI chat component
│   └── DeviceFrame.tsx     # Device preview frame component
├── services/
│   └── geminiService.ts    # Gemini AI service integration
├── App.tsx                 # Main application component
├── constants.ts            # Device configurations and constants
├── types.ts                # TypeScript type definitions
├── index.tsx               # Application entry point
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 🎨 Usage

1. **Enter URL**: Type or paste the website URL you want to preview
2. **Select Devices**: Choose from preset devices or add custom ones
3. **Capture Screenshots**: Click the camera icon to capture all device previews
4. **AI Analysis**: Open the chat panel and ask questions about your screenshots
5. **Customize**: Adjust scale, theme, and device sizes as needed

## 🔑 Environment Variables

| Variable              | Description                | Required |
| --------------------- | -------------------------- | -------- |
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key | Yes      |

## 📄 License

This project is available for personal and commercial use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please open an issue in the repository.
