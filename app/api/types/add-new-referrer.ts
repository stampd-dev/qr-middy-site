export type AddNewReferrerRequest = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type AddNewReferrerResponse = {
  success: boolean;
  qrCodeLink: string;
  qrCodeImage: string;
  message: string;
};
