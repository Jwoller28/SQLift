import React from 'react';
import './App.css';
import UserManagement from './Components/UserLogin/UserManagement';
import { AuthProvider } from './Components/UserContext/UserContext';
import { EventsProvider } from './Components/EventsContext/EventsContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import UserRegistration from './Components/UserRegistration/UserRegistration';

import ProgressPage from './Calendar/ProgressPage';
import InputPage from './Calendar/InputPage';
import CalendarPage from './Calendar/CalendarPage';
import DayView from './Calendar/DayView';
import WeekView from './Calendar/WeekView';
import SetUserGoals from './Components/SetUserGoals/SetUserGoals';
import LoginLandingPage from './Components/UserLogin/LoginLandingPage';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <EventsProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />}/> 
            <Route path="/login" element={<UserManagement/>}></Route>
            <Route path="/register" element={<UserRegistration/>}></Route>
            <Route path="/goals" element={<SetUserGoals/>}></Route>
            <Route path="/login/page" element={<LoginLandingPage/>}></Route>

            <Route path="/calendar" element={<CalendarPage/>} />
            <Route path="/week" element={<WeekView/>} />
            <Route path="/day/:dayId" element={<DayView/>} />
            <Route path="/input/:dayId" element={<InputPage/>} />
            <Route path="/progress/:dayId" element={<ProgressPage/>} />

          </Routes>
          </EventsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
