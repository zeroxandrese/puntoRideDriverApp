export type RootStackParamList = {
  Login: undefined;
  HomeScreen: undefined;
  PermissionsScreen: undefined;
  ContactUsScreen: undefined;
  HistoryTripScreen: undefined;
  ProfileScreen: undefined;
};

export type RootStackParamListInitial = {
  Initial: undefined;
  RootStack: undefined;
  Home: undefined;
};

export interface PostDriverResponse {
  user: Driver;
  token: string;
}

export interface loginData {
  email: string,
  password: string
};

export interface registerData {
  email: string,
  password: string,
  code: string
};

export interface Driver {
  uid: string,
  name : string,
  lastName: string,
  hashValidationEmail: string,
  email: string,
  numberPhone: string,
  hashValidationPhone :string,
  password: string,
  vehicleType: string,
  status: boolean,
  google: boolean,
  img: string,
  created: string
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
  referralCode: string,
  created: string
};

export interface Location {
  latitude: number,
  longitude: number
}

export interface tripPostResponse {
  tripId: string,
  message: string
}

export interface vehicle {
  uid: string,
  usersDriverId: string,
  register: string,
  model: string,
  brand: string,
  year: number,
  color: string,
  cargo: boolean,
  shipment: boolean,
  status: boolean
}

export interface responseTripActive {
  response: tripResponse,
  userData: Users,
  vehicleData: vehicle
}

export interface trip {
  uid: string,
  usersClientId: string,
  usersClient: string,
  price: number,
  offeredPrice?: number,
  priceWithDiscount: number,
  basePrice: number,
  paymentMethod: string,
  kilometers: number,
  latitudeStart: number,
  longitudeStart: number,
  latitudeEnd: number,
  longitudeEnd: number,
  addressStart: string,
  addressEnd: string,
  dateScheduled: string,
  hourScheduledStart: string,
  estimatedArrival: string,
  driverArrived: boolean,
  tripStarted: boolean,
  scheduledStatus: boolean,
  discountCode: string,
  discountApplied: boolean,
  vehicle: string,
  status: boolean,
  created: string
}

export interface tripResponse {
  uid: string,
  usersClientId: string,
  usersClient: string,
  price: number,
  offeredPrice?: number,
  priceWithDiscount: number,
  basePrice: number,
  paymentMethod: string,
  kilometers: number,
  latitudeStart: number,
  longitudeStart: number,
  latitudeEnd: number,
  longitudeEnd: number,
  addressStart: string,
  addressEnd: string,
  dateScheduled: string,
  hourScheduledStart: string,
  estimatedArrival: string,
  scheduledStatus: boolean,
  discountCode: string,
  discountApplied: boolean,
  driverArrived: boolean,
  tripStarted: boolean,
  vehicle: string,
  status: boolean,
  created: string
}

export interface Comments {
  uid: string,
  usersId: string,
  tripId: string,
  comment: string
  status: string,
  created: string
}

export interface polylineFomart {
  latitude: number,
  longitude: number
}

export interface LatLng { latitude: number; longitude: number };

export interface SurveyResponse { uid: string; tripId: string; score: number, feedback: string, status: boolean, created: string, usersDriverId: string };

export interface contactUsResponse {
  comment: string,
  usersDriverId: string
}

export interface tripsHistoryResponse {
  uid: string
  complete: boolean,
  price: number,
  paymentMethod: string,
  addressStart: string,
  addressEnd: string,
  created: string,
  cancelForUser: boolean
}

export interface tripsAvailableResponse {
  trips: trip[]
}

export interface tripsAcceptedResponse {
  trip: trip,
  user: Users,
  success: boolean
}

type ModalName = 'modal1' | 'modal2' | 'modal3';

export interface CurrentTripScreenProps {
  trip: trip;
  tripCurrentVehicle: vehicle | null;
  tripCurrentClient: Users | null;
  user: Driver | null;
  comments: Comments[] | null;
  tripStarted: boolean | null;
  toggleModal: (modal: ModalName) => void;
}

export interface earningsWeekly {
  uid: string;
  usersDriverId: Driver;
  weekStart: Date;
  weekEnd: Date;
  totalOfferedPrice: number;
  totalDiscounted: number;
  totalDiscountDiff: number;
  created: Date;
}
