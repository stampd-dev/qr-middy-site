export type RegisterCodeRequest = {
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nickname: string; //calc as first name + last name from form
  fingerprint: string;
};

export type RegisterCodeResponse = {
  success: boolean;
  message: string;
};
