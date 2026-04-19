"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export default function StoryViewer({ stories, startIndex = 0, onClose }) {
  const [currentIdx, setCurrentIdx] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const animRef = useRef(null);
  const lastTimeRef = useRef(null);
  const DURATION = 5000;

  const currentStory = stories[currentIdx];

  // ✅ useCallback عشان مش بيتعمل re-create كل render
  const nextStory = useCallback(() => {
    setCurrentIdx((prev) => {
      if (prev < stories.length - 1) return prev + 1;
      // ✅ setTimeout عشان مش بنعمل setState في الـ render cycle
      setTimeout(() => onClose(), 0);
      return prev;
    });
    setProgress(0);
  }, [stories.length, onClose]);

  const prevStory = useCallback(() => {
    setCurrentIdx((prev) => (prev > 0 ? prev - 1 : prev));
    setProgress(0);
  }, []);

  useEffect(() => {
    setProgress(0);
    lastTimeRef.current = null;

    const tick = (ts) => {
      if (!lastTimeRef.current) lastTimeRef.current = ts;
      const delta = ts - lastTimeRef.current;
      lastTimeRef.current = ts;

      setProgress((prev) => {
        const next = prev + (delta / DURATION) * 100;
        if (next >= 100) {
          // ✅ setTimeout عشان مش بنعمل setState في الـ render cycle
          setTimeout(() => nextStory(), 0);
          return 100;
        }
        return next;
      });

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [currentIdx, nextStory]);

  if (!currentStory) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-[340px] h-[600px] rounded-2xl overflow-hidden bg-black">

        {/* Background */}
        {currentStory.media_url ? (
          currentStory.media_type === "video" ? (
            <video src={currentStory.media_url} autoPlay className="w-full h-full object-cover" />
          ) : (
            <Image src={currentStory.media_url} alt="story" fill className="object-cover" />
          )
        ) : (
          <div
            className="w-full h-full flex items-center justify-center p-8"
            style={{ background: currentStory.avatar_bg || "linear-gradient(135deg,#667eea,#764ba2)" }}
          >
            <p className="text-white text-xl font-medium text-center leading-relaxed">
              {currentStory.content}
            </p>
          </div>
        )}

        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 flex gap-1 z-10">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-[2px] bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full"
                style={{
                  width: i < currentIdx ? "100%" : i === currentIdx ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        {/* <div className="absolute top-7 left-3 right-3 flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/50 relative flex-shrink-0">
            {currentStory.avatar_url ? (
              <Image src={currentStory.avatar_url} alt="avatar" fill className="object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: currentStory.avatar_bg }}
              >
                {currentStory.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <p className="text-white text-sm font-medium">{currentStory.username}</p>
            <p className="text-white/60 text-xs">
              {new Date(currentStory.created_at).toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-white/80 hover:text-white cursor-pointer z-20 text-xl w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div> */}



        {/* ✅ رفع الـ z-index للـ header فوق الـ tap areas */}
<div className="absolute top-7 left-3 right-3 flex items-center gap-2 z-20"> {/* z-20 مش z-10 */}
  <div className="w-8 h-8 rounded-full overflow-hidden border border-white/50 relative flex-shrink-0">
       {currentStory.avatar_url ? (
              <Image src={currentStory.avatar_url} alt="avatar" fill className="object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: currentStory.avatar_bg }}
              >
                {currentStory.username?.[0]?.toUpperCase()}
              </div>
            )}
  </div>
  <div>
    <p className="text-white text-sm font-medium">{currentStory.username}</p>
         <p className="text-white/60 text-xs">
              {new Date(currentStory.created_at).toLocaleTimeString("ar-EG", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
  </div>
  <button
    onClick={onClose}
    className="ml-auto text-white/80 hover:text-white cursor-pointer text-xl w-8 h-8 flex items-center justify-center z-20" 
  >
    ✕
  </button>
</div>

{/* Tap Areas — z-10 تحت الـ header */}
<button className="absolute left-0 top-0 w-1/3 h-full z-10" onClick={prevStory} />
<button className="absolute right-0 top-0 w-1/3 h-full z-10" onClick={nextStory} />

        {/* Tap Areas */}
        <button className="absolute left-0 top-0 w-1/3 h-full z-10" onClick={prevStory} />
        <button className="absolute right-0 top-0 w-1/3 h-full z-10" onClick={nextStory} />

        {/* Footer */}
        <div className="absolute bottom-4 left-3 right-3 z-10 flex items-center gap-2">
          <input
            placeholder="إرسال رسالة..."
            className="flex-1 bg-white/10 border border-white/30 rounded-full px-4 py-2 text-white text-sm placeholder-white/50 outline-none"
          />
          <button className="text-white text-xl">🤍</button>
        </div>
      </div>
    </div>
  );
}