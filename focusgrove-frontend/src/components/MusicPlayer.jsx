import React, { useState, useRef, useEffect } from 'react';

const MusicButton = ({ title, audioSrc, onPlay, isPlaying }) => {
    return (
        <button
            onClick={() => onPlay(audioSrc)}
            className={`
        w-full min-w-0
        flex justify-center items-center
        px-4 py-3
        rounded-xl font-semibold text-white
        transition-all duration-300 overflow-hidden
        backdrop-blur-md border
        ${isPlaying
                ? 'bg-teal-500/40 border-teal-300/40 shadow-[0_0_12px_rgba(34,243,231,0.6)] scale-[1.02]'
                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-[1.02]'
            }
    `}
        >
            <span className="relative z-10">{title}</span>

            {isPlaying && (
                <span className="absolute inset-0 bg-teal-300/20 animate-pulse-glow rounded-xl"></span>
            )}
        </button>
    );
};

const MusicPlayer = () => {
    const [nowPlaying, setNowPlaying] = useState(null);
    const [volume, setVolume] = useState(0.6);
    const audioRef = useRef(null);

    // ⭐ Visualizer 관련
    const [bars, setBars] = useState(new Array(16).fill(5));

    useEffect(() => {
        let interval;
        if (nowPlaying) {
            interval = setInterval(() => {
                // 랜덤 파형 생성
                setBars(bars.map(() => Math.floor(Math.random() * 25) + 5));
            }, 120);
        } else {
            // 음악 정지 시 파형 감소
            setBars(new Array(16).fill(5));
        }

        return () => clearInterval(interval);
    }, [nowPlaying]);

    const handlePlay = (audioSrc) => {
        if (nowPlaying === audioSrc) {
            audioRef.current.pause();
            setNowPlaying(null);
        } else {
            setNowPlaying(audioSrc);
            if (audioRef.current) {
                audioRef.current.src = audioSrc;
                audioRef.current.volume = volume;
                audioRef.current.play();
            }
        }
    };

    const handleVolume = (v) => {
        const num = parseFloat(v);
        setVolume(num);
        if (audioRef.current) audioRef.current.volume = num;
    };

    return (
        <div
            className="
                backdrop-blur-xl
                bg-white/5
                border border-white/20
                rounded-2xl
                shadow-2xl
                p-6
                min-w-0
                hover:bg-white/15
                transition duration-300
                animate-fadeInUp
            "
        >
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-white text-lg font-semibold tracking-wide">
                    Focus Sounds
                </h3>

                {/* 볼륨 슬라이더 */}
                <div className="flex items-center space-x-2">
                    <span className="text-white/1000 text-sm">🎧</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => handleVolume(e.target.value)}
                        className="w-28 accent-teal-300 cursor-pointer"
                    />
                </div>
            </div>

            <audio ref={audioRef} loop />

            {/* 음악 버튼 */}
            <div className="flex justify-between gap-4 mt-4">
                <MusicButton
                    title="Rain"
                    audioSrc="/rain.mp3"
                    onPlay={handlePlay}
                    isPlaying={nowPlaying === '/rain.mp3'}
                />
                <MusicButton
                    title="Fire"
                    audioSrc="/fire.mp3"
                    onPlay={handlePlay}
                    isPlaying={nowPlaying === '/fire.mp3'}
                />
                <MusicButton
                    title="Classic"
                    audioSrc="/classic.mp3"
                    onPlay={handlePlay}
                    isPlaying={nowPlaying === '/classic.mp3'}
                />
            </div>

            {/* ⭐ 재생 중 파형 Visualizer */}
            <div className="mt-6 flex items-end justify-center space-x-[6px] h-20">
                {bars.map((h, i) => (
                    <div
                        key={i}
                        style={{ height: h }}
                        className={`
                            w-[6px] rounded-full transition-all duration-150
                            ${nowPlaying ? 'bg-teal-300' : 'bg-white/10'}
                        `}
                    />
                ))}
            </div>
        </div>
    );
};

export default MusicPlayer;
