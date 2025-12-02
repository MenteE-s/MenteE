// Utility for handling uploaded file URLs
export const getUploadUrl = (filename) => {
  if (!filename) return null;
  // Handle both full paths (/uploads/...) and relative paths
  const cleanPath = filename.startsWith("/uploads/")
    ? filename.substring(1)
    : filename;
  // Assuming uploads are served from the backend at /uploads/
  return `http://localhost:5000/${cleanPath}`;
};
