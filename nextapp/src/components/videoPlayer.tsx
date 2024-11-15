"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  videoUrl: string;
  autoPlay?: boolean;
  title?: string;
}

export default function VideoPlayer({
  videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  autoPlay = false,
  title = "Demo Video",
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);

  const getEmbedUrl = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  useEffect(() => {
    if (autoPlay) {
      setIsPlaying(true);
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [autoPlay]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      const message = isPlaying
        ? '{"event":"command","func":"pauseVideo","args":""}'
        : '{"event":"command","func":"playVideo","args":""}';
      videoRef.current.contentWindow?.postMessage(message, "*");
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      const message = isMuted
        ? '{"event":"command","func":"unMute","args":""}'
        : '{"event":"command","func":"mute","args":""}';
      videoRef.current.contentWindow?.postMessage(message, "*");
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (videoRef.current) {
      const message = `{"event":"command","func":"setVolume","args":[${newVolume * 100}]}`;
      videoRef.current.contentWindow?.postMessage(message, "*");
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const embedUrl =
    getEmbedUrl(videoUrl) +
    `?enablejsapi=1&autoplay=${autoPlay ? 1 : 0}&mute=${autoPlay ? 1 : 0}&controls=0&rel=0`;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        ref={videoContainerRef}
        className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-md group"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          </div>
        )}

        <iframe
          ref={videoRef}
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-gray-200/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-800 hover:text-gray-600 hover:bg-gray-300/50"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
              <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-800 hover:text-gray-600 hover:bg-gray-300/50"
                onClick={handleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-6 w-6" />
                ) : (
                  <Volume2 className="h-6 w-6" />
                )}
                <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
              </Button>
              <div className="w-24">
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <div className="ml-auto">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-800 hover:text-gray-600 hover:bg-gray-300/50"
                onClick={handleFullscreen}
              >
                <Maximize className="h-6 w-6" />
                <span className="sr-only">Fullscreen</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {title && (
        <h2 className="mt-4 text-xl font-semibold text-gray-800">{title}</h2>
      )}
    </div>
  );
}
