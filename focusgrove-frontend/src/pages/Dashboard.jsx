import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import TimerSection from '../components/TimerSection';
import api from '../api/axios';
import GrassChart from '../components/GrassChart';
import TaskList from '../components/TaskList';
import TodaySentence from '../components/TodaySentence';

import ProfileCard from '../components/ProfileCard';
import MusicPlayer from '../components/MusicPlayer';
import StatsWidgets from '../components/StatsWidgets';
import WeeklyChart from '../components/WeeklyChart';
import HighlightingCalendar from '../components/Calendar';

const Dashboard = () => {
    const [dailyLog, setDailyLog] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [newQuote, setNewQuote] = useState('');

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentTaskId, setCurrentTaskId] = useState(null);
    const [currentTaskContent, setCurrentTaskContent] = useState('');
    const [taskRefreshKey, setTaskRefreshKey] = useState(0);

    const handleStartPomodoro = (taskId, taskContent) => {
        setCurrentTaskId(taskId);
        setCurrentTaskContent(taskContent);
    };

    const handleSessionComplete = () => {
        setCurrentTaskId(null);
        setCurrentTaskContent('');
        setTaskRefreshKey(prev => prev + 1);
    };
    
    const getLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchDailyLog = async () => {
        try {
            const dateString = getLocalDateString(selectedDate);
            const response = await api.get(`/log/daily?date=${dateString}`);

            if (response.data?.content) {
                setDailyLog(response.data.content);
            } else {
                setDailyLog('오늘의 한마디를 작성해주세요.');
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setDailyLog('오늘의 한마디를 작성해주세요.');
            } else {
                console.error(error);
                setDailyLog('오늘의 한마디를 불러오는데 실패했습니다.');
            }
        }
    };

    useEffect(() => {
        fetchDailyLog();
    }, [selectedDate, taskRefreshKey]);

    const handleEdit = () => {
        setNewQuote(dailyLog);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleSave = async () => {
        try {
            const recordDate = getLocalDateString(selectedDate);
            await api.post('/log/daily', { content: newQuote, recordDate });
            setDailyLog(newQuote);
            setIsEditing(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Layout>
            <div className="p-4 lg:p-8  min-h-screen ">

                {/* 🔹 새로운 대시보드 Grid 구조 */}
                <div className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.7fr)_minmax(0,1fr)]
                    gap-6
                ">

                    {/* 1열: Profile + Task */}
                    <div className="space-y-6">
                        <ProfileCard/>

                        <TaskList
                            selectedDate={selectedDate}
                            onStartPomodoro={handleStartPomodoro}
                            taskRefreshKey={taskRefreshKey}
                        />

                        <HighlightingCalendar />
                    </div>

                    {/* 2열: Sentence + Timer + Music */}
                    <div className="space-y-6">
                        <TodaySentence
                            dailyLog={dailyLog}
                            isEditing={isEditing}
                            newQuote={newQuote}
                            setNewQuote={setNewQuote}
                            handleEdit={handleEdit}
                            handleCancel={handleCancel}
                            handleSave={handleSave}
                        />

                        <TimerSection
                            currentTaskId={currentTaskId}
                            currentTaskContent={currentTaskContent}
                            onSessionComplete={handleSessionComplete}
                        />

                        {/*<MusicPlayer/>*/}
                        <GrassChart/>



                    </div>

                    {/* 3열: Stats + Weekly Chart + Grass */}
                    <div className="space-y-6">
                        <StatsWidgets/>

                        <WeeklyChart/>

                        <MusicPlayer/>

                        {/*<GrassChart/>*/}
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
