"use client";

import { useState } from "react";
import Image from "next/image";
import LeftSection from "@/component/leftSection/leftSection";
import RighteSection from "@/component/righteSection/righteSection";

const notificationsData = [
  {
    id: 1,
    type: "like",
    user: "Ahmed Ali",
    avatar: "/avatar1.png",
    time: "2m ago",
    isRead: false,
  },
  {
    id: 2,
    type: "follow",
    user: "Sara Mohamed",
    avatar: "/avatar2.png",
    time: "10m ago",
    isRead: false,
  },
  {
    id: 3,
    type: "comment",
    user: "Omar Khaled",
    avatar: "/avatar3.png",
    time: "1h ago",
    isRead: true,
  },
];

const tabs = [
  { key: "all", label: "all" },
  { key: "likes", label: "likes" },
  { key: "follows", label: "follows" },
];

const getMessage = (type: string, user: string) => {
  switch (type) {
    case "like":
      return `${user} liked your post ❤️`;
    case "follow":
      return `${user} started following you 👤`;
    case "comment":
      return `${user} commented on your post 💬`;
    default:
      return "";
  }
};

const filterNotifications = (tab: string) => {
  if (tab === "all") return notificationsData;
  if (tab === "likes")
    return notificationsData.filter((item) => item.type === "like");
  if (tab === "follows")
    return notificationsData.filter((item) => item.type === "follow");
  return notificationsData;
};

export default function NotificationsPage() {
  const [tab, setTab] = useState("all");
  const filteredNotifications = filterNotifications(tab);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full md:w-[95%] lg:w-[90%] relative bg-black text-white">
        <div className="flex gap-4">
          <div className="hidden md:block md:w-[30%] lg:w-[20%]">
            <div className="fixed top-0 h-screen md:w-[25%] lg:w-[16%]">
              <LeftSection />
            </div>
          </div>

          <div className="w-full md:w-[70%] lg:w-[60%] mt-22 md:mt-10">
            <div className="mx-3 md:mx-0 bg-[#0f0f10] border border-gray-800 rounded-3xl p-5 shadow-sm">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <p className="text-gray-400 text-sm mt-1">
                      Follow updates of your interactions in one place
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                    <span className="bg-[#1b1b1f] px-3 py-2 rounded-full">
                      {filteredNotifications.length} Notifications
                    </span>
                    <span className="bg-[#1b1b1f] px-3 py-2 rounded-full">
                      {tabs.find((item) => item.key === tab)?.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {tabs.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setTab(item.key)}
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        tab === item.key
                          ? "bg-blue-600 text-white"
                          : "bg-[#1a1a1b] text-gray-300 hover:bg-[#2a2a2c]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  {filteredNotifications.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-gray-700 bg-[#151518] p-6 text-center text-gray-400">
                      There are no notifications in this section at the moment.
                    </div>
                  ) : (
                    filteredNotifications.map((notif) => {
                      return (
                        <div
                          key={notif.id}
                          className={`flex flex-col gap-4 rounded-3xl border p-4 transition ${
                            notif.isRead
                              ? "border-gray-800 bg-[#111116]"
                              : "border-blue-500 bg-[#151518]"
                          } hover:bg-[#1c1c1f]`}
                        >
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-700">
                                <Image
                                  src={notif.avatar}
                                  alt={notif.user}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm text-gray-100">
                                  {getMessage(notif.type, notif.user)}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {notif.time}
                                </span>
                              </div>
                            </div>
                            {notif.type === "follow" ? (
                              <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition">
                                follow
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-[20%] hidden lg:block">
            <div className="fixed top-0 w-[16%]">
              <RighteSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
