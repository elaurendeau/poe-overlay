import { SettingsGridModel } from "@/backend/model/settings-grid-model";
import { SettingsOverlayModel } from "@/backend/model/settings-overlay-model";
import { SettingsOverlayPositionEditorModel } from "@/backend/model/settings-overlay-position-editor-model";
import { SettingsScreenCaptureModel } from "@/backend/model/settings-screen-capture";

export interface SettingsModel {
    settingsGrid: SettingsGridModel;
    settingsOverlay: SettingsOverlayModel;
    settingsOverlayPositionEditor: SettingsOverlayPositionEditorModel;
    settingsScreenCapture: SettingsScreenCaptureModel;
}
