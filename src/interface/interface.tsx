export type RootStackParamList = {
  Login: undefined;
  CodePhoneValidation: { phoneNumber: string };
  HomeScreen: undefined;
  PermissionsScreen: undefined;
};

export type RootStackParamListInitial = {
  Initial: undefined;
  RootStack: undefined;
};

export interface postNumberCodeResponse {
  codeValidationNumberSecurity: string
};

export interface PostUserResponse {
  user: Users;
  token: string;
}

export interface postCodeNumberVerifyData {
  phoneNumber: number
};

export interface postCodeCreateUserValidationData {
  code: string,
  codeValidationNumberSecurity: string
}

export interface loginData {
  numberPhone: string
};

export interface Users {
  uid: string,
  name: string,
  numberPhone: string,
  email: string,
  status: boolean,
  google: boolean,
  img: string,
  googleUserId: string,
  created: string
};

export interface Location {
  latitude: number,
  longitude: number
}

export interface postTripCalculateData {
  latitudeStart: number,
  longitudeStart: number,
  latitudeEnd: number,
  longitudeEnd: number,
  paymentMethod: string,
  discountCode?: number
}

export interface tripCalculate {
  uid: string,
  usersClientId: string,
  usersClient: string,
  price: number,
  basePrice: number,
  paymentMethod: string,
  kilometers: number,
  latitudeStart : number,
  longitudeStart: number,
  latitudeEnd   : number,
  longitudeEnd  : number,
  addressStart: string,
  addressEnd  : string,
  dateScheduled: string,
  hourScheduledStart: string,
  hourScheduledEnd  : string,
  scheduledStatus: boolean,
  discountCode: string,
  discountApplied: boolean,
  status: boolean,
  created: string
}