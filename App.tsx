import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { DEVICES, DEFAULT_URL } from "./constants";
import DeviceFrame from "./components/DeviceFrame";
import AIChat from "./components/AIChat";
import { DeviceConfig, ThemeType } from "./types";

function App() {
  const [urlInput, setUrlInput] = useState(DEFAULT_URL);
  const [activeUrl, setActiveUrl] = useState(DEFAULT_URL);
  const [scale, setScale] = useState(0.6);
  const [isSyncScrolling, setIsSyncScrolling] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [theme, setTheme] = useState<ThemeType>("cyber");
  const [isFlashVisible, setIsFlashVisible] = useState(false);

  // Custom Devices State
  const [devices, setDevices] = useState<DeviceConfig[]>(DEVICES);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const [newDevice, setNewDevice] = useState<Partial<DeviceConfig>>({
    type: "mobile",
    width: 375,
    height: 812,
    name: "New Device",
  });

  // Refs for Screenshot
  const contentRef = useRef<HTMLDivElement>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = urlInput;
    if (!finalUrl.startsWith("http")) {
      finalUrl = `https://${finalUrl}`;
    }
    setActiveUrl(finalUrl);
  };

  const handleUpdateDeviceSize = (
    id: string,
    width: number,
    height: number,
  ) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, width, height } : d)),
    );
  };

  const toggleTheme = () => {
    const newTheme = theme === "cyber" ? "lab" : "cyber";
    setTheme(newTheme);
    // Update body styling via DOM for consistency outside React root if needed
    if (newTheme === "lab") {
      document.body.style.backgroundColor = "#f8f9fa";
      document.body.classList.add("light");
    } else {
      document.body.style.backgroundColor = "#050202";
      document.body.classList.remove("light");
    }
  };

  const handleScreenshot = async () => {
    if (!contentRef.current) return;

    // Visual flash effect
    setIsFlashVisible(true);
    setTimeout(() => setIsFlashVisible(false), 500);

    try {
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: theme === "cyber" ? "#050202" : "#f8f9fa",
        ignoreElements: (element) =>
          element.classList.contains("exclude-screenshot"),
        useCORS: true,
        logging: false,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `MIBR-Snapshot-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error("Screenshot failed:", err);
      alert(
        "Screenshot failed. Note: Cross-origin iframes may appear blank due to browser security policies.",
      );
    }
  };

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.width || !newDevice.height) return;
    const device: DeviceConfig = {
      id: `custom-${Date.now()}`,
      name: newDevice.name,
      width: Number(newDevice.width),
      height: Number(newDevice.height),
      type: (newDevice.type as any) || "mobile",
    };
    setDevices([...devices, device]);
    setShowAddDeviceModal(false);
    setNewDevice({
      type: "mobile",
      width: 375,
      height: 812,
      name: "New Device",
    });
  };

  // Styles based on Theme
  const isCyber = theme === "cyber";
  const themeStyles = {
    bg: isCyber ? "bg-[#050202]" : "bg-[#f8f9fa]",
    headerBg: isCyber
      ? "bg-white/5 border-white/10"
      : "bg-white/30 border-white/30 shadow-sm backdrop-blur-xl", // More translucent for glass effect
    headerText: isCyber ? "text-white" : "text-slate-800",
    logoBox: isCyber
      ? "bg-gradient-to-br from-red-600/30 to-black border-red-500/40 shadow-[0_0_15px_rgba(220,38,38,0.3)]"
      : "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-200 shadow-lg shadow-blue-500/10",
    logoIcon: isCyber ? "text-white" : "text-blue-600",
    logoText: isCyber
      ? "from-red-100 via-red-300 to-red-100"
      : "from-blue-700 via-blue-500 to-blue-800",
    inputBg: isCyber
      ? "bg-black/30 border-white/10 text-red-50 focus:bg-black/50 focus:border-red-500/30"
      : "bg-white/40 border-slate-300/50 text-slate-800 focus:bg-white/60 focus:border-blue-400 shadow-inner backdrop-blur-md",
    toolbarBtn: isCyber
      ? "bg-white/5 border-white/10 hover:bg-white/10 hover:text-red-200 text-white/60"
      : "bg-white/40 border-white/40 hover:bg-white/70 hover:border-blue-300 hover:text-blue-700 text-slate-600 shadow-sm backdrop-blur-md",
    activeBtn: isCyber
      ? "bg-red-600/20 text-red-200 border-red-500/30"
      : "bg-blue-100/60 text-blue-700 border-blue-400/50",
    modalBg: isCyber
      ? "bg-zinc-900 border-white/10 text-white"
      : "bg-white/70 border-white/40 text-slate-800 shadow-xl backdrop-blur-xl",
    modalInput: isCyber
      ? "bg-black/50 border-white/10 text-white"
      : "bg-white/50 border-slate-200 text-slate-800",
    blobColors: isCyber
      ? ["bg-red-900/20", "bg-rose-900/20", "bg-orange-900/10"]
      : ["bg-blue-300/20", "bg-indigo-300/20", "bg-cyan-300/10"],
  };

  return (
    <div
      className={`h-screen flex flex-col relative overflow-hidden transition-colors duration-500 ${themeStyles.bg}`}
    >
      {/* 0. Flash Overlay for Screenshot */}
      {isFlashVisible && (
        <div className="absolute inset-0 z-50 bg-white animate-flash pointer-events-none"></div>
      )}

      {/* 1. Static Grid Background */}
      <div
        className={`absolute inset-0 z-0 pointer-events-none opacity-50 ${isCyber ? "cyber-grid" : "lab-grid"}`}
      ></div>

      {/* 2. Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div
          className={`absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-blob ${themeStyles.blobColors[0]}`}
        ></div>
        <div
          className={`absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-blob animation-delay-2000 ${themeStyles.blobColors[1]}`}
        ></div>
        <div
          className={`absolute bottom-[-20%] left-[20%] w-[60rem] h-[60rem] rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob animation-delay-4000 ${themeStyles.blobColors[2]}`}
        ></div>
      </div>

      {/* Navigation Bar */}
      <header
        className={`h-16 flex items-center px-6 justify-between z-20 shrink-0 border-b transition-colors duration-300 ${themeStyles.headerBg}`}
      >
        <div className="flex items-center gap-6">
          {/* Logo MIBR */}
          <div
            className="flex items-center gap-3 select-none group cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <div
              className={`w-10 h-10 border rounded-lg flex items-center justify-center backdrop-blur-md relative overflow-hidden transition-all ${themeStyles.logoBox}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${themeStyles.logoIcon} w-6 h-6`}
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <path d="M10 7h4" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span
                className={`font-bold text-xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r drop-shadow-sm font-mono ${themeStyles.logoText}`}
              >
                MIBR
              </span>
              <span
                className={`text-[10px] font-mono tracking-wide -mt-1 ${isCyber ? "text-red-300/60" : "text-blue-400"}`}
              >
                MIB VIEW REVIEWER
              </span>
            </div>
          </div>

          {/* URL Input */}
          <form onSubmit={handleUrlSubmit} className="flex items-center">
            <div className="relative group">
              <div
                className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors ${isCyber ? "text-red-200/40" : "text-slate-400"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className={`border rounded-xl py-2 pl-10 pr-4 w-[400px] text-sm focus:outline-none focus:ring-1 transition-all font-mono ${themeStyles.inputBg}`}
                placeholder="Enter URL..."
              />
            </div>
          </form>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          {/* Screenshot & Add Device */}
          <div className="flex items-center gap-2 mr-2">
            <button
              onClick={() => setShowAddDeviceModal(true)}
              className={`p-2 rounded-lg transition-all ${themeStyles.toolbarBtn}`}
              title="Add Custom Device"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <button
              onClick={handleScreenshot}
              className={`p-2 rounded-lg transition-all ${themeStyles.toolbarBtn}`}
              title="Take Screenshot (Container)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all ${themeStyles.toolbarBtn}`}
              title={isCyber ? "Switch to Lab Mode" : "Switch to Cyber Mode"}
            >
              {isCyber ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>

          <div
            className={`h-6 w-px mx-1 ${isCyber ? "bg-white/10" : "bg-slate-300"}`}
          ></div>

          {/* Zoom Controls */}
          <div
            className={`flex items-center rounded-lg border p-0.5 backdrop-blur-sm ${isCyber ? "bg-white/5 border-white/10" : "bg-white/40 border-white/40"}`}
          >
            <button
              onClick={() => setScale(Math.max(0.2, scale - 0.1))}
              className={`p-2 rounded-md transition-all ${isCyber ? "hover:bg-white/10 text-white/60 hover:text-red-200" : "hover:bg-white/50 text-slate-500 hover:text-blue-600"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
              </svg>
            </button>
            <span
              className={`text-xs font-mono w-10 text-center font-medium ${isCyber ? "text-white/80" : "text-slate-700"}`}
            >
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(Math.min(1.5, scale + 0.1))}
              className={`p-2 rounded-md transition-all ${isCyber ? "hover:bg-white/10 text-white/60 hover:text-red-200" : "hover:bg-white/50 text-slate-500 hover:text-blue-600"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
          </div>

          <div
            className={`h-6 w-px mx-1 ${isCyber ? "bg-white/10" : "bg-slate-300"}`}
          ></div>

          {/* Sync Scroll Toggle */}
          <button
            onClick={() => setIsSyncScrolling(!isSyncScrolling)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border backdrop-blur-sm ${
              isSyncScrolling ? themeStyles.activeBtn : themeStyles.toolbarBtn
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Sync
          </button>

          {/* AI Toggle */}
          {/* <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border backdrop-blur-sm ${
              isChatOpen 
              ? (isCyber ? 'bg-rose-600/20 text-rose-200 border-rose-500/30' : 'bg-indigo-100 text-indigo-700 border-indigo-300') 
              : themeStyles.toolbarBtn
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/><path d="M22 2 2 22"/><path d="M2 2 22 22"/></svg>
             AI
          </button> */}
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden p-8 pb-96 relative z-10 scroll-smooth"
        ref={contentRef}
      >
        <div className="flex flex-row flex-wrap items-start justify-center w-full gap-8 min-h-full">
          {devices.map((device) => (
            <DeviceFrame
              key={device.id}
              device={device}
              url={activeUrl}
              scale={scale}
              isSyncing={isSyncScrolling}
              isPrimary={device.id === "desktop-lg"}
              onUpdateSize={handleUpdateDeviceSize}
              theme={theme}
            />
          ))}
        </div>

        {/* Glass Info Box */}
        {showDisclaimer && (
          <div
            className={`fixed bottom-6 left-6 max-w-sm backdrop-blur-xl border p-5 rounded-2xl shadow-glass z-30 text-xs exclude-screenshot ${isCyber ? "bg-black/40 border-red-500/10 text-white/70" : "bg-white/60 border-white/50 text-slate-600 shadow-xl"}`}
          >
            <div
              className={`flex justify-between items-start mb-3 border-b pb-2 ${isCyber ? "border-white/5" : "border-slate-300/30"}`}
            >
              <strong
                className={`flex items-center gap-2 ${isCyber ? "text-red-100" : "text-blue-700"}`}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isCyber ? "bg-red-400" : "bg-blue-400"}`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${isCyber ? "bg-red-600" : "bg-blue-600"}`}
                  ></span>
                </span>
                Sec Environment
              </strong>
              <button
                onClick={() => setShowDisclaimer(false)}
                className={`transition-colors rounded-full p-1 w-5 h-5 flex items-center justify-center ${isCyber ? "bg-white/5 hover:bg-white/10 hover:text-red-400" : "bg-slate-200/50 hover:bg-slate-200 hover:text-blue-600"}`}
              >
                ✕
              </button>
            </div>
            <p className="mb-2 leading-relaxed">
              This tool uses{" "}
              <code
                className={`px-1 py-0.5 rounded font-mono border ${isCyber ? "bg-red-900/30 text-red-100 border-red-500/10" : "bg-blue-100/50 text-blue-700 border-blue-200"}`}
              >
                iframes
              </code>
              . Strict X-Frame-Options or CORS may block content.
            </p>
          </div>
        )}
      </main>

      {/* AI Sidebar */}
      {/* <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} /> */}

      {/* Add Device Modal */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm exclude-screenshot">
          <div className={`w-96 p-6 rounded-2xl border ${themeStyles.modalBg}`}>
            <h2 className="text-lg font-bold mb-4 font-mono">
              Add Custom Device
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase opacity-70 mb-1 block">
                  Device Name
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${themeStyles.modalInput}`}
                  value={newDevice.name}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, name: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs uppercase opacity-70 mb-1 block">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${themeStyles.modalInput}`}
                    value={newDevice.width}
                    onChange={(e) =>
                      setNewDevice({
                        ...newDevice,
                        width: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs uppercase opacity-70 mb-1 block">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${themeStyles.modalInput}`}
                    value={newDevice.height}
                    onChange={(e) =>
                      setNewDevice({
                        ...newDevice,
                        height: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase opacity-70 mb-1 block">
                  Type
                </label>
                <select
                  className={`w-full px-3 py-2 rounded-lg border focus:outline-none ${themeStyles.modalInput}`}
                  value={newDevice.type}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, type: e.target.value as any })
                  }
                >
                  <option value="mobile">Mobile</option>
                  <option value="tablet">Tablet</option>
                  <option value="desktop">Desktop</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddDeviceModal(false)}
                className="px-4 py-2 rounded-lg text-sm hover:opacity-80 transition-opacity"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDevice}
                className={`px-4 py-2 rounded-lg text-sm font-bold shadow-lg transition-all ${isCyber ? "bg-red-600 text-white hover:bg-red-500" : "bg-blue-600 text-white hover:bg-blue-500"}`}
              >
                Add Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
