import { SettingsGridModel } from "@/backend/model/settings-grid-model";
import { SettingsOverlayModel } from "@/backend/model/settings-overlay-model";

export interface SettingsModel {
  settingsGrid: SettingsGridModel;
  settingsOverlay: SettingsOverlayModel;
}
