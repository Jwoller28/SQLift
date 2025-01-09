import { useNavigate } from 'react-router-dom';
import React, { FormEvent, useEffect, useState } from 'react';

function SetUserGoals() {
  const navigate = useNavigate();

  // --------------- Existing states ---------------
  const [kal, setCalories] = useState(0);
  const [carb, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [protein, setProtein] = useState(0);
  const [userWeight, setUserWeight] = useState(0);

  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [volume, setVolume] = useState(0);
  const [duration, setDuration] = useState(0);

  const [water, setWater] = useState(0);
  const [sleep, setSleep] = useState(0);

  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [id, setUserId] = useState<number | null>(null);

  // --------------- NEW STATE for the “end date” ---------------
  const [endDate, setEndDate] = useState(''); // We'll store a string like "2024-12-30"

  // NEW: We'll store any error text here for on-screen display
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Grab token & user ID from localStorage, etc.
    const sessionTok = localStorage.getItem('token');
    if (sessionTok) {
      try {
        setToken(JSON.parse(sessionTok));
      } catch {
        setToken(sessionTok);
      }
    }
  }, []);

  useEffect(() => {
    // Validate the token => /me => setUsername
    const userValidToken = async () => {
      if (!token) return;
      try {
        const responseValidToken = await fetch('http://localhost:8080/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!responseValidToken.ok) {
          throw new Error(`GET /me failed: ${responseValidToken.status}`);
        }
        const userTokenName = await responseValidToken.text();
        setUsername(userTokenName);
      } catch (err: any) {
        setErrorMessage(`Error verifying token: ${err.message}`);
      }
    };
    userValidToken();
  }, [token]);

  // Once we have username, fetch user ID
  useEffect(() => {
    if (!username || !token) return;

    const getUserId = async () => {
      try {
        const userIdResponse = await fetch(`http://localhost:8080/username/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!userIdResponse.ok) {
          throw new Error(`GET /username/${username} failed: ${userIdResponse.status}`);
        }
        const userIdData = await userIdResponse.json();
        setUserId(userIdData.id);
        setPassword(userIdData.password);
      } catch (err: any) {
        setErrorMessage(`Error getting user ID: ${err.message}`);
      }
    };
    getUserId();
  }, [username, token]);

  // --------------- Build final objects ---------------
  const nutrition = {
    kal,
    fat,
    carb,
    weight: userWeight,
    protein,
    nutritionDate: endDate,
  };

  const exercise = {
    duration,
    volume,
    caloriesBurned,
    exerciseDate: endDate,
  };

  const createdAt = Date.now(); // or new Date() if needed

  // The user object
  const appUser = {
    id,
    username,
    password,
  };

  async function handleGoalSubmit(event: FormEvent) {
    event.preventDefault();

    // Build the goal body
    const body = {
      createdAt,
      appUser,
      sleep,
      sleepDate: endDate,
      water,
      waterDate: endDate,
      nutrition,
      exercise,
    };

    try {
      const goalResponse = await fetch('http://localhost:8080/goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!goalResponse.ok) {
        throw new Error(`Failed to create goal. Status: ${goalResponse.status}`);
      }

      const data = await goalResponse.json();
      console.log('Here is the successful goal return:', data);
      navigate('/calendar');
    } catch (err: any) {
      setErrorMessage(`Error creating goal: ${err.message}`);
    }
  }

  return (
    <>
      {/* NEW: If there's an error, display it at the top */}
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

      <form onSubmit={handleGoalSubmit} style={{ padding: '20px' }}>
        <h1>Nutrition</h1>
        <label>
          Calories
          <input
            type="number"
            value={kal}
            onChange={(e) => setCalories(Number(e.target.value))}
          />
        </label>
        <br />

        <label>
          Carbs
          <input
            type="number"
            value={carb}
            onChange={(e) => setCarbs(Number(e.target.value))}
          />
        </label>
        <br />

        <label>
          Fat
          <input
            type="number"
            value={fat}
            onChange={(e) => setFat(Number(e.target.value))}
          />
        </label>
        <br />

        <label>
          Protein
          <input
            type="number"
            value={protein}
            onChange={(e) => setProtein(Number(e.target.value))}
          />
        </label>
        <br />

        <label>
          Current Weight
          <input
            type="number"
            value={userWeight}
            onChange={(e) => setUserWeight(Number(e.target.value))}
          />
        </label>
        <br />

        <h1>Exercise</h1>
        <label>
          Calories To Burn For Goal
          <input
            type="number"
            value={caloriesBurned}
            onChange={(e) => setCaloriesBurned(Number(e.target.value))}
          />
        </label>
        <br />

        <label>
          Volume
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </label>
        <br />

        <label>
          Workout Duration
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </label>
        <br />

        <h1>Water Intake</h1>
        <label>
          Daily Water Intake in oz.
          <input
            type="number"
            value={water}
            onChange={(e) => setWater(Number(e.target.value))}
            required/>
        </label>
        <br />

        <h1>Sleep</h1>
        <label>
          Number of Hours of Sleep
          <input
            type="number"
            value={sleep}
            onChange={(e) => setSleep(Number(e.target.value))}
            required/>
        </label>
        <br />

        <h2>Goal End Date</h2>
        <label>
          Pick a date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required />
        </label>
        <br />

        <button type="submit" style={{ marginTop: '20px' }}>
          Submit Goals
        </button>
      </form>
    </>
  );
}

export default SetUserGoals;
