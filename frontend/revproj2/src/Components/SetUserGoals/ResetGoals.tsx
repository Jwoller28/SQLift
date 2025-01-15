// src/Components/SetUserGoals/ResetGoals.tsx
import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Interface for the Goal object
interface IGoal {
  id: number;
  sleep: number;
  sleepDate?: string; // or you might store it as LocalDate on the backend
  water: number;
  waterDate?: string;
  nutrition?: {
    kal: number;
    fat: number;
    carb: number;
    protein: number;
    weight: number;
    nutritionDate?: string;
  };
  exercise?: {
    caloriesBurned: number;
    volume: number;
    duration: number;
    exerciseDate?: string;
  };
}

function ResetGoals() {
  const navigate = useNavigate();

  // Logged in user & token
  const [token, setToken] = useState<string>('');  
  const [username, setUsername] = useState<string>('');  
  const [userId, setUserId] = useState<number | null>(null);

  // We'll store the oldGoal so we can display current values
  const [oldGoal, setOldGoal] = useState<IGoal | null>(null);

  // Form states (start with 0, or fill them from oldGoal once loaded)
  const [kal, setKal] = useState(0);
  const [carb, setCarb] = useState(0);
  const [fat, setFat] = useState(0);
  const [protein, setProtein] = useState(0);
  const [userWeight, setUserWeight] = useState(0);

  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [volume, setVolume] = useState(0);
  const [duration, setDuration] = useState(0);

  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(0);

  // We'll store an "end date" for each category if we want
  const [endDate, setEndDate] = useState('');

  // NEW: We'll store any error text here to display on-screen
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // NEW

  // ---------------------------------------------------------------------------
  // 1) On mount, get token from localStorage
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (stored) {
      try {
        setToken(JSON.parse(stored));
      } catch {
        // If parse fails, treat as raw string
        setToken(stored);
      }
    }
  }, []);

  // ---------------------------------------------------------------------------
  // 2) Once we have token, fetch /me => username
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!token) return;
    const fetchMe = async () => {
      try {
        const res = await fetch('http://18.116.10.154:8081/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`GET /me failed: HTTP ${res.status}`);
        }
        const name = await res.text();
        setUsername(name);
      } catch (err: any) {
        // NEW: Show on-screen error
        setErrorMessage(`Error fetching user info (/me): ${err.message}`);
      }
    };
    fetchMe();
  }, [token]);

  // ---------------------------------------------------------------------------
  // 3) Once we have username, fetch user => userId
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!username || !token) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://18.116.10.154:8081/username/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`GET /username/${username} failed: HTTP ${res.status}`);
        }
        const userData = await res.json();
        setUserId(userData.id);
      } catch (err: any) {
        // NEW: Show on-screen error
        setErrorMessage(`Error fetching user: ${err.message}`);
      }
    };
    fetchUser();
  }, [username, token]);

  // ---------------------------------------------------------------------------
  // 4) Once we have userId, fetch the old goal => set oldGoal
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!userId || !token) return;
    const fetchGoal = async () => {
      try {
        const res = await fetch(`http://18.116.10.154:8081/goalUser/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // It's possible the user has no goal yet => 400 or similar
        if (res.ok) {
          const goalObj: IGoal = await res.json();
          setOldGoal(goalObj);
        } else {
          // Not necessarily an error: user might not have a goal yet
          console.warn(`No existing goal or error fetching it. Status: ${res.status}`);
        }
      } catch (err: any) {
        // NEW: Show on-screen error
        setErrorMessage(`Error fetching old goal: ${err.message}`);
      }
    };
    fetchGoal();
  }, [userId, token]);

  // ---------------------------------------------------------------------------
  // 5) Once oldGoal is loaded, pre-fill the form fields
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!oldGoal) return;
    setKal(oldGoal.nutrition?.kal || 0);
    setCarb(oldGoal.nutrition?.carb || 0);
    setFat(oldGoal.nutrition?.fat || 0);
    setProtein(oldGoal.nutrition?.protein || 0);
    setUserWeight(oldGoal.nutrition?.weight || 0);

    setCaloriesBurned(oldGoal.exercise?.caloriesBurned || 0);
    setVolume(oldGoal.exercise?.volume || 0);
    setDuration(oldGoal.exercise?.duration || 0);

    setWater(oldGoal.water);
    setSleep(oldGoal.sleep);

    // If you want a single "end date" from any field:
    const possibleDate =
      oldGoal.sleepDate ||
      oldGoal.waterDate ||
      oldGoal.nutrition?.nutritionDate ||
      oldGoal.exercise?.exerciseDate;
    if (possibleDate) {
      // if it's something like "2024-12-30", great. 
      // If it has T00:00, substring(0,10)
      setEndDate(possibleDate.toString().substring(0, 10));
    }
  }, [oldGoal]);

  // ---------------------------------------------------------------------------
  // 6) On submit => PATCH the existing goal
  // ---------------------------------------------------------------------------
  async function handleUpdateGoal(event: FormEvent) {
    event.preventDefault();
    if (!oldGoal || !userId) {
      setErrorMessage('No old goal found, or userId is missing.');
      return;
    }

    try {
      // Build the updatedGoal object
      const updatedGoal = {
        sleep,
        sleepDate: endDate,
        water,
        waterDate: endDate,
        nutrition: {
          kal,
          carb,
          fat,
          protein,
          weight: userWeight,
          nutritionDate: endDate,
        },
        exercise: {
          duration,
          volume,
          caloriesBurned,
          exerciseDate: endDate,
        },
      };

      // PATCH /goal/{userId}
      const patchRes = await fetch(`http://18.116.10.154:8081/goal/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedGoal),
      });

      if (!patchRes.ok) {
        throw new Error(`Failed to update goal. Status: ${patchRes.status}`);
      }

      const result = await patchRes.json();
      console.log('Goal updated successfully. Patch result is:', result);

      navigate('/calendar');
    } catch (err: any) {
      setErrorMessage(`Error updating goal: ${err.message}`);
    }
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #ff6bcb, #504dff)',
        minHeight: '100vh',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: '#fff',
        fontFamily: 'Georgia',
      }}
    >
      {errorMessage && (
        <div
          style={{
            backgroundColor: '#ff4444',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '4px',
            marginBottom: '10px',
            maxWidth: '600px',
            textAlign: 'center',
          }}
        >
          {errorMessage}
        </div>
      )}
  
      <h1 style={{ fontSize: '300%' }}>Update Your Goal!</h1>
  
      {oldGoal ? (
        <p style={{ fontSize: '120%' }}>You are updating an existing goal.</p>
      ) : (
        <p style={{ fontSize: '120%' }}>
          No existing goal found. You can create a new one!
        </p>
      )}
  
      <form
        onSubmit={handleUpdateGoal}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        {/* Nutrition Section */}
        <div
          style={{
            backgroundColor: '#000',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '40%',
            marginBottom: '20px',
          }}
        >
          <h2>Nutrition</h2>
          <label>
            Daily Calories Consumed in kal
            <input
              type="number"
              value={kal}
              onChange={(e) => setKal(Number(e.target.value))}
              style={{
                width: '100%',
                marginBottom: '10px',
                padding: '5px',
                borderRadius: '5px',
              }}
            />
          </label><br/>
          <label>
          Daily Carbs in grams
            <input
              type="number"
              value={carb}
              onChange={(e) => setCarb(Number(e.target.value))}
              style={{
                width: '100%',
                marginBottom: '10px',
                padding: '5px',
                borderRadius: '5px',
              }}
            />
          </label><br/>
          <label>
          Daily Fat in grams
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(Number(e.target.value))}
              style={{
                width: '100%',
                marginBottom: '10px',
                padding: '5px',
                borderRadius: '5px',
              }}
            />
          </label><br/>
          <label>
          Daily Protein in grams
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(Number(e.target.value))}
              style={{
                width: '100%',
                marginBottom: '10px',
                padding: '5px',
                borderRadius: '5px',
              }}
            />
          </label><br/>
          <label>
          Goal Weight Loss Amount in lbs
            <input
              type="number"
              value={userWeight}
              onChange={(e) => setUserWeight(Number(e.target.value))}
              style={{
                width: '100%',
                marginBottom: '10px',
                padding: '5px',
                borderRadius: '5px',
              }}
            />
          </label>
        </div>
  
        {/* Exercise Section */}
        <div
          style={{
            backgroundColor: '#000',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '40%',
            marginBottom: '20px',
          }}
        >
          <h2>Exercise</h2>
          <label>
            Calories to Burn Daily 
            <input
              type="number"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(Number(e.target.value))}
              style={{
                width: '100%',
                marginBottom: '10px',
                padding: '5px',
                borderRadius: '5px',
              }}
            />
          </label><br/>
          <label>
          Goal Volume Amount
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{
                width: '100%',
                marginBottom: '10px',
                padding: '5px',
                borderRadius: '5px',
              }}
            />
          </label><br/>
          <label>
          Average Workout Duration
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              style={{
                width: '100%',
                marginBottom: '10px',
                padding: '5px',
                borderRadius: '5px',
              }}
            />
          </label>
        </div>
  
        {/* Water Section */}
        <div
          style={{
            backgroundColor: '#000',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '40%',
            marginBottom: '20px',
          }}
        >
          <h2>Water</h2>
          <label>
          Daily Water Intake in oz.
            <input
              type="number"
              value={water}
              onChange={(e) => setWater(Number(e.target.value))}
              style={{
                width: '100%',
                marginBottom: '10px',
                padding: '5px',
                borderRadius: '5px',
              }}
            />
          </label>
        </div>
  
        {/* Sleep Section */}
        <div
          style={{
            backgroundColor: '#000',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '40%',
            marginBottom: '20px',
          }}
        >
          <h2>Sleep</h2>
          <label>
          Average Number of Hours of Sleep
            <input
              type="number"
              value={sleep}
              onChange={(e) => setSleep(Number(e.target.value))}
              style={{
                width: '100%',
                marginBottom: '10px',
                padding: '5px',
                borderRadius: '5px',
              }}
            />
          </label>
        </div>
  
        {/* Goal End Date Section */}
        <div
          style={{
            backgroundColor: '#000',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '40%',
            textAlign: 'center',
          }}
        >
          <h2>Goal End Date</h2>
          <label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: '80%',
                marginTop: '10px',
                padding: '5px',
                borderRadius: '5px',
              }}
            />
          </label>
          <button
            type="submit"
            style={{
              marginTop: '20px',
              backgroundColor: '#504dff',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Save Updated Goal
          </button>
        </div>
      </form>
    </div>
  );
  
}

export default ResetGoals;
