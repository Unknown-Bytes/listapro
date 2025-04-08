'use client';

import { useState } from 'react';
import { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
  toggleTaskCompleted: (id: string) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, newText: string) => void;
}

export default function TaskList({ 
  tasks, 
  toggleTaskCompleted, 
  deleteTask, 
  editTask 
}: TaskListProps) {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTaskText, setEditedTaskText] = useState<string>('');

  const startEditing = (task: Task): void => {
    setEditingTaskId(task.id);
    setEditedTaskText(task.text);
  };

  const saveEditedTask = (): void => {
    if (editingTaskId && editedTaskText.trim()) {
      editTask(editingTaskId, editedTaskText);
      setEditingTaskId(null);
    }
  };

  // Agrupar tarefas por status (incompletas primeiro)
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="mt-6">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          Nenhuma tarefa adicionada. Comece adicionando uma acima!
        </p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">Tarefas Pendentes ({incompleteTasks.length})</h2>
          <ul className="space-y-2 mb-6">
            {incompleteTasks.map(task => (
              <li 
                key={task.id} 
                className="bg-white rounded-md p-4 shadow flex justify-between items-center"
              >
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editedTaskText}
                    onChange={(e) => setEditedTaskText(e.target.value)}
                    onBlur={saveEditedTask}
                    onKeyDown={(e) => e.key === 'Enter' && saveEditedTask()}
                    className="flex-1 p-1 border border-gray-300 rounded"
                    autoFocus
                  />
                ) : (
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompleted(task.id)}
                      className="h-5 w-5 mr-3 cursor-pointer"
                    />
                    <span className={task.completed ? 'line-through text-gray-500' : ''}>
                      {task.text}
                    </span>
                  </div>
                )}
                
                {editingTaskId !== task.id && (
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => startEditing(task)}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {completedTasks.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-2">Tarefas Concluídas ({completedTasks.length})</h2>
              <ul className="space-y-2">
                {completedTasks.map(task => (
                  <li 
                    key={task.id} 
                    className="bg-gray-50 rounded-md p-4 shadow flex justify-between items-center opacity-70"
                  >
                    {editingTaskId === task.id ? (
                      <input
                        type="text"
                        value={editedTaskText}
                        onChange={(e) => setEditedTaskText(e.target.value)}
                        onBlur={saveEditedTask}
                        onKeyDown={(e) => e.key === 'Enter' && saveEditedTask()}
                        className="flex-1 p-1 border border-gray-300 rounded"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center flex-1">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => toggleTaskCompleted(task.id)}
                          className="h-5 w-5 mr-3 cursor-pointer"
                        />
                        <span className="line-through text-gray-500">
                          {task.text}
                        </span>
                      </div>
                    )}
                    
                    {editingTaskId !== task.id && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => startEditing(task)}
                          className="text-gray-400 hover:text-blue-600"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
