import axiosInstance from "../../../api/axios.js";

// aiReview.routes.js is mounted as router.use("/:versionId", aiReviewRouter)
// inside version.routes.js, which itself is mounted at
// "/designs/:designId/versions" — so the full path is:
// /designs/:designId/versions/:versionId/review

export const generateReview = async (designId, versionId) => {
  const response = await axiosInstance.post(
    `/designs/${designId}/versions/${versionId}/review`
  );
  return response.data.data.review;
};

export const getReviewById = async (designId, versionId) => {
  const response = await axiosInstance.get(
    `/designs/${designId}/versions/${versionId}/review`
  );
  return response.data.data.review;
};