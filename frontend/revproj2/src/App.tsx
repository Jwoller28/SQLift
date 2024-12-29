import React from 'react';
import './App.css';
import UserManagement from './Components/UserLogin/UserManagement';
import { AuthProvider } from './Components/UserContext/UserContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import UserRegistration from './Components/UserRegistration/UserRegistration';
import SetUserGoals from './Components/SetUserGoals/SetUserGoals';
import LoginLandingPage from './Components/UserLogin/LoginLandingPage';
import NutritionApi from './Components/NutritionApi/NutritionApi';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />}/>
          <Route path="/login" element={<UserManagement/>}></Route>
          <Route path="/register" element={<UserRegistration/>}></Route>
          <Route path="/goals" element={<SetUserGoals/>}></Route>
          <Route path="/login/page" element={<LoginLandingPage/>}></Route>
          <Route path="/nutriapi" element={<NutritionApi/>}></Route>
        </Routes>
        
      </AuthProvider>
    </div>
  );
}

export default App;
