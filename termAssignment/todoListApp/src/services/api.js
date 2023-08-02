import axios from "axios";

const api = axios.create({
  // baseURL: "https://6b85-142-134-28-192.ngrok-free.app/api",
  baseURL: "https://j0igccmt9b.execute-api.us-east-1.amazonaws.com/prod",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
