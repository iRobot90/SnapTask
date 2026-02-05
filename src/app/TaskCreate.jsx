import { useEffect, useState } from 'react';
function TaskCreate() {
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  useEffect(() => {
    Fleetbo.log('TaskCreate');
    Fleetbo.onWebPageReady();
    // Listen for camera result
    Fleetbo.on('PHOTO_CAPTURED', (data) => {
      setPhotoUri(data.uri);
    });
    return () => Fleetbo.off('PHOTO_CAPTURED');
  }, []);

  useEffect(() => {
    Fleetbo.on('IMAGE_PROCESSED', (data) => {
      setPhotoUri(data.fullUri); // Use optimized image
    });

    return () => Fleetbo.off('IMAGE_PROCESSED');
  }, []);

  const openCamera = () => {
    Fleetbo.exec('CameraModule', 'openCamera', { quality: 'high', facing: 'back' });
  };

  const requestCameraPermission = () => {
    Fleetbo.exec('PermissionModule', 'requestCamera', {});

    Fleetbo.on('PERMISSION_GRANTED', () => {
      openCamera();
    });

    Fleetbo.on('PERMISSION_DENIED', () => {
      alert('Camera permission is required to attach photos');
    });
  };

  const saveTask = () => {
    const taskData = {
      title: taskTitle,
      description: taskDescription,
      photoUri,
      createdAt: new Date().toISOString(),
      completed: false
    };
    if (photoUri) {
      Fleetbo.addWithLastSelectedImage('Tasks', 'UserTasks', taskData);
    } else {
      Fleetbo.addWithUserId('Tasks', 'UserTasks', taskData);
    }
    Fleetbo.back();
  };
  return (
    <div className="task-create">
      <button onClick={() => Fleetbo.back()}>← Back</button>

      <input
        type="text"
        placeholder="Task Title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
      />
      <button onClick={requestCameraPermission}>📷 Attach Photo</button>
      {photoUri && <img src={photoUri} alt="Preview" style={{ maxWidth: '200px' }} />}
      <button onClick={saveTask} disabled={!taskTitle}>Save Task</button>
    </div>
  );
}
export default TaskCreate;