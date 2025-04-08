'use client';

import { useState, FormEvent } from 'react';

interface AddTaskFormProps {
  addTask: (text: string) => void;
}

export default function AddTaskForm({ addTask }: AddTaskFormProps) {
  const [taskText, setTaskText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (taskText.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await addTask(taskText);
        setTaskText('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Adicionar nova tarefa..."
          className="p-3 border border-gray-300 rounded-md shadow-sm flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md shadow-sm disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adicionando...' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}