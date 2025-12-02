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

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
const API_VERSION = process.env.REACT_APP_API_VERSION || "v1";

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

// Auth functions
export const authAPI = {
  register: async (email, password) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }

      const data = await response.json();

      // Store token in localStorage
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(API_ENDPOINTS.AUTH.ME, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get user");
      }

      return await response.json();
    } catch (error) {
      console.error("Get user error:", error);
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

// Get the backend URL for API calls and uploaded files
export function getBackendUrl() {
  // In development, use localhost:5000
  // In production, this should be configurable via environment variable
  const isDevelopment = process.env.NODE_ENV === "development";
  return isDevelopment ? "http://localhost:5000" : "";
}

// Get full URL for uploaded files
export function getUploadUrl(relativePath) {
  if (!relativePath) return "";
  const backendUrl = getBackendUrl();
  // Remove leading slash if present
  const cleanPath = relativePath.startsWith("/")
    ? relativePath.substring(1)
    : relativePath;
  return `${backendUrl}/${cleanPath}`;
}
export async function verifyTokenWithServer() {
  try {
    if (typeof window === "undefined") return null;

    // With cookie-based auth we don't need to send Authorization header.
    // Ensure cookies are sent by including credentials.
    const res = await fetch("/api/auth/me", {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      // clear stale auth
      localStorage.removeItem("access_token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("authRole");
      return null;
    }
    const data = await res.json();
    if (data && data.user) {
      localStorage.setItem("isAuthenticated", "true");
      if (data.user.role) localStorage.setItem("authRole", data.user.role);
      if (data.user.plan) localStorage.setItem("authPlan", data.user.plan);
      return data.user;
    }
    return null;
  } catch (err) {
    // network or other error - clear local auth to avoid false-positive
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("authRole");
    } catch (e) {
      // ignore
    }
    return null;
  }
}

export function clearLocalAuth() {
  try {
    localStorage.removeItem("access_token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("authRole");
    localStorage.removeItem("authPlan");
  } catch (e) {
    // ignore
  }
}

export function getSidebarItems(role, plan) {
  if (role === "individual") {
    if (plan === "trial") {
      return [
        { name: "Dashboard", link: "/dashboard", icon: FiBarChart2 },
        { name: "Profile", link: "/profile", icon: FiUser },
        { name: "Jobs", link: "/jobs", icon: FiFileText },
        {
          name: "Upcoming Interviews",
          link: "/interviews/upcoming",
          icon: FiCalendar,
        },
        {
          name: "Interview History",
          link: "/interviews/history",
          icon: FiClock,
        },
        { name: "Saved Jobs", link: "/jobs/saved", icon: FiBookmark },
        { name: "Applied Jobs", link: "/jobs/applied", icon: FiCheckCircle },
        { name: "Analytics", link: "/analytics", icon: FiBarChart2 },
        { name: "Practice", link: "/practice", icon: FiClock },
        { name: "My AI Agents", link: "/ai-agents", icon: FiUsers },
        { name: "Settings", link: "/settings", icon: FiSettings },
      ];
    } else {
      // pro
      return [
        { name: "Dashboard", link: "/dashboard", icon: FiBarChart2 },
        { name: "Profile", link: "/profile", icon: FiUser },
        { name: "Jobs", link: "/jobs", icon: FiFileText },
        {
          name: "Upcoming Interviews",
          link: "/interviews/upcoming",
          icon: FiCalendar,
        },
        {
          name: "Interview History",
          link: "/interviews/history",
          icon: FiClock,
        },
        { name: "Saved Jobs", link: "/jobs/saved", icon: FiBookmark },
        { name: "Applied Jobs", link: "/jobs/applied", icon: FiCheckCircle },
        { name: "Analytics", link: "/analytics", icon: FiBarChart2 },
        { name: "Resume Builder", link: "/resume/builder", icon: FiFileText },
        { name: "Job Alerts", link: "/jobs/alerts", icon: FiBell },
        { name: "Career Coaching", link: "/coaching", icon: FiUsers },
        { name: "Practice", link: "/practice", icon: FiClock },
        { name: "My AI Agents", link: "/ai-agents", icon: FiUsers },
        { name: "Settings", link: "/settings", icon: FiSettings },
      ];
    }
  } else if (role === "organization") {
    if (plan === "trial") {
      return [
        {
          name: "Dashboard",
          link: "/dashboard",
          icon: FiBarChart2,
        },
        { name: "Profile", link: "/organization/profile", icon: FiUser },
        {
          name: "Browse Organizations",
          link: "/organization/browse",
          icon: FiUser,
        },
        { name: "Hire People", link: "/organization/hire", icon: FiUsers },
        { name: "Team Members", link: "/organization/team", icon: FiUsers },
        { name: "Job Posts", link: "/organization/jobs", icon: FiFileText },
        { name: "AI Agents", link: "/organization/ai-agents", icon: FiUsers },
        { name: "Candidates", link: "/organization/candidates", icon: FiUser },
        {
          name: "Interviews",
          link: "/organization/interviews",
          icon: FiCalendar,
        },
        { name: "Pipeline", link: "/organization/pipeline", icon: FiBarChart2 },
        {
          name: "Analytics",
          link: "/organization/analytics",
          icon: FiBarChart2,
        },
        { name: "Settings", link: "/settings", icon: FiSettings },
      ];
    } else {
      // pro
      return [
        { name: "Dashboard", link: "/dashboard", icon: FiBarChart2 },
        { name: "Profile", link: "/organization/profile", icon: FiUser },
        {
          name: "Browse Organizations",
          link: "/organization/browse",
          icon: FiUser,
        },
        { name: "Hire People", link: "/organization/hire", icon: FiUsers },
        { name: "Team Members", link: "/organization/team", icon: FiUsers },
        { name: "Job Posts", link: "/organization/jobs", icon: FiFileText },
        { name: "AI Agents", link: "/organization/ai-agents", icon: FiUsers },
        { name: "Candidates", link: "/organization/candidates", icon: FiUser },
        {
          name: "Interviews",
          link: "/organization/interviews",
          icon: FiCalendar,
        },
        { name: "Pipeline", link: "/organization/pipeline", icon: FiBarChart2 },
        {
          name: "Analytics",
          link: "/organization/analytics",
          icon: FiBarChart2,
        },
        { name: "Reports", link: "/organization/reports", icon: FiFileText },
        {
          name: "Integrations",
          link: "/organization/integrations",
          icon: FiBell,
        },
        { name: "AI Insights", link: "/organization/insights", icon: FiUsers },
        { name: "Settings", link: "/settings", icon: FiSettings },
      ];
    }
  }
  return [];
}

export default authAPI;
