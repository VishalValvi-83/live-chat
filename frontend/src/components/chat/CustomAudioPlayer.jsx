import { useState, useRef, useEffect } from 'react';
import { Mic, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from "@/hooks/useTheme";
export default function CustomAudioPlayer({ content }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        audioRef.current.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        if (isMuted) {
            audioRef.current.volume = volume || 0.5;
            setIsMuted(false);
        } else {
            audioRef.current.volume = 0;
            setIsMuted(true);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };


    // const { theme } = useTheme();

    // const bgGradient = theme === "dark"
    //     ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20"
    //     : "bg-gradient-to-br from-blue-200/40 to-purple-200/40";
    // const borderColor = theme === "dark"
    //     ? "border-white/10"
    //     : "border-black/10";
    // const bgPanel = theme === "dark"
    //     ? "bg-background/50"
    //     : "bg-white/80";
    // const textColor = theme === "dark"
    //     ? "text-white"
    //     : "text-black";
    // const subTextColor = theme === "dark"
    //     ? "text-white/60"
    //     : "text-black/60";
    // const buttonBg = theme === "dark"
    //     ? "bg-blue-500 hover:bg-blue-600"
    //     : "bg-blue-400 hover:bg-blue-500";

    return (
        <div className={`flex items-center gap-3 min-w-[280px] max-w-md`}>
            <div className={`flex h-10 w-10 items-center justify-center rounded-full  backdrop-blur-sm bg-primary/50 `}>
                <Mic className={`h-5 w-5 `} />
            </div>

            <div className={`flex-1 flex flex-col gap-2 bg-primary/20 backdrop-blur-sm rounded-lg p-3 `}>
                <div className="flex items-center gap-3">
                    {/* Play/Pause Button */}
                    <button
                        onClick={togglePlay}
                        className={`flex items-center justify-center h-8 w-8 rounded-full bg-primary transition-colors`}
                    >
                        {isPlaying ? (
                            <Pause className={`h-4 w-4 text-primary fill-white`} />
                        ) : (
                            <Play className={`h-4 w-4  fill-white ml-0.5`} />
                        )}
                    </button>

                    {/* Progress Bar */}
                    <div className="flex-1 flex flex-col gap-1 mt-2">
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-1 bg-primary/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                        />
                        <div className={`flex justify-between text-xs text-secondary-foreground`}>
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2 mb-2">
                        <button
                            onClick={toggleMute}
                            className={`text-primary/70 hover:text-primary transition-colors`}
                        >
                            {isMuted ? (
                                <VolumeX className="h-4 w-4" />
                            ) : (
                                <Volume2 className="h-4 w-4" />
                            )}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-16 h-1 bg-primary/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-2.5 [&::-moz-range-thumb]:h-2.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Hidden audio element */}
            <audio ref={audioRef} src={content} preload="metadata" />
        </div>
    );
}