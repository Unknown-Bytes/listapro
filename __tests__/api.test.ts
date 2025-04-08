import MockAdapter from 'axios-mock-adapter';
import { Task, TaskList } from '@/types';
import { api, taskService } from '../services/api';


const mock = new MockAdapter(api);

describe('taskService', () => {
  afterEach(() => {
    mock.reset();
  });

  describe('Listas', () => {
    it('deve buscar listas de tarefas', async () => {
      const mockLists: TaskList[] = [{
          id: '1', name: 'Lista 1',
          tasks: []
      }];
      mock.onGet('/lists').reply(200, mockLists);

      const result = await taskService.getLists();
      expect(result).toEqual(mockLists);
    });

    it('deve criar uma nova lista', async () => {
      const mockList: TaskList = { id: '2', name: 'Nova Lista', tasks: [] };
      mock.onPost('/lists', { name: 'Nova Lista' }).reply(201, mockList);

      const result = await taskService.createList('Nova Lista');
      expect(result).toEqual(mockList);
    });

    it('deve atualizar uma lista', async () => {
      const updatedList: TaskList = { id: '1', name: 'Lista Atualizada', tasks: [] };
      mock.onPut('/lists/1', { name: 'Lista Atualizada' }).reply(200, updatedList);

      const result = await taskService.updateList('1', 'Lista Atualizada');
      expect(result).toEqual(updatedList);
    });

    it('deve deletar uma lista', async () => {
      mock.onDelete('/lists/1').reply(204);

      await expect(taskService.deleteList('1')).resolves.toBeUndefined();
    });
  });

  describe('Tarefas', () => {
    it('deve buscar tarefas de uma lista', async () => {
      const mockTasks: Task[] = [{ id: '1', text: 'Tarefa 1', completed: false }];
      mock.onGet('/lists/1/tasks').reply(200, mockTasks);

      const result = await taskService.getTasks('1');
      expect(result).toEqual(mockTasks);
    });

    it('deve criar uma nova tarefa', async () => {
      const mockTask: Task = { id: '1', text: 'Nova Tarefa', completed: false };
      mock.onPost('/lists/1/tasks', { text: 'Nova Tarefa' }).reply(201, mockTask);

      const result = await taskService.createTask('1', 'Nova Tarefa');
      expect(result).toEqual(mockTask);
    });

    it('deve deletar uma tarefa', async () => {
      mock.onDelete('/tasks/1').reply(204);

      await expect(taskService.deleteTask('1')).resolves.toBeUndefined();
    });
  });
});