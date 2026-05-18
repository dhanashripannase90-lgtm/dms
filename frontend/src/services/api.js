import axios from "axios";
import { getToken, clearAuthData } from "../utils/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api"
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthData();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth ──────────────────────────────────────────────────────────────
export const login = (payload) => api.post("/auth/login", payload);
export const register = (payload) => api.post("/auth/register", payload);
export const requestOtp = (payload) => api.post("/auth/request-otp", payload);
export const resetPassword = (payload) => api.post("/auth/reset-password", payload);

// ─── Documents ─────────────────────────────────────────────────────────
export const uploadDocument = (formData) =>
  api.post("/documents/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

export const getDocuments = (fileName = "", category = "") => {
  const params = new URLSearchParams();
  if (fileName) params.append("fileName", fileName);
  if (category) params.append("category", category);
  const qs = params.toString();
  return api.get(`/documents${qs ? `?${qs}` : ""}`);
};
export const getMyDocuments = () => api.get("/documents/my");
export const getPendingDocuments = () => api.get("/documents/pending");
export const searchDocuments = (fileName) =>
  api.get(`/documents/search?fileName=${encodeURIComponent(fileName)}`);
export const filterDocumentsByCategory = (category) =>
  api.get(`/documents/filter?category=${encodeURIComponent(category)}`);
export const updateDocument = (id, payload) => api.put(`/documents/${id}`, payload);
export const replaceDocumentFile = (id, formData) =>
  api.put(`/documents/${id}/replace`, formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
export const deleteDocument = (id) => api.delete(`/documents/${id}`);
export const downloadDocument = (id) =>
  api.get(`/documents/${id}/download`, { responseType: "blob" });
export const previewDocument = (id) =>
  api.get(`/documents/${id}/preview`, { responseType: "blob" });
export const approveDocument = (id) => api.put(`/documents/${id}/approve`, {});
export const rejectDocument = (id, remarks = "") =>
  api.put(`/documents/${id}/reject`, { remarks });
export const getDocumentVersions = (id) => api.get(`/documents/${id}/versions`);
export const addTagToDocument = (docId, tagId) =>
  api.post(`/documents/${docId}/tags/${tagId}`);
export const removeTagFromDocument = (docId, tagId) =>
  api.delete(`/documents/${docId}/tags/${tagId}`);

// ─── Folders ───────────────────────────────────────────────────────────
export const getFolders = () => api.get("/folders");
export const getFolderTree = () => api.get("/folders/tree");
export const createFolder = (payload) => api.post("/folders", payload);
export const renameFolder = (id, payload) => api.put(`/folders/${id}`, payload);
export const deleteFolder = (id) => api.delete(`/folders/${id}`);

// ─── Tags ──────────────────────────────────────────────────────────────
export const getTags = () => api.get("/tags");
export const createTag = (payload) => api.post("/tags", payload);
export const deleteTag = (id) => api.delete(`/tags/${id}`);

// ─── Users ─────────────────────────────────────────────────────────────
export const getUsers = () => api.get("/users");
export const deleteUser = (id) => api.delete(`/users/${id}`);
export const updateUserRole = (id, role) => api.put(`/users/${id}/role`, { role });

// ─── Dashboard ─────────────────────────────────────────────────────────
export const getDashboardStats = () => api.get("/dashboard/stats");

// ─── Audit Logs ────────────────────────────────────────────────────────
export const getAuditLogs = (page = 0, size = 20) =>
  api.get(`/admin/audit-logs?page=${page}&size=${size}`);

export default api;
