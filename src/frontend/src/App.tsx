import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Loader2, LogIn, LogOut, Music2, Search, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import type { Song } from "./backend.d";
import { AudioPlayer } from "./components/AudioPlayer";
import { PlaylistSection } from "./components/PlaylistSection";
import { SongCard, SongCardSkeleton } from "./components/SongCard";
import { UploadForm } from "./components/UploadForm";
import { Waveform } from "./components/Waveform";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetSongs } from "./hooks/useQueries";

export default function App() {
  const { data: songs, isLoading } = useGetSongs();
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();

  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSongs = useMemo(() => {
    if (!songs) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return songs;
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q),
    );
  }, [songs, searchQuery]);

  const handleAddToPlaylist = (song: Song) => {
    setPlaylist((prev) => {
      const alreadyAdded = prev.some((s) => s.id === song.id);
      if (alreadyAdded) return prev;
      return [...prev, song];
    });
  };

  const handleRemoveFromPlaylist = (songId: bigint) => {
    setPlaylist((prev) => prev.filter((s) => s.id !== songId));
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="relative w-9 h-9 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 btn-glow">
              <Music2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-display font-extrabold text-xl tracking-tight text-gradient">
                SongLaunch
              </span>
              <Waveform isPlaying={isAudioPlaying} className="hidden sm:flex" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {identity ? (
              <>
                <span className="hidden sm:block text-xs text-muted-foreground font-mono truncate max-w-24 bg-secondary px-2 py-1 rounded-lg">
                  {identity.getPrincipal().toString().slice(0, 10)}...
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className="rounded-full text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1.5">Log Out</span>
                </Button>
              </>
            ) : (
              <Button
                onClick={login}
                disabled={isLoggingIn}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full btn-glow"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LogIn className="w-3.5 h-3.5" />
                )}
                <span className="ml-1.5">Log In</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Ambient glow */}
        <div className="hero-glow" />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.97 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.97 0 0) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-widest">
              Music Distribution Platform
            </span>
          </div>
          <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight mb-4">
            <span className="text-foreground">Launch Your</span>
            <br />
            <span className="text-gradient">Music</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-md leading-relaxed">
            Upload, share, and distribute your tracks to the world. Your stage
            is ready.
          </p>
          {/* Stats strip */}
          <div className="flex items-center gap-6 mt-8">
            <div>
              <p className="font-display font-black text-2xl text-foreground">
                {songs?.length ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Tracks
              </p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="font-display font-black text-2xl text-foreground">
                {songs?.reduce((acc, s) => acc + Number(s.likes), 0) ?? "—"}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Total Likes
              </p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <p className="font-display font-black text-2xl text-gradient">
                Live
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                Status
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 pt-8 pb-32 space-y-6">
        {/* Upload section */}
        <UploadForm />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            data-ocid="search.search_input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search songs or artists..."
            className="pl-10 bg-card border-border rounded-xl focus-visible:ring-primary h-12 text-base"
          />
        </div>

        {/* Song list */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-extrabold text-lg">
              All Songs
              {songs && songs.length > 0 && (
                <span className="ml-2 text-xs text-muted-foreground font-normal">
                  {filteredSongs.length}
                  {searchQuery ? ` of ${songs.length}` : ""} track
                  {filteredSongs.length !== 1 ? "s" : ""}
                </span>
              )}
            </h2>
          </div>

          <div data-ocid="songs.list" className="space-y-2">
            {isLoading ? (
              <div data-ocid="songs.loading_state" className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <SongCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredSongs.length === 0 ? (
              <div
                data-ocid="songs.empty_state"
                className="text-center py-20 space-y-4"
              >
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl" />
                  <div className="relative w-20 h-20 rounded-2xl bg-secondary border border-border flex items-center justify-center">
                    <Music2 className="w-9 h-9 text-muted-foreground/50" />
                  </div>
                </div>
                <div>
                  <p className="font-display font-extrabold text-lg text-foreground">
                    {searchQuery ? "No songs found" : "No songs yet"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {searchQuery
                      ? `Try a different search for "${searchQuery}"`
                      : "Be the first to upload a track!"}
                  </p>
                </div>
              </div>
            ) : (
              filteredSongs.map((song, i) => (
                <SongCard
                  key={song.id.toString()}
                  song={song}
                  index={i}
                  isPlaying={currentSong?.id === song.id}
                  onPlay={setCurrentSong}
                  onAddToPlaylist={handleAddToPlaylist}
                />
              ))
            )}
          </div>
        </section>

        {/* Playlist section */}
        <PlaylistSection
          playlist={playlist}
          currentSong={currentSong}
          onPlay={setCurrentSong}
          onRemove={handleRemoveFromPlaylist}
        />

        {/* Footer */}
        <footer className="text-center pt-6 pb-2">
          <p className="text-xs text-muted-foreground/50">
            © {currentYear}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-muted-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </main>

      {/* Fixed bottom player */}
      <AudioPlayer
        currentSong={currentSong}
        onPlayStateChange={setIsAudioPlaying}
      />

      <Toaster position="top-center" theme="dark" richColors />
    </div>
  );
}
