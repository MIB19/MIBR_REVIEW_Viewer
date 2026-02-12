import React, { useState, useRef, useEffect } from "react";
import { DeviceConfig } from "../types";

// Check if running in Electron by testing if webview is a valid element
const isElectron = (() => {
  const el = document.createElement("webview");
  return el.constructor.name !== "HTMLUnknownElement";
})();

interface DeviceFrameProps {
  device: DeviceConfig;
  url: string;
  scale: number;
  onUpdateSize?: (id: string, width: number, height: number) => void;
}

const DeviceFrame: React.FC<DeviceFrameProps> = ({
  device,
  url,
  scale,
  onUpdateSize,
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

      if (!listenersAttachedRef.current) {
        listenersAttachedRef.current = true;

        element.addEventListener("did-stop-loading", () => {
          loadedUrlRef.current = element.src || url;
          setLoading(false);
        });

        element.addEventListener(
          "did-fail-load",
          (_event: any, errorCode: number) => {
            if (errorCode !== -3) {
              loadedUrlRef.current = element.src || url;
              setLoading(false);
            }
          },
        );
      }
    }
  };

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  const [tempWidth, setTempWidth] = useState(device.width);
  const [tempHeight, setTempHeight] = useState(device.height);

  const displayWidth = isRotated ? device.height : device.width;
  const displayHeight = isRotated ? device.width : device.height;

  const isMobile = device.type === "mobile";
  const canResize = !isMobile && onUpdateSize;

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

  return (
    <div className="flex flex-col items-center select-none group relative w-fit gap-3">
      {/* Device Label */}
      <div
        className={`mb-4 flex items-center gap-3! text-xs font-mono tracking-wide px-4! py-2! rounded-full border transition-all z-20 bg-black/45 border-[#ff2b3d]/35 text-[#cfcfcf]/85 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.4),0_0_15px_rgba(255,43,61,0.18)] ${isEditing ? "bg-[#ff2b3d]/18 border-[#ff2b3d]/55 shadow-[0_0_25px_rgba(255,43,61,0.28)]" : "group-hover:bg-[#ff2b3d]/12 group-hover:border-[#ff2b3d]/45 group-hover:shadow-[0_0_20px_rgba(255,43,61,0.22)]"}`}
      >
        {isEditing ? (
          <div className="flex items-center gap-2!">
            <span className="font-bold text-[#ff4d6d]">W:</span>
            <input
              type="number"
              value={tempWidth}
              onChange={(e) => setTempWidth(Number(e.target.value))}
              className="w-14 rounded px-1 py-0.5 focus:outline-none border bg-black/60 border-[#ff2b3d]/35 text-[#ffe6e9] focus:border-[#ff2b3d]/55 focus:shadow-[0_0_15px_rgba(255,43,61,0.25)] backdrop-blur-md"
            />
            <span className="font-bold text-[#ff4d6d]">H:</span>
            <input
              type="number"
              value={tempHeight}
              onChange={(e) => setTempHeight(Number(e.target.value))}
              className="w-14 rounded px-1 py-0.5 focus:outline-none border bg-black/60 border-[#ff2b3d]/35 text-[#ffe6e9] focus:border-[#ff2b3d]/55 focus:shadow-[0_0_15px_rgba(255,43,61,0.25)] backdrop-blur-md"
            />
            <div className="flex items-center gap-1 ml-2 border-l  pl-2!">
              <button
                onClick={handleSaveSize}
                className="text-green-500 hover:text-green-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
                  width="16"
                  height="16"
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
          <>
            <div
              className="w-2 h-2 rounded-full bg-[#ff2b3d]/55 shadow-[0_0_5px_rgba(255,43,61,0.25)]"
            ></div>
            <span className="font-bold transition-colors text-[#cfcfcf] group-hover:text-[#ffe6e9]">
              {device.name}
            </span>
            <span className="w-px h-3 bg-[#ff2b3d]/25 group-hover:bg-[#ff2b3d]/40"></span>
            <span className="opacity-80">
              {displayWidth}{" "}
              <span className="text-[10px] text-[#8A8A8A]/50 group-hover:text-[#ff4d6d]/70">
                x
              </span>{" "}
              {displayHeight}
            </span>

            <div className="flex items-center gap-1 ml-1 border-l border-[#ff2b3d]/25 group-hover:border-[#ff2b3d]/40 pl-2!">
              <button
                onClick={() => setIsRotated(!isRotated)}
                className="transition-all hover:text-[#ff4d6d] hover:drop-shadow-[0_0_8px_rgba(255,43,61,0.6)]"
                title="Rotate View"
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
                  <path d="M21 16.5A2.5 2.5 0 0 1 18.5 19H9c-1.1 0-2 .9-2 2h-1c-1.1 0-2-.9-2-2V7c0-1.1.9-2 2-2h1c0 1.1.9 2 2 2h9.5A2.5 2.5 0 0 1 21 9.5v7Z" />
                </svg>
              </button>

              {canResize && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="transition-all hover:text-[#ff4d6d] hover:drop-shadow-[0_0_8px_rgba(255,43,61,0.6)]"
                  title="Edit Dimensions"
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
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                </button>
              )}
            </div>
          </>
        )}
      </div>

      <div
        className={`relative transition-all duration-500 ease-out z-10 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_60px_rgba(255,43,61,0.15)] ring-1 ring-[#ff2b3d]/25 ${isMobile ? `rounded-[3rem] border-12 border-[#0a0a12] shadow-[inset_0_0_20px_rgba(255,43,61,0.12)]` : `rounded-xl border border-[#ff2b3d]/25 bg-linear-to-b from-[#ff2b3d]/10 via-black/60 to-black/80`}`}
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
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 font-mono text-xs backdrop-blur-sm rounded-[inherit] bg-black/90 text-[#ffdfe2]/70 border-[#ff2b3d]/25 gap-3">
            <div className="w-8 h-8 border-2 rounded-full animate-spin mb-3 border-[#ff2b3d]/45 border-t-[#ff4d6d] shadow-[0_0_10px_rgba(255,43,61,0.35)]"></div>
            <span className="animate-pulse">Loading Target...</span>
          </div>
        )}

        {/* The Frame Content */}
        <div
          className={`w-full h-full overflow-hidden bg-white ${isMobile ? "rounded-[2.2rem]" : "rounded-lg"}`}
        >
          {isElectron ? (
            <webview
              ref={setWebviewRef}
              src={url}
              partition="persist:shared"
              allowpopups={true}
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
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none border border-white/5 bg-linear-to-tr from-white/0 via-white/0 to-white/10"></div>

        {/* Corner Bracket Accents — BMW Blue for Desktop/Tablet */}
        {!isMobile && (
          <>
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l rounded-tl-sm pointer-events-none border-[#ff2b3d]/35"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t border-r rounded-tr-sm pointer-events-none border-[#ff2b3d]/35"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b border-l rounded-bl-sm pointer-events-none border-[#ff2b3d]/35"></div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r rounded-br-sm pointer-events-none border-[#ff2b3d]/35"></div>
          </>
        )}

        {/* Mobile Dynamic Island / Notch */}
        {isMobile && !isRotated && (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-7 w-28 bg-black rounded-b-2xl z-20 pointer-events-none flex justify-center items-center shadow-lg border-b border-white/10">
            <div className="w-16 h-1.5 bg-gray-800/50 rounded-full"></div>
            <div className="absolute right-6 w-2 h-2 rounded-full bg-[#ff2b3d]/35"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceFrame;
