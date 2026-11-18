const getHost = () => {
  if (typeof window !== "undefined" && window.location.hostname) {
    return window.location.hostname;
  }
  return "localhost";
};

export const env = {
  get apiUrl() {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (typeof window !== "undefined" && window.location.protocol === "https:") {
      return `${window.location.origin}/api`;
    }
    return `http://${getHost()}:5000/api`;
  },
  get socketUrl() {
    if (process.env.NEXT_PUBLIC_SOCKET_URL) return process.env.NEXT_PUBLIC_SOCKET_URL;
    if (typeof window !== "undefined" && window.location.protocol === "https:") {
      return window.location.origin;
    }
    return `http://${getHost()}:5000`;
  },
  isProduction: process.env.NODE_ENV === "production",
};
