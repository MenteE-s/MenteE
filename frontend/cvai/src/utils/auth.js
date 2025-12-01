
// Token expiration handling utility

// Function to check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    // Decode the JWT token (the payload is the second part)
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Check if the token has an expiration date
    if (payload.exp) {
      // Get current time in seconds
      const currentTime = Math.floor(Date.now() / 1000);

      // Return true if token is expired
      return payload.exp < currentTime;
    }

    // If no expiration date, assume token is valid
    return false;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // Assume expired if there's an error
  }
};

// Function to handle token expiration and logout
export const handleTokenExpiration = (navigate) => {
  // Clear local storage
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Navigate to login page with message
  navigate("/login", { 
    state: { message: "Your session has expired. Please log in again." },
    replace: true 
  });
};

// Function to set up token expiration check
export const setupTokenExpirationCheck = (navigate) => {
  // Check token immediately
  const token = localStorage.getItem("token");
  if (isTokenExpired(token)) {
    handleTokenExpiration(navigate);
    return;
  }

  // Set up periodic check (every 5 minutes)
  const intervalId = setInterval(() => {
    const currentToken = localStorage.getItem("token");
    if (isTokenExpired(currentToken)) {
      clearInterval(intervalId);
      handleTokenExpiration(navigate);
    }
  }, 5 * 60 * 1000); // 5 minutes in milliseconds

  // Return cleanup function
  return () => clearInterval(intervalId);
};
