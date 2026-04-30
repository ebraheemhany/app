"use client";
import { useState, useRef } from "react";
import { ImageIcon, Video, Smile, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { toast } from "sonner";
import ProfilePage from './../../app/(main)/ProfilePage/ProfilePage';
import { useGetCurrentUser } from "@/Query/useGetUserByid";

const CLOUDINARY_CLOUD_NAME = "dc4c10a3f";
const CLOUDINARY_UPLOAD_PRESET = "social_app";

export default function CreatePost({ onPostCreated }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const feelingRef = useRef(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "video" && file.size > 50 * 1024 * 1024) {
      toast.error("Video must be less than 50MB");
      return;
    }

    const url = URL.createObjectURL(file);
    setMediaPreview({ url, type, file });
  };

  // رفع على Cloudinary مع progress
  const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const xhr = new XMLHttpRequest();

      // تتبع الـ progress
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
          resolve(res.secure_url);
        } else {
          reject(res);
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));

      const resourceType = file.type.startsWith("video") ? "video" : "image";
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      );
      xhr.send(formData);
    });
  };

  const addPost = async () => {
    if (!text.trim() && !mediaPreview) return;

    setLoading(true);
    setUploadProgress(0);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      let mediaUrl = null;
      if (mediaPreview?.file) {
        mediaUrl = await uploadToCloudinary(mediaPreview.file);
      }

      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content: text,
        image_url: mediaPreview?.type === "image" ? mediaUrl : null,
        video_url: mediaPreview?.type === "video" ? mediaUrl : null,
        feeling: mediaPreview?.type === "feeling" ? mediaUrl : null,
      });

      if (error) throw error;

      // استدعاء الدالة لإعادة جلب المنشورات
      if (onPostCreated) onPostCreated();

      setText("");
      setMediaPreview(null);
      setUploadProgress(0);
    } catch (err) {
      toast.error("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

// get current user profile
 const {data: ProfilePageData} =  useGetCurrentUser();
 const currentUser = ProfilePageData?.profile;
  

  return (
    <div className="w-full bg-[#1E1E22] mt-3 sm:mt-8 sm:rounded-2xl border border-gray-700 px-4 py-3 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          <div className="relative w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-blue-700 flex items-center justify-center">
       {
        currentUser?.avatar_url ? (
          <Image src={currentUser.avatar_url} alt="Avatar" fill className="" />
        ) : (
          <span className="text-white text-[12px] sm:text-[18px] sm:font-bold">
            {currentUser?.username?.slice(0, 2) || ""}
          </span>
        )
       }
          </div>
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1e1e2e]" />
        </div>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`What's on your mind, ${currentUser?.username}?`}
          className="flex-1 bg-[#2a2a3e] text-gray-300 placeholder-gray-500 text-[12px] sm:text-[16px] rounded-full px-2 sm:px-4 py-1.5 sm:py-2.5 outline-none border border-transparent focus:border-violet-500 transition-colors duration-200"
        />
      </div>

      {/* Preview */}
      {mediaPreview && (
        <div className="relative w-fit">
          {mediaPreview.type === "image" || mediaPreview.type === "feeling" ? (
            <Image
              src={mediaPreview.url}
              alt="preview"
              className="max-h-60 rounded-xl object-cover"
              width={400}
              height={300}
            />
          ) : (
            <video
              src={mediaPreview.url}
              controls
              className="max-h-60 rounded-xl"
            />
          )}
          <button
            onClick={() => setMediaPreview(null)}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Progress Bar */}
      {loading && mediaPreview && uploadProgress > 0 && (
        <div className="w-full flex flex-col gap-1">
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{uploadProgress}%</span>
        </div>
      )}

      <div className="border-t border-gray-700/60" />

      <div className="flex items-center justify-between">
        <div className="grid grid-cols-3 sm:flex items-center gap-3 sm:gap-5">
          {/* Image */}
          <button
            onClick={() => imageRef.current.click()}
            className="flex items-center gap-1.5 text-gray-400 hover:text-green-400 transition-colors duration-150 text-sm"
          >
            <ImageIcon size={18} className="text-green-400" />
            <span>Photo</span>
          </button>
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, "image")}
          />

          {/* Video */}
          <button
            onClick={() => videoRef.current.click()}
            className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors duration-150 text-sm"
          >
            <Video size={18} className="text-red-400" />
            <span>Video</span>
          </button>
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, "video")}
          />

          {/* Feeling */}
          <button
            onClick={() => feelingRef.current.click()}
            className="flex items-center gap-1.5 text-gray-400 hover:text-yellow-400 transition-colors duration-150 text-sm"
          >
            <Smile size={18} className="text-yellow-400" />
            <span>Feeling</span>
          </button>
          <input
            ref={feelingRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, "feeling")}
          />

          {/* Post button */}
          <button
            onClick={addPost}
            disabled={loading || (!text.trim() && !mediaPreview)}
            className="bg-blue-700 hover:bg-blue-800 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm text-center font-semibold sm:px-5 py-2 rounded-full transition-all duration-150"
          >
            {loading
              ? `${uploadProgress > 0 ? uploadProgress + "%" : "Posting..."}`
              : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
