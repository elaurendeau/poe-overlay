import { contextBridge, ipcRenderer } from "electron";
import logger from "@/backend/logger/logger";
import { WindowPropertiesModel } from "@/backend/model/window-properties-model";
import { OverlayModel } from "@/backend/model/overlay-model";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
    send: (channel, data) => {
        // whitelist channels
        logger.debug(`Preload.send -> ${channel}`);
        const validChannels = [
            "hide-settings",
            "toggle-grid",
            "save-settings",
            "refresh-settings-window-array",
            "toggle-overlay-capture-position-editor",
            "toggle-overlay-display-position-editor",
            "hide-overlay-position-editor",
            "request-stream-full-window",
            "start-streaming",
        ];
        if (validChannels.includes(channel)) {
            logger.debug(`Preload.send -> ${channel} whitelisted`);
            ipcRenderer.send(channel, data);
        }
    },
    invoke: (channel, data) => {
        const validChannels = ["refresh-window-list"];
        logger.debug(`Preload.invoke -> ${channel}`);

        if (validChannels.includes(channel)) {
            logger.debug(`Preload.Invoke -> ${channel} whitelisted`);
            return ipcRenderer.invoke(channel, data);
        }
    },
    receive: (channel, callback) => {
        logger.debug(`Preload.receive -> ${channel}`);
        const validChannels = [
            "update-grid-settings",
            "update-window-list",
            "update-settings",
            "resize-overlay-display-position-editor",
            "resize-overlay-capture-position-editor",
            "change-settings-overlay-position-editor",
            "update-profile",
        ];

        if (validChannels.includes(channel)) {
            logger.debug(`Preload.receive -> ${channel} whitelisted `);
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
    overlayStream: async (channel: string, windowProperties: WindowPropertiesModel, overlayArray: OverlayModel[], htmlCanvasElement: HTMLCanvasElement, htmlVideoElementHidden: HTMLVideoElement, htmlVideoElementShown: HTMLVideoElement) => {
        console.log(`OverlayStream -> ${channel}`);
        console.log(`WindowProperties ${JSON.stringify(windowProperties)}`);

        htmlCanvasElement.width = 2560;
        htmlCanvasElement.height = 1440;

        navigator.mediaDevices
            .getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: "desktop",
                        chromeMediaSourceId: windowProperties.programId,
                    },
                },
            } as any)
            .then((mediaStream) => {
                console.log(`Inside of then mediaStream`);
                htmlVideoElementHidden.srcObject = mediaStream;

                const context = htmlCanvasElement.getContext("2d");

                const rVFC = () => {
                    context!.clearRect(0, 0, htmlCanvasElement.width, htmlCanvasElement.height);
                    overlayArray.forEach((overlay) => {
                        const displayWidth = overlay.displayRectangle.endX - overlay.displayRectangle.startX;
                        const displayHeight = overlay.displayRectangle.endY - overlay.displayRectangle.startY;

                        const captureWidth = overlay.captureRectangle.endX - overlay.captureRectangle.startX;
                        const captureHeight = overlay.captureRectangle.endY - overlay.captureRectangle.startY;

                        context!.drawImage(
                            htmlVideoElementHidden,
                            overlay.captureRectangle.startX,
                            overlay.captureRectangle.startY,
                            captureWidth,
                            captureHeight,
                            overlay.displayRectangle.startX,
                            overlay.displayRectangle.startY,
                            displayWidth,
                            captureHeight
                        ); // Draw the video image on your canvas
                    });

                    // ... Manipulate your canvas here ...
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    htmlVideoElementHidden.requestVideoFrameCallback(rVFC);
                };
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                htmlVideoElementHidden.requestVideoFrameCallback(rVFC);

                htmlVideoElementShown.srcObject = htmlCanvasElement.captureStream();
                htmlVideoElementShown.onloadedmetadata = (e) => htmlVideoElementShown.play();
            });
    },
});
