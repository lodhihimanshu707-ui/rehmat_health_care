import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Doctor } from "./types";

export function useDoctors() {
  return useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: async () => {
      return apiClient.get<Doctor[]>("/doctors");
    },
    refetchInterval: 15000,
  });
}

