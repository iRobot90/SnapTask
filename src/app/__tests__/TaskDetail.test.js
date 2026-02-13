import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskDetail from '../TaskDetail';
import { FLEETBO_DB_NAME, COLLECTIONS } from '../../@fleetbo/constants';

// Mock the Fleetbo global object
global.Fleetbo = {
  getDoc: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  openPage: jest.fn(),
  back: jest.fn(),
  currentRoute: {
    params: {
      id: 'mockTaskId123', // Default mock task ID
    },
  },
};

describe('TaskDetail', () => {
  const mockTask = {
    id: 'mockTaskId123',
    title: 'Detail Task',
    description: 'This is a detailed task description.',
    photoUri: 'https://example.com/mock-photo.jpg',
    createdAt: Date.now(),
    isCompleted: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.Fleetbo.getDoc.mockResolvedValue(mockTask);
    window.alert = jest.fn(); // Mock window.alert
  });

  test('renders TaskDetail component and fetches task on mount', async () => {
    render(<TaskDetail />);

    expect(screen.getByText('Loading task...')).toBeInTheDocument();

    await waitFor(() => {
      expect(global.Fleetbo.getDoc).toHaveBeenCalledWith(
        FLEETBO_DB_NAME,
        COLLECTIONS.USER_TASKS,
        'mockTaskId123'
      );
      expect(screen.getByText('Task Details')).toBeInTheDocument();
      expect(screen.getByText(mockTask.title)).toBeInTheDocument();
      expect(screen.getByText(mockTask.description)).toBeInTheDocument();
      expect(screen.getByAltText('Task')).toHaveAttribute('src', mockTask.photoUri);
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  test('handles task not found scenario', async () => {
    global.Fleetbo.getDoc.mockResolvedValue(null); // Simulate task not found
    render(<TaskDetail />);

    await waitFor(() => {
      expect(screen.getByText('Task not found.')).toBeInTheDocument();
      expect(screen.getByText('Back to Task List')).toBeInTheDocument();
    });
  });

  test('toggles task completion status', async () => {
    render(<TaskDetail />);
    await waitFor(() => expect(screen.getByText('Pending')).toBeInTheDocument());

    fireEvent.click(screen.getByText('Mark Complete'));

    await waitFor(() => {
      expect(global.Fleetbo.update).toHaveBeenCalledWith(
        FLEETBO_DB_NAME,
        COLLECTIONS.USER_TASKS,
        'mockTaskId123',
        { isCompleted: true }
      );
      expect(screen.getByText('Completed')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Mark Incomplete')); // Click again to toggle back

    await waitFor(() => {
      expect(global.Fleetbo.update).toHaveBeenCalledWith(
        FLEETBO_DB_NAME,
        COLLECTIONS.USER_TASKS,
        'mockTaskId123',
        { isCompleted: false }
      );
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });
  });

  test('deletes task and navigates to tasklist on confirmation', async () => {
    window.confirm = jest.fn(() => true); // Mock user confirming deletion
    render(<TaskDetail />);
    await waitFor(() => expect(screen.getByText(mockTask.title)).toBeInTheDocument());

    fireEvent.click(screen.getByText('Delete Task'));

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this task?');
      expect(global.Fleetbo.delete).toHaveBeenCalledWith(
        FLEETBO_DB_NAME,
        COLLECTIONS.USER_TASKS,
        'mockTaskId123'
      );
      expect(window.alert).toHaveBeenCalledWith('Task deleted successfully!');
      expect(global.Fleetbo.openPage).toHaveBeenCalledWith('tasklist');
    });
  });

  test('does not delete task if user cancels confirmation', async () => {
    window.confirm = jest.fn(() => false); // Mock user canceling deletion
    render(<TaskDetail />);
    await waitFor(() => expect(screen.getByText(mockTask.title)).toBeInTheDocument());

    fireEvent.click(screen.getByText('Delete Task'));

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this task?');
      expect(global.Fleetbo.delete).not.toHaveBeenCalled();
      expect(global.Fleetbo.openPage).not.toHaveBeenCalled();
    });
  });

  test('calls Fleetbo.back when the back button is clicked', async () => { // Added async
    render(<TaskDetail />);
    await waitFor(() => expect(screen.getByText('Task Details')).toBeInTheDocument()); // Wait for initial render

    fireEvent.click(screen.getByRole('button', { name: /TaskDetail/i })); // Click the header back button
    expect(global.Fleetbo.back).toHaveBeenCalled();
  });
});
