import logger from "@/backend/logger/logger";
import {
  electronComponents,
  OVERLAY_POSITION_EDITOR_WINDOW_KEY,
  SETTINGS_WINDOW_KEY,
} from "@/backend/electron-component/electron-components";
import { RectangleModel } from "@/backend/model/rectangle-model";
import { SettingsOverlayPositionEditorModel } from "@/backend/model/settings-overlay-position-editor-model";

export function updateOverlayPositionCoordinates() {
  const window = electronComponents.windows[OVERLAY_POSITION_EDITOR_WINDOW_KEY];
  const windowSize = window.getSize();
  const windowPosition = window.getPosition();

  const windowLocation = {
    startX: windowPosition[0],
    startY: windowPosition[1],
    endX: windowPosition[0] + windowSize[0],
    endY: windowPosition[1] + windowSize[1],
  } as RectangleModel;

  logger.debug(
    `${OVERLAY_POSITION_EDITOR_WINDOW_KEY} resized to ${JSON.stringify(
      windowLocation
    )}.`
  );

  const settingsWindow = electronComponents.windows[SETTINGS_WINDOW_KEY];
  settingsWindow.webContents.send(
    "resize-overlay-position-editor",
    windowLocation
  );
}

export function createDefaultSettingsOverlayPositionEditorSettings(): SettingsOverlayPositionEditorModel {
  return {
    capturePositionEditorColor: "#00F8FF38",
    displayPositionEditorColor: "#8300FF38",
  } as SettingsOverlayPositionEditorModel;
}
