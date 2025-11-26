// src/api/taskApi.ts
import api from './axios';
import type { Task } from '../types'; // Assuming Task type is defined in types.ts

/**
 * Fetches tasks for a specific date.
 * @param date - The date in 'YYYY-MM-DD' format.
 */
export const getTasks = async (date: string): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/tasks?date=${date}`);
    return response.data;
};

/**
 * Creates a new task.
 * @param data - An object containing content and recordDate.
 */
export const createTask = async (data: { content: string; recordDate: string }): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
};

/**
 * Toggles the completion status of a task.
 * @param taskId - The ID of the task.
 */
export const toggleComplete = async (taskId: number): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}/complete`);
    return response.data;
};

/**
 * Increments the pomodoro count for a task.
 * @param taskId - The ID of the task.
 */
export const incrementPomodoro = async (taskId: number): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${taskId}/pomodoro`);
    return response.data;
};

/**
 * Deletes a task.
 * @param taskId - The ID of the task.
 */
export const deleteTask = async (taskId: number): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
};
