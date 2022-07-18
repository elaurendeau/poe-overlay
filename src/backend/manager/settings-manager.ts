import { SettingsModel } from "@/backend/model/settings-model";
import logger from "@/backend/logger/logger";
import electron from "electron";
import path from "path";
import * as fs from "fs";
import { createDefaultGridSettings } from "@/backend/manager/grid-manager";
import { createDefaultOverlaySettings } from "@/backend/manager/overlay-manager";
import { createDefaultSettingsOverlayPositionEditorSettings } from "@/backend/manager/overlay-position-editor-manager";
import { updateGridWindowSettings } from "@/backend/ipc/grid-ipc";
import { updateOverlayPositionEditorSettings } from "@/backend/ipc/overlay-position-editor-ipc";
import { updateSettingsWindow } from "@/backend/ipc/settings-ipc";
import { createDefaultScreenCaptureSettings } from "@/backend/manager/screen-capture-manager";
import { updateOverlayWindow } from "@/backend/ipc/overlay-ipc";

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

        return JSON.parse(settingsRawData);
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
    return {
        settingsGrid: createDefaultGridSettings(),
        settingsOverlay: createDefaultOverlaySettings(),
        settingsOverlayPositionEditor: createDefaultSettingsOverlayPositionEditorSettings(),
        settingsScreenCapture: createDefaultScreenCaptureSettings(),
    } as SettingsModel;
}

export function updateAllSettings(settings: SettingsModel) {
    updateSettingsWindow(settings);
    updateGridWindowSettings(settings.settingsGrid);
    updateOverlayPositionEditorSettings(settings.settingsOverlayPositionEditor);
    updateOverlayWindow(settings);
}
