// components/water/VideoOverlay.tsx
"use client";

import { useRef, useState, useEffect } from "react";

type VideoOverlayProps = {
  videoSrc: string;
  onComplete: () => void;
};

export function VideoOverlay({ videoSrc, onComplete }: VideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [show, setShow] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log("VideoOverlay mounted, videoSrc:", videoSrc);
  }, [videoSrc]);

  useEffect(() => {
    // Wait for video to be ready, then play
    const video = videoRef.current;
    if (video) {
      const handleCanPlay = () => {
        video.play().catch((err) => {
          console.error("Video autoplay failed:", err);
          setError(true);
        });
      };

      if (video.readyState >= 2) {
        // Video is already loaded
        handleCanPlay();
      } else {
        video.addEventListener("canplay", handleCanPlay, { once: true });
      }

      return () => {
        video.removeEventListener("canplay", handleCanPlay);
      };
    }
  }, []);

  const handleEnd = () => {
    setShow(false);
    onComplete();
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setShow(false);
    onComplete();
  };

  const handleError = () => {
    console.error("Video failed to load");
    setError(true);
    // If video fails, just skip it
    setTimeout(() => {
      handleSkip();
    }, 1000);
  };

  if (!show) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black pointer-events-auto overflow-hidden"
      style={{
        width: "100vw",
        height: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      {error ? (
        <div className="flex items-center justify-center h-full w-full text-white p-4">
          <div className="text-center max-w-full px-4">
            <p className="mb-4 text-sm sm:text-base break-words">Video failed to load</p>
            <button
              onClick={handleSkip}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-lg text-sm sm:text-base"
            >
              Continue
            </button>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onEnded={handleEnd}
            onError={handleError}
            onLoadedData={() => {
              console.log("Video loaded successfully");
            }}
            className="w-full h-full"
            preload="auto"
            style={{ 
              width: "100vw", 
              height: "100vh",
              objectFit: "contain",
              maxWidth: "100vw",
              maxHeight: "100vh",
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: "#000"
            }}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Skip button - responsive positioning with safe area insets for mobile */}
          <button
            onClick={handleSkip}
            className="absolute z-[10000] bg-black/60 hover:bg-black/80 active:bg-black/90 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors backdrop-blur-sm border border-white/20 touch-manipulation"
            style={{
              top: "max(0.5rem, env(safe-area-inset-top, 0.5rem))",
              right: "max(0.5rem, env(safe-area-inset-right, 0.5rem))",
              padding: "0.5rem 0.75rem",
              maxWidth: "calc(100vw - 1rem)",
              whiteSpace: "nowrap",
              fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)"
            }}
            aria-label="Skip video"
          >
            Skip
          </button>
        </>
      )}
    </div>
  );
}

