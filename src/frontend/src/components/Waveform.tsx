interface WaveformProps {
  isPlaying?: boolean;
  className?: string;
}

export function Waveform({ isPlaying = false, className = "" }: WaveformProps) {
  return (
    <div
      className={`flex items-center gap-0.5 h-6 ${isPlaying ? "" : "waveform-static"} ${className}`}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <span key={i} className="waveform-bar" />
      ))}
    </div>
  );
}
