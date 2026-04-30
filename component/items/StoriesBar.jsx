"use client";
import { useState } from "react";
import Image from "next/image";
import { useGetStories } from "@/Query/useGetStories";
import { useAddStories } from "@/Query/useAddStories";
import { useGetCurrentUser } from "@/Query/useGetUserByid";
import AddStoryModal from "./AddStoryModal";
import StoryViewer from "./StoryViewer";

export default function StoriesBar() {
  const [viewed, setViewed] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(null);

  const { mutate: addStory, isPending: isAdding } = useAddStories();
  const { data: groupedStories, isPending, error } = useGetStories(); // ✅ غير الاسم
  const { data: currentUser } = useGetCurrentUser();
  const profile = currentUser?.profile;

  // ✅ viewed بالـ user_id مش story id
  const handleView = (index) => {
    setViewerIndex(index);
    setViewed((prev) => ({ ...prev, [groupedStories[index].user_id]: true }));
  };

  const handlePost = ({ file, isImage, content, avatarBg }) => {
    addStory(
      { file, isImage, content, avatarBg },
      { onSuccess: () => setShowModal(false) }
    );
  };

  if (isPending) {
    return (
      <div className="w-full bg-[#1E1E22] flex items-center gap-5 px-3 py-3 sm:rounded-2xl border border-gray-700">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="w-[38px] h-[38px] sm:w-[58px] sm:h-[58px] rounded-full bg-[#2a2a3e] animate-pulse" />
            <div className="w-10 h-2 rounded bg-[#2a2a3e] animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-[#1E1E22] flex items-center justify-center px-3 py-4 sm:rounded-2xl border border-gray-700">
        <span className="text-red-400 text-sm">فشل تحميل القصص</span>
      </div>
    );
  }

  return (
    <>
      <div className="w-full bg-[#1E1E22] flex items-center gap-5 px-3 py-3 font-sans overflow-x-auto sm:rounded-2xl border border-gray-700 custom-scroll">

        {/* Your Story */}
        <div
          className="flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <div className="w-[38px] h-[38px] sm:w-[58px] sm:h-[58px] rounded-full border-2 border-[#555] bg-[#2a2a3e] flex items-center justify-center overflow-hidden relative">
            {profile?.avatar_url && (
              <Image src={profile.avatar_url} alt="avatar" fill className="object-cover rounded-full" />
            )}
            <div className="absolute bottom-0 right-0 w-[18px] h-[18px] bg-blue-500 rounded-full border-2 border-[#1E1E22] flex items-center justify-center">
              <span className="text-white text-[10px] font-bold leading-none">+</span>
            </div>
          </div>
          <span className="text-[#ccc] text-[11px] text-center max-w-[60px] truncate">
            {profile?.username ?? "قصتك"}
          </span>
        </div>

        {/* ✅ كل bubble = يوزر وليها stories[] */}
        {groupedStories?.map((userStories, index) => (
          <div
            key={userStories.user_id}
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => handleView(index)}
          >
            <div
              className="flex items-center justify-center p-[3px] rounded-full transition-transform duration-150 hover:scale-110"
              style={{
                background: viewed[userStories.user_id]
                  ? "linear-gradient(135deg, #555, #888)"
                  : userStories.avatar_bg || "linear-gradient(135deg, #E8733A, #E8733Acc)",
              }}
            >
              <div className="w-[38px] h-[38px] sm:w-[58px] sm:h-[58px] rounded-full border-[3px] border-[#1a1a2e] flex items-center justify-center bg-[#2a2a3e] overflow-hidden relative">
                {userStories.avatar_url ? (
                  <Image src={userStories.avatar_url} alt="avatar" fill className="object-cover rounded-full" />
                ) : (
                  <span className="text-white font-bold text-[18px] sm:text-[20px]">
                    {userStories.username?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[#ccc] text-[11px] text-center max-w-[60px] truncate">
              {userStories.username}
            </span>
          </div>
        ))}
      </div>

      {showModal && (
        <AddStoryModal
          onClose={() => setShowModal(false)}
          onPost={handlePost}
          isPosting={isAdding}
          profile={profile}
        />
      )}

      {/* ✅ بعت stories[] بتاعت اليوزر المحدد بس */}
      {viewerIndex !== null && (
        <StoryViewer
          stories={groupedStories[viewerIndex].stories}
          startIndex={0}
          onClose={() => setViewerIndex(null)}
        />
      )}
    </>
  );
}