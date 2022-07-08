import { ipcMain } from "electron";
import logger from "@/backend/logger/logger";
import {
  electronComponents,
  SETTINGS_WINDOW_KEY,
} from "@/backend/electron-component/electron-components";
import { SettingsModel } from "@/backend/model/settings-model";
import { validateGridSettings } from "@/backend/manager/grid-manager";

export const hideSettings = ipcMain.on("hide-settings", async (event, args) => {
  logger.info("IpcMain.receive -> hide-settings");

  electronComponents.windows[SETTINGS_WINDOW_KEY].hide();
});
export const saveSettings = ipcMain.on(
  "save-settings",
  async (event, settings: SettingsModel) => {
    logger.info(
      `IpcMain.receive -> save-settings: ${JSON.stringify(settings)}`
    );

    try {
      validateGridSettings(settings.settingsGrid);
    } catch (e) {
      //Do nothing for now
      logger.error(e);
    }
  }
);
