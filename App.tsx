import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import "./index.css";
import { DEVICES, DEFAULT_URL } from "./constants";
import DeviceFrame from "./components/DeviceFrame";
import { DeviceConfig } from "./types";

// Check if running in Electron
const isElectron =
  typeof window !== "undefined" &&
  window.navigator.userAgent.toLowerCase().includes("electron");

function App() {
  const [urlInput, setUrlInput] = useState(DEFAULT_URL);
  const [activeUrl, setActiveUrl] = useState(DEFAULT_URL);
  const [scale, setScale] = useState(0.6);

  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isFlashVisible, setIsFlashVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"multi" | "dashboard">("dashboard");

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

  const handleScreenshot = async () => {
    if (!contentRef.current) return;

    setIsFlashVisible(true);
    setTimeout(() => setIsFlashVisible(false), 500);

    try {
      const frames = contentRef.current.querySelectorAll("webview, iframe");
      const originalDisplays: string[] = [];

      frames.forEach((frame, i) => {
        originalDisplays[i] = (frame as HTMLElement).style.display;
        (frame as HTMLElement).style.visibility = "hidden";
      });

      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: "#0a0a0a",
        ignoreElements: (element) =>
          element.classList.contains("exclude-screenshot") ||
          element.tagName.toLowerCase() === "webview" ||
          element.tagName.toLowerCase() === "iframe",
        useCORS: true,
        logging: false,
        scale: 2,
      });

      frames.forEach((frame, i) => {
        (frame as HTMLElement).style.visibility =
          originalDisplays[i] || "visible";
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `MIBR-Snapshot-${Date.now()}.png`;
      link.click();
    } catch (err) {
      console.error("Screenshot failed:", err);
      alert(
        "Screenshot failed. For full screenshots with page content, use system screenshot (Win+Shift+S or PrtSc).",
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

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-[#05060a]">
      {/* Flash Overlay for Screenshot */}
      {isFlashVisible && (
        <div className="absolute inset-0 z-50 bg-white animate-flash pointer-events-none"></div>
      )}

      {/* Carbon Fiber Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60 carbon-grid"></div>

      {/* Neon Haze + Noise */}
      <div className="absolute inset-0 z-0 pointer-events-none cyber-haze"></div>
      <div className="absolute inset-0 z-0 pointer-events-none cyber-noise"></div>

      {/* Scanline */}
      <div className="absolute inset-0 z-0 pointer-events-none scanline opacity-40"></div>

      {/* Animated Background Blobs — Neon Red/Cyan */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-12%] left-[-8%] w-200 h-200 rounded-full mix-blend-screen filter blur-[128px] opacity-45 animate-blob bg-[#ff2b3d]/30"></div>
        <div className="absolute top-[-8%] right-[-12%] w-180 h-180 rounded-full mix-blend-screen filter blur-[128px] opacity-40 animate-blob animation-delay-2000 bg-[#ff4d6d]/25"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-240 h-240 rounded-full mix-blend-screen filter blur-[128px] opacity-35 animate-blob animation-delay-4000 bg-[#ff2b3d]/20"></div>
      </div>

      {/* Navigation Bar */}
      <header className="h-20 flex flex-row items-center px-16! justify-between z-20 shrink-0 border-b glass-dark border-[#ff2b3d]/25 shadow-[0_4px_30px_rgba(255,43,61,0.18)]">
        <div className="flex items-center gap-8">
          {/* Logo MIBR */}
          <div
            className="flex items-center gap-3 select-none group cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <div className="w-11 h-11 border rounded-xl flex items-center justify-center backdrop-blur-md relative overflow-hidden transition-all bg-linear-to-br from-[#ff2b3d]/40 to-[#ff4d6d]/20 border-[#ff2b3d]/60 shadow-[0_0_30px_rgba(255,43,61,0.45)] animate-pulse-glow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#ffe6e9] drop-shadow-[0_0_8px_rgba(255,43,61,0.6)] w-6 h-6"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <path d="M10 7h4" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-widest text-transparent bg-clip-text bg-linear-to-r from-[#ffd6db] via-[#ff4d6d] to-[#ffd6db] text-glow-blue drop-shadow-sm font-mono">
                MIBR
              </span>
              <span className="text-[10px] font-mono tracking-wide -mt-1 text-[#ff4d6d]/70">
                MIB VIEW REVIEWER
              </span>
            </div>
          </div>

          {/* URL Input */}
          <form onSubmit={handleUrlSubmit} className="flex items-center h-24">
            <div className="relative group">
              <div className="absolute inset-y-0 left-2 pl-4 flex items-center pointer-events-none text-[#ff2b3d]/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
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
                className="border rounded-md py-2.5 pl-8! pr-4 w-112.5 text-sm h-9 focus:outline-none focus:ring-1 transition-all font-mono bg-black/40 border-[#ff2b3d]/25 text-[#ffe6e9] placeholder-[#ff9aa3]/40 focus:bg-black/60 focus:border-[#ff2b3d]/50 focus:shadow-[0_0_20px_rgba(255,43,61,0.25)] backdrop-blur-xl"
                placeholder="Enter URL..."
              />
            </div>
          </form>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <button
              onClick={() => setShowAddDeviceModal(true)}
              className="p-2.5! rounded-lg transition-all bg-[#ff2b3d]/10 border border-[#ff2b3d]/25 hover:bg-[#ff2b3d]/20 hover:border-[#ff2b3d]/45 hover:shadow-[0_0_15px_rgba(255,43,61,0.25)] text-[#c9c9c9]/70 hover:text-[#ffe6e9] backdrop-blur-md"
              title="Add Custom Device"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
              className="p-2.5! rounded-lg transition-all bg-[#ff2b3d]/10 border border-[#ff2b3d]/25 hover:bg-[#ff2b3d]/20 hover:border-[#ff2b3d]/45 hover:shadow-[0_0_15px_rgba(255,43,61,0.25)] text-[#c9c9c9]/70 hover:text-[#ffe6e9] backdrop-blur-md"
              title="Screenshot Frames (use Win+Shift+S for full capture)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
          </div>
          <div className="h-8 w-px mx-1 bg-white/10"></div>
          {/* Zoom Controls */}
          <div className="flex items-center rounded-full border p-0.5! backdrop-blur-sm bg-white/5 border-white/10">
            <button
              onClick={() => setScale(Math.max(0.2, scale - 0.1))}
              className="p-2! rounded-l-full rounded-r-sm transition-all hover:bg-white/10 text-white/60 hover:text-[#ff4d6d]"
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
            <span className="text-sm font-mono w-12 text-center font-medium text-white/80">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale(Math.min(1.5, scale + 0.1))}
              className="p-2! rounded-l-sm rounded-r-full transition-all hover:bg-white/10 text-white/60 hover:text-[#ff4d6d]"
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
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden p-8! pb-96 relative z-10 scroll-smooth"
        ref={contentRef}
      >
        <div className="flex flex-row flex-wrap items-start justify-center w-full gap-8 min-h-full">
          {devices.map((device) => (
            <DeviceFrame
              key={device.id}
              device={device}
              url={activeUrl}
              scale={scale}
              onUpdateSize={handleUpdateDeviceSize}
            />
          ))}
        </div>

        {/* Glass Info Box */}
        {showDisclaimer && (
          <div className="fixed bottom-6 left-6 max-w-sm backdrop-blur-2xl border p-2! rounded-md z-30 text-xs exclude-screenshot bg-black/55 border-[#ff2b3d]/35 text-[#ffdfe2]/85 shadow-[0_8px_40px_rgba(0,0,0,0.5),0_0_30px_rgba(255,43,61,0.18)]">
            <div className="flex justify-between items-center mb-3 border-b pb-2! border-[#ff2b3d]/25">
              <strong className="flex items-center gap-2 text-[#ffe6e9] text-glow-blue">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#ff2b3d]"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff2b3d] shadow-[0_0_10px_rgba(255,43,61,0.8)]"></span>
                </span>
                Sec Environment
              </strong>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="transition-all rounded-full p-1 w-5 h-5 flex items-center justify-center bg-[#ff2b3d]/10 border border-[#ff2b3d]/30 hover:bg-[#ff2b3d]/20 hover:text-[#ff4d6d] hover:shadow-[0_0_10px_rgba(255,43,61,0.35)]"
              >
                ✕
              </button>
            </div>
            <p className="mb-2 mt-2! leading-relaxed">
              This tool uses{" "}
              <code className="px-1.5 py-0.5 rounded font-mono border bg-[#ff2b3d]/10 text-[#ff4d6d] border-[#ff2b3d]/30 shadow-[0_0_10px_rgba(255,43,61,0.15)]">
                webviews
              </code>{" "}
              with shared session. Login once, all devices sync.
            </p>
          </div>
        )}
      </main>

      {/* Add Device Modal */}
      {showAddDeviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm exclude-screenshot">
          <div className="w-96 p-4! flex flex-col gap-2 rounded-lg border glass-card border-[#ff2b3d]/30 text-white shadow-[0_0_60px_rgba(255,43,61,0.2)]">
            <h2 className="text-lg font-bold mb-1! font-mono">
              Add Custom Device
            </h2>
            <div className="space-y-4!">
              <div>
                <label className="text-sm uppercase opacity-70 mb-1! block tracking-wider">
                  Device Name
                </label>
                <input
                  type="text"
                  className="w-full px-3! py-2! text-sm rounded-lg border focus:outline-none bg-black/50 border-[#ff2b3d]/25 text-[#ffe6e9] focus:border-[#ff2b3d]/45 backdrop-blur-md"
                  value={newDevice.name}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, name: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm uppercase opacity-70 mb-1! block tracking-wider">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3! py-2! text-sm rounded-lg border focus:outline-none bg-black/50 border-[#ff2b3d]/25 text-[#ffe6e9] focus:border-[#ff2b3d]/45 backdrop-blur-md"
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
                  <label className="text-sm uppercase opacity-70 mb-1! block tracking-wider">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    className="w-full px-3! py-2! text-sm rounded-lg border focus:outline-none bg-black/50 border-[#ff2b3d]/25 text-[#ffe6e9] focus:border-[#ff2b3d]/45 backdrop-blur-md"
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
                <label className="text-sm uppercase opacity-70 mb-1! block tracking-wider">
                  Type
                </label>
                <select
                  className="w-full px-3! py-2! text-sm rounded-lg border focus:outline-none bg-black/50 border-[#ff2b3d]/25 text-[#ffe6e9] focus:border-[#ff2b3d]/45 backdrop-blur-md"
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
            <div className="flex justify-end gap-3 mt-4!">
              <button
                onClick={() => setShowAddDeviceModal(false)}
                className="px-4! py-2! rounded-lg text-md hover:opacity-80 transition-opacity text-[#C0C0C0]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDevice}
                className="px-4! py-2! rounded-lg text-md font-bold shadow-lg transition-all bg-[#ff2b3d] text-white hover:bg-[#ff2b3d]/85 hover:shadow-[0_0_20px_rgba(255,43,61,0.45)]"
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
