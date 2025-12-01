// Frontend runtime config — reads API base from env so deploys (Netlify) can set this
// Use namespaced CVAI backend endpoints under /api/cvai for isolation
export const API_BASE =
  process.env.REACT_APP_API_BASE || "http://localhost:5000/api/cvai";

// Optional frontend public URL (used for CORS on backend) — set NETLIFY_URL in Netlify and mirror to backend FRONTEND_URL
export const FRONTEND_ORIGIN =
  process.env.REACT_APP_FRONTEND_ORIGIN || "http://localhost:3000";
