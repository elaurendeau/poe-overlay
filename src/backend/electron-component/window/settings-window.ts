import { BrowserWindow, screen } from "electron";
import path from "path";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import {
  electronComponents,
  SETTINGS_WINDOW_KEY,
} from "@/backend/electron-component/electron-components";

export function createSettingsWindow(): BrowserWindow {
  const settingsWindow = new BrowserWindow({
    height: 600,
    width: 800,
    maxHeight: 2000,
    maxWidth: 1600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    show: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  settingsWindow.webContents.openDevTools({
    mode: "detach",
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the  dev server if in development mode
    settingsWindow.loadURL(
      (process.env.WEBPACK_DEV_SERVER_URL as string) + "settings"
    );
    // if (!process.env.IS_TEST) overlayWindow.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    settingsWindow.loadURL("app://./index.html/settings");
  }

  electronComponents.windows[SETTINGS_WINDOW_KEY] = settingsWindow;
  return settingsWindow;
}
