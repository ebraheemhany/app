"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import LikesCompo from "./LikesCompo";
import CommentCompo from "./CommentCompo";

const reactions = ["❤️", "😮", "😂"];

export default function CommentSection({ post }) {
  const likesCount = post?.likes_count ?? 0;
  const commentsCount = post?.comments_count ?? 0;

  const [currentUser, setCurrentUser] = useState(null);
    console.log("jjjjjjjjjjjjjjjjjjj" , currentUser)
  // get current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
    console.log("user from supabase:", user);
      if (user && !error) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", user.id)
          .single();

        if (!profileError) {
          setCurrentUser({ ...user, profile });
        } else {
          console.error("Profile fetch error:", profileError);
          setCurrentUser({ ...user, profile: null });
        }
      } else {
        setCurrentUser(null);
      }
    };

    getUser();

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", session.user.id)
          .single();

        if (!profileError) {
          setCurrentUser({ ...session.user, profile });
        } else {
          console.error("Profile fetch error:", profileError);
          setCurrentUser({ ...session.user, profile: null });
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getInitials = (username) => username?.charAt(0).toUpperCase() || "?";


  return (
    <div className="bg-[#1E1E22] border border-gray-500 rounded-xl overflow-hidden w-full mx-auto my-4">
      <div className="px-5 pt-4 pb-3">
        <div className="flex items-center gap-2.5 mb-3">
          {post.profiles?.avatar_url ? (
            <div className="relative w-10 h-10 shrink-0">
              <Image src={post.profiles.avatar_url} alt="avatar" fill className="rounded-full object-cover" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium shrink-0">
              {getInitials(post.profiles?.username)}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-white">{post.profiles?.username || "Unknown"}</p>
            <span className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <p className="text-sm text-gray-200 mb-3">{post.content}</p>
        
        {post.image_url && (
            <div className="mb-3 rounded-xl overflow-hidden">
                <Image src={post.image_url} alt="post" width={300} height={300} className="w-full  object-cover" />
            </div>
        )}
{
  post.video_url && (
    <div className="mb-3 rounded-xl overflow-hidden " >
      <video src={post.video_url} controls className="w-full h-[400px]" />
    </div>
  )
}

        <div className="flex items-center justify-between px-1 py-3">
          <div className="flex items-center gap-2">
            <div className="flex">{reactions.map((r, i) => <span key={i} className="text-base">{r}</span>)}</div>
            <span className="text-xs text-gray-400">{likesCount} · {commentsCount} تعليق</span>
          </div>
        </div>

        <div className="border-t border-gray-700 -mx-5" />

     <div className="flex items-start gap-1 pt-2">
  <LikesCompo postId={post.id} currentUser={currentUser} />
  
    <CommentCompo postId={post.id} currentUser={currentUser} />
  
</div>
      </div>

    
    </div>
  );
}

// // الأيقونات
// const HeartIcon = ({ filled }) => (
//   <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
//     <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
//   </svg>
// );
