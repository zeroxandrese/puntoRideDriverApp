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

export interface PostUserResponse {
  user: Users;
  token: string;
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
