"use client";

import { Heart } from "lucide-react";
import { useLikes } from "@/Query/useLikes";
import { useToggleLike } from "@/Query/useToggleLike";

type CurrentUser = {
  id: string;
};

type PropsValue = {
  postId: string;
  currentUser: CurrentUser | null;
};

const LikesCompo = ({ postId, currentUser }: PropsValue) => {
  const userId = currentUser?.id;

  const { data, isLoading } = useLikes(postId, userId);
  const toggleLike = useToggleLike();

  const handleClick = () => {
    if (!userId || !data) return;

    toggleLike.mutate({
      postId,
      userId,
      liked: data.liked,
    });
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] text-gray-500 bg-gray-900 cursor-wait"
      >
        <Heart size={16} fill="none" stroke="currentColor" />0
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={!userId}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] transition ${
        !userId
          ? "text-gray-500 bg-gray-900 cursor-not-allowed"
          : data?.liked
            ? "text-red-500"
            : "text-gray-400"
      }`}
    >
      <Heart
        size={16}
        fill={data?.liked ? "currentColor" : "none"}
        stroke="currentColor"
      />
      {data?.count ?? 0}
      {!userId && <span className="text-[11px] text-gray-400">Sign in</span>}
    </button>
  );
};

export default LikesCompo;
