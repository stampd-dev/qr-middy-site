export type GetMostRecentRipplesResponse = {
  success: boolean;
  message: string;
  ripples: { location: string; referrer: string }[];
};
