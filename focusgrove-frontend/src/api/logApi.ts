// src/api/logApi.ts

import api from './axios';
import { type GrassData } from '../types.ts';

// Function to fetch grass data for a specific year
export const fetchGrassData = async (year: number): Promise<GrassData[]> => {
    const response = await api.get<GrassData[]>(`/log/grass?year=${year}`);
    return response.data;
};

export const getDailyPomodoro = async (date: string): Promise<number> => {
    const response = await api.get<number>(`/log/daily-pomodoro?date=${date}`);
    return response.data;
};

export const getHighlightedDays = async (year: number, month: number): Promise<{ daysToHighlight: number[] }> => {
    // This is a mock API call.
    // In a real application, you would fetch this data from your backend.
    const response = await new Promise<{ daysToHighlight: number[] }>((resolve) => {
        setTimeout(() => {
            const daysInMonth = new Date(year, month, 0).getDate();
            const daysToHighlight = [1, 2, 3].map(() => Math.round(Math.random() * (daysInMonth - 1) + 1));
            resolve({ daysToHighlight });
        }, 500);
    });
    return response;
};

export type Stats = {
    pomodoros: number;
    tasksDone: number;
    focusTime: string;
    dayStreak: number;
};

export const getStats = async (): Promise<Stats> => {
    const response = await api.get<Stats>('/log/stats');
    return response.data;
};

export const getTodayStats = async (): Promise<Stats> => {
    const response = await api.get<Stats>('/log/stats/today');
    return response.data;
};
