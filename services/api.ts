import axios from 'axios';
import { Task, TaskList } from '@/types';

export const api = axios.create({ 
  baseURL: 'http://localhost:8080/api'
});

export const taskService = {
  // Listas de tarefas
  getLists: async (): Promise<TaskList[]> => {
    const response = await api.get<TaskList[]>('/lists');
    return response.data;
  },

  createList: async (name: string): Promise<TaskList> => {
    const response = await api.post<TaskList>('/lists', { name });
    return response.data;
  },

  updateList: async (id: string, name: string): Promise<TaskList> => {
    const response = await api.put<TaskList>(`/lists/${id}`, { name });
    return response.data;
  },

  deleteList: async (id: string): Promise<void> => {
    await api.delete(`/lists/${id}`);
  },

  // Tarefas
  getTasks: async (listId: string): Promise<Task[]> => {
    const response = await api.get<Task[]>(`/lists/${listId}/tasks`);
    return response.data;
  },

  createTask: async (listId: string, text: string): Promise<Task> => {
    const response = await api.post<Task>(`/lists/${listId}/tasks`, { text });
    return response.data;
  },

  updateTask: async (id: string, data: Partial<Task>): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  deleteTask: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  }
};