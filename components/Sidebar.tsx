'use client';

import { useState } from 'react';
import { TaskList } from '@/types';

interface SidebarProps {
  taskLists: TaskList[];
  selectedListId: string;
  setSelectedListId: (id: string) => void;
  setShowAddListForm: (show: boolean) => void;
  deleteList: (id: string) => void;
  editListName: (id: string, newName: string) => void;
  isLoading: boolean;
}

export default function Sidebar({ 
  taskLists, 
  selectedListId, 
  setSelectedListId, 
  setShowAddListForm,
  deleteList,
  editListName,
  isLoading
}: SidebarProps) {
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editedListName, setEditedListName] = useState<string>('');

  const startEditing = (list: TaskList): void => {
    setEditingListId(list.id);
    setEditedListName(list.name);
  };

  const saveEditedName = (): void => {
    if (editingListId && editedListName.trim()) {
      editListName(editingListId, editedListName);
      setEditingListId(null);
    }
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Minhas Listas</h2>
      <div className="flex-1 overflow-auto">
        {isLoading && taskLists.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Carregando listas...</p>
        ) : (
          <ul className="space-y-2">
            {taskLists.map(list => (
              <li 
                key={list.id} 
                className={`p-2 rounded-md flex justify-between items-center ${selectedListId === list.id ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
              >
                {editingListId === list.id ? (
                  <input
                    type="text"
                    value={editedListName}
                    onChange={(e) => setEditedListName(e.target.value)}
                    onBlur={saveEditedName}
                    onKeyDown={(e) => e.key === 'Enter' && saveEditedName()}
                    className="bg-gray-600 text-white p-1 rounded w-full"
                    autoFocus
                  />
                ) : (
                  <>
                    <span 
                      className="cursor-pointer flex-1"
                      onClick={() => setSelectedListId(list.id)}
                    >
                      {list.name}
                    </span>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => startEditing(list)}
                        className="text-gray-400 hover:text-white"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => deleteList(list.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button 
        onClick={() => setShowAddListForm(true)}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md w-full"
        disabled={isLoading}
      >
        Nova Lista
      </button>
    </div>
  );
}