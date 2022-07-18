import { RectangleModel } from "@/backend/model/rectangle-model";

export interface OverlayModel {
    id: string;
    name: string;
    captureRectangle: RectangleModel;
    displayRectangle: RectangleModel;
}
