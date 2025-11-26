import { useState, useEffect } from 'react';
import api from '../api/axios';

const ProgressCard = () => {
  const [todaySummary, setTodaySummary] = useState({ totalDuration: 0 });

  useEffect(() => {
    const fetchSummary = async () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      try {
        const response = await api.get(`/log/summary/monthly?year=${year}&month=${month}`);
        const todayString = today.toISOString().split('T')[0];
        const summary = response.data.find(d => d.sessionDate === todayString);
        if (summary) {
          setTodaySummary(summary);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSummary();
  }, []);

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };
  
  const pomodoros = Math.floor(todaySummary.totalDuration / 25);
  const focusTime = formatDuration(todaySummary.totalDuration);
  const tasksDone = pomodoros;
  const dayStreak = 12; // Hardcoded as per instructions

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
      <h3 className="text-xl font-bold mb-4">🔥 Today's Progress</h3>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="text-3xl font-bold">{pomodoros}</div>
          <div>Pomodoros</div>
        </div>
        <div>
          <div className="text-3xl font-bold">{focusTime}</div>
          <div>Focus Time</div>
        </div>
        <div>
          <div className="text-3xl font-bold">{tasksDone}</div>
          <div>Tasks Done</div>
        </div>
        <div>
          <div className="text-3xl font-bold">{dayStreak}</div>
          <div>Day Streak</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
