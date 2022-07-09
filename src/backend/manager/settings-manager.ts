import { SettingsModel } from "@/backend/model/settings-model";
import logger from "@/backend/logger/logger";
import electron from "electron";
import path from "path";
import { SettingsGridModel } from "@/backend/model/settings-grid-model";
import * as fs from "fs";

const userDataPath = (electron.app || electron.remote.app).getPath("userData");
const SETTINGS_FILE_PATH = path.join(userDataPath, "settings.json");

let currentSettings: SettingsModel = readSettings();

export function getSettings(): SettingsModel {
  return currentSettings;
}

export function writeSettings(settings: SettingsModel) {
  currentSettings = settings;
  logger.debug(`Writing settings data to ${SETTINGS_FILE_PATH}`);
  fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2));
}

export function readSettings(): SettingsModel {
  logger.debug(`Reading settings data from ${SETTINGS_FILE_PATH}`);
  const settingsRawData = fs.readFileSync(SETTINGS_FILE_PATH, "utf-8");
  const settings: SettingsModel = JSON.parse(settingsRawData);

  return settings;
}

export function createDefaultSettings(): SettingsModel {
  const settingsGrid: SettingsGridModel = {
    rowCount: 5,
    columnCount: 5,
  };
  const settings: SettingsModel = {
    settingsGrid: settingsGrid,
  };
  return settings;
}
