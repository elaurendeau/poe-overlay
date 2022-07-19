import { SettingsScreenCaptureModel } from "@/backend/model/settings-screen-capture";
import { desktopCapturer } from "electron";
import { WindowPropertiesModel } from "@/backend/model/window-properties-model";
import { WindowsKey } from "@/backend/electron-component/electron-components";

export function createDefaultScreenCaptureSettings(): SettingsScreenCaptureModel {
    return {
        captureProgramName: "Path of Exile",
        displayProgramName: "Path of Exile",
    } as SettingsScreenCaptureModel;
}

export async function getWindowPropertiesList(): Promise<WindowPropertiesModel[]> {
    return desktopCapturer.getSources({ types: ["window", "screen"] }).then((array) => {
        return array.map((source) => {
            return {
                programName: source.name,
                programId: source.id,
            } as WindowPropertiesModel;
        });
    });
}
