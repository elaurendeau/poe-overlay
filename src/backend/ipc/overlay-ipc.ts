import { SettingsModel } from "@/backend/model/settings-model";
import logger from "@/backend/logger/logger";
import { electronComponents, GRID_WINDOW_KEY, OVERLAY_WINDOW_KEY } from "@/backend/electron-component/electron-components";
import { desktopCapturer, ipcMain } from "electron";
import { createGridWindow } from "@/backend/electron-component/window/grid-window";
import { WindowPropertiesModel } from "@/backend/model/window-properties-model";

export function updateOverlayWindow(settings: SettingsModel) {
    logger.debug(`OverlayWindow.send -> update-settings: ${JSON.stringify(settings)}`);

    electronComponents.windows[OVERLAY_WINDOW_KEY].webContents.send("update-settings", settings);
}
