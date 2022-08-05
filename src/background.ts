import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createOverlayWindow } from "@/backend/electron-component/window/overlay-window";
import { createTray } from "@/backend/electron-component/tray/main-tray";

import "@/backend/ipc/settings-ipc";
import "@/backend/ipc/grid-ipc";
import "@/backend/ipc/overlay-position-editor-ipc";
import logger from "@/backend/logger/logger";
import { createGridWindow } from "@/backend/electron-component/window/grid-window";
import { createSettingsWindow } from "@/backend/electron-component/window/settings-window";
import { createCaptureOverlayPositionEditorWindow } from "@/backend/electron-component/window/overlay-capture-position-editor-window";
import { createDisplayOverlayPositionEditorWindow } from "@/backend/electron-component/window/overlay-display-position-editor-window";
import { WindowPropertiesModel } from "@/backend/model/window-properties-model";
import { OverlayModel } from "@/backend/model/overlay-model";

const isDevelopment = process.env.NODE_ENV !== "production";

declare global {
    interface Window {
        api: {
            send: (channel: string, ...arg: any) => void;
            receive: (channel: string, ...arg: any) => void;
            invoke: (channel: string, ...arg: any) => Promise<any>;
            stream: (channel: string, windowProperties: WindowPropertiesModel, htmlVideoElement: HTMLVideoElement) => void;
            overlayStream: (channel: string, windowSourceProperties: WindowPropertiesModel, windowProperties: OverlayModel[], htmlCanvasElement: HTMLCanvasElement, ...arg: any) => void;
        };
    }
}

protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: { secure: true, standard: true } }]);

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
    createDisplayOverlayPositionEditorWindow();
    createCaptureOverlayPositionEditorWindow();
    createGridWindow();
    createTray();
    createSettingsWindow();
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
