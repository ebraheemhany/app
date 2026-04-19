"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
const Search_history = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // 1. استخدام JSON (بحروف كبيرة)
    // 2. القيمة الافتراضية تكون "[]" كنص
    const savedHistory = localStorage.getItem("search_history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // function to remove one item from history
  const removeHistoryItem = (index: number) => {
    const newHistory = [...history];
    newHistory.splice(index, 1);
    setHistory(newHistory);
    localStorage.setItem("search_history", JSON.stringify(newHistory));
  };

  // function to clear all history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("search_history");
  };

  return (
    <div className="mb-5">
      {history.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 mb-3">Search History</p>
          <div onClick={clearHistory}>
            <p className=" text-gray-400 hover:text-white cursor-pointer">
              Clear All
            </p>
          </div>
        </div>
      )}
      {history.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-2 border-b border-gray-700"
        >
          <span className="text-gray-400 text-sm">{index + 1}</span>
          <p className="flex-1 mx-3 text-white text-sm">{item}</p>
          <div>
            <X
              className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer"
              onClick={() => removeHistoryItem(index)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Search_history;
