import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCreate from '../TaskCreate';
import { useCameraPermission } from '../../@fleetbo/hooks/useCameraPermission';
import { FLEETBO_DB_NAME, COLLECTIONS } from '../../@fleetbo/constants';

// Mock the Fleetbo global object
global.Fleetbo = {
  add: jest.fn(),
  openPage: jest.fn(),
  back: jest.fn(),
};

// Mock the useCameraPermission hook
jest.mock('../../@fleetbo/hooks/useCameraPermission', () => ({
  useCameraPermission: jest.fn(),
  PERMISSION_STATES: {
    GRANTED: 'granted',
    DENIED: 'denied',
    CHECKING: 'checking',
  },
}));

describe('TaskCreate', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    useCameraPermission.mockReturnValue({
      requestPermission: jest.fn(() => Promise.resolve(true)),
      takePhoto: jest.fn(() => Promise.resolve('mock-photo-uri')),
      isGranted: true,
      permissionState: 'granted',
      isLoading: false,
    });
  });

  test('renders TaskCreate component correctly', () => {
    render(<TaskCreate />);
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
    expect(screen.getByLabelText('Task Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Take Photo')).toBeInTheDocument();
    expect(screen.getByText('Save Task')).toBeInTheDocument();
  });

  test('updates title and description on input change', () => {
    render(<TaskCreate />);
    const titleInput = screen.getByLabelText('Task Title');
    const descriptionInput = screen.getByLabelText('Description');

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    expect(titleInput.value).toBe('Test Task');
    expect(descriptionInput.value).toBe('Test Description');
  });

  test('calls handleTakePhoto and displays photo if granted', async () => {
    const mockTakePhoto = jest.fn(() => Promise.resolve('mock-photo-uri'));
    useCameraPermission.mockReturnValue({
      requestPermission: jest.fn(() => Promise.resolve(true)),
      takePhoto: mockTakePhoto,
      isGranted: true,
      permissionState: 'granted',
      isLoading: false,
    });

    render(<TaskCreate />);
    fireEvent.click(screen.getByText('Take Photo'));

    await waitFor(() => {
      expect(mockTakePhoto).toHaveBeenCalled();
      expect(screen.getByAltText('Captured')).toHaveAttribute('src', 'mock-photo-uri');
    });
  });

  test('shows alert if camera permission is denied and take photo is attempted', async () => {
    const mockRequestPermission = jest.fn(() => Promise.resolve(false));
    useCameraPermission.mockReturnValue({
      requestPermission: mockRequestPermission,
      takePhoto: jest.fn(),
      isGranted: false,
      permissionState: 'denied',
      isLoading: false,
    });

    window.alert = jest.fn(); // Mock alert

    render(<TaskCreate />);
    fireEvent.click(screen.getByText('Take Photo'));

    await waitFor(() => {
      expect(mockRequestPermission).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith('Camera permission denied. Please grant permission in settings.');
    });
  });

  test('calls Fleetbo.add and navigates to tasklist on successful save', async () => {
    render(<TaskCreate />);
    const titleInput = screen.getByLabelText('Task Title');
    const descriptionInput = screen.getByLabelText('Description');
    const saveButton = screen.getByText('Save Task');

    fireEvent.change(titleInput, { target: { value: 'New Task Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'New Task Description' } });

    fireEvent.click(screen.getByText('Take Photo')); // Simulate taking a photo
    await waitFor(() => expect(screen.getByAltText('Captured')).toBeInTheDocument());

    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.Fleetbo.add).toHaveBeenCalledWith(
        FLEETBO_DB_NAME,
        COLLECTIONS.USER_TASKS,
        expect.objectContaining({
          title: 'New Task Title',
          description: 'New Task Description',
          photoUri: 'mock-photo-uri',
          isCompleted: false,
        })
      );
      expect(global.Fleetbo.openPage).toHaveBeenCalledWith('tasklist');
      expect(window.alert).toHaveBeenCalledWith('Task saved successfully!');
    });
  });

  test('shows alert if title is empty on save', async () => {
    window.alert = jest.fn(); // Mock alert
    render(<TaskCreate />);
    fireEvent.click(screen.getByText('Save Task'));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Task title cannot be empty.');
      expect(global.Fleetbo.add).not.toHaveBeenCalled();
    });
  });

  test('calls Fleetbo.back when the back button is clicked', () => {
    render(<TaskCreate />);
    fireEvent.click(screen.getByRole('button', { name: /TaskCreate/i })); // Click the header back button
    expect(global.Fleetbo.back).toHaveBeenCalled();
  });
});
