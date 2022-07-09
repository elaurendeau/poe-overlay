import { ipcMain } from "electron";
import {
  electronComponents,
  GRID_WINDOW_KEY,
} from "@/backend/electron-component/electron-components";
import { createGridWindow } from "@/backend/electron-component/window/grid-window";
import logger from "@/backend/logger/logger";
import { SettingsGridModel } from "@/backend/model/settings-grid-model";

export const toggleGrid = ipcMain.on("toggle-grid", async (event, args) => {
  let gridWindow = electronComponents.windows[GRID_WINDOW_KEY];

  if (!gridWindow) {
    gridWindow = createGridWindow();
  }

  if (gridWindow.isVisible()) {
    logger.debug("isVisible, hiding!");
    gridWindow.hide();
  } else {
    logger.debug("is not Visible, showing!");
    gridWindow.show();
  }
});

export function updateGridWindowSettings(gridSettings: SettingsGridModel) {
  logger.debug(
    `GridWindow.send -> update-grid-settings: ${JSON.stringify(gridSettings)}`
  );

  const gridWindow = electronComponents.windows["GRID_WINDOW"];
  logger.debug("test before");
  // setTimeout(() => {
  //   logger.debug("test hello");
  gridWindow.webContents.send("update-grid-settings", gridSettings);
  // }, 10000);
}
