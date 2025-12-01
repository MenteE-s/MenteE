import toast from "react-hot-toast";

/**
 * Toast notification utilities
 */
export const showSuccess = (message) => {
  toast.success(message, {
    duration: 3000,
    position: "top-right",
  });
};

export const showError = (message) => {
  toast.error(message, {
    duration: 4000,
    position: "top-right",
  });
};

export const showLoading = (message) => {
  return toast.loading(message, {
    position: "top-right",
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Helper function for API calls with automatic error handling
 */
export const fetchWithToast = async (
  url,
  options = {},
  showLoadingMessage = null
) => {
  let loadingToast = null;

  try {
    if (showLoadingMessage) {
      loadingToast = showLoading(showLoadingMessage);
    }

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      if (loadingToast) dismissToast(loadingToast);
      showError(data.message || "An error occurred");
      throw new Error(data.message || "Request failed");
    }

    if (loadingToast) dismissToast(loadingToast);
    return { success: true, data };
  } catch (error) {
    if (loadingToast) dismissToast(loadingToast);
    return { success: false, error: error.message };
  }
};
