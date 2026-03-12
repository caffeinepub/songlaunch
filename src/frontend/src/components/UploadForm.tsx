import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Image, Loader2, LogIn, Music, Rocket, Type, User } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useBlobStorage } from "../hooks/useBlobStorage";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUploadSong } from "../hooks/useQueries";

export function UploadForm() {
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const audioRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadSong } = useUploadSong();
  const { uploadBlob } = useBlobStorage();
  const { identity, login, isLoggingIn } = useInternetIdentity();

  const handleSubmit = async () => {
    if (!artist.trim() || !title.trim() || !audioFile) {
      toast.error(
        "Please fill in all required fields and select an audio file",
      );
      return;
    }
    if (!identity) {
      toast.error("Please log in to upload songs");
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const uploadPromises: [Promise<string>, Promise<string>] = [
        uploadBlob(audioFile, (pct) => setProgress(pct * 0.6)),
        coverFile
          ? uploadBlob(coverFile, (pct) => setProgress(60 + pct * 0.3))
          : Promise.resolve(""),
      ];

      const [audioBlobId, coverBlobId] = await Promise.all(uploadPromises);
      setProgress(90);

      await uploadSong({
        title: title.trim(),
        artist: artist.trim(),
        audioBlobId,
        coverBlobId,
      });
      setProgress(100);

      toast.success(`"${title}" by ${artist} uploaded successfully!`);

      setArtist("");
      setTitle("");
      setAudioFile(null);
      setCoverFile(null);
      if (audioRef.current) audioRef.current.value = "";
      if (coverRef.current) coverRef.current.value = "";
    } catch (err) {
      toast.error(
        `Upload failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  if (!identity) {
    return (
      <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
        {/* Gradient header accent */}
        <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
        <div className="p-8 text-center space-y-4">
          <div className="relative w-14 h-14 mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-lg" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center">
              <Music className="w-7 h-7 text-primary" />
            </div>
          </div>
          <div>
            <p className="font-display font-extrabold text-xl text-foreground">
              Share your music
            </p>
            <p className="text-sm text-muted-foreground mt-1.5">
              Log in to upload songs to SongLaunch
            </p>
          </div>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 btn-glow"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4 mr-2" />
            )}
            Log In to Upload
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl border border-border bg-card overflow-hidden">
      {/* Gradient header accent line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Rocket className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-extrabold text-lg text-foreground leading-tight">
              Upload a Song
            </h2>
            <p className="text-xs text-muted-foreground">
              Release your track to the world
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3 h-3" /> Artist
            </Label>
            <Input
              data-ocid="upload.artist_input"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              placeholder="e.g. The Midnight"
              className="bg-secondary border-border rounded-xl focus-visible:ring-primary h-11"
              disabled={isUploading}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3 h-3" /> Song Title
            </Label>
            <Input
              data-ocid="upload.title_input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Echoes of Neon"
              className="bg-secondary border-border rounded-xl focus-visible:ring-primary h-11"
              disabled={isUploading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Audio file */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Music className="w-3 h-3" /> Audio File
            </Label>
            <button
              type="button"
              data-ocid="upload.audio_upload_button"
              className={`w-full rounded-xl border-2 border-dashed transition-all cursor-pointer text-left ${
                audioFile
                  ? "border-primary/60 bg-primary/8"
                  : "border-border hover:border-primary/40 bg-secondary/50"
              }`}
              onClick={() => audioRef.current?.click()}
              disabled={isUploading}
            >
              <input
                ref={audioRef}
                type="file"
                accept="audio/*"
                className="sr-only"
                onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                disabled={isUploading}
              />
              <div className="p-4 text-center">
                <Music
                  className={`w-6 h-6 mx-auto mb-1.5 ${
                    audioFile ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <p
                  className={`text-xs truncate font-medium ${
                    audioFile ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {audioFile ? audioFile.name : "Click to select audio"}
                </p>
              </div>
            </button>
          </div>

          {/* Cover image */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Image className="w-3 h-3" /> Cover Image
            </Label>
            <button
              type="button"
              data-ocid="upload.cover_upload_button"
              className={`w-full rounded-xl border-2 border-dashed transition-all cursor-pointer text-left ${
                coverFile
                  ? "border-primary/60 bg-primary/8"
                  : "border-border hover:border-primary/40 bg-secondary/50"
              }`}
              onClick={() => coverRef.current?.click()}
              disabled={isUploading}
            >
              <input
                ref={coverRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                disabled={isUploading}
              />
              <div className="p-4 text-center">
                {coverFile ? (
                  <img
                    src={URL.createObjectURL(coverFile)}
                    alt="Cover preview"
                    className="w-10 h-10 rounded-lg object-cover mx-auto mb-1.5"
                  />
                ) : (
                  <Image className="w-6 h-6 mx-auto mb-1.5 text-muted-foreground" />
                )}
                <p
                  className={`text-xs truncate font-medium ${
                    coverFile ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {coverFile ? coverFile.name : "Click to select image"}
                </p>
              </div>
            </button>
          </div>
        </div>

        {isUploading && progress > 0 && (
          <div className="space-y-1.5" data-ocid="upload.loading_state">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="font-medium">Uploading...</span>
              <span className="text-primary font-bold">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <Button
          data-ocid="upload.submit_button"
          onClick={handleSubmit}
          disabled={isUploading || !artist || !title || !audioFile}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold text-base h-12 btn-glow"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Rocket className="w-5 h-5 mr-2" />
              Launch Track
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
