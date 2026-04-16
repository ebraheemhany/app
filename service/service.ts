import { supabase } from "@/lib/supabase"

// get post by id
export const getPostById = async (id: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (
        username,
        avatar_url
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
};

// get all posts
export const getAllPosts = async () => {
const {data , error} = await supabase.from("posts").select(`
  *,
  profiles (
    username,
    avatar_url
  )
`).order("created_at", { ascending: false });

if(error) throw error;
return data;

}

// get likes from db
export const getLikesByPostId = async (postId: string, userId?: string) => {
  const { count } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId);

  let liked = false;
  if (userId) {
    const { data } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();

    liked = !!data;
  }

  return {
    count: count || 0,
    liked,
  };
};
// add or remove like from db

// get comments from db
export const getCommentByPostId = async (postId: string) => {
  const {data , error} = await supabase.from("comments")
        .select(
          `id, content, created_at, user_id, profiles (username, avatar_url)`,
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

if(error) throw error;

return data;

}

// add comment to db
type CommentType = {
  postId: string;
  userId: string;
  content: string;
}
export const addComment = async ({
  postId,
  userId,
  content,
}: CommentType) => {
  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      user_id: userId,
      content,
    })
    .select("id")
    .single();

  if (error) throw error;

  return data;
};

// get user from db
export const getUsers = async () => {
const {data , error} = await supabase.from("profiles").select("*")
if(error) throw error;
return data;

}

// follow or unfollow user


export const getFollowData = async (profileId: string) => {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;

  if (!userId) throw new Error("User not logged in");

  // check following
  const { data: followData } = await supabase
    .from("follows")
    .select("*")
    .eq("follower_id", userId)
    .eq("following_id", profileId)
    .maybeSingle();

  // count followers
  const { count } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_id", profileId);

  return {
    isFollowing: !!followData,
    followersCount: count || 0,
    userId,
  };
};

export const toggleFollow = async ({
  profileId,
  userId,
  isFollowing,
}: {
  profileId: string;
  userId: string;
  isFollowing: boolean;
}) => {
  if (isFollowing) {
    return await supabase
      .from("follows")
      .delete()
      .eq("follower_id", userId)
      .eq("following_id", profileId);
  }

  return await supabase.from("follows").insert({
    follower_id: userId,
    following_id: profileId,
  });
};


// get and send chat between users

// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// const supabase = createClientComponentClient();

// إنشاء أو جلب محادثة موجودة
export async function getOrCreateConversation(
  currentUserId?: string,
  otherUserId?: string
): Promise<string> {
  const [p1, p2] = [currentUserId, otherUserId].sort();

  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .eq("participant_one", p1)
    .eq("participant_two", p2)
    .single();

  if (existing) return existing.id;

  const { data: created, error } = await supabase
    .from("conversations")
    .insert({ participant_one: p1, participant_two: p2 })
    .select("id")
    .single();

  if (error) throw error;
  return created.id;
}














