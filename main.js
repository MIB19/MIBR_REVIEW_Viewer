const { app, BrowserWindow, session, ipcMain } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 2000,
    height: 1200,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      webviewTag: true,
      partition: "persist:main",
      preload: path.join(__dirname, "preload.cjs"),
    },
    backgroundColor: "#050202",
    title: "MIBR Review Viewer - Multi Device",
    icon: path.join(__dirname, "public/icon.png"),
  });

  win.webContents.on("did-finish-load", () => {
    console.log("[main] loaded:", win.webContents.getURL());
  });

  win.webContents.on(
    "did-fail-load",
    (event, errorCode, errorDescription, validatedURL) => {
      console.error(
        "[main] failed to load:",
        validatedURL,
        errorCode,
        errorDescription,
      );
    },
  );

  const isDev = !app.isPackaged;

  if (isDev) {
    const devUrls = [
      "https://localhost:9899",
      "https://127.0.0.1:9899",
      "http://localhost:9899",
    ];
    let devUrlIndex = 0;

    const loadDevUrl = () => {
      const url = devUrls[devUrlIndex];
      console.log("[main] loading:", url);
      win.loadURL(url);
    };

    win.webContents.on(
      "did-fail-load",
      (event, errorCode, errorDescription, validatedURL) => {
        if (errorCode === -3) return; // ERR_ABORTED
        if (devUrlIndex < devUrls.length - 1) {
          devUrlIndex += 1;
          loadDevUrl();
          return;
        }
        console.error(
          "[main] dev load failed:",
          validatedURL,
          errorCode,
          errorDescription,
        );
      },
    );

    loadDevUrl();
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "dist/index.html"));
  }

  win.on("closed", () => {});

  // Force all webviews to use persist:shared partition from main process
  win.webContents.on("will-attach-webview", (event, webPreferences, params) => {
    webPreferences.partition = "persist:shared";
  });

  // Modify user agent to mimic real browser
  const userAgent = win.webContents.userAgent.replace(/Electron\/[\d.]+/, "");
  win.webContents.userAgent = userAgent;

  // --- Main window session: security bypass only ---
  const mainSession = win.webContents.session;

  mainSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };
    delete responseHeaders["x-frame-options"];
    delete responseHeaders["X-Frame-Options"];
    delete responseHeaders["content-security-policy"];
    delete responseHeaders["Content-Security-Policy"];
    delete responseHeaders["x-content-type-options"];
    callback({ responseHeaders });
  });

  mainSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const requestHeaders = { ...details.requestHeaders };
    const isLocalDev =
      details.url.startsWith("https://localhost:9899") ||
      details.url.startsWith("https://127.0.0.1:9899");
    if (isLocalDev) {
      callback({ requestHeaders });
      return;
    }
    requestHeaders["User-Agent"] =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    requestHeaders["Accept"] =
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
    requestHeaders["Accept-Language"] = "en-US,en;q=0.5";
    requestHeaders["Accept-Encoding"] = "gzip, deflate";
    requestHeaders["DNT"] = "1";
    requestHeaders["Connection"] = "keep-alive";
    requestHeaders["Upgrade-Insecure-Requests"] = "1";
    callback({ requestHeaders });
  });

  // --- Webview session (persist:shared): security bypass + cache override ---
  const webviewSession = session.fromPartition("persist:shared");

  webviewSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };

    // Security bypass
    delete responseHeaders["x-frame-options"];
    delete responseHeaders["X-Frame-Options"];
    delete responseHeaders["content-security-policy"];
    delete responseHeaders["Content-Security-Policy"];
    delete responseHeaders["x-content-type-options"];

    // Cache override — skip localhost/dev URLs
    const isLocalDev =
      details.url.startsWith("https://localhost") ||
      details.url.startsWith("https://127.0.0.1") ||
      details.url.startsWith("http://localhost") ||
      details.url.startsWith("http://127.0.0.1");

    if (!isLocalDev) {
      const existingCC =
        responseHeaders["cache-control"]?.[0] ||
        responseHeaders["Cache-Control"]?.[0] ||
        "";
      const maxAgeMatch = existingCC.match(/max-age=(\d+)/);
      const existingMaxAge = maxAgeMatch ? parseInt(maxAgeMatch[1], 10) : 0;

      // Respect no-store (sensitive/authenticated responses)
      if (
        !existingCC.includes("no-store") &&
        (existingMaxAge < 60 || /no-cache|private/.test(existingCC))
      ) {
        delete responseHeaders["cache-control"];
        delete responseHeaders["Cache-Control"];
        delete responseHeaders["pragma"];
        delete responseHeaders["Pragma"];
        responseHeaders["Cache-Control"] = ["public, max-age=300"];
      }
    }

    callback({ responseHeaders });
  });

  webviewSession.webRequest.onBeforeSendHeaders((details, callback) => {
    const requestHeaders = { ...details.requestHeaders };
    const isLocalDev =
      details.url.startsWith("https://localhost:9899") ||
      details.url.startsWith("https://127.0.0.1:9899");
    if (isLocalDev) {
      callback({ requestHeaders });
      return;
    }
    requestHeaders["User-Agent"] =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
    requestHeaders["Accept"] =
      "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";
    requestHeaders["Accept-Language"] = "en-US,en;q=0.5";
    requestHeaders["Accept-Encoding"] = "gzip, deflate";
    requestHeaders["DNT"] = "1";
    requestHeaders["Connection"] = "keep-alive";
    requestHeaders["Upgrade-Insecure-Requests"] = "1";
    callback({ requestHeaders });
  });

}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  // IPC: clear webview HTTP cache (not cookies/localStorage) — registered once
  ipcMain.handle("clear-webview-cache", async () => {
    await session.fromPartition("persist:shared").clearCache();
    console.log("[main] webview cache cleared");
  });

  createWindow();

  app.on("activate", () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
  // On macOS, apps stay active until Cmd+Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Disable certificate errors (localhost + webview targets)
app.on(
  "certificate-error",
  (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  },
);
