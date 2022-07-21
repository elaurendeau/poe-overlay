import { BrowserWindow } from "electron";
import path from "path";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { electronComponents, SETTINGS_WINDOW_KEY } from "@/backend/electron-component/electron-components";
import { getSettings } from "@/backend/manager/settings-manager";
import { updateSettingsWindow } from "@/backend/ipc/settings-ipc";
import { getWindowPropertiesList } from "@/backend/manager/window-properties-manager";
import { sendWindowPropertiesArray } from "@/backend/ipc/window-properties-ipc";
import logger from "@/backend/logger/logger";

export function createSettingsWindow(): BrowserWindow {
    const settingsWindow = new BrowserWindow({
        height: 900,
        width: 800,
        maxHeight: 2000,
        maxWidth: 800,
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        resizable: false,
        show: false,
        icon: "./public/img/icons/blind.png",
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION as unknown as boolean,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    settingsWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    settingsWindow.setAlwaysOnTop(true, "normal");
    settingsWindow.on("ready-to-show", async () => {
        logger.debug("Ready to show settings");
        const settings = getSettings();
        updateSettingsWindow(settings, SETTINGS_WINDOW_KEY);
        sendWindowPropertiesArray(await getWindowPropertiesList(), SETTINGS_WINDOW_KEY);
    });
    settingsWindow.webContents.openDevTools({
        mode: "detach",
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the  dev server if in development mode
        settingsWindow.loadURL((process.env.WEBPACK_DEV_SERVER_URL as string) + "settings");
        // if (!process.env.IS_TEST) overlayWindow.webContents.openDevTools();
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        settingsWindow.loadURL("app://./index.html/settings");
    }

    electronComponents.windows[SETTINGS_WINDOW_KEY] = settingsWindow;
    return settingsWindow;
}
