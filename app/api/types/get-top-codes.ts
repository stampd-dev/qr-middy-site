import { SplashLocation } from "./referrer-dynamo";

export type GetTopCodesResponse = {
  success: boolean;
  message: string;
  mostRipples: {
    first: {
      name: string;
      totalUniqueScans: number;
    };
    second: {
      name: string;
      totalUniqueScans: number;
    };
  };
  furthestRipples: {
    first: {
      name: string;
      locations: SplashLocation[];
    };
    second: {
      name: string;
      locations: SplashLocation[];
    };
  };
};
