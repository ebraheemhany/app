"use client";

import LeftSection from "../../../component/leftSection/leftSection";
import RighteSection from "../../../component/righteSection/righteSection";
import { UserPen } from "lucide-react";
import { EditPage } from "@/component/items/EditPage";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import Image from "next/image";

type Profile = {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  created_at: string;
};

export default function ProfilePage() {
  const [showEdit, setShowEdit] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  // ✅ طلعنا fetchProfile برّه useEffect
  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) toast.error("Failed to fetch profile data");
    else setProfile(data);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // get posts of the user
  useEffect(() => {
    const fetchPosts = async () => {
      if (!profile) return;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) toast.error("Failed to fetch Posts");
      else setPosts(data);
    };
    fetchPosts();
  }, [profile]);
  console.log("posts", posts);
  return (
    <div className="w-full flex justify-center">
      <div className="w-[100%] md:w-[95%] lg:w-[90%] relative bg-black text-white">
        <div className="flex gap-4">
          <div className="hidden md:block md:w-[30%] lg:w-[20%]">
            <div className="fixed top-0 h-screen md:w-[25%] lg:w-[16%]">
              <LeftSection />
            </div>
          </div>

          <div className="w-[100%] md:w-[70%] lg:w-[60%] mt-22 md:mt-10 bg-black text-white min-h-screen flex flex-col">
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

              <div className="flex gap-6 mt-4 text-center">
                <div>
                  <p className="font-bold">{posts.length}</p>
                  <p className="text-gray-400 text-sm">Posts</p>
                </div>
                <div>
                  <p className="font-bold">24.5k</p>
                  <p className="text-gray-400 text-sm">Followers</p>
                </div>
                <div>
                  <p className="font-bold">850</p>
                  <p className="text-gray-400 text-sm">Following</p>
                </div>
              </div>

              <div
                onClick={() => setShowEdit(true)}
                className="hidden sm:block mt-5 w-25 h-8 text-center border border-blue-700 cursor-pointer pt-1 text-[15px] text-white rounded-2xl"
              >
                Edit Profile
              </div>

              <div
                onClick={() => setShowEdit(true)}
                className="block sm:hidden absolute top-3 right-3 group cursor-pointer"
              >
                <UserPen />
                <span className="absolute right-0 mt-1 hidden group-hover:block text-white text-xs">
                  Edit
                </span>
              </div>
            </div>

            <div className="flex justify-around border-b border-gray-800">
              <button className="py-3 border-b-2 border-purple-500 text-purple-400">
                Posts
              </button>
              <button className="py-3 text-gray-400">Bookmark</button>
              <button className="py-3 text-gray-400">Tag</button>
            </div>

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
                      // بوست نص بس
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

          <div className="w-[20%] hidden lg:block">
            <div className="fixed top-0 w-[16%]">
              <RighteSection />
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <EditPage state={setShowEdit} onProfileUpdated={fetchProfile} />
      )}
    </div>
  );
}
