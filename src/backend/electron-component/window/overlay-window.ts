import { BrowserWindow, screen } from "electron";
import path from "path";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { electronComponents, OVERLAY_WINDOW_KEY } from "@/backend/electron-component/electron-components";
import { getSettings } from "@/backend/manager/settings-manager";
import { getWindowPropertiesList } from "@/backend/manager/window-properties-manager";
import { sendWindowPropertiesArray } from "@/backend/ipc/window-properties-ipc";
import { updateSettingsWindow } from "@/backend/ipc/settings-ipc";
import { overlayWindow } from "electron-overlay-window";

export function createOverlayWindow(): BrowserWindow {
    const primaryDisplay = screen.getPrimaryDisplay();
    const displayWidth = primaryDisplay.size.width;
    const displayHeight = primaryDisplay.size.height;
    // Create the browser window.
    const window = new BrowserWindow({
        width: displayWidth,
        height: displayHeight,
        autoHideMenuBar: true,
        skipTaskbar: true,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
        icon: "./public/img/icons/blind.png",
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION as unknown as boolean,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    window.setAlwaysOnTop(true, "normal");
    window.on("ready-to-show", async () => {
        const settings = getSettings();
        updateSettingsWindow(settings, OVERLAY_WINDOW_KEY);

        // const windowPropertiesModels = await getWindowPropertiesList();
        // const displayWindowProperties = windowPropertiesModels.filter((it) => it.programName === settings.settingsScreenCapture.displayProgramName)[0];
        //
        // if (displayWindowProperties) {
        //     overlayWindow.attachTo(window, displayWindowProperties.programName);
        // }

        // sendWindowPropertiesArray(windowPropertiesModels, OVERLAY_WINDOW_KEY);
    });

    window.webContents.openDevTools({
        mode: "detach",
    });

    window.setIgnoreMouseEvents(true);

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the  dev server if in development mode
        window.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
        // if (!process.env.IS_TEST) overlayWindow.webContents.openDevTools();
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        window.loadURL("app://./index.html");
    }

    electronComponents.windows[OVERLAY_WINDOW_KEY] = window;
    return window;
}
