export type SignupRequest = {
  name: string;
  email: string;
  password: string;
}

export type SignupResponse = {
  accessToken: string;
  message: string;
}

export type LoginPasswordRequest = {
  email: string;
  password: string;
};

export type LoginPasswordResponse = {
  accessToken: string;
  message: string;
};

export type RequestLoginOtpRequest = {
  email: string;
}

export type RequestLoginOtpResponse = {
  message: string;
}

export type VerifyLoginOtpRequest = {
  email: string;
  otp: string;
}

export type VerifyLoginOtpResponse = {
  accessToken: string;
  message: string;
}
