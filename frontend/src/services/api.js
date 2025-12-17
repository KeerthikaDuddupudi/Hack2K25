export const API_URL = "http://localhost:5000";

export const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});
