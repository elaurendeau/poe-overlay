import { SettingsScreenCaptureModel } from "@/backend/model/settings-screen-capture";

export function createDefaultScreenCaptureSettings(): SettingsScreenCaptureModel {
  return {
    programName: "Path of Exile",
  } as SettingsScreenCaptureModel;
}
