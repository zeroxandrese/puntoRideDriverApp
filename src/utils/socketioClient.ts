import { io } from "socket.io-client";
import {API_URL_SOCKET} from "@env";

export const socket = io(API_URL_SOCKET, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});