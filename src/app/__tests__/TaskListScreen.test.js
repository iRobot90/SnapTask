// TaskListScreen.test.js - TaskListScreen Navigation Tests
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskListScreen from '../TaskListScreen';

// Mock Fleetbo object
const mockFleetbo = {
  onWebPageReady: jest.fn(),
  storage: {
    read: jest.fn()
  },
  on: jest.fn(),
  exec: jest.fn()
};

global.Fleetbo = mockFleetbo;
global.window = global.window || {};
global.window.Fleetbo = mockFleetbo;

// Mock NavigationHelper
jest.mock('../NavigationHelper', () => ({
  signalPageReady: jest.fn(),
  loadTasks: jest.fn(),
  goToTaskDetail: jest.fn(),
  goToNewTask: jest.fn(),
  handleBackButton: jest.fn(),
  deleteTask: jest.fn()
}));

const NavigationHelper = require('../NavigationHelper');

// Mock document methods
global.document = global.document || {};
global.document.createElement = jest.fn(() => ({
  className: '',
  style: {},
  innerHTML: '',
  appendChild: jest.fn(),
  remove: jest.fn()
}));

// Mock window.confirm
global.window.confirm = jest.fn();

describe('TaskListScreen Navigation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render TaskListScreen component correctly', async () => {
    const mockTasks = [
      { id: '1', title: 'Test Task 1', completed: false },
      { id: '2', title: 'Test Task 2', completed: true }
    ];
    NavigationHelper.loadTasks.mockResolvedValueOnce(mockTasks);

    render(<TaskListScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('My Tasks')).toBeInTheDocument();
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  test('should signal page ready on mount', () => {
    const mockTasks = [];
    NavigationHelper.loadTasks.mockResolvedValueOnce(mockTasks);

    render(<TaskListScreen />);
    
    expect(NavigationHelper.signalPageReady).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('TaskListScreen: Component mounted');
  });

  test('should load tasks on mount', async () => {
    const mockTasks = [{ id: '1', title: 'Test Task' }];
    NavigationHelper.loadTasks.mockResolvedValueOnce(mockTasks);

    render(<TaskListScreen />);
    
    await waitFor(() => {
      expect(NavigationHelper.loadTasks).toHaveBeenCalledTimes(1);
    });
    
    expect(console.log).toHaveBeenCalledWith('TaskListScreen: Loading tasks from Fleetbo.storage');
  });

  test('should navigate to task detail when task is clicked', async () => {
    const mockTasks = [{ id: '1', title: 'Test Task' }];
    NavigationHelper.loadTasks.mockResolvedValueOnce(mockTasks);

    render(<TaskListScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
    
    const taskItem = screen.getByText('Test Task');
    fireEvent.click(taskItem);
    
    expect(NavigationHelper.goToTaskDetail).toHaveBeenCalledWith('1');
    expect(console.log).toHaveBeenCalledWith('TaskListScreen: Task item clicked:', '1');
  });

  test('should navigate to new task when create button is clicked', async () => {
    const mockTasks = [];
    NavigationHelper.loadTasks.mockResolvedValueOnce(mockTasks);

    render(<TaskListScreen />);
    
    await waitFor(() => {
      // Wait for component to render
    });
    
    const createButton = screen.getByRole('button');
    fireEvent.click(createButton);
    
    expect(NavigationHelper.goToNewTask).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('TaskListScreen: Create task button pressed');
  });

  test('should handle back button press', async () => {
    const mockTasks = [];
    NavigationHelper.loadTasks.mockResolvedValueOnce(mockTasks);

    render(<TaskListScreen />);
    
    await waitFor(() => {
      // Wait for component to render
    });
    
    const backButton = screen.getByRole('button').closest('button');
    fireEvent.click(backButton);
    
    expect(NavigationHelper.handleBackButton).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('TaskListScreen: Back button pressed');
  });

  test('should delete task when delete is confirmed', async () => {
    const mockTasks = [{ id: '1', title: 'Test Task' }];
    NavigationHelper.loadTasks.mockResolvedValueOnce(mockTasks);
    NavigationHelper.deleteTask.mockResolvedValueOnce(true);
    global.window.confirm.mockReturnValueOnce(true);

    render(<TaskListScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(global.window.confirm).toHaveBeenCalledWith('Delete this task?');
    expect(NavigationHelper.deleteTask).toHaveBeenCalledWith('1');
    expect(console.log).toHaveBeenCalledWith('TaskListScreen: Delete task button pressed for:', '1');
  });

  test('should not delete task when delete is cancelled', async () => {
    const mockTasks = [{ id: '1', title: 'Test Task' }];
    NavigationHelper.loadTasks.mockResolvedValueOnce(mockTasks);
    global.window.confirm.mockReturnValueOnce(false);

    render(<TaskListScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(global.window.confirm).toHaveBeenCalledWith('Delete this task?');
    expect(NavigationHelper.deleteTask).not.toHaveBeenCalled();
  });

  test('should show empty state when no tasks', async () => {
    const mockTasks = [];
    NavigationHelper.loadTasks.mockResolvedValueOnce(mockTasks);

    render(<TaskListScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('No tasks yet. Tap + to start.')).toBeInTheDocument();
    });
  });

  test('should handle connectivity changes', async () => {
    const mockTasks = [];
    NavigationHelper.loadTasks.mockResolvedValueOnce(mockTasks);

    render(<TaskListScreen />);
    
    await waitFor(() => {
      // Wait for component to render
    });
    
    expect(mockFleetbo.on).toHaveBeenCalledWith('CONNECTIVITY_CHANGE', expect.any(Function));
    expect(mockFleetbo.exec).toHaveBeenCalledWith('Connectivity', 'check', {});
  });
});

describe('TaskListScreen Error Handling Tests', () => {
  test('should show error when loadTasks fails', async () => {
    NavigationHelper.loadTasks.mockRejectedValueOnce(new Error('Load failed'));

    render(<TaskListScreen />);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('TaskListScreen: Load error:', expect.any(Error));
    });
  });

  test('should show error when deleteTask fails', async () => {
    const mockTasks = [{ id: '1', title: 'Test Task' }];
    NavigationHelper.loadTasks.mockResolvedValueOnce(mockTasks);
    NavigationHelper.deleteTask.mockResolvedValueOnce(false);
    global.window.confirm.mockReturnValueOnce(true);

    render(<TaskListScreen />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(document.createElement).toHaveBeenCalledWith('div');
  });
});

console.log('✅ TaskListScreen Navigation Tests Complete');