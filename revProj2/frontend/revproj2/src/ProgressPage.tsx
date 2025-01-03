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
  sleep: number;       // e.g. total hours to achieve
  water: number;       // e.g. total ounces to achieve
  // If you have nutrition or exercise goals, add them here
}

function ProgressPage() {
  const { dayId } = useParams();  // e.g., "2024-12-31"
  const navigate = useNavigate();

  // 1) Basic user/goal tokens and IDs
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [goal, setGoal] = useState<IGoal | null>(null); // We'll store entire goal object

  // 2) Trackers
  const [allTrackers, setAllTrackers] = useState<ITracker[]>([]);
  const [dayTracker, setDayTracker] = useState<ITracker | null>(null);

  // 3) Summations for total progress
  const [totalSleep, setTotalSleep] = useState(0);
  const [totalWater, setTotalWater] = useState(0);
  // If you want total cals, you can add a state for it, etc.

  // ---------------------------------------------------
  // A) On mount, fetch token from localStorage
  // ---------------------------------------------------
  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      // if raw string: setToken(stored);
      // if JSON: setToken(JSON.parse(stored));
      setToken(JSON.parse(stored));
    } else {
      console.error('No token found. Please log in.');
    }
  }, []);

  // ---------------------------------------------------
  // B) Once we have token, get username from /me
  // ---------------------------------------------------
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

  // ---------------------------------------------------
  // C) Once we have username, get user object => userId
  // ---------------------------------------------------
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

  // ---------------------------------------------------
  // D) Once we have userId, get the user's goal
  // ---------------------------------------------------
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
      } catch (err) {
        console.error('Error fetching goal:', err);
      }
    };
    fetchGoal();
  }, [userId, token]);

  // ---------------------------------------------------
  // E) Then, also get all trackers => allTrackers
  // ---------------------------------------------------
  useEffect(() => {
    const fetchTrackers = async () => {
      if (!userId || !goal || !token) return;
      try {
        // goal.id is optional if you need it, but we only need userId to fetch all if your backend requires both
        const res = await fetch(`http://localhost:8080/Tracker/${userId}/${goal.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`GET /Tracker/${userId}/${goal.id} failed: ${res.status}`);
        }
        const trackers = await res.json();
        setAllTrackers(trackers);
      } catch (err) {
        console.error('Error fetching trackers:', err);
      }
    };
    fetchTrackers();
  }, [userId, goal, token]);

  // ---------------------------------------------------
  // F) Once we have allTrackers, find the specific day, sum totals
  // ---------------------------------------------------
  useEffect(() => {
    // 1) Find day tracker
    const foundTracker = allTrackers.find((t) => {
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
    // let sumCals = 0; // if you want total cals
    allTrackers.forEach(t => {
      sumSleep += t.sleep || 0;
      sumWater += t.water || 0;
      // if (t.nutrition?.kal) sumCals += t.nutrition.kal;
    });
    setTotalSleep(sumSleep);
    setTotalWater(sumWater);
    // setTotalCals(sumCals);
  }, [allTrackers, dayId]);

  // ---------------------------------------------------
  // G) Render read-only UI
  // ---------------------------------------------------
  const goBack = () => {
    navigate('/calendar');
  };

  // dayTracker might be null if no data for that day
  // goal might be null if no goal found

  return (
    <div style={{ padding: '20px' }}>
      <h2>Progress for {dayId}</h2>

      {/* Display the day’s data if found */}
      {dayTracker ? (
        <div style={{ marginBottom: '20px' }}>
          <p><strong>Sleep (hrs):</strong> {dayTracker.sleep ?? 0}</p>
          <p><strong>Water (oz):</strong> {dayTracker.water ?? 0}</p>
          <p><strong>Calories Burned:</strong> {dayTracker.exercise?.caloriesBurned ?? 0}</p>
          <p><strong>Volume:</strong> {dayTracker.exercise?.volume ?? 0}</p>
          <p><strong>Duration:</strong> {dayTracker.exercise?.duration ?? 0} min</p>
          <p><strong>Weight (lbs):</strong> {dayTracker.nutrition?.weight ?? 0}</p>
          <p><strong>Carbs (g):</strong> {dayTracker.nutrition?.carb ?? 0}</p>
          <p><strong>Fat (g):</strong> {dayTracker.nutrition?.fat ?? 0}</p>
          <p><strong>Protein (g):</strong> {dayTracker.nutrition?.protein ?? 0}</p>
        </div>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <p>No data for this day.</p>
        </div>
      )}

      <hr />

      <h3>Total Progress So Far</h3>
      {goal ? (
        <>
          {/* e.g. "hours slept: 20/400 hour goal" */}
          <p>
            <strong>Hours Slept:</strong> {totalSleep}/{goal.sleep} hour goal
          </p>
          <p>
            <strong>Water Drank:</strong> {totalWater}/{goal.water} oz goal
          </p>
          {/* If your goal has other fields for exercise or nutrition, add them here */}
        </>
      ) : (
        <p>No goal found.</p>
      )}

      <button onClick={goBack} style={{ marginTop: '20px' }}>
        Back to Calendar
      </button>
    </div>
  );
}

export default ProgressPage;
