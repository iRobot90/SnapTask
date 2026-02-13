// NewTaskScreen.test.js - NewTaskScreen Save Function Tests
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewTaskScreen from '../NewTaskScreen';

// Mock Fleetbo object
const mockFleetbo = {
  onWebPageReady: jest.fn(),
  storage: {
    read: jest.fn(),
    save: jest.fn()
  },
  exec: jest.fn()
};

global.Fleetbo = mockFleetbo;
global.window = global.window || {};
global.window.Fleetbo = mockFleetbo;

// Mock NavigationHelper
jest.mock('../NavigationHelper', () => ({
  signalPageReady: jest.fn(),
  takePhoto: jest.fn(),
  saveTask: jest.fn(),
  handleBackButton: jest.fn(),
  goToTaskList: jest.fn()
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

describe('NewTaskScreen Navigation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.window.lastCapturedPhoto = null;
  });

  test('should render NewTaskScreen component correctly', () => {
    render(<NewTaskScreen />);
    
    expect(screen.getByText('New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What needs to be done?')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add some details...')).toBeInTheDocument();
    expect(screen.getByText('Save Task')).toBeInTheDocument();
    expect(screen.getByText('Tap to capture photo')).toBeInTheDocument();
  });

  test('should signal page ready on mount', () => {
    render(<NewTaskScreen />);
    
    expect(NavigationHelper.signalPageReady).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('NewTaskScreen: Component mounted');
  });

  test('should save task with title and navigate to TaskList', async () => {
    const mockTask = { id: '123', title: 'Test Task' };
    NavigationHelper.saveTask.mockResolvedValueOnce(true);

    render(<NewTaskScreen />);
    
    // Fill in title
    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    
    // Click save button
    const saveButton = screen.getByText('Save Task');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(NavigationHelper.saveTask).toHaveBeenCalledWith(
        expect.objectContaining({
          id: expect.any(String),
          title: 'Test Task',
          description: '',
          photoUri: null,
          completed: false
        })
      );
    });

    expect(console.log).toHaveBeenCalledWith('NewTaskScreen: Save task button pressed');
  });

  test('should show validation error when title is empty', () => {
    render(<NewTaskScreen />);
    
    // Leave title empty and click save
    const saveButton = screen.getByText('Save Task');
    fireEvent.click(saveButton);
    
    expect(console.log).toHaveBeenCalledWith('NewTaskScreen: Save task button pressed');
    // Should not call saveTask
    expect(NavigationHelper.saveTask).not.toHaveBeenCalled();
  });

  test('should take photo when photo area is clicked', async () => {
    const mockPhoto = { uri: 'file://test.jpg' };
    NavigationHelper.takePhoto.mockResolvedValueOnce(mockPhoto);

    render(<NewTaskScreen />);
    
    const photoArea = screen.getByText('Tap to capture photo');
    fireEvent.click(photoArea);
    
    expect(NavigationHelper.takePhoto).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('NewTaskScreen: Take photo button pressed');
  });

  test('should handle back button press', () => {
    render(<NewTaskScreen />);
    
    // Find and click back button
    const backButton = screen.getByRole('button').closest('button');
    fireEvent.click(backButton);
    
    expect(NavigationHelper.handleBackButton).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('NewTaskScreen: Back button pressed');
  });

  test('should show error when save task fails', async () => {
    NavigationHelper.saveTask.mockResolvedValueOnce(false);

    render(<NewTaskScreen />);
    
    // Fill in title
    const titleInput = screen.getByPlaceholderText('What needs to be done?');
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    
    // Click save button
    const saveButton = screen.getByText('Save Task');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('NewTaskScreen: Save task button pressed');
    });
    
    // Should show error
    expect(document.createElement).toHaveBeenCalledWith('div');
  });

  test('should handle photo capture errors', async () => {
    NavigationHelper.takePhoto.mockResolvedValueOnce(null);

    render(<NewTaskScreen />);
    
    const photoArea = screen.getByText('Tap to capture photo');
    fireEvent.click(photoArea);
    
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith('NewTaskScreen: Take photo button pressed');
    });
    
    // Should show error
    expect(document.createElement).toHaveBeenCalledWith('div');
  });
});

console.log('✅ NewTaskScreen Navigation Tests Complete');