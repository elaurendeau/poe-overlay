import { BrowserWindow } from "electron";
import path from "path";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { electronComponents, PROFILE_PICKER_WINDOW_KEY } from "@/backend/electron-component/electron-components";
import { getSettings } from "@/backend/manager/settings-manager";
import { updateSettingsWindow } from "@/backend/ipc/settings-ipc";
import logger from "@/backend/logger/logger";

export function createProfilePickerWindow(): BrowserWindow {
    const profilePickerWindow = new BrowserWindow({
        height: 300,
        width: 600,
        maxHeight: 2000,
        maxWidth: 800,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        show: true,
        icon: "./public/img/icons/blind.png",
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION as unknown as boolean,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    profilePickerWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    profilePickerWindow.setAlwaysOnTop(true, "normal");
    profilePickerWindow.on("ready-to-show", async () => {
        logger.debug("Ready to show settings");
        const settings = getSettings();
        updateSettingsWindow(settings, PROFILE_PICKER_WINDOW_KEY);
    });
    // profilePickerWindow.webContents.openDevTools({
    //     mode: "detach",
    // });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the  dev server if in development mode
        profilePickerWindow.loadURL((process.env.WEBPACK_DEV_SERVER_URL as string) + "profile-picker");
        // if (!process.env.IS_TEST) overlayWindow.webContents.openDevTools();
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        profilePickerWindow.loadURL("app://./index.html/profile-picker");
    }

    electronComponents.windows[PROFILE_PICKER_WINDOW_KEY] = profilePickerWindow;
    return profilePickerWindow;
}
