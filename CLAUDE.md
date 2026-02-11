# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MIBR Review Viewer is a responsive device preview tool that displays websites in multiple device frames (desktop, tablet, mobile) simultaneously. It runs as both a web app and an Electron desktop app, with the Electron version bypassing CORS/X-Frame-Options to allow iframe loading of any website.

## Commands

```bash
# Development (web only) - serves on https://localhost:9899
npm run dev

# Development (Electron + Vite) - starts Vite then launches Electron
npm run electron-dev

# Production build (Vite only)
npm run build

# Preview production build
npm run preview

# Run Electron with production build (loads dist/index.html)
npm run electron

# Package Electron app (all Windows targets: portable + NSIS + MSI)
npm run package

# Build specific targets
npm run build:portable    # Windows portable .exe
npm run build:installer   # Windows NSIS installer
npm run build:msi         # Windows MSI installer
npm run build:win         # All Windows targets
npm run build:mac         # macOS DMG
npm run build:electron    # Vite build + electron-builder (all platforms)
```

**No test or lint scripts are configured.** The Vite dev server runs on port 9899 with HTTPS (self-signed via `@vitejs/plugin-basic-ssl`).

### Build Output

- `dist/` — Vite production build (web assets)
- `release/` — Electron packaged executables (portable, installer, MSI)

## Architecture

### Flat Source Layout

Source files live at project root, not in `src/`. The `@` import alias resolves to project root (`vite.config.ts`).

### Dual Runtime Model
- **Web mode**: Standard React app served by Vite, uses `<iframe>` (subject to CORS/X-Frame-Options)
- **Electron mode**: `main.cjs` creates a BrowserWindow loading the Vite dev server (dev) or `dist/index.html` (prod), renders `<webview>` tags with security bypasses

### Electron Detection

Both `App.tsx` and `DeviceFrame.tsx` detect Electron at module load time. `DeviceFrame.tsx` uses the more reliable check: creates a `<webview>` element and checks if its constructor is `HTMLUnknownElement`. Based on this, it renders either `<webview>` (Electron) or `<iframe>` (web).

The `<webview>` JSX type is declared globally in `types.ts` — without this, TypeScript won't recognize the `<webview>` element.

### Electron Main Process (`main.cjs` vs `main.js`)

Two nearly identical Electron entry files exist. `package.json` `"main"` points to `main.cjs`. The `.cjs` version has additional certificate bypass logic (`ignore-certificate-errors` and `allow-insecure-localhost` command-line switches, `NODE_TLS_REJECT_UNAUTHORIZED=0`). Both strip `X-Frame-Options`, `Content-Security-Policy`, and `x-content-type-options` response headers and spoof browser-like request headers.

### Session Sharing

All Electron webviews use `partition: "persist:shared"` so login sessions are shared across all device frames — login once, all devices sync.

## Styling

Tailwind CSS v4 via `@tailwindcss/postcss` plugin (not classic config-based). The `tailwind.config.js` extends with custom glass colors, shadows, and animations but Tailwind v4 primarily uses CSS-based config via `@import "tailwindcss"` in `index.css`.

Single **BMW-inspired sporty futuristic** theme — deep black (`#0a0a0a`) with BMW Blue (`#1C69D4`) and electric cyan (`#00D4FF`) accents, silver/metallic (`#C0C0C0`, `#8A8A8A`) for muted text. No theme switching — all styling is direct inline classes.

Custom CSS utilities in `index.css`: `.glass`, `.glass-dark`, `.glass-card` (blue-tinted glassmorphism), `.carbon-grid` (carbon fiber background), `.glow-blue-*`, `.text-glow-blue` (blue neon glow effects), `.animate-blob`, `.animate-pulse-glow` (animations).

## Key Patterns

- All state lives in `App.tsx` (URL, devices, scale, scroll sync). No state management library.
- Device configs are mutable at runtime — users can add custom devices and resize non-mobile devices inline.
- Screenshot uses `html2canvas` but hides webviews/iframes (they render as blank), so captures only the frame chrome. The UI suggests `Win+Shift+S` for full captures.
- Mobile devices get a phone-style frame with notch/dynamic island; desktop/tablet get minimal border with corner bracket accents.

