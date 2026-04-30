"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LeftSection from "@/component/leftSection/leftSection";
import RighteSection from "@/component/righteSection/righteSection";
import Image from "next/image";
import { toast } from "sonner";
import { useFollow } from "@/Query/useFollow";
import { useToggleFollow } from "@/Query/useToggleFollow";
import { startConversation } from "@/Query/useConversations";

type Profile = {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
};

export default function UserProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);

  // التحقق من أن id موجود وهو string
  if (!id || typeof id !== "string") {
    return <div>Invalid profile ID</div>;
  }

  // ✅ React Query
  const { data: followData, isLoading: followLoading } = useFollow(id);
  const toggleFollowMutation = useToggleFollow();

  // =====================
  // Get Current User
  // =====================
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setCurrentUserId(data.session?.user.id ?? null);
    });
  }, []);

  // =====================
  // Fetch profile
  // =====================
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) toast.error("Failed to fetch profile");
      else setProfile(data);
    };

    if (id) fetchProfile();
  }, [id]);

  // =====================
  // Fetch posts
  // =====================
  useEffect(() => {
    const fetchPosts = async () => {
      if (!profile) return;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) toast.error("Failed to fetch posts");
      else setPosts(data);
    };

    fetchPosts();
  }, [profile]);

  // =====================
  // Follow / Unfollow
  // =====================
  const handleFollowToggle = () => {
    if (!followData) return;

    toggleFollowMutation.mutate({
      profileId: id,
      userId: followData.userId,
      isFollowing: followData.isFollowing,
    });
  };

  // =====================
  // Send Message
  // =====================
  const handleSendMessage = async () => {
    if (!currentUserId || !id) {
      toast.error("Please log in first");
      return;
    }

    try {
      setIsLoadingMessage(true);
      const conversationId = await startConversation(currentUserId, id);
      router.push(`/Messages?conv=${conversationId}`);
    } catch (error) {
      toast.error("Failed to start conversation");
    } finally {
      setIsLoadingMessage(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[100%] md:w-[95%] lg:w-[90%] relative bg-black text-white">
        <div className="flex gap-4">
          {/* Left Section */}
          <div className="hidden md:block md:w-[30%] lg:w-[20%]">
            <div className="fixed top-0 h-screen md:w-[25%] lg:w-[16%]">
              <LeftSection />
            </div>
          </div>

          {/* Main Content */}
          <div className="w-[100%] md:w-[70%] lg:w-[60%] mt-22 md:mt-10 bg-black text-white min-h-screen flex flex-col">
            {/* Profile Header */}
            <div className="relative flex flex-col items-center justify-between sm:flex-row sm:items-start mx-3 md:mx-0 py-6">
              <div>
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt="Profile Image"
                    width={96}
                    height={96}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center text-2xl shadow-[0_0_10px_#1d4ed8]">
                    {profile?.username?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}

                <h2 className="mt-3 text-[18px]">{profile?.username}</h2>
                <p className="text-gray-400 text-[12px]">{profile?.email}</p>
                <p className="text-gray-400 text-[12px]">
                  {profile?.bio || "No bio available"}
                </p>
              </div>

              {/* Stats */}
              <div className="flex gap-6 mt-4 text-center">
                <div>
                  <p className="font-bold">{posts.length}</p>
                  <p className="text-gray-400 text-sm">Posts</p>
                </div>

                <div>
                  <p className="font-bold">{followData?.followersCount ?? 0}</p>
                  <p className="text-gray-400 text-sm">Followers</p>
                </div>

                <div>
                  <p className="font-bold">850</p>
                  <p className="text-gray-400 text-sm">Following</p>
                </div>
              </div>

              {/* Follow Button */}
              <div className="flex gap-3 mt-5">
                <button
                  onClick={handleFollowToggle}
                  disabled={toggleFollowMutation.isPending || followLoading}
                  className={` px-4 text-center border cursor-pointer pt-1 text-[15px] rounded-2xl transition-colors ${
                    followData?.isFollowing
                      ? "bg-blue-700 text-white"
                      : "border-blue-700 text-white hover:bg-blue-700"
                  }`}
                >
                  {toggleFollowMutation.isPending
                    ? "Follo.."
                    : followData?.isFollowing
                      ? "Following"
                      : "Follow"}
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={isLoadingMessage}
                  className=" px-4 text-center border border-blue-700 text-white hover:bg-blue-700 cursor-pointer pt-1 text-[15px] rounded-2xl transition-colors"
                >
                  {isLoadingMessage ? "Cha.." : "Chating"}
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex justify-around border-b border-gray-800">
              <button className="py-3 border-b-2 border-purple-500 text-purple-400">
                Posts
              </button>
              <button className="py-3 text-gray-400">Bookmark</button>
              <button className="py-3 text-gray-400">Tag</button>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-3 gap-1 flex-1">
              {posts.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500 py-10">
                  No posts yet
                </div>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    className="aspect-square bg-gray-800 overflow-hidden relative"
                  >
                    {post.image_url ? (
                      <Image
                        src={post.image_url}
                        alt="post"
                        fill
                        className="object-cover"
                      />
                    ) : post.video_url ? (
                      <video
                        src={post.video_url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-2">
                        <p className="text-gray-300 text-xs text-center line-clamp-4">
                          {post.content}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="w-[20%] hidden lg:block">
            <div className="fixed top-0 w-[20%]">
              <RighteSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
