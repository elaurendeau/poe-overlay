import { BrowserWindow, screen } from "electron";
import path from "path";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { electronComponents, SETTINGS_WINDOW_KEY } from "@/electron-components";

export function createGridWindow(): BrowserWindow {
  const primaryDisplay = screen.getPrimaryDisplay();
  const displayWidth = primaryDisplay.size.width;
  const displayHeight = primaryDisplay.size.height;
  // Create the browser window.
  const gridWindow = new BrowserWindow({
    width: displayWidth,
    height: displayHeight,
    autoHideMenuBar: true,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
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
  gridWindow.webContents.openDevTools();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the  dev server if in development mode
    gridWindow.loadURL((process.env.WEBPACK_DEV_SERVER_URL as string) + "grid");
    // if (!process.env.IS_TEST) overlayWindow.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    gridWindow.loadURL("app://./index.html/grid");
  }

  electronComponents.windows[SETTINGS_WINDOW_KEY] = gridWindow;
  return gridWindow;
}
