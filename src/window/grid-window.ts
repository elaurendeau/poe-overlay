import { BrowserWindow, screen } from "electron";
import path from "path";

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
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  gridWindow.setIgnoreMouseEvents(true);
  return gridWindow;
}
