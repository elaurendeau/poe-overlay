import logger from "@/backend/logger/logger";
import { electronComponents, OVERLAY_CAPTURE_POSITION_EDITOR_WINDOW_KEY, OVERLAY_DISPLAY_POSITION_EDITOR_WINDOW_KEY, SETTINGS_WINDOW_KEY } from "@/backend/electron-component/electron-components";
import { RectangleModel } from "@/backend/model/rectangle-model";
import { SettingsOverlayPositionEditorModel } from "@/backend/model/settings-overlay-position-editor-model";

export function resizeDisplay() {
    const captureWindow = electronComponents.windows[OVERLAY_CAPTURE_POSITION_EDITOR_WINDOW_KEY];
    const windowSize = captureWindow.getSize();

    const displayWindow = electronComponents.windows[OVERLAY_DISPLAY_POSITION_EDITOR_WINDOW_KEY];
    const windowPosition = displayWindow.getPosition();

    const windowLocation = {
        startX: windowPosition[0],
        startY: windowPosition[1],
        endX: windowPosition[0] + windowSize[0],
        endY: windowPosition[1] + windowSize[1],
    } as RectangleModel;

    displayWindow.setSize(windowSize[0], windowSize[1]);
    updateOverlayDisplayPositionCoordinates();
}

export function updateOverlayCapturePositionCoordinates() {
    const window = electronComponents.windows[OVERLAY_CAPTURE_POSITION_EDITOR_WINDOW_KEY];
    const windowSize = window.getSize();
    const windowPosition = window.getPosition();

    const windowLocation = {
        startX: windowPosition[0],
        startY: windowPosition[1],
        endX: windowPosition[0] + windowSize[0],
        endY: windowPosition[1] + windowSize[1],
    } as RectangleModel;

    logger.debug(`${OVERLAY_CAPTURE_POSITION_EDITOR_WINDOW_KEY} resized to ${JSON.stringify(windowLocation)}.`);
    const settingsWindow = electronComponents.windows[SETTINGS_WINDOW_KEY];
    settingsWindow.webContents.send("resize-overlay-capture-position-editor", windowLocation);
}
export function updateOverlayDisplayPositionCoordinates() {
    const window = electronComponents.windows[OVERLAY_DISPLAY_POSITION_EDITOR_WINDOW_KEY];
    const windowSize = window.getSize();
    const windowPosition = window.getPosition();

    const windowLocation = {
        startX: windowPosition[0],
        startY: windowPosition[1],
        endX: windowPosition[0] + windowSize[0],
        endY: windowPosition[1] + windowSize[1],
    } as RectangleModel;

    logger.debug(`${OVERLAY_DISPLAY_POSITION_EDITOR_WINDOW_KEY} resized to ${JSON.stringify(windowLocation)}.`);

    const settingsWindow = electronComponents.windows[SETTINGS_WINDOW_KEY];
    settingsWindow.webContents.send("resize-overlay-display-position-editor", windowLocation);
}

export function createDefaultSettingsOverlayPositionEditorSettings(): SettingsOverlayPositionEditorModel {
    return {
        capturePositionEditorColor: "#00F8FF38",
        displayPositionEditorColor: "#8300FF38",
    } as SettingsOverlayPositionEditorModel;
}
