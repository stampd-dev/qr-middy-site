export type GetTopCodesResponse = {
  success: boolean;
  message: string;
  furthest: {
    location: string;
    referrer: string;
    distanceFromOriginal: number;
  }[];
  most: {
    referrer: string;
    totalUniqueScans: number;
  }[];
};
