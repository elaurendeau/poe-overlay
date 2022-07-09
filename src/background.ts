import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createOverlayWindow } from "@/backend/electron-component/window/overlay-window";
import { createTray } from "@/backend/electron-component/tray/main-tray";

import "@/backend/ipc/settings-ipc";
import "@/backend/ipc/grid-ipc";
import logger from "@/backend/logger/logger";
import { createGridWindow } from "@/backend/electron-component/window/grid-window";

const isDevelopment = process.env.NODE_ENV !== "production";

declare global {
  interface Window {
    api: {
      send: (channel: string, ...arg: any) => void;
      receive: (channel: string, ...arg: any) => void;
    };
  }
}

protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createOverlayWindow();
  }
});

app.on("ready", async () => {
  logger.info("Creating overlay and tray");
  createOverlayWindow();
  createGridWindow();
  createTray();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
