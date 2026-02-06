import axios from "axios";

export const api = axios.create({
  baseURL: `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api`, // all requests will be relative to /api
  headers: {
    "Content-Type": "application/json",
  },
});
