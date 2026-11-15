import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { getSocket } from "@/lib/socket";
import { ChatMessage } from "./types";
import { useAuthStore } from "@/stores/auth.store";

export function useChat(activeRecipientId: string) {
  const { currentUser, isAuthenticated } = useAuthStore();

  const queryKey = ["chat-thread", currentUser?.id, activeRecipientId];

  const { data: initialMessages = [], isLoading } = useQuery<ChatMessage[]>({
    queryKey,
    queryFn: async () => {
      if (!activeRecipientId || !currentUser?.id) return [];
      return apiClient.get<ChatMessage[]>(`/messages/${currentUser.id}/${activeRecipientId}`);
    },
    enabled: !!activeRecipientId && !!currentUser?.id && isAuthenticated,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    const socket = getSocket();

    const handleReceive = (msg: ChatMessage) => {
      if (
        (msg.senderId === activeRecipientId && msg.receiverId === currentUser.id) ||
        (msg.senderId === currentUser.id && msg.receiverId === activeRecipientId)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive-message", handleReceive);
    socket.on("message-sent", handleReceive);

    return () => {
      socket.off("receive-message", handleReceive);
      socket.off("message-sent", handleReceive);
    };
  }, [activeRecipientId, currentUser.id]);

  const sendMessage = (text: string) => {
    if (!text.trim() || !activeRecipientId) return;

    const socket = getSocket();
    socket.emit("send-message", {
      senderId: currentUser.id,
      receiverId: activeRecipientId,
      text: text.trim(),
    });
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
}

