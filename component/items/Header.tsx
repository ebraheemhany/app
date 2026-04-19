"use client";

import { Search, Bell, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useGetCurrentUser } from "@/Query/useGetUserByid";

export default function Header() {
  const { data: user } = useGetCurrentUser();

  console.log("user data:", user?.profile?.avatar_url);

  return (
    <nav className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-[#0f1117] text-white z-50">
      {/* الجزء الأيسر: اللوجو */}
      <Link href="/">
        <div className="">
          <Image src="/icon/logo.svg" alt="logo" width={150} height={100} />
        </div>
      </Link>

      {/* profile icon */}
      <Link href="/ProfilePage">
        <div className="ml-1 w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center text-white  text-xs cursor-pointer shadow-sm">
          {user?.profile?.avatar_url ? (
            <Image
              src={user.profile.avatar_url}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full"
            />
          ) : (
            <p>{user?.profile?.name?.charAt(1)}</p>
          )}
        </div>
      </Link>
    </nav>
  );
}
