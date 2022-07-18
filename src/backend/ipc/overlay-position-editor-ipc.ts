import { ipcMain } from "electron";
import { electronComponents, OVERLAY_CAPTURE_POSITION_EDITOR_WINDOW_KEY, OVERLAY_DISPLAY_POSITION_EDITOR_WINDOW_KEY } from "@/backend/electron-component/electron-components";
import logger from "@/backend/logger/logger";
import { createCaptureOverlayPositionEditorWindow } from "@/backend/electron-component/window/overlay-capture-position-editor-window";
import { OverlayModel } from "@/backend/model/overlay-model";
import { SettingsOverlayPositionEditorModel } from "@/backend/model/settings-overlay-position-editor-model";
import { createDisplayOverlayPositionEditorWindow } from "@/backend/electron-component/window/overlay-display-position-editor-window";

export const toggleCaptureOverlayPositionEditor = ipcMain.on("toggle-overlay-capture-position-editor", async (event, overlay: OverlayModel) => {
    logger.debug(`SettingsOverlayEditComponent.send -> toggle-overlay-capture-position-editor: ${JSON.stringify(overlay)}`);
    let window = electronComponents.windows[OVERLAY_CAPTURE_POSITION_EDITOR_WINDOW_KEY];

    if (!window) {
        window = createCaptureOverlayPositionEditorWindow();
    }

    logger.debug(`Current width ${overlay.captureRectangle.endX - overlay.captureRectangle.startX}`);
    logger.debug(`Current height ${overlay.captureRectangle.endY - overlay.captureRectangle.startY}`);
    window.setSize(overlay.captureRectangle.endX - overlay.captureRectangle.startX, overlay.captureRectangle.endY - overlay.captureRectangle.startY);
    logger.debug(`Current position x ${overlay.captureRectangle.startX}`);
    logger.debug(`Current position y ${overlay.captureRectangle.startY}`);
    window.setPosition(overlay.captureRectangle.startX, overlay.captureRectangle.startY);

    if (window.isVisible()) {
        logger.debug("OverlayCapturePositionEditor isVisible, hiding!");
        window.hide();
    } else {
        logger.debug("OverlayCapturePositionEditor is not Visible, showing!");
        window.show();
    }
});

export const toggleDisplayOverlayPositionEditor = ipcMain.on("toggle-overlay-display-position-editor", async (event, overlay: OverlayModel) => {
    logger.debug(`SettingsOverlayEditComponent.send -> toggle-overlay-display-position-editor: ${JSON.stringify(overlay)}`);
    let window = electronComponents.windows[OVERLAY_DISPLAY_POSITION_EDITOR_WINDOW_KEY];

    if (!window) {
        window = createDisplayOverlayPositionEditorWindow();
    }

    logger.debug(`Current width ${overlay.displayRectangle.endX - overlay.displayRectangle.startX}`);
    logger.debug(`Current height ${overlay.displayRectangle.endY - overlay.displayRectangle.startY}`);
    window.setSize(overlay.displayRectangle.endX - overlay.displayRectangle.startX, overlay.displayRectangle.endY - overlay.displayRectangle.startY);
    logger.debug(`Current position x ${overlay.displayRectangle.startX}`);
    logger.debug(`Current position y ${overlay.displayRectangle.startY}`);
    window.setPosition(overlay.displayRectangle.startX, overlay.displayRectangle.startY);

    if (window.isVisible()) {
        logger.debug("OverlayDisplayPositionEditor isVisible, hiding!");
        window.hide();
    } else {
        logger.debug("OverlayDisplayPositionEditor is not Visible, showing!");
        window.show();
    }
});

export const hideOverlayPositionEditor = ipcMain.on("hide-overlay-position-editor", async (event, args) => {
    logger.debug("OverlayPositionEditor hiding!");
    electronComponents.windows[OVERLAY_CAPTURE_POSITION_EDITOR_WINDOW_KEY].hide();
    electronComponents.windows[OVERLAY_DISPLAY_POSITION_EDITOR_WINDOW_KEY].hide();
});

export function updateOverlayPositionEditorSettings(settingsOverlayPositionEditorModel: SettingsOverlayPositionEditorModel) {
    logger.debug(`OverlayPositionEditorWindow.send -> change-settings-overlay-position-editor: ${JSON.stringify(settingsOverlayPositionEditorModel)}`);

    electronComponents.windows[OVERLAY_CAPTURE_POSITION_EDITOR_WINDOW_KEY].webContents.send("change-settings-overlay-position-editor", settingsOverlayPositionEditorModel);

    electronComponents.windows[OVERLAY_DISPLAY_POSITION_EDITOR_WINDOW_KEY].webContents.send("change-settings-overlay-position-editor", settingsOverlayPositionEditorModel);
}
