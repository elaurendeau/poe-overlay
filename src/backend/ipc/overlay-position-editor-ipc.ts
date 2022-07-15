import { ipcMain } from "electron";
import {
  electronComponents,
  OVERLAY_POSITION_EDITOR_WINDOW_KEY,
} from "@/backend/electron-component/electron-components";
import logger from "@/backend/logger/logger";
import { createOverlayPositionEditorWindow } from "@/backend/electron-component/window/overlay-position-editor-window";
import { OverlayModel } from "@/backend/model/overlay-model";
import { SettingsGridModel } from "@/backend/model/settings-grid-model";
import { SettingsOverlayPositionEditorModel } from "@/backend/model/settings-overlay-position-editor-model";

export const toggleOverlayPositionEditor = ipcMain.on(
  "toggle-overlay-position-editor",
  async (event, overlay: OverlayModel) => {
    let window = electronComponents.windows[OVERLAY_POSITION_EDITOR_WINDOW_KEY];

    if (!window) {
      window = createOverlayPositionEditorWindow();
    }

    logger.debug(
      `Current width ${
        overlay.captureRectangle.endX - overlay.captureRectangle.startX
      }`
    );
    logger.debug(
      `Current height ${
        overlay.captureRectangle.endY - overlay.captureRectangle.startY
      }`
    );
    window.setSize(
      overlay.captureRectangle.endX - overlay.captureRectangle.startX,
      overlay.captureRectangle.endY - overlay.captureRectangle.startY
    );
    logger.debug(`Current position x ${overlay.captureRectangle.startX}`);
    logger.debug(`Current width ${overlay.captureRectangle.startY}`);
    window.setPosition(
      overlay.captureRectangle.startX,
      overlay.captureRectangle.startY
    );

    if (window.isVisible()) {
      logger.debug("OverlayPositionEditor isVisible, hiding!");
      window.hide();
    } else {
      logger.debug("OverlayPositionEditor is not Visible, showing!");
      window.show();
    }
  }
);

export const hideOverlayPositionEditor = ipcMain.on(
  "hide-overlay-position-editor",
  async (event, args) => {
    let window = electronComponents.windows[OVERLAY_POSITION_EDITOR_WINDOW_KEY];

    if (!window) {
      window = createOverlayPositionEditorWindow();
    }

    logger.debug("OverlayPositionEditor hiding!");
    window.hide();
  }
);

export function updateOverlayPositionEditorSettings(
  settingsOverlayPositionEditorModel: SettingsOverlayPositionEditorModel
) {
  logger.debug(
    `OverlayPositionEditorWindow.send -> change-settings-overlay-position-editor: ${JSON.stringify(
      settingsOverlayPositionEditorModel
    )}`
  );

  const window = electronComponents.windows[OVERLAY_POSITION_EDITOR_WINDOW_KEY];
  window.webContents.send(
    "change-settings-overlay-position-editor",
    settingsOverlayPositionEditorModel
  );
}
