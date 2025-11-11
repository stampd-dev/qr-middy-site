import { RefererStats } from "./referrer-dynamo";

export type CreateNewReferrerRequest = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  ip: string;
  fingerprint: string;
};

export type CreateNewReferrerResponse = {
  success: boolean;
  message: string;
  new_referrer: RefererStats;
  qr_code_download_url: string;
  referral_link: string;
};
