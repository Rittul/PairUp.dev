// Conditional BASE_URL based on environment
const hostname = window.location.hostname;
export const BASE_URL =
  hostname === "localhost" || hostname === "127.0.0.1"
    ? "http://localhost:3000/"
    : "https://pairup-dev.onrender.com/";