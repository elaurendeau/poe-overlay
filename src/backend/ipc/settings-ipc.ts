import { ipcMain } from "electron";
import logger from "@/backend/logger/logger";
import { electronComponents, OVERLAY_WINDOW_KEY, SETTINGS_WINDOW_KEY, WindowsKey } from "@/backend/electron-component/electron-components";
import { SettingsModel } from "@/backend/model/settings-model";
import { validateGridSettings } from "@/backend/manager/grid-manager";

import { updateAllSettings, writeSettings } from "@/backend/manager/settings-manager";
import { getWindowPropertiesList } from "@/backend/manager/window-properties-manager";
import { sendWindowPropertiesArray } from "@/backend/ipc/window-properties-ipc";

export const hideSettings = ipcMain.on("hide-settings", async (event, args) => {
    logger.debug("IpcMain.receive -> hide-settings");

    electronComponents.windows[SETTINGS_WINDOW_KEY].hide();
});

export const saveSettings = ipcMain.on("save-settings", async (event, settings: SettingsModel) => {
    logger.debug(`IpcMain.receive -> save-settings: ${JSON.stringify(settings)}`);

    try {
        validateGridSettings(settings.settingsGrid);
        writeSettings(settings);
        updateAllSettings(settings);
    } catch (e) {
        //Do nothing for now
        logger.error(e);
    }
});

export function updateSettingsWindow(settings: SettingsModel, windowKey: WindowsKey) {
    logger.debug(`SettingsIpc.send -> update-settings to ${windowKey}: ${JSON.stringify(settings)}`);

    electronComponents.windows[windowKey].webContents.send("update-settings", settings);
}
