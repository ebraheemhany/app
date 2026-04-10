import { Search, Bell, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="md:hidden fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-[#0f1117] text-white z-50">
      {/* الجزء الأيسر: اللوجو */}
      <div className="">
        <Image src="/icon/logo.svg" alt="logo" width={150} height={100} />
      </div>

      {/* الجزء الأيمن: الأيقونات */}
      <div className="flex items-center gap-2">
        {/* البحث - خليت الـ border شفاف أكتر */}
        <button className="p-2 rounded-full border border-gray-700/30 bg-gray-800/20 hover:bg-gray-800/50 transition-colors">
          <Search size={15} className="text-gray-300" />
        </button>

        {/* التنبيهات */}
        <button className="p-2 rounded-full border border-gray-700/30 bg-gray-800/20 hover:bg-gray-800/50 transition-colors relative">
          <Bell size={15} className="text-gray-300" />
          {/* تعديل مكان النقطة عشان تبقا زي الصورة بالظبط */}
          <span className="absolute top-2 right-2 w-[7px] h-[7px] bg-[#e67e22] rounded-full border-[1.5px] border-[#0f1117]"></span>
        </button>

        {/* البروفايل - الـ AM */}
        <Link href="/ProfilePage">
          <div className="ml-1 w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white  text-xs cursor-pointer shadow-sm">
            AM
          </div>
        </Link>
      </div>
    </nav>
  );
}
