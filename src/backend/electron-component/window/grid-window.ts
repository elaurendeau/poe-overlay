import { BrowserWindow, screen } from "electron";
import path from "path";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import { electronComponents, GRID_WINDOW_KEY } from "@/backend/electron-component/electron-components";
import { updateGridWindowSettings } from "@/backend/ipc/grid-ipc";
import { getSettings, readSettings } from "@/backend/manager/settings-manager";
import logger from "@/backend/logger/logger";

export function createGridWindow(): BrowserWindow {
    const primaryDisplay = screen.getPrimaryDisplay();
    const displayWidth = primaryDisplay.size.width;
    const displayHeight = primaryDisplay.size.height;
    // Create the browser window.
    const gridWindow = new BrowserWindow({
        width: displayWidth,
        height: displayHeight,
        autoHideMenuBar: true,
        skipTaskbar: true,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
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
    gridWindow.setBounds({ x: 0, y: 0, width: displayWidth, height: displayHeight });
    gridWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    gridWindow.setAlwaysOnTop(true, "normal");
    gridWindow.once("ready-to-show", () => {
        const settings = getSettings();
        updateGridWindowSettings(settings.settingsGrid);
    });

    gridWindow.on("show", () => {
        gridWindow.maximize();
        gridWindow.setBounds({ x: 0, y: 0, width: displayWidth, height: displayHeight });
        logger.debug("Grid window Maximize");
    });
    // gridWindow.webContents.openDevTools({
    //   mode: "detach",
    // });

    gridWindow.setIgnoreMouseEvents(true);

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the  dev server if in development mode
        gridWindow.loadURL((process.env.WEBPACK_DEV_SERVER_URL as string) + "grid");
        // if (!process.env.IS_TEST) overlayWindow.webContents.openDevTools();
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        gridWindow.loadURL("app://./index.html/grid");
    }

    electronComponents.windows[GRID_WINDOW_KEY] = gridWindow;
    return gridWindow;
}
