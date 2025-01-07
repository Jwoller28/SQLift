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
import SetUserGoals from './Components/SetUserGoals/SetUserGoals';
import PostList from './Components/PostFeed/PostList';
import Inbox from './Components/Inbox/Inbox';
import RouteGuard from './Components/RouteGuard/RouteGuard';
import UserProfile from './Components/UserProfile/UserProfile';
import ResetGoals from './Components/SetUserGoals/ResetGoals';

function App() {
  return (
    <div className="App">
      <AuthProvider>

        <EventsProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<UserManagement/>}></Route>
            <Route path="/register" element={<UserRegistration />}></Route>
            <Route path="/resetGoals" element={<ResetGoals />} />
            
            <Route path="/goals" element={
              <RouteGuard>
                <SetUserGoals />
              </RouteGuard>
              }></Route>

            <Route path="/calendar" element={
              <RouteGuard>
                <CalendarPage />
              </RouteGuard>} />

            <Route path="/input/:dayId" element={
              <RouteGuard>
                <InputPage />
              </RouteGuard>} />

            <Route path="/progress/:dayId" element={
              <RouteGuard>
                <ProgressPage />
              </RouteGuard>} />

	      <Route path="/feed" element={<PostList />} />
	      <Route path="/inbox" element={<Inbox />}/>
              <Route path="/profile" element={<RouteGuard><UserProfile/></RouteGuard>}></Route>
          </Routes>
        </EventsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
