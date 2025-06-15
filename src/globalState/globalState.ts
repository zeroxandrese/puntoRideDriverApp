import { create } from "zustand";
import { Asset } from 'react-native-image-picker';

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
  updatePhone: (phone: string) => Promise<void>;
  updateAvatar: (file: Asset) => Promise<void>;

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
        userId: data.user.uid
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

  updatePhone: async (phone) => {
    try {
      const uid = get().user!.uid;
      const { data: updated } = await apiConfig.put<Driver>(`/usersDriver/${uid}/phone`, { phone });
      set({ user: updated });
    } catch (err) {
      const msg = (err as ErrorAPI).response?.data?.msg ?? "Error al actualizar teléfono";
      set({ errorMessage: msg });
    }
  },

  updateAvatar: async (file) => {
    try {
      const uid = get().user!.uid;
      const form = new FormData();
      form.append('file', {
        uri: file.uri!,
        name: file.fileName ?? 'avatar.jpg',
        type: file.type ?? 'image/jpeg'
      } as any);

      await apiConfig.put(`/usersDriver/avatar`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Refesh User
      const { data: refreshed } = await apiConfig.get<Driver>(`/usersDriver`);
      set({ user: refreshed });
    } catch (err) {
      const msg = (err as ErrorAPI).response?.data?.msg ?? "Error al subir avatar";
      set({ errorMessage: msg });
    }
  },

  registerDriver: async ({ email, password, code }) => {
    try {

      const { data } = await apiConfig.post<PostDriverResponse>(`/usersDriver/`, { email, password, code });

      await almacenamientoSeguro.guardarCredenciales({
        token: data.token,
        email,
        userId: data.user.uid
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