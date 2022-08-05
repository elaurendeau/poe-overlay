import { SettingsScreenCaptureModel } from "@/backend/model/settings-screen-capture";
import { SettingsOverlayModel } from "@/backend/model/settings-overlay-model";

export interface ProfileModel {
    id: string;
    name: string;
    isDefaultProfile: boolean;
    settingsScreenCapture: SettingsScreenCaptureModel;
    settingsOverlay: SettingsOverlayModel;
}