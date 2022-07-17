import { SettingsScreenCaptureModel } from "@/backend/model/settings-screen-capture";
import { desktopCapturer } from "electron";
import { WindowSourcePropertiesModel } from "@/backend/model/window-source-properties-model";
import { electronComponents } from "@/backend/electron-component/electron-components";

export function createDefaultScreenCaptureSettings(): SettingsScreenCaptureModel {
  return {
    captureProgramName: "Path of Exile",
    displayProgramName: "Path of Exile",
  } as SettingsScreenCaptureModel;
}

export function sendScreenCaptureWindowList() {
  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async (sources) => {
      electronComponents.windows["SETTING_WINDOW"].webContents.send(
        "update-settings-window-list",
        sources.map((source) => {
          return {
            programName: source.name,
            programId: source.id,
          } as WindowSourcePropertiesModel;
        })
      );
    });
}
