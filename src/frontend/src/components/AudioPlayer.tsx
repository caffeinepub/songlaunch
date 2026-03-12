import { Music } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Song } from "../backend.d";
import { useBlobUrl } from "../hooks/useBlobUrl";
import { Waveform } from "./Waveform";

interface AudioPlayerProps {
  currentSong: Song | null;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

export function AudioPlayer({
  currentSong,
  onPlayStateChange,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioUrl = useBlobUrl(currentSong?.audioBlobId);
  const coverUrl = useBlobUrl(currentSong?.coverBlobId);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(() => {});
    }
  }, [audioUrl]);

  const handlePlayState = (playing: boolean) => {
    setIsPlaying(playing);
    onPlayStateChange?.(playing);
  };

  return (
    <div
      data-ocid="player.section"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl"
    >
      {/* Top accent line */}
      <div className="player-accent-line" />

      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Album art thumbnail */}
          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-muted flex-shrink-0">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={currentSong?.title ?? "Album cover"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                <Music className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
            {isPlaying && <div className="absolute inset-0 bg-primary/20" />}
          </div>

          {/* Song info */}
          <div className="flex-shrink-0 w-28 sm:w-44 min-w-0">
            {currentSong ? (
              <>
                <p className="text-sm font-bold font-display text-foreground truncate leading-tight">
                  {currentSong.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentSong.artist}
                </p>
              </>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                No song playing
              </p>
            )}
          </div>

          {/* Waveform indicator */}
          <div className="hidden sm:flex flex-shrink-0">
            <Waveform isPlaying={isPlaying && !!currentSong} />
          </div>

          {/* Audio element */}
          <div className="flex-1">
            {/* biome-ignore lint/a11y/useMediaCaption: user-uploaded audio, captions not available */}
            <audio
              ref={audioRef}
              controls
              className="w-full h-8"
              style={{ colorScheme: "dark" }}
              onPlay={() => handlePlayState(true)}
              onPause={() => handlePlayState(false)}
              onEnded={() => handlePlayState(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
