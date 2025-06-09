import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVICIO_KEYCHAIN, CLAVE_TOKEN_LEGACY } from "@env";

interface CredencialesSeguras {
  token: string;
  email?: string;
  userId?: string;
}

class AlmacenamientoSeguro {
  private readonly SERVICIO_KEYCHAIN = SERVICIO_KEYCHAIN;
  private readonly CLAVE_TOKEN_LEGACY = CLAVE_TOKEN_LEGACY;

  async guardarCredenciales(credenciales: CredencialesSeguras): Promise<boolean> {
    try {
      const credencialesJSON = JSON.stringify(credenciales);
      const resultado = await Keychain.setInternetCredentials(
        this.SERVICIO_KEYCHAIN,
        'token',
        credencialesJSON
      );

      // Limpiar el token del AsyncStorage si existe
      await AsyncStorage.removeItem(this.CLAVE_TOKEN_LEGACY);

      return true;
    } catch (error) {
      console.error('Error al guardar credenciales seguras:', error);
      return false;
    }
  }

  async obtenerCredenciales(): Promise<CredencialesSeguras | null> {
    try {
      const credenciales = await Keychain.getInternetCredentials(this.SERVICIO_KEYCHAIN);

      if (credenciales) {
        return JSON.parse(credenciales.password);
      }

      // Migrar desde AsyncStorage si existe
      const tokenLegacy = await AsyncStorage.getItem(this.CLAVE_TOKEN_LEGACY);
      if (tokenLegacy) {
        const credencialesMigradas = { token: tokenLegacy };
        await this.guardarCredenciales(credencialesMigradas);
        return credencialesMigradas;
      }

      return null;
    } catch (error) {
      console.error('Error al obtener credenciales seguras:', error);
      return null;
    }
  }

  async obtenerToken(): Promise<string | null> {
    const credenciales = await this.obtenerCredenciales();
    return credenciales?.token || null;
  }

async eliminarCredenciales(): Promise<boolean> {
  try {
    await Keychain.resetInternetCredentials({ service: this.SERVICIO_KEYCHAIN });
    await AsyncStorage.removeItem(this.CLAVE_TOKEN_LEGACY);
    return true;
  } catch (error) {
    console.error('Error al eliminar credenciales seguras:', error);
    return false;
  }
}

  async verificarDisponibilidad(): Promise<boolean> {
    try {
      const soportado = await Keychain.getSupportedBiometryType();
      return soportado !== null;
    } catch (error) {
      return false;
    }
  }
}

export default new AlmacenamientoSeguro();