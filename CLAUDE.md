# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MIBR Review Viewer is a responsive device preview tool that displays websites in multiple device frames (desktop, tablet, mobile) simultaneously. It runs as both a web app and an Electron desktop app, with the Electron version bypassing CORS/X-Frame-Options to allow iframe loading of any website.

## Commands

```bash
# Development (web only) - serves on https://localhost:9898
npm run dev

# Development (Electron + Vite) - starts Vite then launches Electron
npm run electron-dev

# Production build (Vite only)
npm run build

# Run Electron with production build (loads dist/index.html)
npm run electron

# Package Electron app (portable + NSIS installer, Windows x64)
npm run package

# Build specific targets
npm run build:portable    # Windows portable .exe
npm run build:installer   # Windows NSIS installer
```

The Vite dev server runs on port 9898 with HTTPS (self-signed via `@vitejs/plugin-basic-ssl`).

## Architecture

### Flat Source Layout

Source files live at project root, not in `src/`. The `@` import alias resolves to project root.

### Dual Runtime Model
- **Web mode**: Standard React app served by Vite, uses iframes (subject to CORS/X-Frame-Options)
- **Electron mode**: `main.cjs` creates a BrowserWindow loading the Vite dev server (dev) or `dist/index.html` (prod), uses `<webview>` tags with security bypasses

### Electron Detection

Both `App.tsx` and `DeviceFrame.tsx` detect Electron at module load. `DeviceFrame.tsx` uses a more reliable check: creates a `<webview>` element and checks if its constructor is `HTMLUnknownElement`. Based on this, it renders either `<webview>` (Electron) or `<iframe>` (web).

### Electron Main Process (`main.cjs` vs `main.js`)

Two nearly identical Electron entry files exist. `package.json` `"main"` points to `main.cjs`. The `.cjs` version has additional certificate bypass logic (`ignore-certificate-errors` switch, `NODE_TLS_REJECT_UNAUTHORIZED=0`). Both strip `X-Frame-Options`, `Content-Security-Policy`, and `x-content-type-options` response headers and spoof browser-like request headers.

### Session Sharing

All Electron webviews use `partition: "persist:shared"` so login sessions are shared across all device frames — login once, all devices sync.

### AI Chat (Disabled)

`components/AIChat.tsx` and `services/geminiService.ts` exist but are commented out in both the service implementation and the UI render in `App.tsx`. Uses `@google/genai` SDK with `VITE_GEMINI_API_KEY` env var.

## Styling

Tailwind CSS v4 via `@tailwindcss/postcss` plugin (not classic config-based). The `tailwind.config.js` extends with custom glass colors, shadows, and animations but Tailwind v4 primarily uses CSS-based config via `@import "tailwindcss"` in `index.css`.

Two themes controlled by `ThemeType` state in `App.tsx`:
- `cyber` — Dark red/black (default)
- `lab` — Light blue/white

Theme switching is done inline via conditional class strings in both `App.tsx` (via `themeStyles` object) and `DeviceFrame.tsx` (via `styles` object). No CSS variables or theme provider — all theme logic is ternary-based on `isCyber` boolean.

Custom CSS utilities in `index.css`: `.glass`, `.glass-dark`, `.glass-card` (glassmorphism), `.cyber-grid`, `.lab-grid` (backgrounds), `.glow-red-*`, `.text-glow-red` (glow effects), `.animate-blob`, `.animate-pulse-glow` (animations).

## Key Patterns

- All state lives in `App.tsx` (URL, devices, scale, theme, scroll sync). No state management library.
- Device configs are mutable at runtime — users can add custom devices and resize non-mobile devices inline.
- Screenshot uses `html2canvas` but hides webviews/iframes (they render as blank), so captures only the frame chrome. The UI suggests `Win+Shift+S` for full captures.
- Mobile devices get a phone-style frame with notch/dynamic island; desktop/tablet get minimal border with corner bracket accents.

## Environment Variables

- `VITE_GEMINI_API_KEY` — Google Gemini API key (for AI chat feature, currently disabled)
