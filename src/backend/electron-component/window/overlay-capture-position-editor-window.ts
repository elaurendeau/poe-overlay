import { BrowserWindow, desktopCapturer, screen } from "electron";
import path from "path";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import {
  electronComponents,
  OVERLAY_CAPTURE_POSITION_EDITOR_WINDOW_KEY,
} from "@/backend/electron-component/electron-components";
import { updateOverlayCapturePositionCoordinates } from "@/backend/manager/overlay-position-editor-manager";
import { updateOverlayPositionEditorSettings } from "@/backend/ipc/overlay-position-editor-ipc";
import { getSettings } from "@/backend/manager/settings-manager";

export function createCaptureOverlayPositionEditorWindow(): BrowserWindow {
  // Create the browser window.
  const primaryDisplay = screen.getPrimaryDisplay();
  const displayWidth = primaryDisplay.size.width;
  const displayHeight = primaryDisplay.size.height;
  const overlay = new BrowserWindow({
    width: displayWidth,
    height: displayHeight,
    autoHideMenuBar: true,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    show: false,
    icon: "./public/img/icons/blind.png",
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, "preload.js"),
    },
  });
  overlay.on("ready-to-show", () => {
    const settings = getSettings();
    updateOverlayPositionEditorSettings(settings.settingsOverlayPositionEditor);
  });
  overlay.on("resized", () => {
    updateOverlayCapturePositionCoordinates();
  });

  overlay.on("moved", () => {
    updateOverlayCapturePositionCoordinates();
  });

  // overlay.webContents.openDevTools({
  //   mode: "detach",
  // });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the  dev server if in development mode
    overlay.loadURL(
      (process.env.WEBPACK_DEV_SERVER_URL as string) +
        "overlay-capture-position-editor"
    );
    // if (!process.env.IS_TEST) overlayWindow.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    overlay.loadURL("app://./index.html/overlay-capture-position-editor");
  }

  electronComponents.windows[OVERLAY_CAPTURE_POSITION_EDITOR_WINDOW_KEY] =
    overlay;
  return overlay;
}
