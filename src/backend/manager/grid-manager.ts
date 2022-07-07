import { SettingsGridModel } from "@/backend/model/settings-grid-model";
import ipcMain = Electron.Main.ipcMain;

export function updateGridBySettings(gridSettings: SettingsGridModel) {
  ipcMain.emit("update-grid", gridSettings);
}

export function validateGridSettings(gridSettings: SettingsGridModel) {
  if (
    !gridSettings.columnCount ||
    gridSettings.columnCount < 1 ||
    gridSettings.columnCount > 20
  ) {
    throw new Error(
      `Invalid column count at '${gridSettings.columnCount}'. Shouldn't be null, < 1 or > 20`
    );
  }

  if (
    !gridSettings.rowCount ||
    gridSettings.rowCount < 1 ||
    gridSettings.rowCount > 20
  ) {
    throw new Error(
      `Invalid row count at '${gridSettings.rowCount}'. Shouldn't be null, < 1 or > 20`
    );
  }
}
