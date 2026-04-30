import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Post = {
  id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  likes_count: number;
  comments_count: number;
};

const TrendingPosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("trending_score", { ascending: false })
      .limit(20);

    if (error) console.error("supabase error =>", error);
    setPosts(data || []);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="mx-2 mb-20">
      <p className="text-[14px] text-gray-300 mb-3">Suggested posts</p>

      <div className="columns-2 md:columns-3 gap-3">
        {posts.slice(0, 3).map((post) => (
          <div
            onClick={() => router.push(`/posts/${post.id}`)}
            key={post.id}
            className="mb-3 break-inside-avoid bg-[#1E1E22] border border-gray-700 rounded-xl overflow-hidden hover:translate-y-[-2px] transition"
          >
            <div className="relative h-[120px] bg-gray-700">
              {post.image_url ? (
                <div className="relative h-[120px] bg-gray-700">
                  <Image
                    src={post.image_url}
                    alt="post image"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : post.video_url ? (
                <div className="relative h-[120px] bg-gray-700">
                  <video
                    src={post.video_url}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}
            </div>

            <div className="p-3">
              <p className="text-white text-sm mb-1">{post.content}</p>
              <div className="flex gap-2 text-xs text-gray-400">
                <span>❤️ {post.likes_count}</span>
                <span>💬 {post.comments_count}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;
