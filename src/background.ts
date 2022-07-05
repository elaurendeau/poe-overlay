import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createOverlayWindow } from "@/window/overlay-window";
import {
  electronComponents,
  GRID_WINDOW_KEY,
  SETTINGS_WINDOW_KEY,
} from "@/electron-components";
import { createTray } from "@/tray/main-tray";
import { createGridWindow } from "@/window/grid-window";

const isDevelopment = process.env.NODE_ENV !== "production";

declare global {
  interface Window {
    api: {
      send: (channel: string, ...arg: any) => void;
    };
  }
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createOverlayWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // // Install Vue Devtools
    // try {
    //   await installExtension(VUEJS_DEVTOOLS);
    // } catch (e) {
    //   console.error("Vue Devtools failed to install:", e);
    // }
  }
  createOverlayWindow();
  createTray();
});
ipcMain.on("hide-settings", async (event, args) => {
  electronComponents.windows[SETTINGS_WINDOW_KEY].hide();
});

ipcMain.on("toggle-grid", async (event, args) => {
  let gridWindow = electronComponents.windows[GRID_WINDOW_KEY];

  if (!gridWindow) {
    gridWindow = createGridWindow();
  }

  if (gridWindow.isVisible()) {
    gridWindow.hide();
  } else {
    gridWindow.show();
  }
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
