import React from 'react';
import './App.css';
import UserManagement from './Components/UserLogin/UserManagement';
import { AuthProvider } from './Components/UserContext/UserContext';
import { EventsProvider } from './Components/EventsContext/EventsContext';
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
        <EventsProvider>
          <Routes>
            {/* MAKE SURE TO CHANGE BACK TO LOGIN here */}
            <Route path="/" element={<Navigate to="/calendar" replace />}/> 
            <Route path="/login" element={<UserManagement/>}></Route>
            <Route path="/register" element={<UserRegistration/>}></Route>

            <Route path="/calendar" element={<CalendarPage/>} />
            <Route path="/week" element={<WeekView/>} />
            <Route path="/day/:dayId" element={<DayView/>} />
          </Routes>
          </EventsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
