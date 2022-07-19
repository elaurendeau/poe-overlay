import { electronComponents, WindowsKey } from "@/backend/electron-component/electron-components";
import { desktopCapturer } from "electron";
import { WindowPropertiesModel } from "@/backend/model/window-properties-model";

export function sendWindowPropertiesArray(windowSourceArray: Array<WindowPropertiesModel>, windowKey: WindowsKey) {
    electronComponents.windows[windowKey].webContents.send("update-window-list", windowSourceArray);
}
