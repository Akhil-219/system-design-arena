import axiosInstance from "../../../api/axios.js";

// aiMentor.routes.js is mounted at /problems/:problemId/mentor in
// problem.routes.js, with mergeParams: true — so every call needs
// problemId in the URL alongside conversationId, even though
// conversationId is the actual key once a conversation exists.

// Get-or-create: returns the existing conversation for this user+problem
// if one already exists, otherwise creates a new one.
export const createConversation = async (problemId) => {
  const response = await axiosInstance.post(`/problems/${problemId}/mentor/conversation`);
  return response.data.data.conversation;
};

export const getMessages = async (problemId, conversationId) => {
  const response = await axiosInstance.get(
    `/problems/${problemId}/mentor/conversation/${conversationId}/messages`
  );
  return response.data.data.messages;
};

// Returns { userMessage, aiMessage } — both freshly created docs, so the
// caller doesn't need to guess at an id for the message it just sent.
export const sendMessage = async (problemId, conversationId, content) => {
  const response = await axiosInstance.post(
    `/problems/${problemId}/mentor/conversation/${conversationId}/messages`,
    { content }
  );
  return response.data.data;
};