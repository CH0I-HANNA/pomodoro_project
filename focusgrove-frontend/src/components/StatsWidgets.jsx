// src/components/StatsWidgets.jsx
import React, { useState, useEffect } from 'react';
import { getTodayStats } from '../api/logApi';

// 이모티콘 매핑
const getIcon = (title) => {
    switch (title) {
        case 'Pomodoros': return '⌛️';
        case 'Tasks Done': return '✅';
        case 'Focus Time': return '⏱️';
        case 'Day Streak': return '🔥';
        default: return '';
    }
};

// 카드 하나 — Glass 스타일 적용
const StatWidget = ({ title, value }) => {
    const displayValue = title === 'Day Streak'
        ? `연속 ${value} 일 째`
        : value;

    return (
        <div
            className="
                backdrop-blur-md
                bg-white/5
                border border-white/10
                shadow-xl
                rounded-2xl
                px-5 py-4
                flex flex-col items-center justify-between
                hover:bg-white/10
                transition-all duration-300
            "
        >
            {/* Title */}
            <p className="text-white/70 text-sm tracking-wide">
                {title}
            </p>

            {/* Icon */}
            <div className="text-4xl my-2">
                {getIcon(title)}
            </div>

            {/* Value */}
            <p className="text-white text-2xl font-semibold mt-1">
                {displayValue}
            </p>
        </div>
    );
};

const StatsWidgets = () => {
    const [stats, setStats] = useState({
        pomodoros: 0,
        tasksDone: 0,
        focusTime: '0h 0m',
        dayStreak: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const fetched = await getTodayStats();
                setStats(fetched);
            } catch (e) {
                console.error("Failed to fetch stats:", e);
            }
        };
        fetchStats();
    }, []);

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
            <h3 className="text-white text-lg font-semibold mb-4 tracking-wide">
                Today’s Statistics
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <StatWidget title="Pomodoros" value={stats.pomodoros} />
                <StatWidget title="Tasks Done" value={stats.tasksDone} />
                <StatWidget title="Focus Time" value={stats.focusTime} />
                <StatWidget title="Day Streak" value={stats.dayStreak} />
            </div>
        </div>
    );
};

export default StatsWidgets;
