import { ipcMain } from "electron";
import { electronComponents, GRID_WINDOW_KEY, OVERLAY_WINDOW_KEY, PROFILE_PICKER_WINDOW_KEY, WindowsKey } from "@/backend/electron-component/electron-components";
import logger from "@/backend/logger/logger";
import { ProfileModel } from "@/backend/model/profile-model";
import { overlayWindow } from "electron-overlay-window";
import { getWindowPropertiesList } from "@/backend/manager/window-properties-manager";
import { sendWindowPropertiesArray } from "@/backend/ipc/window-properties-ipc";
import { SettingsModel } from "@/backend/model/settings-model";

let currentProfile: ProfileModel | null = null;

export const startStreaming = ipcMain.on("start-streaming", async (event, profile: ProfileModel) => {
    logger.debug("IpcMain.receive -> start-streaming");
    const windowPropertiesModels = await getWindowPropertiesList();
    const displayWindowProperties = windowPropertiesModels.filter((it) => it.programName === profile.settingsScreenCapture.displayProgramName)[0];

    currentProfile = profile;

    if (displayWindowProperties) {
        updateProfile(currentProfile, OVERLAY_WINDOW_KEY);

        const profilePickerWindow = electronComponents.windows[PROFILE_PICKER_WINDOW_KEY];
        profilePickerWindow.hide();

        const theOverlayWindow = electronComponents.windows[OVERLAY_WINDOW_KEY];
        theOverlayWindow.show();
        overlayWindow.attachTo(theOverlayWindow, currentProfile.settingsScreenCapture.displayProgramName);

        sendWindowPropertiesArray(windowPropertiesModels, OVERLAY_WINDOW_KEY);
    }
});

export function updateProfile(profile: ProfileModel, windowKey: WindowsKey) {
    logger.debug(`overlayIpc.send -> update-profile to ${windowKey}: ${JSON.stringify(profile)}`);

    electronComponents.windows[windowKey].webContents.send("update-profile", profile);
}

export function updateOverlayProfile(settings: SettingsModel) {
    if (currentProfile) {
        const updateCurrentProfile = settings.profileArray.find((it) => it.id == currentProfile!.id);

        if (updateCurrentProfile) {
            currentProfile = updateCurrentProfile;
            updateProfile(currentProfile, OVERLAY_WINDOW_KEY);
        } else {
            currentProfile = null;
        }
    }
}
