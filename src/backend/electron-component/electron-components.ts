import { Tray, BrowserWindow } from "electron";

export const OVERLAY_WINDOW_KEY = "OVERLAY_WINDOW";
export const SETTINGS_WINDOW_KEY = "SETTING_WINDOW";
export const GRID_WINDOW_KEY = "GRID_WINDOW";

export type WindowsKey =
  | typeof OVERLAY_WINDOW_KEY
  | typeof SETTINGS_WINDOW_KEY
  | typeof GRID_WINDOW_KEY;

export type ElectronComponents = {
  tray: Tray | null;
  windows: Record<WindowsKey, BrowserWindow>;
};

export const electronComponents: ElectronComponents = {
  tray: null,
  windows: <Record<WindowsKey, BrowserWindow>>{},
};