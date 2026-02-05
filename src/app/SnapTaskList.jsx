import React, { useState, useEffect, useMemo, memo } from 'react';
import { PageConfig, fleetboDB, Loader } from '@fleetbo';
import { Search, Image as ImageIcon, CheckCircle, Circle } from 'lucide-react';

// This component is memoized. It will only re-render if its `task` prop changes.
const TaskItem = memo(({ task }) => {
  return (
    <div className="list-group-item d-flex justify-content-between align-items-center p-3">
      <div className="d-flex align-items-center">
        {task.imageUrl ? (
          // Lazy loading is enabled via the native browser/webview attribute.
          <img
            src={task.imageUrl}
            alt="Task visual"
            className="rounded me-3"
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
            loading="lazy"
          />
        ) : (
          <div
            className="rounded me-3 bg-secondary d-flex align-items-center justify-content-center"
            style={{ width: '50px', height: '50px' }}
          >
            <ImageIcon size={24} className="text-white-50" />
          </div>
        )}
        <div>
          <h6 className={`mb-0 ${task.completed ? 'text-decoration-line-through text-muted' : ''}`}>
            {task.title}
          </h6>
          <small className="text-muted">{new Date(task.createdAt?.seconds * 1000).toLocaleDateString()}</small>
        </div>
      </div>
      {task.completed ? (
        <CheckCircle size={24} className="text-success" />
      ) : (
        <Circle size={24} className="text-muted" />
      )}
    </div>
  );
});

function SnapTaskList() {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Debounce search input to avoid excessive re-renders on every keystroke.
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce delay.

    // Cleanup function to cancel the timeout if the user types again.
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch initial data once when the component mounts.
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        // The Fleetbo SDK currently fetches all documents.
        // For server-side pagination (50 items), a native module or SDK update is needed.
        const taskDocs = await Fleetbo.getDocsG(fleetboDB, 'tasks');
        setTasks(taskDocs);
      } catch (error) {
        console.error("Fleetbo Engine Error: Failed to fetch tasks.", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    Fleetbo.onWebPageReady();
  }, []);

  // Memoize the filtering logic so it only runs when data or search term changes.
  const filteredTasks = useMemo(() => {
    if (!debouncedSearchTerm) {
      return tasks;
    }
    return tasks.filter(task =>
      task.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [tasks, debouncedSearchTerm]);

  // NOTE: For lists with thousands of items, the Fleetbo "YouTube Pattern"
  // using a native-driven list (Fleetbo.exec('NativeFeed', 'load')) is recommended
  // over a pure JS solution to guarantee 120FPS. This component implements
  // the requested JS-level optimizations.

  return (
    <>
      <PageConfig navbar="show" />
      <div className="container-fluid p-3">
        <div className="input-group mb-3">
          <span className="input-group-text bg-light border-0">
            <Search size={18} className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control bg-light border-0"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="list-group">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => <TaskItem key={task.id} task={task} />)
            ) : (
              <div className="text-center p-5 text-muted">
                <p>No tasks found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default SnapTaskList;
