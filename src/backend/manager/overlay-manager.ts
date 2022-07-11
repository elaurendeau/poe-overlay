import { SettingsOverlayModel } from "@/backend/model/settings-overlay-model";

export function createDefaultOverlaySettings(): SettingsOverlayModel {
  const settingsOverlay: SettingsOverlayModel = {
    programName: "",
  };

  return settingsOverlay;
}
