import { app, Menu, Tray } from "electron";
import { electronComponents, OVERLAY_WINDOW_KEY, SETTINGS_WINDOW_KEY, WindowsKey } from "@/backend/electron-component/electron-components";

export function createTray(): Tray {
    const tray = new Tray("./public/img/icons/blind.png");
    tray.setToolTip("POE Overlay");
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "Settings",
            click: () => {
                electronComponents.windows[SETTINGS_WINDOW_KEY].show();
            },
        },
        {
            label: "Overlay",
            type: "checkbox",
            checked: true,
            click: () => {
                const window = electronComponents.windows[OVERLAY_WINDOW_KEY];
                if (window.isVisible()) {
                    window.hide();
                } else {
                    window.show();
                }
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
