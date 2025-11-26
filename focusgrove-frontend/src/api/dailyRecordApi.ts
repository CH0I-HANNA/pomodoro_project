
import api from './axios';

export const incrementDailyPomodoro = async (): Promise<void> => {
    await api.patch('/log/daily-records/pomodoro');
};
