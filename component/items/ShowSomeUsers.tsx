"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";
import { useGetUsers } from "@/Query/useGetUsers";

type User = {
  id: string;
  username: string;
  avatar_url: string | null;
};

const ShowSomeUsers = () => {
  const [following, setFollowing] = useState<string[]>([]);

  const { data: users, isLoading, error } = useGetUsers();

  const safeUsers: User[] = users ?? [];

  const toggleFollow = (id: string) => {
    setFollowing((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id],
    );
  };

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToScroll: 1,
    slidesToShow: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (isLoading) {
    return <div className="text-gray-400">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error loading users</div>;
  }

  return (
    <div className="mx-2">
      <p className="text-[14px] text-gray-300 mb-3">People may know them</p>

      <div className="mb-6">
        <Slider {...settings}>
          {safeUsers.map((user) => (
            <div key={user.id} className="p-2">
              <div className="bg-[#1E1E22] border border-gray-700 rounded-xl p-3 flex flex-col items-center">
                <Link href={`/OuherProfile/${user.id}`}>
                  <div className="w-12 h-12 relative mb-2">
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt="avatar"
                        fill
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-blue-700 flex items-center justify-center">
                        <p>{user?.username.slice(0, 2)}</p>
                      </div>
                    )}
                  </div>
                </Link>

                <p className="text-white text-sm">{user.username}</p>

                <button
                  onClick={() => toggleFollow(user.id)}
                  className={`mt-2 px-4 py-1 rounded-full text-xs ${
                    following.includes(user.id)
                      ? "border border-gray-600 text-gray-400"
                      : "bg-purple-600 text-white"
                  }`}
                >
                  {following.includes(user.id) ? "following" : "follow"}
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ShowSomeUsers;
