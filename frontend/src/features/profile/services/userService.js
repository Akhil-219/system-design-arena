import axiosInstance from "../../../api/axios.js";

// Current user's own profile — includes stats not present in the auth
// token payload (totalUpvotes, publishedDesignsCount).
export const getMyProfile = async () => {
  const response = await axiosInstance.get("/users/me");
  return response.data.data; // { user, totalUpvotes, publishedDesignsCount }
};

export const updateBio = async (bio) => {
  const response = await axiosInstance.patch("/users/profile", { updatedbio: bio });
  return response.data.data.user;
};

// Multipart upload — field name must be "profilePictureURL" to match
// upload.single("profilePictureURL") in user.routes.js.
export const updateAvatar = async (file) => {
  const formData = new FormData();
  formData.append("profilePictureURL", file);
  const response = await axiosInstance.patch("/users/profile-picture", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data.user;
};

// Public profile lookup by username (no auth needed).
export const getUserProfile = async (username) => {
  const response = await axiosInstance.get(`/users/${username}`);
  return response.data.data; // { user, publishedDesignsCount, totalUpvotes }
};

export const getPublishedDesignsByUser = async (username) => {
  const response = await axiosInstance.get(`/users/${username}/designs`);
  return response.data.data.publishedDesigns;
};