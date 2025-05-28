import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiConfig from "../apiConfig/apiConfig";

import {
   Driver,
   loginData,
   PostDriverResponse,
   registerData
} from '../interface/interface';

interface AuthState {
  token: string | null;
  user: Driver | null;
  status: "checking" | "authenticated" | "not-authenticated";
  errorMessage: string;
  checkToken: () => Promise<void>;
  signIn: (loginData: loginData) => Promise<void>;
  registerDriver: (registerData: registerData) => Promise<void>;
  logOut: () => Promise<void>;

}

const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  status: "checking",
  errorMessage: "",

  checkToken: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        set({ status: "not-authenticated", token: null, user: null });
        return;
      }

      const resp = await apiConfig.post("/authDriver/verify");

      if (resp.status === 201) {
        set({ token, user: resp.data.user, status: "authenticated" });
      } else {
        set({ status: "not-authenticated", token: null, user: null });
      }
    } catch (error) {
      console.log("Error en checkToken:", error);
      set({ status: "not-authenticated", token: null, user: null });
    }
  },

  signIn: async ({ email, password }) => {
    try {
      const { data } = await apiConfig.post<PostDriverResponse>("/authDriver/login", { email, password });
   
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

  registerDriver: async ({ email, password, code }) => {
    try {

      const { data } = await apiConfig.post<PostDriverResponse>(`/usersDriver/`, { email, password, code });

      set({
        user: data.user,
        token: data.token
      });
    } catch (error: any) {
      set({ errorMessage: error.response?.data?.msg || "Error al comentar" });
    }
  }

}));

export default useAuthStore;