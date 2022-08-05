import { SettingsGridModel } from "@/backend/model/settings-grid-model";
import { ProfileModel } from "@/backend/model/profile-model";
import { SettingsOverlayPositionEditorModel } from "@/backend/model/settings-overlay-position-editor-model";

export interface SettingsModel {
    settingsGrid: SettingsGridModel;
    settingsOverlayPositionEditor: SettingsOverlayPositionEditorModel;
    profileArray: ProfileModel[];
}
