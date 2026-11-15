import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Doctor } from "../types/doctor.types";

export function useDoctors() {
  return useQuery<Doctor[]>({
    queryKey: ["doctors"],
    queryFn: async () => {
      return apiClient<Doctor[]>("/doctors");
    },
    refetchInterval: 15000,
  });
}
