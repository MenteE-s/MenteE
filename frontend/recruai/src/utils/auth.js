// helper utilities for token verification and auth state
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiBookmark,
  FiBarChart2,
  FiFileText,
  FiBell,
  FiUsers,
  FiSettings,
  FiCheckCircle,
} from "react-icons/fi";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://mentee-production-e517.up.railway.app";
const API_VERSION = process.env.REACT_APP_API_VERSION || "v1";

console.log("🔥 AUTH UTILITY LOADED:", { API_BASE_URL, API_VERSION });

// API endpoints
export const API_ENDPOINTS = {
  BASE: API_BASE_URL,
  AUTH: {
    REGISTER: `${API_BASE_URL}/api/${API_VERSION}/auth/register`,
    LOGIN: `${API_BASE_URL}/api/${API_VERSION}/auth/login`,
    ME: `${API_BASE_URL}/api/${API_VERSION}/auth/me`,
  },
  INTERVIEWS: {
    LIST: `${API_BASE_URL}/api/${API_VERSION}/interviews`,
    CREATE: `${API_BASE_URL}/api/${API_VERSION}/interviews`,
  },
  CHAT: `${API_BASE_URL}/api/${API_VERSION}/chat`,
};

console.log("🔥 API ENDPOINTS:", API_ENDPOINTS);

// Auth functions
export const authAPI = {
  register: async (email, password) => {
    try {
      console.log("🔥 REGISTER CALL TO:", API_ENDPOINTS.AUTH.REGISTER);

      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("✅ REGISTER RESPONSE STATUS:", response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
      }

      const data = await response.json();
      console.log("🎉 REGISTER SUCCESS:", data);
      return data;
    } catch (error) {
      console.error("❌ Registration error:", error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      console.log("🔥 LOGIN CALL TO:", API_ENDPOINTS.AUTH.LOGIN);

      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("✅ LOGIN RESPONSE STATUS:", response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      const data = await response.json();
      console.log("🎉 LOGIN SUCCESS:", data);

      // Store token in localStorage
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      console.log("🔥 GET USER CALL TO:", API_ENDPOINTS.AUTH.ME);

      const response = await fetch(API_ENDPOINTS.AUTH.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ GET USER RESPONSE STATUS:", response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get user");
      }

      const data = await response.json();
      console.log("🎉 GET USER SUCCESS:", data);
      return data;
    } catch (error) {
      console.error("❌ Get user error:", error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },
};

// Centralized API fetch helper - use this for all API calls
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};

// Sidebar items helper expected by organization pages
export const getSidebarItems = () => [
  { key: "dashboard", label: "Dashboard", icon: FiBarChart2 },
  { key: "jobs", label: "Job Posts", icon: FiFileText },
  { key: "candidates", label: "Candidates", icon: FiUsers },
  { key: "interviews", label: "Interviews", icon: FiCalendar },
  { key: "pipeline", label: "Pipeline", icon: FiClock },
  { key: "saved", label: "Saved", icon: FiBookmark },
  { key: "alerts", label: "Alerts", icon: FiBell },
  { key: "settings", label: "Settings", icon: FiSettings },
];

// Token verification utility expected by organization pages
export const verifyTokenWithServer = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  try {
    const res = await fetch(API_ENDPOINTS.AUTH.ME, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
};

// Upload URL helper expected by organization pages
export const getUploadUrl = (path = "") => {
  return `${API_ENDPOINTS.BASE}/uploads/${path}`;
};

export default authAPI;
