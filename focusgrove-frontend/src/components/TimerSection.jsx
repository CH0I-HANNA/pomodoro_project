import { useState, useEffect } from 'react';
import { incrementPomodoro } from '../api/taskApi';
import { incrementDailyPomodoro } from '../api/dailyRecordApi';

const TimerSection = ({ currentTaskId, currentTaskContent, onSessionComplete }) => {
  const [time, setTime] = useState(25 * 60);
  const [mode, setMode] = useState('focus');
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let interval = null;

    const handleSessionEnd = async () => {
      if (mode === 'focus') {
        if (currentTaskId) {
          try {
            await incrementPomodoro(currentTaskId);
            onSessionComplete && onSessionComplete();
          } catch (err) {
            console.error(err);
          }
        } else {
          try {
            await incrementDailyPomodoro();
            onSessionComplete && onSessionComplete();
          } catch (err) {
            console.error(err);
          }
        }

        setSessionCount((prev) => prev + 1);
        const newMode = (sessionCount + 1) % 4 === 0 ? 'long_break' : 'short_break';
        setMode(newMode);
        setTime(newMode === 'long_break' ? 15 * 60 : 5 * 60);
      } else {
        setMode('focus');
        setTime(25 * 60);
      }

      setIsActive(false);
    };

    if (isActive && time > 0) {
      interval = setInterval(() => setTime((t) => t - 1), 1000);
    } else if (time === 0) {
      handleSessionEnd();
    }

    return () => clearInterval(interval);
  }, [isActive, time, mode, sessionCount, currentTaskId, onSessionComplete]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setMode('focus');
    setTime(25 * 60);
    setIsActive(false);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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
            "
      >
        <div className="text-center w-full">

          {/* 현재 작업 정보 */}
          {currentTaskId ? (
              <p className="text-custom-orange text-2xl font-bold mb-4 tracking-wide">
                집중 중인 작업:
                <span className="block sm:inline-block text-white ml-2">
              {currentTaskContent}
            </span>
              </p>
          ) : (
              <p className="text-white/70 text-lg mb-4 tracking-wide">
                집중 중인 작업: 없음
              </p>
          )}

          {/* TIMER */}
          <div className="text-8xl md:text-9xl font-bold my-10 text-white drop-shadow-lg">
            {formatTime(time)}
          </div>

          {/* MODE SELECT */}
          <div className="flex justify-center space-x-4 mb-10">
            {[
              {key: "focus", label: "Focus", time: 0.1 * 60},
              {key: "short_break", label: "Short Break", time: 5 * 60},
              {key: "long_break", label: "Long Break", time: 15 * 60},
            ].map((m) => (
                <button
                    key={m.key}
                    onClick={() => {
                      setMode(m.key);
                      setTime(m.time);
                    }}
                    className={`
                px-6 py-2 rounded-xl font-semibold tracking-wide 
                transition-all duration-300
                ${
                        mode === m.key
                            ? "bg-custom-orange text-white shadow-lg"
                            : "bg-white/10 text-white/70 border border-white/10 hover:bg-white/20"
                    }
              `}
                >
                  {m.label}
                </button>
            ))}
          </div>

          {/* START / RESET */}
          <div className="flex justify-center space-x-8">
            <button
                onClick={toggleTimer}
                className="
              bg-custom-orange text-white
              px-12 py-4 rounded-full text-2xl font-bold
              hover:opacity-90
              shadow-lg hover:shadow-custom-orange/40
              transition duration-300
            "
            >
              {isActive ? "Pause" : "Start"}
            </button>

            <button
                onClick={resetTimer}
                className="
              bg-white/10 text-white
              px-12 py-4 rounded-full text-2xl font-bold
              border border-white/10
              hover:bg-white/20
              transition duration-300
            "
            >
              Reset
            </button>
          </div>

        </div>
      </div>
  );
};

export default TimerSection;
