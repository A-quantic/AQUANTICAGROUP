"use client";

import axios, { AxiosError, AxiosInstance } from "axios";

// BUILD_ID: 2024-01-v3 - HTTPS ENFORCED
function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  const defaultUrl = "https://amused-peace-production-424b.up.railway.app";
  const url = envUrl || defaultUrl;
  
  // Forzar HTTPS - reemplazar cualquier http:// por https://
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
}

const API_URL = getApiUrl();
console.log("[API] URL configured:", API_URL);

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// Request interceptor to add auth token and debug
apiClient.interceptors.request.use(
  async (config) => {
    // Debug: log actual URL being used
    const base = config.baseURL || "";
    const path = config.url || "";
    const fullUrl = base + path;
    console.log("[API] Request URL:", fullUrl);
    console.log("[API] baseURL:", base);
    console.log("[API] path:", path);
    
    // Ensure HTTPS in baseURL
    if (config.baseURL && config.baseURL.startsWith("http://")) {
      console.warn("[API] Fixing HTTP to HTTPS in baseURL");
      config.baseURL = config.baseURL.replace("http://", "https://");
    }
    
    // Ensure HTTPS in full URL if somehow it's still HTTP
    if (fullUrl && fullUrl.startsWith("http://")) {
      console.error("[API] CRITICAL: Full URL is HTTP!", fullUrl);
    }
    
    // Get Clerk token if available
    const token = localStorage.getItem("clerk-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error("Unauthorized request");
    }
    return Promise.reject(error);
  }
);

// API functions
export const leadsApi = {
  create: async (data: {
    name: string;
    email: string;
    phone?: string;
    service?: string;
    message?: string;
  }) => {
    const response = await apiClient.post("/api/leads", data);
    return response.data;
  },
  list: async () => {
    const response = await apiClient.get("/api/leads");
    return response.data;
  },
};

export const projectsApi = {
  list: async () => {
    console.log("[projectsApi.list] Starting request...");
    const response = await apiClient.get("/api/projects/");
    console.log("[projectsApi.list] Response received:", response.status);
    return response.data;
  },
  get: async (id: string) => {
    const response = await apiClient.get(`/api/projects/${id}/`);
    return response.data;
  },
  create: async (data: {
    title: string;
    description?: string;
    type: string;
  }) => {
    const response = await apiClient.post("/api/projects/", data);
    return response.data;
  },
  update: async (id: string, data: Partial<Project>) => {
    const response = await apiClient.put(`/api/projects/${id}/`, data);
    return response.data;
  },
  getDocuments: async (id: string) => {
    const response = await apiClient.get(`/api/projects/${id}/documents/`);
    return response.data;
  },
  getTimeline: async (id: string) => {
    const response = await apiClient.get(`/api/projects/${id}/timeline/`);
    return response.data;
  },
};

export const documentsApi = {
  upload: async (file: File, metadata?: {
    projectId?: string;
    expedienteId?: string;
    category?: string;
  }) => {
    const formData = new FormData();
    formData.append("file", file);
    if (metadata?.projectId) formData.append("project_id", metadata.projectId);
    if (metadata?.expedienteId) formData.append("expediente_id", metadata.expedienteId);
    if (metadata?.category) formData.append("category", metadata.category);

    const response = await apiClient.post("/api/documents/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  list: async (filters?: {
    projectId?: string;
    expedienteId?: string;
    category?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.projectId) params.append("project_id", filters.projectId);
    if (filters?.expedienteId) params.append("expediente_id", filters.expedienteId);
    if (filters?.category) params.append("category", filters.category);

    const response = await apiClient.get(`/api/documents/?${params}`);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/api/documents/${id}/`);
    return response.data;
  },
};

export const aiApi = {
  chat: async (message: string, sessionId?: string) => {
    const response = await apiClient.post("/api/ai/chat", {
      message,
      session_id: sessionId,
    });
    return response.data;
  },
  analyzeDocument: async (file: File, documentType?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (documentType) formData.append("document_type", documentType);

    const response = await apiClient.post("/api/ai/analyze-document", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  generateChecklist: async (projectType: string, municipality?: string) => {
    const response = await apiClient.post("/api/ai/generate-checklist", {
      project_type: projectType,
      municipality,
    });
    return response.data;
  },
  detectMissing: async (uploadedDocs: string[], projectType: string) => {
    const response = await apiClient.post("/api/ai/detect-missing", {
      documents: uploadedDocs,
      project_type: projectType,
    });
    return response.data;
  },
};

// Types
export interface Project {
  id: string;
  code: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  priority: string;
  startDate?: string;
  endDate?: string;
  deadline?: string;
  budget?: number;
  quotedAmount?: number;
  clientId: string;
  creatorId: string;
  assigneeId?: string;
  createdAt: string;
  updatedAt: string;
  expediente?: Expediente;
  documents?: Document[];
}

export interface Expediente {
  id: string;
  code: string;
  type: string;
  status: string;
  municipality?: string;
  sunarpOffice?: string;
  cofopriOffice?: string;
  submissionDate?: string;
  resolutionDate?: string;
  aiSummary?: string;
  aiChecklist?: any;
  missingDocs: string[];
  projectId: string;
  observations?: Observation[];
  documents?: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Observation {
  id: string;
  type: string;
  description: string;
  status: string;
  aiAnalysis?: string;
  aiSuggestedResponse?: string;
  entity: string;
  expedienteId: string;
  responseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  fileUrl: string;
  fileKey: string;
  fileSize: number;
  mimeType: string;
  ocrText?: string;
  aiSummary?: string;
  aiExtractedData?: any;
  embeddingId?: string;
  projectId?: string;
  expedienteId?: string;
  uploadedById: string;
  createdAt: string;
  updatedAt: string;
}
