const { app, BrowserWindow } = require("electron");
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

  // Modify user agent to mimic real browser
  const userAgent = win.webContents.userAgent.replace(/Electron\/[\d.]+/, "");
  win.webContents.userAgent = userAgent;

  // Bypass X-Frame-Options and CSP
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };

    delete responseHeaders["x-frame-options"];
    delete responseHeaders["X-Frame-Options"];
    delete responseHeaders["content-security-policy"];
    delete responseHeaders["Content-Security-Policy"];
    delete responseHeaders["x-content-type-options"];

    callback({ responseHeaders });
  });

  // Add headers to look like real browser request
  win.webContents.session.webRequest.onBeforeSendHeaders(
    (details, callback) => {
      const requestHeaders = { ...details.requestHeaders };

      const isLocalDev =
        details.url.startsWith("https://localhost:9899") ||
        details.url.startsWith("https://127.0.0.1:9899");

      if (isLocalDev) {
        callback({ requestHeaders });
        return;
      }

      // Add browser-like headers
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
    },
  );

  // Handle session to allow cookies
  win.webContents.session.cookies.on("changed", () => {
    // Cookies are persisted automatically
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
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

// Disable certificate errors for localhost development
app.on(
  "certificate-error",
  (event, webContents, url, error, certificate, callback) => {
    if (url.includes("localhost")) {
      event.preventDefault();
      callback(true);
    } else {
      callback(false);
    }
  },
);
