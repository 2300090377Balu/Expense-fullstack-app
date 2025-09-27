const API_BASE_URL = "http://localhost:2544";

export const apiRequest = async (endpoint, method = "GET", data = null) => {
  const token = localStorage.getItem("token"); // Get stored token

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Add token to headers
  };

  const options = {
    method,
    headers,
  };

  if (data) options.body = JSON.stringify(data);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (response.status === 401) {
      localStorage.removeItem("token"); // Clear token if unauthorized
      window.location.href = "/login"; // Redirect to login
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    return { error: "Network error, please try again." };
  }
};
