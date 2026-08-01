import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export interface ApiResponse<T = any> {
  status: string;
  data?: T;
  message?: string;
}

export const stegoApi = {
  // Health & System
  getHealth: async (): Promise<ApiResponse> => {
    const res = await apiClient.get("/health");
    return res.data;
  },

  getVersion: async (): Promise<ApiResponse> => {
    const res = await apiClient.get("/version");
    return res.data;
  },

  // Metadata & Specs
  getAlgorithms: async (): Promise<ApiResponse> => {
    const res = await apiClient.get("/algorithms");
    return res.data;
  },

  // Operations
  encodePayload: async (data: FormData | Record<string, any>): Promise<ApiResponse> => {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await apiClient.post("/encode", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  },

  decodePayload: async (data: FormData | Record<string, any>): Promise<ApiResponse> => {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await apiClient.post("/decode", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  },

  compareImages: async (data: FormData | Record<string, any>): Promise<ApiResponse> => {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;
    const res = await apiClient.post("/compare", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return res.data;
  },

  getMetrics: async (data?: Record<string, any>): Promise<ApiResponse> => {
    const res = await apiClient.post("/metrics", data || {});
    return res.data;
  },
};
