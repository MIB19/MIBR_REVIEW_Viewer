const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  clearWebviewCache: () => ipcRenderer.invoke("clear-webview-cache"),
});
