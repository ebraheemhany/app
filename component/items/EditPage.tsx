"use client";
import React, { useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const CLOUDINARY_CLOUD_NAME = "dc4c10a3f";
const CLOUDINARY_UPLOAD_PRESET = "social_app";

type Props = {
  state: React.Dispatch<React.SetStateAction<boolean>>;
  onProfileUpdated?: () => void;
};

type FormValues = {
  username: string;
  email: string;
  password: string;
  phone: string;
  bio: string;
  avatar: FileList;
};

export const EditPage = ({ state, onProfileUpdated }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue, // ✅ عشان نحط البيانات القديمة
    formState: { errors },
  } = useForm<FormValues>();

  // ✅ جلب البيانات الحالية
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // جيب بيانات الـ auth
        setValue("email", user.email || "");

        // جيب بيانات الـ profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, bio, phone, avatar_url")
          .eq("id", user.id)
          .single();

        if (profile) {
          setValue("username", profile.username || "");
          setValue("bio", profile.bio || "");
          setValue("phone", profile.phone || "");
          if (profile.avatar_url) setPreview(profile.avatar_url);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const uploadAvatar = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        const res = JSON.parse(xhr.responseText);
        if (xhr.status === 200) resolve(res.secure_url);
        else reject(res);
      };
      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      );
      xhr.send(formData);
    });
  };

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not logged in");

      let avatarUrl = null;
      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      const profileUpdates: Record<string, string> = {};
      if (data.username) profileUpdates.username = data.username;
      if (data.bio) profileUpdates.bio = data.bio;
      if (data.phone) profileUpdates.phone = data.phone;
      if (avatarUrl) profileUpdates.avatar_url = avatarUrl;

      if (Object.keys(profileUpdates).length > 0) {
        const { error } = await supabase
          .from("profiles")
          .update(profileUpdates)
          .eq("id", user.id);

        if (error) throw error;
      }

      if (data.email && data.email !== user.email) {
        const { error } = await supabase.auth.updateUser({ email: data.email });
        if (error) throw error;
      }

      if (data.password) {
        const { error } = await supabase.auth.updateUser({
          password: data.password,
        });
        if (error) throw error;
      }

      toast.success("Profile updated successfully!");
      onProfileUpdated?.();
      state(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div
        className="w-[95%] md:w-[500px] h-[85vh] bg-gray-900 flex flex-col items-center py-4 rounded-xl relative overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-gray-300 text-lg absolute top-4 left-4">
          Edit Your Profile
        </h2>

        <div
          onClick={() => state(false)}
          className="absolute top-4 right-4 border border-gray-600 rounded-lg cursor-pointer w-7 h-7 flex items-center justify-center hover:bg-gray-800 transition"
        >
          <X className="w-4 text-white" />
        </div>

        {/* loading skeleton */}
        {fetching ? (
          <div className="w-[90%] flex flex-col gap-4 mt-12">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-full h-10 bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <form
            className="w-[90%] flex flex-col gap-4 mt-12"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative w-24 h-24 rounded-full bg-gray-500 flex items-center justify-center text-2xl shadow-[0_0_10px_#1d4ed8]">
                {preview ? (
                  <Image
                    src={preview}
                    alt="avatar"
                    fill
                    className="rounded-full object-cover"
                  />
                ) : (
                  "AM"
                )}
                <div
                  className="absolute bottom-1 right-1 bg-blue-700 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer text-white hover:scale-110 transition"
                  onClick={() => inputRef.current?.click()}
                >
                  <Plus className="w-4" />
                </div>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAvatarFile(file);
                    const url = URL.createObjectURL(file);
                    setPreview(url);
                  }
                }}
              />
            </div>

            {/* Username */}
            <div>
              <label className="text-gray-400 text-sm">Username</label>
              <input
                {...register("username")}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-700 outline-none"
                placeholder="Enter your username"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-400 text-sm">Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-700 outline-none"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-400 text-sm">Password</label>
              <input
                type="password"
                {...register("password")}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-700 outline-none"
                placeholder="Leave empty to keep current password"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-400 text-sm">Phone</label>
              <input
                {...register("phone")}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-700 outline-none"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-gray-400 text-sm">Bio</label>
              <textarea
                {...register("bio")}
                rows={3}
                className="w-full bg-gray-800 text-white rounded-lg px-3 py-2 border border-gray-600 focus:border-blue-700 outline-none resize-none"
                placeholder="Tell us about yourself"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-700 text-white rounded-lg py-2 hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
