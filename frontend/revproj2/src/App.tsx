import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import './App.css';

// Import the pages we'll create:
import CalendarPage from './CalendarPage';
import DayView from './DayView';
import WeekView from './WeekView';

function App() {
  return (
    <Router>
      <div>
        <nav style={{ padding: '10px', background: '#ccc' }}>
          <Link to="/" style={{ marginRight: '20px' }}>Home (Calendar)</Link>
          <Link to="/week">Weekly View</Link>
        </nav>

        <Routes>
          {/* The main CalendarPage at path="/" */}
          <Route path="/" element={<CalendarPage />} />

          {/* WeekView at /week */}
          <Route path="/week" element={<WeekView />} />

          {/* DayView at /day/:dayId (e.g. /day/5 for the 5th of the month) */}
          <Route path="/day/:dayId" element={<DayView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
