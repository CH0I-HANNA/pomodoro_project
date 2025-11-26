// =========================
// src/components/GrassChart.tsx
// =========================
import React, { useState, useEffect, useMemo, useRef } from "react";
import { fetchGrassData } from "../api/logApi";
import { type GrassData } from "../types";

const getGrassColor = (count: number): string => {
    if (count >= 10) return "bg-teal-300/90";
    if (count >= 7) return "bg-teal-400/90";
    if (count >= 4) return "bg-teal-500/90";
    if (count >= 1) return "bg-teal-700/90";
    return "bg-white/10";
};

const GrassChart: React.FC = () => {
    const [grassData, setGrassData] = useState(new Map<string, GrassData>());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipContent, setTooltipContent] = useState("");
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const weekRefs = useRef<(HTMLDivElement | null)[]>([]);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const weekDayLabels = ["Sat", "Mon", "Tue", "Fri"];
    const monthLabels = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchGrassData(currentYear);
                setGrassData(new Map(data.map((item) => [item.date, item])));
            } catch (e) {
                console.error("Grass data fetch failed:", e);
            }
        };
        load();
    }, [currentYear]);

    // =============== 주차 계산 ===============
    const weeks = useMemo(() => {
        const year = currentYear;
        const result: (Date | null)[][] = [];

        let current: (Date | null)[] = [];
        const start = new Date(year, 0, 1);
        const end = new Date(year, 11, 31);
        const cur = new Date(start);

        // 💡 수정된 부분: 첫 주 앞부분 빈칸 채우기
        // 1월 1일이 일요일(0)이 아니면, 그 이전 요일 수만큼 null을 채워 그리드 시작점을 맞춥니다.
        for (let i = 0; i < start.getDay(); i++) {
            current.push(null);
        }

        // 💡 날짜 채우기 (현재 연도의 날짜만 사용)
        while (cur <= end) {
            current.push(new Date(cur));

            if (current.length === 7) {
                result.push(current);
                current = [];
            }
            // 다음 날짜로 이동
            cur.setDate(cur.getDate() + 1);
        }

        // 마지막 padding
        if (current.length > 0) {
            while (current.length < 7) {
                current.push(null);
            }
            result.push(current);
        }

        return result;
    }, [currentYear]);

    // =========== 월 위치 계산(정확 DOM 기반) ===========
    const getMonthOffset = (monthIndex: number) => {
        const weekIndex = weeks.findIndex((week) =>
            week.some((day) => day && day.getMonth() === monthIndex)
        );
        if (weekIndex === -1) return null;
        const col = weekRefs.current[weekIndex];
        if (!col) return null;
        return col.offsetLeft;
    };

    // ============= Tooltip positioning =============
    const handleMouseEnter = (
        e: React.MouseEvent<HTMLDivElement>,
        text: string
    ) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const parentRect = container.getBoundingClientRect();

        const tooltipWidth = 205;

        let x = rect.left - parentRect.left - tooltipWidth - 12;
        let y = rect.top - parentRect.top;

        if (x < 0) {
            x = rect.left - parentRect.left + e.currentTarget.offsetWidth + 12;
        }

        setTooltipPos({ x, y });
        setTooltipContent(text);
        setShowTooltip(true);
    };

    const handleMouseLeave = () => setShowTooltip(false);

    return (
        <div
            className="
                backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl shadow-2xl
                p-6 hover:bg-white/15 transition duration-300
            "
        >

            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">
                <button className="px-3 py-1 bg-white/10 rounded-lg text-white/70"
                        onClick={() => setCurrentYear((y) => y - 1)}
                >
                    ‹
                </button>

                <h2 className="text-lg font-semibold text-white">
                    Contribution Graph – {currentYear}
                </h2>

                <button className="px-3 py-1 bg-white/10 rounded-lg text-white/70"
                        onClick={() => setCurrentYear((y) => y + 1)}
                >
                    ›
                </button>
            </div>


            {/* SCROLL AREA */}
            <div ref={containerRef} className="overflow-x-auto pb-4 relative">
                <div className="flex px-2">

                    {/* 요일 */}
                    <div className="flex flex-col text-xs text-white/60 mt-6 mr-2 space-y-[18px]">
                        {weekDayLabels.map((label) => (
                            <div key={label} className="h-5">{label}</div>
                        ))}
                    </div>

                    {/* Chart */}
                    <div className="relative">

                        {/* 정확 월 정렬 */}
                        <div className="absolute top-0 left-0 text-xs text-white/60 h-4">
                            {monthLabels.map((m, i) => {
                                const x = getMonthOffset(i);
                                if (x === null) return null;
                                return (
                                    <div
                                        key={m}
                                        style={{
                                            position: "absolute",
                                            left: x - 1,
                                        }}
                                    >
                                        {m}
                                    </div>
                                );
                            })}
                        </div>

                        {/* 주 단위 grid */}
                        <div className="flex space-x-[3px] mt-6">
                            {weeks.map((week, wi) => (
                                <div
                                    key={wi}
                                    ref={(el) => (weekRefs.current[wi] = el)}
                                    className="flex flex-col space-y-[3px]"
                                >
                                    {week.map((day, di) => {
                                        if (!day)
                                            return <div key={di} className="w-4 h-4 opacity-10" />;

                                        const date = day.toISOString().split("T")[0];
                                        const item = grassData.get(date);
                                        const count = item?.count ?? 0;
                                        const tooltip =
                                            `${date}\n${count} Pomodoro Sessions\n` +
                                            `${item?.quote ?? "작성된 한마디 없음"}`;

                                        return (
                                            <div
                                                key={date}
                                                className={`
                                                    w-4 h-4 rounded-md
                                                    transition duration-200
                                                    hover:scale-[1.3]
                                                    hover:shadow-[0_0_6px_rgba(34,243,231,0.6)]
                                                    hover:border hover:border-teal-300/60
                                                    ${getGrassColor(count)}
                                                `}
                                                onMouseEnter={(e) => handleMouseEnter(e, tooltip)}
                                                onMouseLeave={handleMouseLeave}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>


            {/* TOOLTIP */}
            {showTooltip && (
                <div
                    className="
                        absolute pointer-events-none
                        p-3 rounded-xl text-xs leading-relaxed whitespace-pre-line
                        backdrop-blur-xl bg-[rgba(15,17,20,0.55)]
                        border border-[rgba(34,243,231,0.45)]
                        shadow-[0_0_18px_rgba(34,243,231,0.45)]
                        animate-[fadeInScale_0.2s_ease-out]
                        text-white
                    "
                    style={{
                        top: tooltipPos.y,
                        left: tooltipPos.x,
                        width: 205,
                        zIndex: 3000,
                    }}
                >
                    {tooltipContent}
                </div>
            )}

        </div>
    );
};

export default GrassChart;
