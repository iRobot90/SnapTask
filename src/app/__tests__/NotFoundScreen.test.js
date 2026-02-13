// NotFoundScreen.test.js - NotFoundScreen Go Home Button Tests
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NotFoundScreen from '../NotFoundScreen';

// Mock Fleetbo object
const mockFleetbo = {
  onWebPageReady: jest.fn(),
  toHome: jest.fn(),
  back: jest.fn()
};

global.Fleetbo = mockFleetbo;
global.window = global.window || {};
global.window.Fleetbo = mockFleetbo;

// Mock NavigationHelper
jest.mock('../NavigationHelper', () => ({
  signalPageReady: jest.fn(),
  goToHome: jest.fn(),
  handleBackButton: jest.fn()
}));

const NavigationHelper = require('../NavigationHelper');

// Mock alert
global.alert = jest.fn();

describe('NotFoundScreen Navigation Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render NotFoundScreen component correctly', () => {
    render(<NotFoundScreen />);
    
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found.')).toBeInTheDocument();
    expect(screen.getByText('Go Home')).toBeInTheDocument();
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });

  test('should signal page ready on mount', () => {
    render(<NotFoundScreen />);
    
    expect(NavigationHelper.signalPageReady).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('NotFoundScreen: Component mounted');
  });

  test('should navigate to home when Go Home button is clicked', () => {
    render(<NotFoundScreen />);
    
    const goHomeButton = screen.getByText('Go Home');
    fireEvent.click(goHomeButton);
    
    expect(NavigationHelper.goToHome).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('NotFoundScreen: Go Home button pressed');
    expect(console.log).toHaveBeenCalledWith('Calling NavigationHelper.goToHome()');
    expect(console.log).toHaveBeenCalledWith('Fleetbo object exists:', true);
    expect(console.log).toHaveBeenCalledWith('NotFoundScreen: Navigation to Core initiated');
  });

  test('should handle back button when Go Back button is clicked', () => {
    render(<NotFoundScreen />);
    
    const goBackButton = screen.getByText('Go Back');
    fireEvent.click(goBackButton);
    
    expect(NavigationHelper.handleBackButton).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('NotFoundScreen: Back button pressed');
  });

  test('should show alert when goToHome fails', () => {
    const mockError = new Error('Navigation failed');
    NavigationHelper.goToHome.mockImplementationOnce(() => {
      throw mockError;
    });

    render(<NotFoundScreen />);
    
    const goHomeButton = screen.getByText('Go Home');
    fireEvent.click(goHomeButton);
    
    expect(NavigationHelper.goToHome).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith('NotFoundScreen: Navigation error:', mockError);
    expect(global.alert).toHaveBeenCalledWith('Navigation Error: Unable to navigate to home. Please restart app.');
  });

  test('should log Fleetbo object status correctly', () => {
    render(<NotFoundScreen />);
    
    const goHomeButton = screen.getByText('Go Home');
    fireEvent.click(goHomeButton);
    
    expect(console.log).toHaveBeenCalledWith('Fleetbo object exists:', true);
  });

  test('should detect when Fleetbo object does not exist', () => {
    delete global.window.Fleetbo;
    
    render(<NotFoundScreen />);
    
    const goHomeButton = screen.getByText('Go Home');
    fireEvent.click(goHomeButton);
    
    expect(console.log).toHaveBeenCalledWith('Fleetbo object exists:', false);
    expect(NavigationHelper.goToHome).not.toHaveBeenCalled();
  });
});

describe('404 Error Recovery Integration Tests', () => {
  test('should complete 404 recovery flow successfully', () => {
    console.log('Testing 404 error recovery integration...');
    
    render(<NotFoundScreen />);
    
    // Step 1: User clicks Go Home
    const goHomeButton = screen.getByText('Go Home');
    fireEvent.click(goHomeButton);
    
    // Verify home navigation
    expect(NavigationHelper.goToHome).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('NotFoundScreen: Navigation to Core initiated');
    
    // Step 2: User clicks Go Back instead
    const goBackButton = screen.getByText('Go Back');
    fireEvent.click(goBackButton);
    
    // Verify back navigation
    expect(NavigationHelper.handleBackButton).toHaveBeenCalled();
    
    console.log('✅ 404 error recovery integration test passed');
  });

  test('should handle multiple consecutive navigation attempts', () => {
    render(<NotFoundScreen />);
    
    // Multiple rapid clicks on Go Home
    const goHomeButton = screen.getByText('Go Home');
    fireEvent.click(goHomeButton);
    fireEvent.click(goHomeButton);
    fireEvent.click(goHomeButton);
    
    // Should call goToHome for each click
    expect(NavigationHelper.goToHome).toHaveBeenCalledTimes(3);
    
    // Multiple rapid clicks on Go Back
    const goBackButton = screen.getByText('Go Back');
    fireEvent.click(goBackButton);
    fireEvent.click(goBackButton);
    
    expect(NavigationHelper.handleBackButton).toHaveBeenCalledTimes(2);
    
    console.log('✅ Multiple navigation attempts test passed');
  });
});

console.log('✅ NotFoundScreen Navigation Tests Complete');