import { ipcMain } from "electron";
import logger from "@/backend/logger/logger";
import {
  electronComponents,
  SETTINGS_WINDOW_KEY,
} from "@/backend/electron-component/electron-components";
import { SettingsModel } from "@/backend/model/settings-model";
import { validateGridSettings } from "@/backend/manager/grid-manager";

import { writeSettings } from "@/backend/manager/settings-manager";
import { updateGridWindowSettings } from "@/backend/ipc/grid-ipc";

export const hideSettings = ipcMain.on("hide-settings", async (event, args) => {
  logger.debug("IpcMain.receive -> hide-settings");

  electronComponents.windows[SETTINGS_WINDOW_KEY].hide();
});
export const saveSettings = ipcMain.on(
  "save-settings",
  async (event, settings: SettingsModel) => {
    logger.debug(
      `IpcMain.receive -> save-settings: ${JSON.stringify(settings)}`
    );

    try {
      validateGridSettings(settings.settingsGrid);
      writeSettings(settings);
      updateGridWindowSettings(settings.settingsGrid);
    } catch (e) {
      //Do nothing for now
      logger.error(e);
    }
  }
);