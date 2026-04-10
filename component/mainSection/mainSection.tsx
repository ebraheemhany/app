"use client";
import React from "react";
import StoriesBar from "../items/StoriesBar";
import CreatePost from "../items/CreatePost";
import PostCard from "../items/PostCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Post = {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  feeling: string | null;
  likes_count: number;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  } | null;
};

const MainSection = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const getPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        profiles (
          username,
          avatar_url
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setPosts(data as Post[]);

    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div>
      <StoriesBar />
      <CreatePost onPostCreated={getPosts} />

      {loading ? (
        <div className="text-gray-400 text-center mt-10">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-gray-400 text-center mt-10">No posts yet</div>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainSection;
