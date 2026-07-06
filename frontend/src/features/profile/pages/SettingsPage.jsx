import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getMyProfile, updateBio, updateAvatar } from "../services/userService";

function SettingsPage() {
  const { updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bio, setBio] = useState("");
  const [isSavingBio, setIsSavingBio] = useState(false);
  const [bioSaveState, setBioSaveState] = useState("idle"); // idle | saved | error

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarSaveState, setAvatarSaveState] = useState("idle"); // idle | saved | error

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { user } = await getMyProfile();
        setBio(user.bio || "");
        setAvatarPreview(user.profilePicture || null);
      } catch (err) {
        setError(err?.response?.data?.message || "Couldn't load your profile.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveBio = async (e) => {
    e.preventDefault();
    setIsSavingBio(true);
    setBioSaveState("idle");
    try {
      const updatedUser = await updateBio(bio);
      updateUser(updatedUser);
      setBioSaveState("saved");
    } catch {
      setBioSaveState("error");
    } finally {
      setIsSavingBio(false);
      setTimeout(() => setBioSaveState("idle"), 2000);
    }
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setIsUploadingAvatar(true);
    setAvatarSaveState("idle");
    try {
      const updatedUser = await updateAvatar(avatarFile);
      updateUser(updatedUser);
      setAvatarPreview(updatedUser.profilePicture);
      setAvatarFile(null);
      setAvatarSaveState("saved");
    } catch {
      setAvatarSaveState("error");
    } finally {
      setIsUploadingAvatar(false);
      setTimeout(() => setAvatarSaveState("idle"), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] text-[#fafafa] min-h-screen flex items-center justify-center">
        <span className="font-mono text-sm text-gray-500">Loading settings…</span>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] text-[#fafafa] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-10">Settings</h1>

        {error && <p className="text-sm text-red-400 mb-6">{error}</p>}

        {/* Avatar */}
        <section className="mb-10 pb-10 border-b border-gray-800">
          <h2 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-4">
            Profile Picture
          </h2>
          <div className="flex items-center gap-5">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-800" />
            )}
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="font-mono text-xs uppercase tracking-wider text-gray-300 border border-gray-800 rounded-md px-4 py-2 hover:bg-[#1a1a1a] hover:text-white transition-colors"
              >
                Choose Image
              </button>
              {avatarFile && (
                <button
                  onClick={handleUploadAvatar}
                  disabled={isUploadingAvatar}
                  className="font-mono text-xs uppercase tracking-wider text-black bg-white rounded-md px-4 py-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isUploadingAvatar && "Uploading…"}
                  {!isUploadingAvatar && avatarSaveState === "saved" && "Saved ✓"}
                  {!isUploadingAvatar && avatarSaveState === "error" && "Upload failed"}
                  {!isUploadingAvatar && avatarSaveState === "idle" && "Upload"}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Bio */}
        <section>
          <h2 className="font-mono text-xs uppercase tracking-wider text-gray-500 mb-4">Bio</h2>
          <form onSubmit={handleSaveBio}>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell people a bit about yourself…"
              className="w-full min-h-[120px] bg-[#111111] border border-gray-800 rounded-md p-3 text-sm text-gray-200 placeholder:text-gray-600 resize-none outline-none focus:border-gray-600"
            />
            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={isSavingBio}
                className="font-mono text-xs uppercase tracking-wider text-black bg-white rounded-md px-4 py-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {isSavingBio && "Saving…"}
                {!isSavingBio && bioSaveState === "saved" && "Saved ✓"}
                {!isSavingBio && bioSaveState === "error" && "Save failed"}
                {!isSavingBio && bioSaveState === "idle" && "Save"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default SettingsPage;