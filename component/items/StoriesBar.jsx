"use client";
import { useState } from "react";

const stories = [
  { id: 1, name: "Sara", initial: "S", color: "#E8733A", ring: "#E8733A" },
  { id: 2, name: "Mohamed", initial: "M", color: "#4CAF8A", ring: "#4CAF8A" },
  { id: 3, name: "Layla", initial: "L", color: "#E05C8A", ring: "#E05C8A" },
  { id: 4, name: "Kareem", initial: "K", color: "#6BB8E8", ring: "#6BB8E8" },
  { id: 5, name: "Nour", initial: "N", color: "#E8B84B", ring: "#E8B84B" },
  { id: 6, name: "Rana", initial: "R", color: "#A08EE0", ring: "#A08EE0" },
  { id: 7, name: "Ahmed", initial: "A", color: "#FF6B6B", ring: "#FF6B6B" },
  { id: 8, name: "Fatima", initial: "F", color: "#4ECDC4", ring: "#4ECDC4" },
  { id: 9, name: "Omar", initial: "O", color: "#45B7D1", ring: "#45B7D1" },
  { id: 10, name: "Omar", initial: "O", color: "#45B7D1", ring: "#45B7D1" },
  { id: 11, name: "Omar", initial: "O", color: "#45B7D1", ring: "#45B7D1" },
];

export default function StoriesBar() {
  const [viewed, setViewed] = useState({});

  const handleView = (id) => {
    setViewed((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="w-full bg-[#1E1E22]  flex items-center gap-5 px-3 py-3  font-sans overflow-x-auto sm:rounded-2xl border border-gray-700 custom-scroll">
      {/* Your Story */}
      <div className="flex flex-col items-center gap-1 cursor-pointer">
        <div className=" w-[38px] h-[38px] sm:w-[58px] sm:h-[58px] rounded-full border-2 border-[#555] bg-[#2a2a3e] flex items-center justify-center">
          <span className="text-[#aaa] text-[18px] sm:text-[22px] leading-none">
            +
          </span>
        </div>
        <span className="text-[#ccc] text-[11px] text-center max-w-[60px] truncate">
          Your story
        </span>
      </div>

      {/* Stories */}
      {stories.map((story) => (
        <div
          key={story.id}
          className="flex flex-col items-center gap-1 cursor-pointer"
          onClick={() => handleView(story.id)}
        >
          <div
            className="flex items-center justify-center p-[3px] rounded-full transition-transform duration-150 hover:scale-110"
            style={{
              background: viewed[story.id]
                ? "linear-gradient(135deg, #555, #888)"
                : `linear-gradient(135deg, ${story.ring}, ${story.ring}cc)`,
            }}
          >
            <div
              className="w-[38px] h-[38px] sm:w-[58px] sm:h-[58px] rounded-full border-[3px] border-[#1a1a2e] flex items-center justify-center"
              style={{ background: story.color }}
            >
              <span className="text-white font-bold text-[18px] sm:text-[20px] tracking-wide">
                {story.initial}
              </span>
            </div>
          </div>

          <span className="text-[#ccc] text-[11px] text-center max-w-[60px] truncate">
            {story.name}
          </span>
        </div>
      ))}
    </div>
  );
}
