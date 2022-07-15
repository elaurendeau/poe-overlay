import { SettingsGridModel } from "@/backend/model/settings-grid-model";
import { app, screen } from "electron";

export function validateGridSettings(gridSettings: SettingsGridModel) {
  if (
    !gridSettings.columnCount ||
    gridSettings.columnCount < 1 ||
    gridSettings.columnCount > 200
  ) {
    throw new Error(
      `Invalid column count at '${gridSettings.columnCount}'. Shouldn't be null, < 1 or > 20`
    );
  }

  if (
    !gridSettings.rowCount ||
    gridSettings.rowCount < 1 ||
    gridSettings.rowCount > 200
  ) {
    throw new Error(
      `Invalid row count at '${gridSettings.rowCount}'. Shouldn't be null, < 1 or > 20`
    );
  }
}
export function createDefaultGridSettings(): SettingsGridModel {
  // 2560 x 1440
  const primaryDisplay = screen.getPrimaryDisplay();
  const displayWidth = primaryDisplay.size.width;
  const displayHeight = primaryDisplay.size.height;

  return {
    columnCount: displayWidth / 20,
    rowCount: displayHeight / 20,
    displayCenterLines: true,
    color: "#FF000039",
  } as SettingsGridModel;
}
