import React from "react";

export const ActiveNow = () => {
  return (
    <div className="bg-[#161618] border border-gray-700 rounded-xl">
      <div className="p-3">
        <p className="text-[13px] text-gray-700">ACTIVE NOW</p>
        <div className="relative flex items-center justify-between mt-3 pb-1">
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-[13px]">
              Ah
            </div>
            <span className="absolute bottom-0 left-5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1e1e2e]" />
            <div>
              <p className="text-[14px] text-white">Ahmed M.</p>
            </div>
          </div>

          <p className="text-[12px] text-gray-300">Online</p>
        </div>

        <div className="relative flex items-center justify-between mt-3 pb-1">
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-[13px]">
              Ah
            </div>
            <span className="absolute bottom-0 left-5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#1e1e2e]" />
            <div>
              <p className="text-[14px] text-white">Ahmed M.</p>
            </div>
          </div>

          <p className="text-[12px] text-gray-300">Online</p>
        </div>

        <div className="relative flex items-center justify-between mt-3 pb-1">
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-[13px]">
              Ah
            </div>

            <div>
              <p className="text-[14px] text-white">Ahmed M.</p>
            </div>
          </div>

          <p className="text-[12px] text-gray-700">2m ago</p>
        </div>

        <div className="relative flex items-center justify-between mt-3 pb-1">
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-[13px]">
              Ah
            </div>

            <div>
              <p className="text-[14px] text-white">Ahmed M.</p>
            </div>
          </div>

          <p className="text-[12px] text-gray-700">2m ago</p>
        </div>
      </div>
    </div>
  );
};
