import { RefererStats } from "./referrer-dynamo";

export type GetMetricsByCodeRequest = {
  code: string;
};

export type GetMetricsByCodeResponse = {
  success: boolean;
  message: string;
  registered: boolean;
  record: RefererStats;
};
