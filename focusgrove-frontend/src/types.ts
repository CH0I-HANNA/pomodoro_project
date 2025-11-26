// src/types.ts

export interface GrassData {
    // From backend query
    date: string;       // YYYY-MM-DD
    count: number;      // pomodoroCount
    quote: string | null; // content for tooltip
}

export interface Task {
    id: number;
    content: string;
    recordDate: string; // 'YYYY-MM-DD'
    completed: boolean;
    pomodoroCount: number;
}
