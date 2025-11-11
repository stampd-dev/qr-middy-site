import { QrMetricsUpdateInput } from "./qr-metrics";

export type UpdateCodeMetricsRequest = {
  code: string;
  metrics: QrMetricsUpdateInput;
};

export type UpdateCodeMetricsResponse = {
  success: boolean;
  message: string;
};
