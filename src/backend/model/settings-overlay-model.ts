import { OverlayModel } from "@/backend/model/overlay-model";

export interface SettingsOverlayModel {
  programName: string;
  overlayArray: Array<OverlayModel>;
}
