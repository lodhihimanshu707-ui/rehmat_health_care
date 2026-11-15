import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { env } from "@/config/env";
import { handleApiError } from "./errors";
import { useAuthStore } from "@/stores/auth.store";

const instance: AxiosInstance = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: attach active demo user ID header so backend RequestContext knows caller
instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    try {
      const currentUser = useAuthStore.getState().currentUser;
      if (currentUser?.id) {
        config.headers["x-user-id"] = currentUser.id;
      }
    } catch {
      // Ignore
    }
  }
  return config;
});

// Response Interceptor: unwrap payload
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // If backend returns { success: true, data: ... }
    if (response.data && response.data.data !== undefined) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    return Promise.reject(handleApiError(error));
  }
);

export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    instance.get(url, config) as unknown as Promise<T>,

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    instance.post(url, data, config) as unknown as Promise<T>,

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    instance.put(url, data, config) as unknown as Promise<T>,

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    instance.patch(url, data, config) as unknown as Promise<T>,

  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    instance.delete(url, config) as unknown as Promise<T>,
};

