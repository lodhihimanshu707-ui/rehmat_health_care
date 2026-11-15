import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/features/auth/store/use-auth-store";

const SOCKET_URL = "http://localhost:5000";

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
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
