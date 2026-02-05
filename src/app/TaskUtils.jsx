// @Fleetbo ModuleName: TaskUtils
// This file contains pure utility functions for task management.
// They are designed to be used with hooks like useMemo for performance.

/**
 * Performs a simple case-insensitive search on task titles.
 * @param {Array<Object>} tasks - The array of task objects, e.g., [{ title: '...' }].
 * @param {string} query - The search string.
 * @returns {Array<Object>} - Filtered tasks.
 */
export const searchTasks = (tasks, query) => {
  if (!query) {
    return tasks;
  }
  const lowercasedQuery = query.toLowerCase();
  return tasks.filter(task =>
    task.title && task.title.toLowerCase().includes(lowercasedQuery)
  );
};

/**
 * Filters tasks by their completion status.
 * @param {Array<Object>} tasks - The array of task objects, e.g., [{ done: true }].
 * @param {string} status - 'all', 'done', or 'pending'.
 * @returns {Array<Object>} - Filtered tasks.
 */
export const filterByStatus = (tasks, status) => {
  switch (status) {
    case 'done':
      return tasks.filter(task => task.completed);
    case 'pending':
      return tasks.filter(task => !task.completed);
    case 'all':
    default:
      return tasks;
  }
};

/**
 * Sorts tasks by a given key.
 * @param {Array<Object>} tasks - The array of task objects.
 * @param {string} sortBy - 'date', 'title', or 'status'.
 * @returns {Array<Object>} - A new array with sorted tasks.
 */
export const sortTasks = (tasks, sortBy) => {
  const sortedTasks = [...tasks]; // Create a shallow copy to avoid mutation
  switch (sortBy) {
    case 'date':
      // Assumes date is a timestamp or ISO string. Newest first.
      return sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    case 'title':
      return sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
    case 'status':
      // Sorts pending (false) before done (true)
      return sortedTasks.sort((a, b) => a.completed - b.completed);
    default:
      return tasks;
  }
};

/**
 * Groups tasks by date categories: Today, Yesterday, This Week, Older.
 * @param {Array<Object>} tasks - The array of task objects with a `date` property.
 * @returns {Object} - An object with keys for each date category.
 */
export const groupTasksByDate = (tasks) => {
  const groups = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  // Sunday is 0, so we adjust to make Monday the start of the week if needed.
  const dayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ...
  const startOfWeek = new Date(today);
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Monday as start

  tasks.forEach(task => {
    const taskDate = new Date(task.createdAt);
    const taskDay = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());

    if (taskDay.getTime() === today.getTime()) {
      groups.Today.push(task);
    } else if (taskDay.getTime() === yesterday.getTime()) {
      groups.Yesterday.push(task);
    } else if (taskDay >= startOfWeek) {
      groups['This Week'].push(task);
    } else {
      groups.Older.push(task);
    }
  });

  return groups;
};
