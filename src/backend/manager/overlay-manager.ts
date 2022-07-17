import { SettingsOverlayModel } from "@/backend/model/settings-overlay-model";

export function createDefaultOverlaySettings(): SettingsOverlayModel {
  return {
    overlayArray: [],
  } as SettingsOverlayModel;
}
