"use client";
import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  BadgeCheck,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const reactions = ["❤️", "😮", "😂"];

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="w-full bg-[#1E1E22] mt-5 sm:rounded-2xl border border-gray-700/60 overflow-hidden font-sans">
      {/* ── Header ── */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <Link href={`/OuherProfile/${post.user_id}`}>
            {post.profiles?.avatar_url ? (
              <Image
                src={post.profiles.avatar_url}
                alt="avatar"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0 cursor-pointer"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center flex-shrink-0 cursor-pointer">
                <span className="text-white text-sm font-bold">
                  {post.profiles?.username?.charAt(0).toUpperCase() || "?"}
                </span>
              </div>
            )}
          </Link>
          {/* Name */}
          <div>
            <div className="flex items-center gap-1">
              <Link href={`/OuherProfile/${post.user_id}`}>
                <span className="text-white text-sm font-semibold cursor-pointer hover:underline">
                  {post.profiles?.username || "Unknown"}
                </span>
              </Link>
              <BadgeCheck size={15} className="text-blue-400 fill-blue-400" />
            </div>
            <span className="text-gray-500 text-xs">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {post.is_edited && " · edited"}
            </span>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-300 transition-colors p-1">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* ── Body text ── */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-gray-200 text-sm leading-relaxed">
            {post.content}
          </p>
        </div>
      )}

      {/* ── Feeling ── */}
      {post.feeling && (
        <div className="px-4 pb-3">
          <span className="text-gray-400 text-sm">
            is feeling {post.feeling}
          </span>
        </div>
      )}

      {/* ── Image ── */}
      {post.image_url && (
        <div className="mx-4 mb-4 rounded-xl overflow-hidden">
          <Image
            src={post.image_url}
            alt="post"
            className="w-full object-cover max-h-96"
            width={400}
            height={300}
          />
        </div>
      )}

      {/* ── Video ── */}
      {post.video_url && (
        <div className="mx-4 mb-4 rounded-xl overflow-hidden">
          <video
            src={post.video_url}
            controls
            className="w-full max-h-96 rounded-xl"
          />
        </div>
      )}

      {/* ── Reactions & counts ── */}
      <div className="px-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1">
            {reactions.map((r, i) => (
              <span key={i} className="text-base leading-none">
                {r}
              </span>
            ))}
          </div>
          <span className="text-gray-400 text-xs">
            {post.likes_count} · 0 comments
          </span>
        </div>
        <span className="text-gray-500 text-xs">0 shares</span>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-gray-700/50 mx-4" />

      {/* ── Action buttons ── */}
      <div className="grid grid-cols-4">
        <button
          onClick={() => setLiked((p) => !p)}
          className={`flex items-center justify-center gap-2 py-3 text-sm transition-colors hover:bg-white/5 ${
            liked ? "text-red-400" : "text-gray-400"
          }`}
        >
          <Heart size={17} className={liked ? "fill-red-400" : ""} />
          <span>Like</span>
        </button>

        <button className="flex items-center justify-center gap-2 py-3 text-sm text-gray-400 hover:bg-white/5 transition-colors">
          <MessageCircle size={17} />
          <span>Comment</span>
        </button>

        <button className="flex items-center justify-center gap-2 py-3 text-sm text-gray-400 hover:bg-white/5 transition-colors">
          <Send size={17} />
          <span>Share</span>
        </button>

        <button
          onClick={() => setSaved((p) => !p)}
          className={`flex items-center justify-center gap-2 py-3 text-sm transition-colors hover:bg-white/5 ${
            saved ? "text-yellow-400" : "text-gray-400"
          }`}
        >
          <Bookmark size={17} className={saved ? "fill-yellow-400" : ""} />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}
