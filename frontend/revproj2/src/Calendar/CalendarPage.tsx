import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  // We'll store everything we need here:
  const [token, setToken] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(null);

  // The “end date” (or dates) from the user’s goal
  const [goalDate, setGoalDate] = useState<string | null>(null);

  // A dictionary that maps date strings ("YYYY-MM-DD") to a status.
  // We’ll populate it dynamically after fetching the goal date.
  const [taskStatuses, setTaskStatuses] = useState<{ [key: string]: string }>({});

  // For building the calendar
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based in JS
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Build an array of days (with null for blank cells in the grid)
  const calendarCells: Array<number | null> = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  // ---------------------------------------------
  // 1) On mount, get token from localStorage
  // ---------------------------------------------
  useEffect(() => {
    const rawToken = localStorage.getItem('token');
    if (rawToken) {
      // If you stored the token as a raw string, do: setToken(rawToken);
      // If you did JSON.stringify, parse it:
      setToken(JSON.parse(rawToken));
    }
  }, []);

  // ---------------------------------------------
  // 2) Once we have token, fetch /me => username
  // ---------------------------------------------
  useEffect(() => {
    if (!token) return;
    const fetchMe = async () => {
      try {
        const res = await fetch('http://localhost:8080/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`GET /me failed: ${res.status}`);
        }
        const name = await res.text();
        setUsername(name);
      } catch (err) {
        console.error('Error fetching /me:', err);
      }
    };
    fetchMe();
  }, [token]);

  // ---------------------------------------------
  // 3) Once we have username, get user object => userId
  // ---------------------------------------------
  useEffect(() => {
    if (!username || !token) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:8080/username/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`GET /username/${username} failed: ${res.status}`);
        }
        const userObj = await res.json();
        setUserId(userObj.id);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchUser();
  }, [username, token]);

  // ---------------------------------------------
  // 4) Once we have userId, fetch the user’s goal => get the “end date”
  // ---------------------------------------------
  useEffect(() => {
    if (!userId || !token) return;
    const fetchGoal = async () => {
      try {
        const res = await fetch(`http://localhost:8080/goalUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`GET /goalUser/${userId} failed: ${res.status}`);
        }
        const goalObj = await res.json();
        
        // Suppose your goal object might have "sleepDate" or "waterDate" etc.
        // We'll pick one as the "end date" to highlight:
        if (goalObj.sleepDate) {
          // often we get something like "2025-01-29T00:00:00" from the backend
          // let's substring(0,10) to get "2025-01-29"
          const dateOnly = goalObj.sleepDate.substring(0, 10);
          setGoalDate(dateOnly);
        }
      } catch (err) {
        console.error('Error fetching goal:', err);
      }
    };
    fetchGoal();
  }, [userId, token]);

  // ---------------------------------------------
  // 5) If we have a goalDate, store it in taskStatuses with "end_date"
  // ---------------------------------------------
  useEffect(() => {
    if (goalDate) {
      setTaskStatuses(prev => ({
        ...prev,
        [goalDate]: 'end_date',
      }));
    }
  }, [goalDate]);

  // ---------------------------------------------
  // 6) Color coding logic
  // ---------------------------------------------
  const getDayColor = (dayId: string) => {
    // If user has "missed" or "completed" statuses, you can set those too
    const status = taskStatuses[dayId];
    if (status === 'missed') return '#ff0000';    // Red
    if (status === 'end_date') return '#800080';  // Purple
    if (status === 'completed') return '#008000'; // Green

    // highlight today in yellow
    if (dayId === todayFormatted) return '#FFEB3B'; 
    return '#0080ff'; // Default blue
  };

  // Today's date in YYYY-MM-DD
  const today = new Date();
  const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  // When user clicks a day in the calendar
  const handleDayClick = (dayNumber: number) => {
    const formattedDay = String(dayNumber).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    const dayId = `${year}-${formattedMonth}-${formattedDay}`; // "YYYY-MM-DD"

    // Compare date with "today" to decide if it’s future or not
    const clickedDate = new Date(year, month, dayNumber);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // zero out time

    if (clickedDate > now) {
      // Future date => progress page
      navigate(`/progress/${dayId}`);
    } else {
      // Past or today => input page
      navigate(`/input/${dayId}`);
    }
  };

  // Month navigation
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Example placeholders
  const goToFeed = () => {/* navigate('/feed'); */};
  const goToProfile = () => {navigate("/profile")};
  const goToInbox = () => {/* navigate('/inbox'); */};
  const goToGoals = () => {/* navigate('/goals'); */};

  // ---------------------------------------------
  // Render the calendar
  // ---------------------------------------------
  return (
    <div
      style={{
        padding: '0px',
        background: 'linear-gradient(to bottom, #3370ff, #ADD8E6)',
        color: '#000000',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 0
      }}
    >
      <h1
        style={{
          fontFamily: 'Arial, sans-serif',
          color: '#ffffff',
          fontSize: '50px'
        }}
      >
        {currentDate.toLocaleString('default', { month: 'long' })} {year}
      </h1>

      {/* Example nav buttons */}
      <div style={{ marginBottom: '20px', backgroundColor: '#000' }}>
        <button
          onClick={goToFeed}
          style={{
            padding: '10px 10px',
            backgroundColor: '#2282ff',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            margin: '5px'
          }}
        >
          Feed
        </button>

        <button
          onClick={goToPrevMonth}
          style={{
            padding: '10px 10px',
            backgroundColor: '#2282ff',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            margin: '5px'
          }}
        >
          Prev Month
        </button>

        <button
          onClick={goToNextMonth}
          style={{
            padding: '10px 10px',
            backgroundColor: '#2282ff',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            margin: '5px'
          }}
        >
          Next Month
        </button>

        <button
          onClick={goToGoals}
          style={{
            padding: '10px 10px',
            backgroundColor: '#2282ff',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            margin: '5px'
          }}
        >
          Goals
        </button>

        <button
          onClick={goToInbox}
          style={{
            padding: '10px 10px',
            backgroundColor: '#2282ff',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            margin: '5px'
          }}
        >
          Inbox
        </button>

        <button
          onClick={goToProfile}
          style={{
            padding: '10px 10px',
            backgroundColor: '#2282ff',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            margin: '5px'
          }}
        >
          Profile
        </button>
      </div>

      {/* Calendar Grid */}
      <div
        style={{
          backgroundColor: 'black',
          padding: '20px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 100px)',
            gap: '10px',
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#ffffff'
          }}
        >
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 100px)',
            gap: '10px'
          }}
        >
          {calendarCells.map((cell, index) => {
            if (cell === null) {
              return (
                <div
                  key={index}
                  style={{
                    height: '100px',
                    border: '1px solid #ccc',
                    background: '#b0c4de'
                  }}
                />
              );
            } else {
              const formattedDay = String(cell).padStart(2, '0');
              const formattedMonth = String(month + 1).padStart(2, '0');
              const dayId = `${year}-${formattedMonth}-${formattedDay}`;
              const backgroundColor = getDayColor(dayId);

              return (
                <div
                  key={index}
                  onClick={() => handleDayClick(cell)}
                  style={{
                    height: '100px',
                    border: '1px solid #000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: backgroundColor,
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    transition: 'background 0.3s, transform 0.2s'
                  }}
                >
                  {cell}
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
