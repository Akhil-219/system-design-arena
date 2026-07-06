import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyProfile } from "../services/userService";

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Couldn't load your profile.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#0a0a0a] text-[#fafafa] min-h-screen flex items-center justify-center">
        <span className="font-mono text-sm text-gray-500">Loading profile…</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="bg-[#0a0a0a] text-[#fafafa] min-h-screen flex items-center justify-center">
        <span className="font-mono text-sm text-gray-500">{error || "Profile not found."}</span>
      </div>
    );
  }

  const { user, totalUpvotes, publishedDesignsCount } = profile;

  return (
    <div className="bg-[#0a0a0a] text-[#fafafa] min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            {user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-xl text-gray-400 font-mono">
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{user.username}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <Link
            to="/settings"
            className="font-mono text-xs uppercase tracking-wider text-gray-300 border border-gray-800 rounded-md px-4 py-2 hover:bg-[#1a1a1a] hover:text-white transition-colors shrink-0"
          >
            Edit Profile
          </Link>
        </div>

        {user.bio && (
          <p className="text-sm text-gray-300 leading-relaxed mb-8">{user.bio}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-b border-gray-800 py-6">
          <div>
            <p className="text-2xl font-semibold">{publishedDesignsCount}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mt-1">
              Published
            </p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{totalUpvotes}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mt-1">
              Upvotes
            </p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{user.reputation}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mt-1">
              Reputation
            </p>
          </div>
          <div>
            <p className="text-2xl font-semibold">{user.followersCount}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-gray-500 mt-1">
              Followers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;