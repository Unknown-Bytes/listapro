'use client';

import { useState, FormEvent } from 'react';

interface AddListFormProps {
  addList: (name: string) => void;
  onCancel: () => void;
}

export default function AddListForm({ addList, onCancel }: AddListFormProps) {
  const [listName, setListName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (listName.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await addList(listName);
        setListName('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Nova Lista de Tarefas</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="listName" className="block mb-2 font-medium">
            Nome da Lista
          </label>
          <input
            id="listName"
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="Ex: Trabalho, Estudos, Compras..."
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}