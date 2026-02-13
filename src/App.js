import React from 'react';
import { Routes, Route } from "react-router-dom";

import Home from './app/Home';
import TaskList from './app/TaskList';
import CreateTask from './app/CreateTask';
import TaskDetail from './app/TaskDetail';
import Camera from './app/Camera';
import Profile from './app/Profile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/tasklist" element={<TaskList />} />
      <Route path="/createtask" element={<CreateTask />} />
      <Route path="/taskdetail/:id" element={<TaskDetail />} />
      <Route path="/camera" element={<Camera />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}

export default App;
