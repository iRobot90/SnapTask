import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskList from '../TaskList';
import { FLEETBO_DB_NAME, COLLECTIONS } from '../../@fleetbo/constants';

// Mock the Fleetbo global object
global.Fleetbo = {
  getDocsU: jest.fn(),
  openPage: jest.fn(),
  openPageId: jest.fn(),
  back: jest.fn(),
};

describe('TaskList', () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', description: 'Desc 1', isCompleted: false, photoUri: null, createdAt: Date.now() },
    { id: '2', title: 'Task 2', description: 'Desc 2', isCompleted: true, photoUri: 'uri2', createdAt: Date.now() },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    global.Fleetbo.getDocsU.mockResolvedValue(mockTasks);
  });

  test('renders TaskList component and fetches tasks on mount', async () => {
    render(<TaskList />);

    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();

    await waitFor(() => {
      expect(global.Fleetbo.getDocsU).toHaveBeenCalledWith(FLEETBO_DB_NAME, COLLECTIONS.USER_TASKS);
      expect(screen.getByText('My Tasks')).toBeInTheDocument();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });
  });

  test('navigates to TaskCreate when "Create New Task" button is clicked', async () => {
    render(<TaskList />);
    await waitFor(() => expect(screen.getByText('Task 1')).toBeInTheDocument()); // Wait for tasks to load

    fireEvent.click(screen.getByText('Create New Task'));
    expect(global.Fleetbo.openPage).toHaveBeenCalledWith('taskcreate');
  });

  test('navigates to TaskDetail when "View Details" button is clicked', async () => {
    render(<TaskList />);
    await waitFor(() => expect(screen.getByText('Task 1')).toBeInTheDocument());

    fireEvent.click(screen.getAllByText('View Details')[0]); // Click first View Details button
    expect(global.Fleetbo.openPageId).toHaveBeenCalledWith('taskdetail', '1');
  });

  test('refreshes tasks when the refresh button is clicked', async () => {
    render(<TaskList />);
    await waitFor(() => expect(screen.getByText('Task 1')).toBeInTheDocument());

    global.Fleetbo.getDocsU.mockClear(); // Clear mock before refreshing
    fireEvent.click(screen.getByLabelText('Refresh Tasks')); // Use aria-label

    await waitFor(() => {
      expect(global.Fleetbo.getDocsU).toHaveBeenCalledWith(FLEETBO_DB_NAME, COLLECTIONS.USER_TASKS);
      expect(screen.getByText('Task 1')).toBeInTheDocument(); // Ensure tasks are re-rendered
    });
  });

  test('displays "No tasks yet" message if no tasks are returned', async () => {
    global.Fleetbo.getDocsU.mockResolvedValue([]); // Mock an empty array of tasks
    render(<TaskList />);

    await waitFor(() => {
      expect(screen.getByText('No tasks yet. Create one!')).toBeInTheDocument();
    });
  });

  test('calls Fleetbo.back when the back button is clicked', async () => { // Added async
    render(<TaskList />);
    await waitFor(() => expect(screen.getByText('My Tasks')).toBeInTheDocument()); // Wait for initial render

    fireEvent.click(screen.getByRole('button', { name: /TaskList/i }));
    expect(global.Fleetbo.back).toHaveBeenCalled();
  });
});