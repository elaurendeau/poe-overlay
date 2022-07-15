import { contextBridge, ipcRenderer } from "electron";
import logger from "@/backend/logger/logger";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    logger.debug(`IpcBridge.front -> ${channel}`);
    const validChannels = [
      "hide-settings",
      "toggle-grid",
      "save-settings",
      "refresh-settings-window-array",
      "toggle-overlay-position-editor",
      "hide-overlay-position-editor",
    ];
    if (validChannels.includes(channel)) {
      logger.debug(`IpcBridge.front -> ${channel} whitelisted`);
      ipcRenderer.send(channel, data);
    }
  },

  receive: (channel, callback) => {
    const validChannels = [
      "update-grid-settings",
      "update-settings",
      "update-settings-window-list",
      "resize-overlay-position-editor",
      "change-settings-overlay-position-editor",
    ];
    logger.debug(`IpcBridge.back -> ${channel}`);
    if (validChannels.includes(channel)) {
      logger.debug(`IpcBridge.back -> ${channel} whitelisted`);
      ipcRenderer.on(channel, callback);
    }
  },
});
