import axiosInstance from "../../../api/axios.js";

export const getAllVersions = async (designId) => {
  const response = await axiosInstance.get(`/designs/${designId}/versions`);
  return response.data.data.versions;
};
export const deleteVersion = async (designId, versionId) => {
  await axiosInstance.delete(`/designs/${designId}/versions/${versionId}`);
};