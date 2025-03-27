import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConfig from "../apiConfig/apiConfig";

import {
  postNumberCodeResponse, Users,
  postCodeNumberVerifyData, loginData,
  postCodeCreateUserValidationData, PostUserResponse,
  postTripCalculateData
} from '../interface/interface';

interface AuthState {
  token: string | null;
  user: Users | null;
  codeValidationNumberSecurity: string | null;
  status: "checking" | "authenticated" | "not-authenticated";
  errorMessage: string;
  checkToken: () => Promise<void>;
  signIn: (loginData: loginData) => Promise<void>;
  logOut: () => Promise<void>;
  postCodeNumberVerify: (postCodeNumberVerifyData: postCodeNumberVerifyData) => Promise<void>;
  postCodeCreateUserValidation: (postCodeCreateUserValidationData: postCodeCreateUserValidationData) => Promise<void>;
  postTripCalculate: (postTripCalculateData: postTripCalculateData) => Promise<void>;
}

const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  codeValidationNumberSecurity: null,
  status: "checking",
  errorMessage: "",

  checkToken: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        set({ status: "not-authenticated", token: null, user: null });
        return;
      }

      const resp = await apiConfig.post("/auth/verify");

      if (resp.status === 201) {
        set({ token, user: resp.data.responseUser, status: "authenticated" });
      } else {
        set({ status: "not-authenticated", token: null, user: null });
      }
    } catch (error) {
      console.log("Error en checkToken:", error);
      set({ status: "not-authenticated", token: null, user: null });
    }
  },

  signIn: async ({ numberPhone }) => {
    try {
      const { data } = await apiConfig.post<PostUserResponse>("/auth/login", { numberPhone });

      await AsyncStorage.setItem("token", data.token);
      set({ token: data.token, user: data.user, status: "authenticated" });
    } catch (error: any) {
      set({ errorMessage: error.response?.data?.msg || "Error al iniciar sesión" });
    }
  },

  logOut: async () => {
    await AsyncStorage.removeItem("token");
    set({ token: null, user: null, status: "not-authenticated" });
  },

  postCodeNumberVerify: async ({ phoneNumber }) => {
    try {

      const { data } = await apiConfig.post<postNumberCodeResponse>(`/validationCode/`, { phoneNumber });

      set({
        codeValidationNumberSecurity: data.codeValidationNumberSecurity
      });
    } catch (error: any) {
      set({ errorMessage: error.response?.data?.msg || "Error al comentar" });
    }
  },

  postCodeCreateUserValidation: async ({ code, codeValidationNumberSecurity }) => {

    try {
      const { data } = await apiConfig.post<PostUserResponse>(`/validationCode/auth`, { code, codeSecurity: codeValidationNumberSecurity });

      await AsyncStorage.setItem("token", data.token);
      set({
        user: data.user,
        status: "authenticated",
        token: data.token
      });

    } catch (error: any) {
      set({ errorMessage: error.response?.data?.msg || "Error al comentar" });
    }
  },

  postTripCalculate: async ({ latitudeStart,
    longitudeStart, latitudeEnd, longitudeEnd,
    paymentMethod, discountCode }) => {

    try {
      const { data } = await apiConfig.post<PostUserResponse>(`/tripCalculate/`, {
        latitudeStart,
        longitudeStart, latitudeEnd, longitudeEnd,
        paymentMethod, discountCode
      });

      await AsyncStorage.setItem("token", data.token);
      set({
        user: data.user,
        status: "authenticated",
        token: data.token
      });

    } catch (error: any) {
      set({ errorMessage: error.response?.data?.msg || "Error al comentar" });
    }
  }
}));

export default useAuthStore;