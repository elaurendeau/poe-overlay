import { electronComponents, SETTINGS_WINDOW_KEY, WindowsKey } from "@/backend/electron-component/electron-components";
import { desktopCapturer, ipcMain } from "electron";
import { WindowPropertiesModel } from "@/backend/model/window-properties-model";
import logger from "@/backend/logger/logger";
import { getWindowPropertiesList } from "@/backend/manager/window-properties-manager";

export function sendWindowPropertiesArray(windowSourceArray: Array<WindowPropertiesModel>, windowKey: WindowsKey) {
    logger.debug(`IpcMain.send -> update-window-list to ${windowKey}: ${JSON.stringify(windowSourceArray)}`);
    electronComponents.windows[windowKey].webContents.send("update-window-list", windowSourceArray);
}
export const refreshWindowNameArray = ipcMain.handle("refresh-window-list", async (event, args) => {
    logger.debug("IpcMain.handle -> refresh-window-list");
    return await getWindowPropertiesList();
});
