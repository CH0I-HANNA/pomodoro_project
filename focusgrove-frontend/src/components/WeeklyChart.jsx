// src/components/WeeklyChart.jsx
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import api from "../api/axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const WeeklyChart = () => {
    const [chartData, setChartData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/stats/weekly-completion");
                const data = res.data;

                if (!data?.completionRates?.length) {
                    setChartData(null);
                    return;
                }

                setChartData({
                    labels: data.labels,
                    datasets: [
                        {
                            label: "Weekly Completion (%)",
                            data: data.completionRates,
                            backgroundColor: (ctx) => {
                                const index = ctx.dataIndex;
                                const chart = ctx.chart;
                                const { ctx: c } = chart;
                                const isActive = index === activeIndex;

                                const gradient = c.createLinearGradient(
                                    0,
                                    0,
                                    0,
                                    chart.height
                                );
                                gradient.addColorStop(
                                    0,
                                    isActive
                                        ? "rgba(34,243,231,1)"
                                        : "rgba(34,243,231,0.95)"
                                );
                                gradient.addColorStop(
                                    1,
                                    isActive
                                        ? "rgba(22,174,165,1)"
                                        : "rgba(22,174,165,0.8)"
                                );

                                return gradient;
                            },
                            borderColor:
                                activeIndex !== null
                                    ? "rgba(34,243,231,1)"
                                    : "rgba(22,174,165,0.9)",
                            borderWidth: 2,
                            borderRadius: {
                                topLeft: 12,
                                topRight: 12,
                                bottomLeft: 3,
                                bottomRight: 3,
                            },
                            hoverBorderWidth: 3,
                        },
                    ],
                });
            } catch (err) {
                console.error(err);
                setError("Failed to load chart data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [activeIndex]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        onHover: (_, el) => {
            if (el.length > 0) setActiveIndex(el[0].index);
            else setActiveIndex(null);
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                padding: 12,
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                borderColor: "rgba(34,243,231,0.9)",
                borderWidth: 1.4,
                bodyColor: "#fff",
                titleColor: "#fff",
                titleFont: { weight: "bold" },
                displayColors: false,
                caretSize: 7,
                caretPadding: 7,
                cornerRadius: 10,


                // Glow 효과
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 15,
                shadowColor: "rgba(34,243,231,0.9)",

                callbacks: {
                    label: (ctx) => `완료율: ${ctx.raw}%`,
                },
            },
        },
        scales: {
            y: {
                min: 0,
                max: 100,
                ticks: {
                    callback: (value) => `${value}%`,
                    color: "rgba(255,255,255,0.85)",
                    font: { weight: 600 },
                },
                grid: {
                    color: "rgba(255,255,255,0.08)",
                    lineWidth: 1,
                },
            },
            x: {
                ticks: {
                    color: "rgba(255,255,255,0.85)",
                    font: { weight: "bold" },
                },
                grid: { display: false },
            },
        },
        animation: {
            duration: 700,
            easing: "easeOutQuint",
        },
        datasets: {
            bar: {
                barPercentage: 0.55,
                categoryPercentage: 0.45,
            },
        },
    };

    const renderContent = () => {
        if (isLoading)
            return (
                <div className="flex items-center justify-center h-full text-white/60">
                    Loading...
                </div>
            );

        if (error)
            return (
                <div className="flex items-center justify-center h-full text-red-400">
                    {error}
                </div>
            );

        if (!chartData)
            return (
                <div className="flex items-center justify-center h-full text-white/50">
                    최근 7일 작업 기록이 없습니다.
                </div>
            );

        return <Bar data={chartData} options={options} />;
    };

    return (
        <div
            className="
        backdrop-blur-xl bg-white/5 border border-white/20 rounded-2xl
        shadow-2xl p-6 hover:bg-white/10 transition duration-300
        animate-fadeInUp
      "
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold tracking-wide">
                    Weekly Productivity
                </h3>

                <span className="text-xs px-2 py-1 rounded-md bg-white/10 text-white/70">
                    최근 7일
                </span>
            </div>

            <div className="h-[1px] bg-white/10 mb-4"></div>

            <div className="relative h-[240px] md:h-[270px]">
                {renderContent()}
            </div>
        </div>
    );
};

export default WeeklyChart;
