import { create } from "zustand";
import almacenamientoSeguro from '../utils/almacenamientoSeguro';
import apiConfig from "../apiConfig/apiConfig";
import { desconectarSocket } from '../utils/socketioClient';

import {
   Driver,
   loginData,
   PostDriverResponse,
   registerData
} from '../interface/interface';
import { ErrorAPI, obtenerMensajeError } from '../interface/errores';

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
      const token = await almacenamientoSeguro.obtenerToken();
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
   
      await almacenamientoSeguro.guardarCredenciales({ 
        token: data.token, 
        email, 
        userId: data.user._id 
      });
      set({ token: data.token, user: data.user, status: "authenticated" });
    } catch (error) {
      const errorAPI = error as ErrorAPI;
      set({ errorMessage: obtenerMensajeError(errorAPI) });
    }
  },

  logOut: async () => {
    await almacenamientoSeguro.eliminarCredenciales();
    desconectarSocket();
    set({ token: null, user: null, status: "not-authenticated" });
  },

  registerDriver: async ({ email, password, code }) => {
    try {

      const { data } = await apiConfig.post<PostDriverResponse>(`/usersDriver/`, { email, password, code });

      await almacenamientoSeguro.guardarCredenciales({ 
        token: data.token, 
        email, 
        userId: data.user._id 
      });
      set({
        user: data.user,
        token: data.token,
        status: "authenticated"
      });
    } catch (error) {
      const errorAPI = error as ErrorAPI;
      set({ errorMessage: obtenerMensajeError(errorAPI) });
    }
  }

}));

export default useAuthStore;