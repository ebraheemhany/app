import {
  Home,
  Search,
  Plus,
  Bell,
  User,
  MessageSquareMore,
} from "lucide-react";
import Link from "next/link";

export default function BottomNav() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0f1117] border-t border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* Home - Active State */}
        <Link href="/">
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="bg-[#6366f1] p-1.5 rounded-lg text-white">
              <Home size={15} fill="currentColor" />
            </div>
            <span className="text-[#6366f1] text-xs font-medium">Home</span>
          </div>
        </Link>

        {/* Explore */}
        <Link href="explore">
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <Search
              size={20}
              className="text-gray-500 group-hover:text-gray-300"
            />
            <span className="text-gray-500 text-xs group-hover:text-gray-300 pt-1.5">
              Explore
            </span>
          </div>
        </Link>

        {/* Create */}
        {/* <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <Plus size={20} className="text-gray-500 group-hover:text-gray-300" />
          <span className="text-gray-500 text-xs group-hover:text-gray-300 pt-1.5">
            Create
          </span>
        </div> */}

        {/* Alerts */}
        <Link href="/Notifications">
          <div className="flex flex-col items-center gap-1 cursor-pointer group relative">
            <Bell
              size={20}
              className="text-gray-500 group-hover:text-gray-300"
            />
            {/* Notification Dot */}
            <span className="absolute top-0 right-1 w-2 h-2 bg-orange-600 rounded-full border border-[#0f1117]"></span>
            <span className="text-gray-500 text-xs group-hover:text-gray-300 pt-1.5">
              Alerts
            </span>
          </div>
        </Link>

        {/* Profile */}
        <Link href="/Messages">
          <div className="flex flex-col items-center gap-1 cursor-pointer group">
            <MessageSquareMore
              size={20}
              className="text-gray-500 group-hover:text-gray-300"
            />
            <span className="text-gray-500 text-xs group-hover:text-gray-300">
              Chat
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
