import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Minimal interface for your Tracker. Adjust as needed.
interface ITracker {
  id: number;
  exercise?: {
    caloriesBurned?: number;
    volume?: number;
    duration?: number;
    exerciseDate?: string;
  };
  nutrition?: {
    kal?: number;
    carb?: number;
    fat?: number;
    protein?: number;
    weight?: number;
    nutritionDate?: string;
  };
  sleep?: number;
  sleepDate?: string;
  water?: number;
  waterDate?: string;
}

// Minimal interface for your Goal. Adjust as needed.
interface IGoal {
  id: number;
  sleep: number; // e.g. total hours to achieve
  water: number; // e.g. total ounces to achieve
  // If you have nutrition or exercise goals, add them here
}

function ProgressPage() {
  const { dayId } = useParams(); // e.g., "2024-12-31"
  const navigate = useNavigate();

  // Basic user/goal tokens and IDs
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [goal, setGoal] = useState<IGoal | null>(null);

  // Trackers
  const [allTrackers, setAllTrackers] = useState<ITracker[]>([]);
  const [dayTracker, setDayTracker] = useState<ITracker | null>(null);

  // Summations for total progress
  const [totalSleep, setTotalSleep] = useState(0);
  const [totalWater, setTotalWater] = useState(0);

  // NEW: We'll store any error text here for on-screen display
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // A) On mount, fetch token
  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      try {
        setToken(JSON.parse(stored));
      } catch {
        setToken(stored);
      }
    } else {
      setErrorMessage('No token found. Please log in first.');
    }
  }, []);

  // B) Once we have token, get username from /me
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
      } catch (err: any) {
        setErrorMessage(`Error fetching user info (/me): ${err.message}`);
      }
    };
    fetchMe();
  }, [token]);

  // C) Once we have username, get user object => userId
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
      } catch (err: any) {
        setErrorMessage(`Error fetching user: ${err.message}`);
      }
    };
    fetchUser();
  }, [username, token]);

  // D) Once we have userId, get the user's goal
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
        setGoal(goalObj);
      } catch (err: any) {
        setErrorMessage(`Error fetching goal: ${err.message}`);
      }
    };
    fetchGoal();
  }, [userId, token]);

  // E) Then, also get all trackers => allTrackers
  useEffect(() => {
    if (!userId || !goal || !token) return;

    const fetchTrackers = async () => {
      try {
        // Some backends require both userId & goalId to fetch trackers
        const res = await fetch(`http://localhost:8080/Tracker/${userId}/${goal.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`GET /Tracker/${userId}/${goal.id} failed: ${res.status}`);
        }
        const trackers = await res.json();
        setAllTrackers(trackers);
      } catch (err: any) {
        setErrorMessage(`Error fetching trackers: ${err.message}`);
      }
    };

    fetchTrackers();
  }, [userId, goal, token]);

  // F) Once we have allTrackers, find the specific day, sum totals
  useEffect(() => {
    // 1) Find day tracker
    const foundTracker =
      allTrackers.find((t) => {
        const exDate = t.exercise?.exerciseDate;
        const slDate = t.sleepDate;
        const wtDate = t.waterDate;
        const nuDate = t.nutrition?.nutritionDate;
        return exDate === dayId || slDate === dayId || wtDate === dayId || nuDate === dayId;
      }) || null;
    setDayTracker(foundTracker);

    // 2) Sum total sleep, water, etc.
    let sumSleep = 0;
    let sumWater = 0;
    allTrackers.forEach((t) => {
      sumSleep += t.sleep || 0;
      sumWater += t.water || 0;
    });
    setTotalSleep(sumSleep);
    setTotalWater(sumWater);
  }, [allTrackers, dayId]);

  const goBack = () => {
    navigate('/calendar');
  };

  return (
    // Outer gradient container — similar to CalendarPage
    <div
      style={{
        padding: '0px',
        background: 'linear-gradient(to bottom, #3370ff, #ADD8E6)',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        marginTop: 0,
      }}
    >
      {/* NEW: If there's an error, display it here */}
      {errorMessage && (
        <div
          style={{
            backgroundColor: '#ff4444',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '4px',
            marginBottom: '10px',
            maxWidth: '800px',
            textAlign: 'center',
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* Black “card” container */}
      <div
        style={{
          backgroundColor: 'black',
          padding: '20px',
          borderRadius: '10px',
          width: '80%',
          maxWidth: '800px',
        }}
      >
        <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}>
          Progress for {dayId}
        </h2>

        {/* Display the day’s data if found */}
        {dayTracker ? (
          <div style={{ marginBottom: '20px' }}>
            <p>
              <strong>Sleep (hrs):</strong> {dayTracker.sleep ?? 0}
            </p>
            <p>
              <strong>Water (oz):</strong> {dayTracker.water ?? 0}
            </p>
            <p>
              <strong>Calories Burned:</strong> {dayTracker.exercise?.caloriesBurned ?? 0}
            </p>
            <p>
              <strong>Volume:</strong> {dayTracker.exercise?.volume ?? 0}
            </p>
            <p>
              <strong>Duration:</strong> {dayTracker.exercise?.duration ?? 0} min
            </p>
            <p>
              <strong>Weight (lbs):</strong> {dayTracker.nutrition?.weight ?? 0}
            </p>
            <p>
              <strong>Carbs (g):</strong> {dayTracker.nutrition?.carb ?? 0}
            </p>
            <p>
              <strong>Fat (g):</strong> {dayTracker.nutrition?.fat ?? 0}
            </p>
            <p>
              <strong>Protein (g):</strong> {dayTracker.nutrition?.protein ?? 0}
            </p>
          </div>
        ) : (
          <div style={{ marginBottom: '20px' }}>
            <p>No data for this day.</p>
          </div>
        )}

        <hr style={{ margin: '20px 0' }} />

        <h3 style={{ color: '#fff', marginTop: '10px' }}>Total Progress So Far</h3>
        {goal ? (
          <>
            <p>
              <strong>Hours Slept:</strong> {totalSleep}/{goal.sleep} hour goal
            </p>
            <p>
              <strong>Water Drank:</strong> {totalWater}/{goal.water} oz goal
            </p>
            {/* Add additional comparisons if your goal has more fields */}
          </>
        ) : (
          <p>No goal found.</p>
        )}

        <button
          onClick={goBack}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2282ff',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
            marginTop: '20px',
          }}
        >
          Back to Calendar
        </button>
      </div>
    </div>
  );
}

export default ProgressPage;
