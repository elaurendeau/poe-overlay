import { app, Menu, Tray } from "electron";
import { createSettingsWindow } from "@/window/settings-window";
import {
  electronComponents,
  SETTINGS_WINDOW_KEY,
  WindowsKey,
} from "@/electron-components";

export function createTray(): Tray {
  const tray = new Tray("./public/img/icons/blind.png");
  tray.setToolTip("POE Overlay");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Settings",
      click: () => {
        if (!electronComponents.windows[SETTINGS_WINDOW_KEY]) {
          createSettingsWindow();
        }
        electronComponents.windows[SETTINGS_WINDOW_KEY].show();
      },
    },
    {
      label: "Exit",
      click: () => {
        app.exit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
  electronComponents.tray = tray;
  return tray;
}
