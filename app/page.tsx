'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import AddTaskForm from '@/components/AddTaskForm';
import AddListForm from '@/components/AddListForm';
import { TaskList as TaskListType, Task } from '@/types';
import { taskService } from '@/services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const [taskLists, setTaskLists] = useState<TaskListType[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [selectedListTasks, setSelectedListTasks] = useState<Task[]>([]);
  const [showAddListForm, setShowAddListForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const selectedList = taskLists.find(list => list.id === selectedListId);

  // Carregar todas as listas
  useEffect(() => {
    const fetchLists = async () => {
      try {
        setIsLoading(true);
        const lists = await taskService.getLists();
        setTaskLists(lists);
        
        if (lists.length > 0 && !selectedListId) {
          setSelectedListId(lists[0].id);
        }
        
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar listas:', err);
        setError('Não foi possível carregar as listas de tarefas. Verifique se o servidor está rodando.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLists();
  }, []);

  // Carregar tarefas da lista selecionada
  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedListId) return;
      
      try {
        setIsLoading(true);
        const tasks = await taskService.getTasks(selectedListId);
        setSelectedListTasks(tasks);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar tarefas:', err);
        setError('Não foi possível carregar as tarefas. Verifique se o servidor está rodando.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [selectedListId]);

  // Adicionar nova tarefa à lista selecionada
  const addTask = async (text: string): Promise<void> => {
    if (!selectedListId) return;
    
    try {
      setIsLoading(true);
      const newTask = await taskService.createTask(selectedListId, text);
      setSelectedListTasks([...selectedListTasks, newTask]);
      setError(null);
    } catch (err) {
      console.error('Erro ao adicionar tarefa:', err);
      setError('Não foi possível adicionar a tarefa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Marcar tarefa como completa/incompleta
  const toggleTaskCompleted = async (taskId: string): Promise<void> => {
    try {
      const task = selectedListTasks.find(t => t.id === taskId);
      if (!task) return;
      
      setIsLoading(true);
      const updatedTask = await taskService.updateTask(taskId, { 
        completed: !task.completed 
      });
      
      setSelectedListTasks(selectedListTasks.map(t => 
        t.id === taskId ? updatedTask : t
      ));
      
      setError(null);
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      setError('Não foi possível atualizar o status da tarefa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Remover tarefa
  const deleteTask = async (taskId: string): Promise<void> => {
    try {
      setIsLoading(true);
      await taskService.deleteTask(taskId);
      setSelectedListTasks(selectedListTasks.filter(t => t.id !== taskId));
      setError(null);
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err);
      setError('Não foi possível excluir a tarefa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Adicionar nova lista de tarefas
  const addList = async (name: string): Promise<void> => {
    try {
      setIsLoading(true);
      const newList = await taskService.createList(name);
      setTaskLists([...taskLists, newList]);
      setSelectedListId(newList.id);
      setSelectedListTasks([]);
      setShowAddListForm(false);
      setError(null);
    } catch (err) {
      console.error('Erro ao criar lista:', err);
      setError('Não foi possível criar a lista. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Remover lista de tarefas
  const deleteList = async (listId: string): Promise<void> => {
    if (taskLists.length <= 1) {
      alert('Você precisa manter pelo menos uma lista!');
      return;
    }
    
    const confirmed = confirm('Tem certeza que deseja excluir esta lista e todas as suas tarefas?');
    if (confirmed) {
      try {
        setIsLoading(true);
        await taskService.deleteList(listId);
        
        const newTaskLists = taskLists.filter(list => list.id !== listId);
        setTaskLists(newTaskLists);
        
        if (selectedListId === listId && newTaskLists.length > 0) {
          setSelectedListId(newTaskLists[0].id);
        }
        
        setError(null);
      } catch (err) {
        console.error('Erro ao excluir lista:', err);
        setError('Não foi possível excluir a lista. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Editar tarefa
  const editTask = async (taskId: string, newText: string): Promise<void> => {
    try {
      setIsLoading(true);
      const updatedTask = await taskService.updateTask(taskId, { text: newText });
      
      setSelectedListTasks(selectedListTasks.map(t => 
        t.id === taskId ? updatedTask : t
      ));
      
      setError(null);
    } catch (err) {
      console.error('Erro ao editar tarefa:', err);
      setError('Não foi possível editar a tarefa. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Editar nome da lista
  const editListName = async (listId: string, newName: string): Promise<void> => {
    try {
      setIsLoading(true);
      const updatedList = await taskService.updateList(listId, newName);
      
      setTaskLists(taskLists.map(list => 
        list.id === listId ? updatedList : list
      ));
      
      setError(null);
    } catch (err) {
      console.error('Erro ao editar nome da lista:', err);
      setError('Não foi possível editar o nome da lista. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        taskLists={taskLists}
        selectedListId={selectedListId}
        setSelectedListId={setSelectedListId}
        setShowAddListForm={setShowAddListForm}
        deleteList={deleteList}
        editListName={editListName}
        isLoading={isLoading}
      />
      <main className="flex-1 p-6 overflow-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {isLoading && <LoadingSpinner />}
        
        {!isLoading && showAddListForm ? (
          <AddListForm 
            addList={addList} 
            onCancel={() => setShowAddListForm(false)} 
          />
        ) : !isLoading && selectedList ? (
          <>
            <h1 className="text-3xl font-bold mb-6">{selectedList.name}</h1>
            <AddTaskForm addTask={addTask} />
            <TaskList 
              tasks={selectedListTasks} 
              toggleTaskCompleted={toggleTaskCompleted}
              deleteTask={deleteTask}
              editTask={editTask}
            />
          </>
        ) : null}
      </main>
    </div>
  );
}