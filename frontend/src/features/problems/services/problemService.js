import axiosInstance from "../../../api/axios";

export const getProblems = async () => {
  const response = await axiosInstance.get("/problems");

  return response.data.data;
};

export const getProblemBySlug = async (slug) => {
  const response = await axiosInstance.get(`/problems/${slug}`);

  return response.data.data;
};