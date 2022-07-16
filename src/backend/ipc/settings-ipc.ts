import { desktopCapturer, ipcMain } from "electron";
import logger from "@/backend/logger/logger";
import {
  electronComponents,
  SETTINGS_WINDOW_KEY,
} from "@/backend/electron-component/electron-components";
import { SettingsModel } from "@/backend/model/settings-model";
import { validateGridSettings } from "@/backend/manager/grid-manager";

import {
  updateAllSettings,
  writeSettings,
} from "@/backend/manager/settings-manager";
import { WindowSourcePropertiesModel } from "@/backend/model/window-source-properties-model";

export const hideSettings = ipcMain.on("hide-settings", async (event, args) => {
  logger.debug("IpcMain.receive -> hide-settings");

  electronComponents.windows[SETTINGS_WINDOW_KEY].hide();
});

export const refreshWindowNameArray = ipcMain.on(
  "refresh-settings-window-array",
  async (event, args) => {
    logger.debug("IpcMain.receive -> refresh-settings-window-array");

    desktopCapturer
      .getSources({ types: ["window", "screen"] })
      .then(async (sources) => {
        event.reply(
          "update-settings-window-list",
          sources.map((source) => {
            return {
              programName: source.name,
              programId: source.id,
            } as WindowSourcePropertiesModel;
          })
        );
      });
  }
);
export const saveSettings = ipcMain.on(
  "save-settings",
  async (event, settings: SettingsModel) => {
    logger.debug(
      `IpcMain.receive -> save-settings: ${JSON.stringify(settings)}`
    );

    try {
      validateGridSettings(settings.settingsGrid);
      writeSettings(settings);
      updateAllSettings(settings);
    } catch (e) {
      //Do nothing for now
      logger.error(e);
    }
  }
);

export function updateSettingsWindow(settings: SettingsModel) {
  logger.debug(
    `SettingsWindow.send -> update-settings: ${JSON.stringify(settings)}`
  );

  const window = electronComponents.windows["SETTING_WINDOW"];
  window.webContents.send("update-settings", settings);
}

export function updateSettingsWindowList(windowList: Array<string>) {
  logger.debug(
    `SettingsWindow.send -> update-settings-window-list: ${JSON.stringify(
      windowList
    )}`
  );

  const window = electronComponents.windows["SETTING_WINDOW"];
  window.webContents.send("update-settings-window-list", windowList);
}
