import React, { useState, useRef, useEffect } from "react";
import { DeviceConfig, ThemeType } from "../types";

// Check if running in Electron by testing if webview is a valid element
const isElectron = (() => {
  const el = document.createElement('webview');
  return el.constructor.name !== 'HTMLUnknownElement';
})();

interface DeviceFrameProps {
  device: DeviceConfig;
  url: string;
  scale: number;
  isSyncing: boolean;
  onScroll?: (percentage: number) => void;
  syncScrollPosition?: number; // 0 to 1
  isPrimary?: boolean;
  onUpdateSize?: (id: string, width: number, height: number) => void;
  theme: ThemeType;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({
  device,
  url,
  scale,
  isSyncing,
  onScroll,
  syncScrollPosition,
  isPrimary = false,
  onUpdateSize,
  theme,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const webviewRef = useRef<any>(null);
  const [isRotated, setIsRotated] = useState(false);
  const [loading, setLoading] = useState(true);
  const loadedUrlRef = useRef<string>("");
  const listenersAttachedRef = useRef(false);

  // Reset loading when URL changes, with timeout fallback
  useEffect(() => {
    if (url !== loadedUrlRef.current) {
      setLoading(true);

      // Fallback timeout - stop loading after 15s max
      const timeout = setTimeout(() => {
        loadedUrlRef.current = url;
        setLoading(false);
      }, 15000);

      return () => clearTimeout(timeout);
    }
  }, [url]);

  // Callback ref to attach event listeners when webview is mounted
  const setWebviewRef = (element: any) => {
    if (element && isElectron && element !== webviewRef.current) {
      webviewRef.current = element;

      // Only attach listeners once
      if (!listenersAttachedRef.current) {
        listenersAttachedRef.current = true;

        element.addEventListener("did-stop-loading", () => {
          loadedUrlRef.current = element.src || url;
          setLoading(false);
        });

        element.addEventListener("did-fail-load", (_event: any, errorCode: number) => {
          // Ignore ERR_ABORTED (-3) which happens on navigation
          if (errorCode !== -3) {
            loadedUrlRef.current = element.src || url;
            setLoading(false);
          }
        });
      }
    }
  };

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [tempWidth, setTempWidth] = useState(device.width);
  const [tempHeight, setTempHeight] = useState(device.height);

  // Apply rotation if needed
  const displayWidth = isRotated ? device.height : device.width;
  const displayHeight = isRotated ? device.width : device.height;

  const isMobile = device.type === "mobile";
  const canResize = !isMobile && onUpdateSize;

  // --- STYLING LOGIC BASED ON THEME ---
  const isCyber = theme === "cyber";

  const styles = {
    // Label styles - glassmorphic pill
    labelBg: isCyber
      ? "bg-black/40 border-red-500/30 text-red-100/80 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4),0_0_15px_rgba(220,38,38,0.1)]"
      : "bg-white/40 border-white/30 text-slate-600 shadow-sm backdrop-blur-md",
    labelEditing: isCyber
      ? "bg-red-950/60 border-red-500/50 shadow-[0_0_25px_rgba(220,38,38,0.2)]"
      : "bg-blue-100/80 border-blue-400",
    labelHover: isCyber
      ? "group-hover:bg-red-950/40 group-hover:border-red-500/40 group-hover:shadow-[0_0_20px_rgba(220,38,38,0.15)]"
      : "group-hover:bg-white/60 group-hover:border-blue-300/50",
    labelText: isCyber
      ? "text-red-100 group-hover:text-red-50"
      : "text-slate-700 group-hover:text-blue-700",
    labelDivider: isCyber
      ? "bg-red-500/20 group-hover:bg-red-500/30"
      : "bg-slate-400/20 group-hover:bg-blue-400/20",
    labelMeta: isCyber
      ? "text-red-200/50 group-hover:text-red-200/70"
      : "text-slate-500/70 group-hover:text-blue-500",

    // Frame base - glassmorphic container
    frameBase: isCyber
      ? "backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_60px_rgba(220,38,38,0.1)] ring-1 ring-red-500/20"
      : "backdrop-blur-xl shadow-lg ring-1 ring-white/40",

    frameDesktop: isCyber
      ? "border-red-500/20 bg-gradient-to-b from-red-950/30 via-black/60 to-black/80"
      : "border-white/50 bg-gradient-to-br from-white/40 via-white/20 to-white/5",

    frameMobile: isCyber
      ? "border-[#1a0a0a] shadow-[inset_0_0_20px_rgba(220,38,38,0.1)]"
      : "border-[#2d2d2d]",

    indicatorPrimary: isCyber
      ? "bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.8),0_0_30px_rgba(220,38,38,0.4)] animate-pulse"
      : "bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]",
    indicatorNormal: isCyber
      ? "bg-red-900/50 shadow-[0_0_5px_rgba(220,38,38,0.2)]"
      : "bg-slate-300",

    iconHover: isCyber
      ? "hover:text-red-400 hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.5)] transition-all"
      : "hover:text-blue-600",

    input: isCyber
      ? "bg-black/60 border-red-500/30 text-red-100 focus:border-red-500/50 focus:shadow-[0_0_15px_rgba(220,38,38,0.2)] backdrop-blur-md"
      : "bg-white/50 border-blue-400/30 text-blue-900 focus:border-blue-500 backdrop-blur-sm",

    loadingBg: isCyber
      ? "bg-black/90 text-red-200/60 border-red-500/20 backdrop-blur-xl"
      : "bg-white/60 text-blue-900/50 border-white/40",
    loadingSpinner: isCyber
      ? "border-red-900/40 border-t-red-500 shadow-[0_0_10px_rgba(220,38,38,0.3)]"
      : "border-blue-200 border-t-blue-600",
  };

  const handleLoad = () => {
    loadedUrlRef.current = url;
    setLoading(false);
  };

  const handleSaveSize = () => {
    if (onUpdateSize) {
      onUpdateSize(device.id, Number(tempWidth), Number(tempHeight));
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempWidth(device.width);
    setTempHeight(device.height);
    setIsEditing(false);
  };

  useEffect(() => {
    if (!isSyncing || isPrimary) return;

    if (isElectron && webviewRef.current) {
      // Webview scroll sync via executeJavaScript
      if (syncScrollPosition !== undefined) {
        webviewRef.current.executeJavaScript(`
          const scrollHeight = document.body.scrollHeight - window.innerHeight;
          window.scrollTo(0, scrollHeight * ${syncScrollPosition});
        `).catch(() => {});
      }
    } else if (iframeRef.current) {
      try {
        const win = iframeRef.current.contentWindow;
        if (win && syncScrollPosition !== undefined) {
          const scrollHeight = win.document.body.scrollHeight - win.innerHeight;
          const targetY = scrollHeight * syncScrollPosition;
          win.scrollTo(0, targetY);
        }
      } catch (e) {
        // Cross-origin blocked
      }
    }
  }, [syncScrollPosition, isSyncing, isPrimary]);

  return (
    <div className="flex flex-col items-center select-none group relative w-fit">
      {/* Device Label */}
      <div
        className={`mb-4 flex items-center gap-3 text-xs font-mono tracking-wide px-4 py-2 rounded-full border transition-all z-20 ${styles.labelBg} ${isEditing ? styles.labelEditing : styles.labelHover}`}
      >
        {isEditing ? (
          // Editing Mode UI
          <div className="flex items-center gap-2">
            <span
              className={`font-bold ${isCyber ? "text-red-200" : "text-blue-700"}`}
            >
              W:
            </span>
            <input
              type="number"
              value={tempWidth}
              onChange={(e) => setTempWidth(Number(e.target.value))}
              className={`w-14 rounded px-1 py-0.5 focus:outline-none border ${styles.input}`}
            />
            <span
              className={`font-bold ${isCyber ? "text-red-200" : "text-blue-700"}`}
            >
              H:
            </span>
            <input
              type="number"
              value={tempHeight}
              onChange={(e) => setTempHeight(Number(e.target.value))}
              className={`w-14 rounded px-1 py-0.5 focus:outline-none border ${styles.input}`}
            />
            <div
              className={`flex items-center gap-1 ml-2 border-l ${styles.labelDivider} pl-2`}
            >
              <button
                onClick={handleSaveSize}
                className="text-green-500 hover:text-green-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
              <button
                onClick={handleCancelEdit}
                className="text-red-500 hover:text-red-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          // Display Mode UI
          <>
            <div
              className={`w-2 h-2 rounded-full ${isPrimary ? styles.indicatorPrimary : styles.indicatorNormal}`}
            ></div>
            <span className={`font-bold transition-colors ${styles.labelText}`}>
              {device.name}
            </span>
            <span className={`w-px h-3 ${styles.labelDivider}`}></span>
            <span className="opacity-80">
              {displayWidth}{" "}
              <span className={`text-[10px] ${styles.labelMeta}`}>x</span>{" "}
              {displayHeight}
            </span>

            <div
              className={`flex items-center gap-1 ml-1 border-l ${styles.labelDivider} pl-2`}
            >
              <button
                onClick={() => setIsRotated(!isRotated)}
                className={`transition-colors ${styles.iconHover}`}
                title="Rotate View"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 16.5A2.5 2.5 0 0 1 18.5 19H9c-1.1 0-2 .9-2 2h-1c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h1c0 1.1.9 2 2 2h9.5A2.5 2.5 0 0 1 21 9.5v7Z" />
                </svg>
              </button>

              {canResize && (
                <button
                  onClick={() => setIsEditing(true)}
                  className={`transition-colors ${styles.iconHover}`}
                  title="Edit Dimensions"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div
        className={`relative transition-all duration-500 ease-out z-10 ${styles.frameBase} ${isMobile ? `rounded-[3rem] border-[12px] ${styles.frameMobile}` : `rounded-xl border-[1px] ${styles.frameDesktop}`}`}
        style={{
          width: displayWidth,
          height: displayHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          marginBottom: -(displayHeight * (1 - scale)),
        }}
      >
        {/* Loading State */}
        {loading && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center z-20 font-mono text-xs backdrop-blur-sm rounded-[inherit] ${styles.loadingBg}`}
          >
            <div
              className={`w-8 h-8 border-2 rounded-full animate-spin mb-3 ${styles.loadingSpinner}`}
            ></div>
            <span className="animate-pulse">Loading Target...</span>
          </div>
        )}

        {/* The Frame Content */}
        <div
          className={`w-full h-full overflow-hidden bg-white ${isMobile ? "rounded-[2.2rem]" : "rounded-[0.5rem]"}`}
        >
          {isElectron ? (
            <webview
              ref={setWebviewRef}
              src={url}
              partition="persist:shared"
              allowpopups="true"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          ) : (
            <iframe
              ref={iframeRef}
              src={url}
              className="w-full h-full border-0"
              onLoad={handleLoad}
              title={`${device.name} view`}
            />
          )}
        </div>

        {/* Glass Reflection */}
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none border border-white/5 bg-gradient-to-tr from-white/0 via-white/0 to-white/10"></div>

        {/* Tech Accents (Corner Brackets) for Desktop/Tablet only */}
        {!isMobile && (
          <>
            <div
              className={`absolute -top-1 -left-1 w-4 h-4 border-t border-l rounded-tl-sm pointer-events-none ${isCyber ? "border-red-500/30" : "border-blue-500/30"}`}
            ></div>
            <div
              className={`absolute -top-1 -right-1 w-4 h-4 border-t border-r rounded-tr-sm pointer-events-none ${isCyber ? "border-red-500/30" : "border-blue-500/30"}`}
            ></div>
            <div
              className={`absolute -bottom-1 -left-1 w-4 h-4 border-b border-l rounded-bl-sm pointer-events-none ${isCyber ? "border-red-500/30" : "border-blue-500/30"}`}
            ></div>
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 border-b border-r rounded-br-sm pointer-events-none ${isCyber ? "border-red-500/30" : "border-blue-500/30"}`}
            ></div>
          </>
        )}

        {/* Mobile Dynamic Island / Notch */}
        {isMobile && !isRotated && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-7 w-28 bg-black rounded-b-2xl z-20 pointer-events-none flex justify-center items-center shadow-lg border-b border-white/10">
            <div className="w-16 h-1.5 bg-gray-800/50 rounded-full"></div>
            <div className="absolute right-6 w-2 h-2 rounded-full bg-blue-900/30"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceFrame;
