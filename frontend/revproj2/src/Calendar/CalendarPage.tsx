import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../Components/EventsContext/EventsContext';
import { useGroups } from '../Components/GroupContext/GroupContext';

function CalendarPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  // If you track user ID, token, etc. (some of this logic you already have):
  const [token, setToken] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(null);

  // For your start/end date logic
  const [goalDate, setGoalDate] = useState<string | null>(null);
  const [StartDate, setStartDate] = useState<string | null>(null);
  const [goalCheck, setGoalCheck] = useState<Boolean | null>(false);

  // A dictionary that maps date "YYYY-MM-DD" => "end_date" or "start_date" or "completed"
  const [taskStatuses, setTaskStatuses] = useState<{ [key: string]: string }>({});

  // Build the month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-based
  const firstDayOfMonth = new Date(year, month, 1);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // e.g. Sunday=0
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Build an array of (null or dayNumber)
  const calendarCells: Array<number | null> = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  // ---------------------
  //  Token / me logic
  // ---------------------
  useEffect(() => {
    const rawToken = localStorage.getItem('token');
    if (rawToken) {
      setToken(JSON.parse(rawToken));
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchMe = async () => {
      try {
        const res = await fetch('http://18.221.145.66:8080/me', {
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

  useEffect(() => {
    if (!username || !token) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://18.221.145.66:8080/username/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`GET /username/${username} failed: ${res.status}`);
        }
        const userObj = await res.json();
        setUserId(userObj.id);
        localStorage.setItem('id', userObj.id);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    fetchUser();
  }, [username, token]);

  useEffect(() => {
    if (!userId || !token) return;
    const fetchGoal = async () => {
      try {
        const res = await fetch(`http://18.221.145.66:8080/goalUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`GET /goalUser/${userId} failed: ${res.status}`);
        }
        const goalObj = await res.json();
        setGoalCheck(true);
        if (goalObj.createdAt) {
          const today = new Date();
          const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
          setStartDate(todayFormatted);
        }
        if (goalObj.sleepDate) {
          const dateOnlyEnd = goalObj.sleepDate.substring(0, 10);
          setGoalDate(dateOnlyEnd);
        }
      } catch (err) {
        console.error('Error fetching goal:', err);
      }
    };
    fetchGoal();
  }, [userId, token]);

  useEffect(() => {
    if(goalCheck == true){
      const today = new Date();
      const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const checkEnd = goalDate && todayFormatted ? new Date(todayFormatted) >= new Date(goalDate) : false; 
      if(checkEnd){ navigate('/newGoal') }
      setGoalCheck(false);
    }
  },[goalCheck]);

  // If we have goal start/end, mark them in taskStatuses
  useEffect(() => {
    if (goalDate) {
      setTaskStatuses((prev) => ({
        ...prev,
        [goalDate]: 'end_date',
      }));
    }
  }, [goalDate]);

  useEffect(() => {
    if (StartDate) {
      setTaskStatuses((prev) => ({
        ...prev,
        [StartDate]: 'start_date',
      }));
    }
  }, [StartDate]);

  // If we have "completed" in localStorage
  useEffect(() => {
    const newStatuses = { ...taskStatuses };
    if (!userId) {
      setTaskStatuses(newStatuses);
      return;
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const formattedDay = String(i).padStart(2, '0');
      const formattedMonth = String(month + 1).padStart(2, '0');
      const dayId = `${year}-${formattedMonth}-${formattedDay}`;
      const key = `completed_${userId}_${dayId}`;
      if (localStorage.getItem(key) === 'true') {
        newStatuses[dayId] = 'completed';
      }
    }
    setTaskStatuses(newStatuses);
  }, [year, month, userId]);

  // ---------------------------
  // Merge personal & group events => color code days
  // ---------------------------
  const { getAllGroupEventsForDay } = useGroups();
  const { fetchPersonalEvents, events: personalEvents } = useEvents(); // all personal events in memory

  // We'll store which day has ANY event in a set
  const [daysWithAnyEvents, setDaysWithAnyEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (userId && token) {
      fetchPersonalEvents();
    }
  }, [userId, token, fetchPersonalEvents]);

  useEffect(() => {
    if (!userId) return;

    // We'll build up a new Set of dayIds that have personal or group events
    const newSet = new Set<string>();

    // 1) Mark personal events day
    personalEvents.forEach((evt) => {
      newSet.add(evt.day);
    });

    // 2) For each day in the month, also check group events
    const gatherGroupDays = async () => {
      for (let i = 1; i <= daysInMonth; i++) {
        const dayId = `${year}-${(month + 1).toString().padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const groupEvts = await getAllGroupEventsForDay(dayId, userId);
        if (groupEvts.length > 0) {
          newSet.add(dayId);
        }
      }
      setDaysWithAnyEvents(newSet);
    };
    gatherGroupDays();
  }, [userId, personalEvents, year, month, daysInMonth, getAllGroupEventsForDay]);

  // Color logic:
  const today = new Date();
  const todayFormatted = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;

  function getDayColor(dayId: string): string {
    const status = taskStatuses[dayId];
    // if day has ANY event (personal or group)
    const hasAny = daysWithAnyEvents.has(dayId);

    // If you also want to preserve your start_date, end_date, completed logic:
    if (dayId === todayFormatted) {
      if (status === 'completed') return '#4CAF50'; // Green
      return '#0099FF'; // today
    }

    if (status === 'end_date' || status === 'start_date'){
      return '#C613D0'; // end or start
    }
    if (status === 'completed') {
      return '#4CAF50'; // green
    }
    if (hasAny) {
      // color for any user event
      return '#DC143C';
    }
    // default
    return '#3C3C3C';
  }

  // --------------------------
  // Day click => always goes to /day/:dayId
  // The DayView will handle "Input" vs "Progress" buttons.
  // --------------------------
  function handleDayClick(dayNumber: number) {
    const formattedDay = String(dayNumber).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    const dayId = `${year}-${formattedMonth}-${formattedDay}`;
    navigate(`/day/${dayId}`);
  }

  // --------------------------
  // Month Navigation
  // --------------------------
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };




  return (
    <div
      style={{
        padding: '0px',
        background: 'linear-gradient(135deg, #ff6bcb, #504dff)', // background
        color: '#000000',
        minHeight: '110vh',
        display: 'flex',
        // justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        margin: 0,
        
      }}
    >
      <h1
        style={{
          fontFamily: 'Arial, sans-serif',
          color: '#ffffff',
          fontSize: '50px',
          marginTop: 10,
        }}
      >
        {currentDate.toLocaleString('default', { month: 'long' })} {year}
      </h1>

      <div
        style={{
          marginBottom: '20px',
          background: 'linear-gradient(to bottom, #2F2F2F , #2F2F2F )',
          padding: '10px',
          borderRadius: '10px',
          minWidth: '350px',
        }}
      >
        <button
          onClick={goToPrevMonth}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0099FF',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            margin: '10px',
            borderRadius: '10px',
            fontSize: '18px',
          }}
        >
          Prev Month
        </button>

        <button
          onClick={goToNextMonth}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0099FF',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            margin: '10px',
            borderRadius: '10px',
            fontSize: '18px',
          }}
        >
          Next Month
        </button>
      </div>

      <div
        style={{
          // backgroundColor: '#757073',
          background: 'linear-gradient(to bottom, #2F2F2F , #1A1A1A )',
          padding: '20px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
            color: '#ffffff',
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
            gap: '10px',
          }}
        >
          {calendarCells.map((cell, index) => {
            if (cell === null) {
              // empty cell for pre-month offset
              return (
                <div
                  key={index}
                  style={{
                    height: '100px',
                    border: '1px solid #ccc',
                    background: '#b0c4de',
                  }}
                />
              );
            } else {
              const dayStr = String(cell).padStart(2, '0');
              const monthStr = String(month + 1).padStart(2, '0');
              const dayId = `${year}-${monthStr}-${dayStr}`;
              const bgColor = getDayColor(dayId);

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
                    background: bgColor,
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    transition: 'background 0.3s, transform 0.2s',
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
