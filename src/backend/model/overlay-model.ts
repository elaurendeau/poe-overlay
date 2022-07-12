import { CoordinateModel } from "@/backend/model/coordinate-model";

export interface OverlayModel {
  id: string;
  name: string;
  captureCoordinate: CoordinateModel;
  captureLength: CoordinateModel;
  displayCoordinate: CoordinateModel;
}
