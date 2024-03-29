import { SettingsModel } from "@/backend/model/settings-model";
import logger from "@/backend/logger/logger";
import electron from "electron";
import path from "path";
import * as fs from "fs";
import { createDefaultGridSettings } from "@/backend/manager/grid-manager";
import { updateGridWindowSettings } from "@/backend/ipc/grid-ipc";
import { updateOverlayPositionEditorSettings } from "@/backend/ipc/overlay-position-editor-ipc";
import { updateSettingsWindow } from "@/backend/ipc/settings-ipc";
import { OVERLAY_WINDOW_KEY, SETTINGS_WINDOW_KEY } from "@/backend/electron-component/electron-components";
import { createDefaultProfile, getCurrentProfile } from "@/backend/manager/profile-manager";
import { ProfileModel } from "@/backend/model/profile-model";
import { createDefaultSettingsOverlayPositionEditorSettings } from "@/backend/manager/overlay-position-editor-manager";
import { updateOverlayProfile } from "@/backend/ipc/overlay-ipc";

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
    const profileDefaultArray: Array<ProfileModel> = [];
    profileDefaultArray.push(createDefaultProfile());

    return {
        settingsGrid: createDefaultGridSettings(),
        settingsOverlayPositionEditor: createDefaultSettingsOverlayPositionEditorSettings(),
        profileArray: profileDefaultArray,
    } as SettingsModel;
}

export function updateAllSettings(settings: SettingsModel) {
    updateSettingsWindow(settings, SETTINGS_WINDOW_KEY);
    updateSettingsWindow(settings, OVERLAY_WINDOW_KEY);
    updateGridWindowSettings(settings.settingsGrid);
    updateOverlayPositionEditorSettings(settings.settingsOverlayPositionEditor);
    updateOverlayProfile(settings);
}
