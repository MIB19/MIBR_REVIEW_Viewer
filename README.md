<div align="center">
</div>

# MIBR Review Viewer

A responsive device preview application. View and test your web applications across multiple device sizes simultaneously with real-time preview and screenshot capture.

Available as both a web app and Electron desktop app (Electron version bypasses CORS/X-Frame-Options).

## ✨ Features

- **Multi-Device Preview**: View your website on multiple devices (mobile, tablet, desktop) simultaneously
- **Custom Device Configuration**: Add and customize your own device sizes
- **Screenshot Capture**: Take full-page screenshots of all device previews at once
- **Theme Support**: Multiple theme options (cyber, lab)
- **Responsive Controls**: Real-time URL updates and device size adjustments
- **Sync Scrolling**: Optional synchronized scrolling across all device frames
- **Electron Desktop App**: Bypass CORS/X-Frame-Options restrictions with webview integration

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

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

3. Run the development server:

   **Web mode:**

   ```bash
   npm run dev
   ```

   **Electron mode:**

   ```bash
   npm run electron-dev
   ```

4. Open your browser and navigate to the local development URL (typically `https://localhost:9899`)

## 📦 Build

**Web app:**

```bash
npm run build
npm run preview
```

**Electron app:**

```bash
npm run build
npm run electron
```

**Package Electron (portable + MSI):**

```bash
npm run package
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Styling
- **Electron** - Desktop app runtime
- **html2canvas** - Screenshot capture

## 📁 Project Structure

```
MIBR_REVIEW_Viewer/
├── components/
│   └── DeviceFrame.tsx     # Device preview frame component
├── App.tsx                 # Main application component
├── constants.ts            # Device configurations and constants
├── types.ts                # TypeScript type definitions
├── index.tsx               # Application entry point
├── index.html              # HTML template
├── index.css               # Custom CSS utilities
├── main.cjs                # Electron main process
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── tailwind.config.js      # Tailwind configuration
```

## 🎨 Usage

1. **Enter URL**: Type or paste the website URL you want to preview
2. **Select Devices**: Choose from preset devices or add custom ones
3. **Capture Screenshots**: Click the camera icon to capture all device previews
4. **Customize**: Adjust scale, theme, and device sizes as needed

## 📄 License

This project is available for personal and commercial use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please open an issue in the repository.

---

View original AI Studio app: https://ai.studio/apps/temp/1
