import { ipcMain } from "electron";
import {
  electronComponents,
  OVERLAY_POSITION_EDITOR_WINDOW_KEY,
} from "@/backend/electron-component/electron-components";
import logger from "@/backend/logger/logger";
import { createOverlayPositionEditorWindow } from "@/backend/electron-component/window/overlay-position-editor-window";

export const toggleOverlayPositionEditor = ipcMain.on(
  "toggle-overlay-position-editor",
  async (event, args) => {
    let window = electronComponents.windows[OVERLAY_POSITION_EDITOR_WINDOW_KEY];

    if (!window) {
      window = createOverlayPositionEditorWindow();
    }

    if (window.isVisible()) {
      logger.debug("OverlayPositionEditor isVisible, hiding!");
      window.hide();
    } else {
      logger.debug("OverlayPositionEditor is not Visible, showing!");
      window.show();
    }
  }
);
