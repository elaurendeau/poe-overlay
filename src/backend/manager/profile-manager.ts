import { v4 as uuidv4 } from "uuid";
import { ProfileModel } from "@/backend/model/profile-model";
import { createDefaultScreenCaptureSettings } from "@/backend/manager/window-properties-manager";
import { getSettings } from "@/backend/manager/settings-manager";
import { createDefaultOverlaySettings } from "@/backend/manager/overlay-manager";

let currentProfile: ProfileModel;

export function getCurrentProfile(): ProfileModel | null {
    if (currentProfile) {
        const settings = getSettings();
        const profileModel = settings.profileArray.find((profile) => profile.id === currentProfile.id);
        if (profileModel) {
            return profileModel;
        }
    }
    return null;
}

export function createDefaultProfile(): ProfileModel {
    return {
        id: uuidv4(),
        name: "default",
        isDefaultProfile: true,
        settingsScreenCapture: createDefaultScreenCaptureSettings(),
        settingsOverlay: createDefaultOverlaySettings(),
    } as ProfileModel;
}
