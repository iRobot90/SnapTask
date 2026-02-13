// CoreScreen.test.js - CoreScreen Navigation Tests
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CoreScreen from '../CoreScreen';

// Mock Fleetbo object
const mockFleetbo = {
  onWebPageReady: jest.fn(),
  openPage: jest.fn(),
  toHome: jest.fn()
};

global.Fleetbo = mockFleetbo;
global.window = global.window || {};
global.window.Fleetbo = mockFleetbo;

// Mock NavigationHelper
jest.mock('../NavigationHelper', () => ({
  signalPageReady: jest.fn(),
  goToTaskList: jest.fn(),
  goToNewTask: jest.fn(),
  goToProfile: jest.fn()
}));

const NavigationHelper = require('../NavigationHelper');

describe('CoreScreen Navigation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render CoreScreen component correctly', () => {
    render(<CoreScreen />);
    
    expect(screen.getByText('SnapTask')).toBeInTheDocument();
    expect(screen.getByText('Offline-First Task Manager with Camera Integration')).toBeInTheDocument();
    expect(screen.getByText('View My Tasks')).toBeInTheDocument();
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByText('View Profile')).toBeInTheDocument();
  });

  test('should signal page ready on mount', () => {
    render(<CoreScreen />);
    
    expect(NavigationHelper.signalPageReady).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('CoreScreen: Component mounted');
  });

  test('should navigate to TaskList when View My Tasks is clicked', () => {
    render(<CoreScreen />);
    
    const viewTasksButton = screen.getByText('View My Tasks');
    fireEvent.click(viewTasksButton);
    
    expect(NavigationHelper.goToTaskList).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('CoreScreen: View My Tasks button pressed');
  });

  test('should navigate to NewTask when Create New Task is clicked', () => {
    render(<CoreScreen />);
    
    const createTaskButton = screen.getByText('Create New Task');
    fireEvent.click(createTaskButton);
    
    expect(NavigationHelper.goToNewTask).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('CoreScreen: Create New Task button pressed');
  });

  test('should navigate to Profile when View Profile is clicked', () => {
    render(<CoreScreen />);
    
    const profileButton = screen.getByText('View Profile');
    fireEvent.click(profileButton);
    
    expect(NavigationHelper.goToProfile).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('CoreScreen: View Profile button pressed');
  });

  test('should show error alert when NavigationHelper.goToTaskList throws error', () => {
    const mockError = new Error('Navigation failed');
    NavigationHelper.goToTaskList.mockImplementationOnce(() => {
      throw mockError;
    });

    // Mock alert
    global.alert = jest.fn();

    render(<CoreScreen />);
    
    const viewTasksButton = screen.getByText('View My Tasks');
    fireEvent.click(viewTasksButton);
    
    expect(NavigationHelper.goToTaskList).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith('CoreScreen: Navigation error:', mockError);
    expect(global.alert).toHaveBeenCalledWith('Navigation Error: Unable to open task list. Please try again.');
  });
});

console.log('✅ CoreScreen Navigation Tests Complete');