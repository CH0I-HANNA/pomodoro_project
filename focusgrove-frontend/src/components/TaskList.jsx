// src/components/TaskList.jsx

import React, { useState, useEffect, useCallback } from 'react';
import {
    getTasks,
    createTask,
    toggleComplete,
    deleteTask,
} from '../api/taskApi';
import { getDailyPomodoro } from '../api/logApi';
import TaskItem from './TaskItem';
import { getLocalDateString } from '../utils/date';

const TaskList = ({ selectedDate, onStartPomodoro, taskRefreshKey }) => {
    const [tasks, setTasks] = useState([]);
    const [newTaskContent, setNewTaskContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPomodoros, setTotalPomodoros] = useState(0);

    const fetchTasks = useCallback(async () => {
        if (!selectedDate) return;

        setIsLoading(true);
        setError(null);

        try {
            const dateStr = getLocalDateString(selectedDate);

            const fetchedTasks = await getTasks(dateStr);
            const dailyPomodoro = await getDailyPomodoro(dateStr);
            const taskPomodoros = fetchedTasks.reduce(
                (acc, t) => acc + t.pomodoroCount,
                0
            );

            setTotalPomodoros(dailyPomodoro + taskPomodoros);
            setTasks(fetchedTasks);
        } catch (err) {
            setError('Failed to fetch tasks.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks, taskRefreshKey]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskContent.trim()) return;

        try {
            const dateStr = getLocalDateString(selectedDate);
            await createTask({ content: newTaskContent, recordDate: dateStr });
            setNewTaskContent('');
            await fetchTasks();
        } catch (err) {
            setError('Failed to add task.');
            console.error(err);
        }
    };

    const handleToggleComplete = async (taskId) => {
        try {
            await toggleComplete(taskId);
            await fetchTasks();
        } catch (err) {
            setError('Failed to update task.');
            console.error(err);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await deleteTask(taskId);
            await fetchTasks();
        } catch (err) {
            setError('Failed to delete task.');
            console.error(err);
        }
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
            {/* HEADER */}
            <div className="mb-6 flex flex-col">
                <h2 className="text-2xl font-bold text-white tracking-wide">
                    Tasks for {selectedDate.toLocaleDateString()}
                </h2>

                <p className="text-white/50 text-sm mt-1">
                    Total Pomodoros: {totalPomodoros}
                </p>

                <div className="mt-3 h-[1px] bg-white/10"></div>
            </div>

            {/* ADD TASK */}
            <form
                onSubmit={handleAddTask}
                className="flex mb-6 rounded-xl overflow-hidden shadow-lg"
            >
                <input
                    type="text"
                    value={newTaskContent}
                    onChange={(e) => setNewTaskContent(e.target.value)}
                    placeholder="Add a new task..."
                    className="
                        flex-grow px-4 py-3
                        text-white bg-white/10 backdrop-blur-lg
                        border-l border-t border-white/10
                        focus:outline-none focus:ring-2 focus:ring-teal-300/60
                        placeholder-white/40
                        transition-all duration-300
                    "
                />
                <button
                    type="submit"
                    className="
                        px-6 py-3
                        bg-teal-400/30 text-white font-semibold
                        border-r border-t border-white/10
                        hover:bg-teal-300/40
                        transition duration-300
                    "
                >
                    Add
                </button>
            </form>

            {/* ERROR */}
            {error && (
                <p className="text-red-400 text-sm mb-3">{error}</p>
            )}

            {/* TASK LIST */}
            {isLoading ? (
                <p className="text-white/50 animate-pulse">Loading tasks...</p>
            ) : (
                <div className="space-y-3">
                    {tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggleComplete={handleToggleComplete}
                                onStartPomodoro={onStartPomodoro}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <div
                            className="
                                text-white/40 text-center py-8
                                border border-white/10 rounded-xl
                                bg-white/5 backdrop-blur-md
                            "
                        >
                            No tasks for this day.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TaskList;
