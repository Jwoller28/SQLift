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
import NavBar from './Components/NavBar/NavBar';
import Logout from './Components/Logout/Logout';

function App() {
  return (
    <div className="App">
      <AuthProvider>

        <EventsProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<UserManagement/>}></Route>
            <Route path="/register" element={<UserRegistration />}></Route>
            <Route path="/logout" element={<Logout />}></Route>

            <Route path="/resetGoals" element={
              <RouteGuard>
                <NavBar/><ResetGoals />
              </RouteGuard>} />
            
            <Route path="/goals" element={
              <RouteGuard>
                <NavBar/><SetUserGoals />
              </RouteGuard>
              }></Route>

            <Route path="/calendar" element={
              <RouteGuard>
                <NavBar/><CalendarPage />
              </RouteGuard>} />

            <Route path="/input/:dayId" element={
              <RouteGuard>
                <NavBar/><InputPage />
              </RouteGuard>} />

            <Route path="/progress/:dayId" element={
              <RouteGuard>
                <NavBar/><ProgressPage />
              </RouteGuard>} />

	          <Route path="/feed" element={
              <RouteGuard>
                <NavBar/><PostList />
              </RouteGuard>}/>

	          <Route path="/inbox" element={
              <RouteGuard>
                <NavBar/><Inbox />
              </RouteGuard>}/>

            <Route path="/profile" element={
              <RouteGuard>
                <NavBar/><UserProfile/>
              </RouteGuard>}/>

          </Routes>
        </EventsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
