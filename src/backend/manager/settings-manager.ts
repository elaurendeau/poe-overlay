import { SettingsModel } from "@/backend/model/settings-model";
import logger from "@/backend/logger/logger";
import electron from "electron";
import path from "path";
import * as fs from "fs";
import { createDefaultGridSettings } from "@/backend/manager/grid-manager";
import { createDefaultOverlaySettings } from "@/backend/manager/overlay-manager";

const userDataPath = (electron.app || electron.remote.app).getPath("userData");
const SETTINGS_FILE_PATH = path.join(userDataPath, "settings.json");

let currentSettings: SettingsModel;

export function getSettings(): SettingsModel {
  if (!currentSettings) {
    currentSettings = readSettings();
  }
  return currentSettings;
}

export function writeSettings(settings: SettingsModel) {
  currentSettings = settings;
  logger.debug(`Writing settings data to ${SETTINGS_FILE_PATH}`);
  fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2));
}

export function readSettings(): SettingsModel {
  logger.debug(`Reading settings data from ${SETTINGS_FILE_PATH}`);

  try {
    const settingsRawData = fs.readFileSync(SETTINGS_FILE_PATH, "utf-8");

    const settings: SettingsModel = JSON.parse(settingsRawData);
    return settings;
  } catch (e) {
    if (e instanceof Error) {
      logger.error(`Unable to open or parse settings. ${e.message}`);
    } else {
      logger.error(`Unable to open or parse settings. ${e}`);
    }

    return createDefaultSettings();
  }
}

export function createDefaultSettings(): SettingsModel {
  const settings: SettingsModel = {
    settingsGrid: createDefaultGridSettings(),
    settingsOverlay: createDefaultOverlaySettings(),
  };
  return settings;
}
