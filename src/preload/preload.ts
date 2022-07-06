import { contextBridge, ipcRenderer } from "electron";
import { logger } from "@/logger/logger";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    // whitelist channels
    logger.info(`IpcBridge.front -> ${channel}`);
    const validChannels = ["hide-settings", "toggle-grid", "save-settings"];
    logger.info(`IpcBridge.front -> ${channel} whitelisted`);
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = ["update-grid"];
    logger.info(`IpcBridge.back -> ${channel}`);
    if (validChannels.includes(channel)) {
      logger.info(`IpcBridge.back -> ${channel} whitelisted`);
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  },
});
