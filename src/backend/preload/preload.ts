import { contextBridge, ipcRenderer } from "electron";
import logger from "@/backend/logger/logger";
import { WindowPropertiesModel } from "@/backend/model/window-properties-model";
import { OverlayModel } from "@/backend/model/overlay-model";

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
            "toggle-overlay-capture-position-editor",
            "toggle-overlay-display-position-editor",
            "hide-overlay-position-editor",
            "request-stream-full-window",
        ];
        if (validChannels.includes(channel)) {
            logger.debug(`IpcBridge.front -> ${channel} whitelisted`);
            ipcRenderer.send(channel, data);
        }
    },

    receive: (channel, callback) => {
        const validChannels = ["update-grid-settings", "update-settings", "update-window-list", "resize-overlay-display-position-editor", "resize-overlay-capture-position-editor", "change-settings-overlay-position-editor"];
        logger.debug(`IpcBridge.back -> ${channel}`);
        if (validChannels.includes(channel)) {
            logger.debug(`IpcBridge.back -> ${channel} whitelisted ${JSON.stringify(callback)}`);
            ipcRenderer.on(channel, callback);
        }
    },

    stream: async (channel, windowSourceProperties: WindowPropertiesModel, htmlVideoElement: HTMLVideoElement) => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: windowSourceProperties.programId,
                },
            },
        } as any);

        htmlVideoElement.autoplay = true;
        htmlVideoElement.srcObject = stream;
        htmlVideoElement.onloadedmetadata = (e) => htmlVideoElement.play();
    },
    overlayStream: async (channel: string, windowProperties: WindowPropertiesModel, overlayArray: OverlayModel[], htmlCanvasElement: HTMLCanvasElement) => {
        console.log(`OverlayStream -> ${channel}`);
        console.log(`WindowProperties ${JSON.stringify(windowProperties)}`);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: windowProperties.programId,
                },
            },
        } as any);

        const video = document.createElement("video");
        video.width = 320;
        video.height = 240;
        video.autoplay = true;

        video.srcObject = stream;
        video.onloadedmetadata = (e) => video.play();

        var videoTexture = new THREE.Texture(video);
    },
});
