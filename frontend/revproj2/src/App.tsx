import React from 'react';
import './App.css';
import UserManagement from './Components/UserLogin/UserManagement';
import { AuthProvider } from './Components/UserContext/UserContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import UserRegistration from './Components/UserRegistration/UserRegistration';

// Import the pages we'll create:
import CalendarPage from './CalendarPage';
import DayView from './DayView';
import WeekView from './WeekView';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />}/>
          <Route path="/login" element={<UserManagement/>}></Route>
          <Route path="/register" element={<UserRegistration/>}></Route>
        </Routes>
        
      </AuthProvider>
    </div>
  );
}

export default App;
