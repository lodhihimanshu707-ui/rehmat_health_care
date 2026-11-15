import { QueryClient } from "@tanstack/react-query";

let clientQueryClientSingleton: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 10 * 1000,
          retry: 1,
        },
      },
    });
  }

  // Browser: make a new query client if we don't already have one
  if (!clientQueryClientSingleton) {
    clientQueryClientSingleton = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 10 * 1000,
          retry: 1,
          refetchOnWindowFocus: true,
        },
      },
    });
  }
  return clientQueryClientSingleton;
}

