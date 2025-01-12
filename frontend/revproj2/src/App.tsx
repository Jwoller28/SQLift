import React from 'react';
import './App.css';
import UserManagement from './Components/UserLogin/UserManagement';
import { AuthProvider } from './Components/UserContext/UserContext';
import { EventsProvider } from './Components/EventsContext/EventsContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import UserRegistration from './Components/UserRegistration/UserRegistration';
import { GroupProvider } from './Components/GroupContext/GroupContext';
import ProgressPage from './Calendar/ProgressPage';
import InputPage from './Calendar/InputPage';
import CalendarPage from './Calendar/CalendarPage';
import GroupPage from './Calendar/GroupPage';
import DayView from './Calendar/DayView';
import WeekView from './Calendar/WeekView';
import CreateEventPage from './Calendar/CreateEventPage';
import SetUserGoals from './Components/SetUserGoals/SetUserGoals';
import PostList from './Components/PostFeed/PostList';
import Inbox from './Components/Inbox/Inbox';
import RouteGuard from './Components/RouteGuard/RouteGuard';
import UserProfile from './Components/UserProfile/UserProfile';
import ResetGoals from './Components/SetUserGoals/ResetGoals';
import NavBar from './Components/NavBar/NavBar';
import Logout from './Components/Logout/Logout';
import MakeNewGoal from './Components/SetUserGoals/MakeNewGoal';

function App() {
  return (
    <div className="App">
      <AuthProvider>

        <EventsProvider>
          <GroupProvider>
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
                  <SetUserGoals />
                </RouteGuard>
                }></Route>

                <Route path="/newGoal" element={
                  <RouteGuard>
                    <MakeNewGoal />
                  </RouteGuard>
                }></Route>
              
              <Route path="/createEvent/:dayId" element={
                <RouteGuard>
                  <CreateEventPage />
                </RouteGuard>
                }></Route>  

              <Route path="/calendar" element={
                <RouteGuard>
                  <NavBar/><CalendarPage />
                </RouteGuard>} />

                <Route path="/groups" element={
                <RouteGuard>
                  <NavBar/><GroupPage />
                </RouteGuard>} />

                <Route path="/day/:dayId" element={
                <RouteGuard>
                  <NavBar/><DayView />
                </RouteGuard>} />

                <Route path="/Week" element={
                <RouteGuard>
                  <NavBar/><WeekView />
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
          </GroupProvider>
        </EventsProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
