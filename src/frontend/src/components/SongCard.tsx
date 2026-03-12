import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ListPlus, Music, Play, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Song } from "../backend.d";
import { useBlobUrl } from "../hooks/useBlobUrl";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useDeleteSong, useLikeSong } from "../hooks/useQueries";
import { Waveform } from "./Waveform";

interface SongCardProps {
  song: Song;
  index: number;
  isPlaying: boolean;
  onPlay: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
}

export function SongCard({
  song,
  index,
  isPlaying,
  onPlay,
  onAddToPlaylist,
}: SongCardProps) {
  const coverUrl = useBlobUrl(song.coverBlobId);
  const { mutate: likeSong, isPending: isLiking } = useLikeSong();
  const { mutate: deleteSong, isPending: isDeleting } = useDeleteSong();
  const { identity } = useInternetIdentity();
  const [imgError, setImgError] = useState(false);

  const isOwner =
    identity?.getPrincipal().toString() === song.uploadedBy.toString();

  const handleLike = () => {
    if (!identity) {
      toast.error("Please log in to like songs");
      return;
    }
    likeSong(song.id);
  };

  const handleDelete = () => {
    deleteSong(song.id, {
      onSuccess: () => toast.success("Song deleted"),
      onError: () => toast.error("Failed to delete song"),
    });
  };

  const ocidIndex = index + 1;

  return (
    <div
      data-ocid={`songs.item.${ocidIndex}`}
      className={`group relative flex gap-4 rounded-2xl p-3.5 transition-all duration-300 border song-card-glow ${
        isPlaying
          ? "bg-card border-primary/50 song-card-active"
          : "bg-card border-border hover:border-primary/30"
      }`}
    >
      {/* Active track glow line */}
      {isPlaying && (
        <div className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-primary" />
      )}

      {/* Cover art — larger 80px */}
      <div className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-muted">
        {coverUrl && !imgError ? (
          <img
            src={coverUrl}
            alt={song.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <Music className="w-7 h-7 text-muted-foreground" />
          </div>
        )}
        {/* Gradient overlay on active */}
        {isPlaying && (
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent flex items-end justify-center pb-1.5">
            <Waveform isPlaying={true} />
          </div>
        )}
        {/* Index number on hover (hidden when playing) */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="font-display font-black text-lg text-foreground">
              {index + 1}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <p
          className={`font-display font-bold text-base truncate leading-tight ${
            isPlaying ? "text-primary" : "text-foreground"
          }`}
        >
          {song.title}
        </p>
        <p className="text-sm text-muted-foreground truncate font-medium">
          {song.artist}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Heart
            className={`w-3 h-3 ${
              Number(song.likes) > 0
                ? "fill-destructive text-destructive"
                : "text-muted-foreground/50"
            }`}
          />
          <span className="text-xs text-muted-foreground/70">
            {Number(song.likes)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          data-ocid="song.play_button"
          size="icon"
          variant="ghost"
          className={`h-9 w-9 rounded-full transition-all ${
            isPlaying
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
              : "hover:bg-primary/20 hover:text-primary"
          }`}
          onClick={() => onPlay(song)}
          title="Play"
        >
          <Play className="w-4 h-4 fill-current" />
        </Button>

        <Button
          data-ocid="song.like_button"
          size="icon"
          variant="ghost"
          className="h-9 w-9 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors"
          onClick={handleLike}
          disabled={isLiking}
          title={`Like (${Number(song.likes)})`}
        >
          <Heart
            className={`w-4 h-4 ${
              Number(song.likes) > 0 ? "fill-destructive text-destructive" : ""
            }`}
          />
        </Button>

        <Button
          data-ocid="song.playlist_button"
          size="icon"
          variant="ghost"
          className="h-9 w-9 rounded-full hover:bg-playlist/20 hover:text-playlist transition-colors"
          onClick={() => {
            onAddToPlaylist(song);
            toast.success(`"${song.title}" added to playlist`);
          }}
          title="Add to playlist"
        >
          <ListPlus className="w-4 h-4" />
        </Button>

        {isOwner && (
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full hover:bg-destructive/20 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete song"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function SongCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-2xl p-3.5 bg-card border border-border">
      <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2.5 py-1">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <div className="flex items-center gap-1">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  );
}
