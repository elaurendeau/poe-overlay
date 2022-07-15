import { SettingsOverlayModel } from "@/backend/model/settings-overlay-model";

export function createDefaultOverlaySettings(): SettingsOverlayModel {
  return {
    programName: "Path of Exile",
    overlayArray: [],
  } as SettingsOverlayModel;
}
