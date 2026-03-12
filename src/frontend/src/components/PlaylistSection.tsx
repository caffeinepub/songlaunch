import { Button } from "@/components/ui/button";
import { ListMusic, Play, X } from "lucide-react";
import { Music } from "lucide-react";
import type { Song } from "../backend.d";
import { useBlobUrl } from "../hooks/useBlobUrl";

interface PlaylistItemProps {
  song: Song;
  index: number;
  isPlaying: boolean;
  onPlay: (song: Song) => void;
  onRemove: (songId: bigint) => void;
}

function PlaylistItem({
  song,
  index,
  isPlaying,
  onPlay,
  onRemove,
}: PlaylistItemProps) {
  const coverUrl = useBlobUrl(song.coverBlobId);
  const ocidIndex = index + 1;

  return (
    <div
      data-ocid={`playlist.item.${ocidIndex}`}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 ${
        isPlaying
          ? "bg-primary/10 border border-primary/40 shadow-sm"
          : "hover:bg-secondary/80 border border-transparent"
      }`}
    >
      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={song.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <Music className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
        {isPlaying && <div className="absolute inset-0 bg-primary/20" />}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-bold truncate ${
            isPlaying ? "text-primary" : "text-foreground"
          }`}
        >
          {song.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
      </div>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 rounded-full hover:bg-primary/20 hover:text-primary flex-shrink-0"
        onClick={() => onPlay(song)}
      >
        <Play className="w-3.5 h-3.5 fill-current" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-7 w-7 rounded-full hover:bg-destructive/20 hover:text-destructive flex-shrink-0"
        onClick={() => onRemove(song.id)}
      >
        <X className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}

interface PlaylistSectionProps {
  playlist: Song[];
  currentSong: Song | null;
  onPlay: (song: Song) => void;
  onRemove: (songId: bigint) => void;
}

export function PlaylistSection({
  playlist,
  currentSong,
  onPlay,
  onRemove,
}: PlaylistSectionProps) {
  return (
    <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
      {/* Subtle top accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-playlist/50 to-transparent" />

      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-extrabold text-lg flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-playlist/15 border border-playlist/30 flex items-center justify-center">
              <ListMusic className="w-3.5 h-3.5 text-playlist" />
            </div>
            My Playlist
            {playlist.length > 0 && (
              <span className="text-xs bg-playlist/20 text-playlist px-2 py-0.5 rounded-full font-bold">
                {playlist.length}
              </span>
            )}
          </h2>
        </div>

        <div data-ocid="playlist.list" className="space-y-1">
          {playlist.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="relative w-14 h-14 mx-auto">
                <div className="absolute inset-0 rounded-xl bg-playlist/10 blur-lg" />
                <div className="relative w-14 h-14 rounded-xl bg-secondary border border-border flex items-center justify-center">
                  <ListMusic className="w-6 h-6 text-muted-foreground/40" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground">
                  Your playlist is empty
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Tap ➕ on any song to add it
                </p>
              </div>
            </div>
          ) : (
            playlist.map((song, i) => (
              <PlaylistItem
                key={`${song.id.toString()}-${i}`}
                song={song}
                index={i}
                isPlaying={currentSong?.id === song.id}
                onPlay={onPlay}
                onRemove={onRemove}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
