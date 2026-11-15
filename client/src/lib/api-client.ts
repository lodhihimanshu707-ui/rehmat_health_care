import { useAuthStore } from "@/features/auth/store/use-auth-store";

const API_BASE_URL = "http://localhost:5000/api";

export interface ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const currentUser = useAuthStore.getState().currentUser;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(currentUser ? { "x-user-id": currentUser.id } : {}),
    ...(options.headers as Record<string, string>),
  };

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const response = await fetch(`${API_BASE_URL}${cleanEndpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data.data;
}
