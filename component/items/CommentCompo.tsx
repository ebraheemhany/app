"use client";

import { useState } from "react";
import Image from "next/image";
import { useGetCommentsById } from "@/Query/useGetCommentsById";
import { useAddCommentById } from "@/Query/useAddCommentById";

type CurrentUser = {
  id: string;
  profile?: {
    username?: string;
    avatar_url?: string | null;
  };
} | null;

type PropsValue = {
  postId: string;
  currentUser: CurrentUser;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
};

const CommentCompo = ({ postId, currentUser }: PropsValue) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");

  // React Query - fetch comments
  const { data: comments, isLoading, error } = useGetCommentsById(postId);

  const safeComments: Comment[] = comments ?? [];

  // React Query - add comment
  const { mutate: addComment, isPending } = useAddCommentById();

  const submitComment = () => {
    if (!draft.trim() || !currentUser) return;

    addComment(
      {
        postId,
        userId: currentUser.id,
        content: draft.trim(),
      },
      {
        onSuccess: () => setDraft(""),
      },
    );
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitComment();
    }
  };

  return (
    <div className="w-full relative">
      {/* زرار التعليق */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] text-gray-400"
      >
        <CommentIcon />
        تعليق
        {safeComments.length > 0 && (
          <span className="text-xs text-gray-500">({safeComments.length})</span>
        )}
      </button>

      {/* التعليقات */}
      <div
        className="overflow-hidden transition-all duration-300 w-full relative -left-15"
        style={{
          maxHeight: open ? "600px" : "0",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="px-5 pt-3 flex flex-col gap-2.5">
          {/* loading */}
          {isLoading && <div className="text-gray-400 text-sm">Loading...</div>}

          {/* error */}
          {error && (
            <div className="text-red-400 text-sm">Error loading comments</div>
          )}

          {/* comments */}
          {!isLoading &&
            !error &&
            safeComments.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                {/* avatar */}
                <div className="w-8 h-8 rounded-full bg-green-300">
                  {c.profiles?.avatar_url ? (
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={c.profiles.avatar_url}
                        alt="avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {c.profiles?.username?.charAt(0).toUpperCase() || "?"}
                    </span>
                  )}
                </div>

                {/* comment */}
                <div className="bg-gray-700 rounded-xl px-3 py-2 flex-1">
                  <strong className="text-xs text-gray-100 block">
                    {c.profiles?.username}
                  </strong>
                  <p className="text-[13px] text-gray-300">{c.content}</p>
                </div>
              </div>
            ))}
        </div>

        {/* input */}
        <div className="px-5 pt-3 pb-4 flex gap-2 items-end w-full">
          <textarea
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Add Comment..."
            className="flex-1 bg-gray-800 text-white rounded-xl p-2 text-sm"
          />

          <button
            onClick={submitComment}
            disabled={isPending || !currentUser || !draft.trim()}
            className="text-white bg-blue-800 px-4 py-1.5 rounded-lg text-sm disabled:opacity-50"
          >
            {isPending ? "..." : currentUser ? "add" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentCompo;

/* icon */
const CommentIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
