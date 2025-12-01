import React from "react";
import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 3000,
        style: {
          background: "#363636",
          color: "#fff",
          borderRadius: "8px",
          padding: "16px",
          fontWeight: "500",
        },

        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: "#10b981",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#10b981",
          },
        },
        error: {
          duration: 4000,
          style: {
            background: "#ef4444",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#ef4444",
          },
        },
        loading: {
          duration: 999999,
          style: {
            background: "#3b82f6",
            color: "#fff",
          },
          iconTheme: {
            primary: "#fff",
            secondary: "#3b82f6",
          },
        },
      }}
    />
  );
}
