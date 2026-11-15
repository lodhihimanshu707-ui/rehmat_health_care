import { io, Socket } from "socket.io-client";
import { env } from "@/config/env";
import { useAuthStore } from "@/stores/auth.store";

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(env.socketUrl, {
      autoConnect: true,
      reconnection: true,
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      const currentUser = useAuthStore.getState().currentUser;
      if (currentUser) {
        socketInstance?.emit("join-user-room", currentUser.id);
      }
    });
  }

  return socketInstance;
}

export function syncSocketUser(userId: string) {
  const socket = getSocket();
  if (socket.connected) {
    socket.emit("join-user-room", userId);
  }
}

