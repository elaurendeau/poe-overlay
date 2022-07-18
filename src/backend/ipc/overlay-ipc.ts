import { SettingsModel } from "@/backend/model/settings-model";
import logger from "@/backend/logger/logger";
import { electronComponents, OVERLAY_WINDOW_KEY } from "@/backend/electron-component/electron-components";

export function updateOverlayWindow(settings: SettingsModel) {
    logger.debug(`OverlayWindow.send -> update-settings: ${JSON.stringify(settings)}`);

    electronComponents.windows[OVERLAY_WINDOW_KEY].webContents.send("update-settings", settings);
}
