import axiosInstance from "../../../api/axios.js";
// Gets the existing design for this problem, or creates one if it's the
// user's first time opening it. Always returns a design with a real _id.
export const startDesign = async (problemId) => {
  const response = await axiosInstance.post(`/designs/start/${problemId}`);
  return response.data.data.design;
};

export const getDesignById = async (designId) => {
  const response = await axiosInstance.get(`/designs/${designId}`);
  return response.data.data.design;
};

export const updateDesign = async (designId, { diagramData, notes }) => {
  const response = await axiosInstance.patch(`/designs/${designId}`, {
    diagramData,
    notes,
  });
  return response.data.data.design;
};

// Creates a new Version snapshot from whatever is currently in
// design.draftDiagramData/draftNotes. Must be called AFTER updateDesign
// so the draft is up to date first. Backend no-ops (400) if nothing changed
// since the last snapshot — callers should treat that as a soft success,
// not a real error.
export const createVersionSnapshot = async (designId) => {
  const response = await axiosInstance.post(`/designs/${designId}/versions/snapshot`);
  return response.data.data.version;
};
export const deleteDesign = async (designId) => {
  await axiosInstance.delete(`/designs/${designId}`);
};