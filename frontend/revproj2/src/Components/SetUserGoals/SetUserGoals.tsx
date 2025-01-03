import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [endDate, setEndDate] = useState(''); 
  // We'll store a string like "2024-12-30" from the <input type="date" />

  useEffect(() => {
    // Grab token & user ID from localStorage, etc.
    const sessionTok = localStorage.getItem('token');
    if (sessionTok) {
      setToken(JSON.parse(sessionTok));
    }
    // If you also store userId in localStorage, parse that too, etc.
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
        const userTokenName = await responseValidToken.text();
        setUsername(userTokenName);
      } catch (err) {
        console.error('Error verifying token:', err);
      }
    };
    userValidToken();
  }, [token]);

  // Once we have username, fetch user ID
  useEffect(() => {
    if (!username || !token) return;

    const getUserId = async () => {
      try {
        const userIdResponse = await fetch(
          `http://localhost:8080/username/${username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!userIdResponse.ok) {
          alert(
            `Something went wrong getting user id ERROR CODE: ${userIdResponse.status}`
          );
        } else {
          const userIdData = await userIdResponse.json();
          setUserId(userIdData.id);
          setPassword(userIdData.password);
        }
      } catch (err) {
        console.error('Error getting userId:', err);
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
    // NEW: add the date if you want
    nutritionDate: endDate, 
  };

  const exercise = {
    duration,
    volume,
    caloriesBurned,
    exerciseDate: endDate, // store endDate if you want
  };

  const createdAt = Date.now(); // or new Date() if needed

  // The user object
  const user = {
    id: id,
    username: username,
    password: password,
  };

  function handleGoalSubmit(event: FormEvent) {
    event.preventDefault();

    // Build the goal body
    const body = {
      createdAt,
      user,
      sleep,
      sleepDate: endDate,  // store the end date for sleep
      water,
      waterDate: endDate,  // store the end date for water
      nutrition,
      exercise,
    };

    const postGoals = async () => {
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
          alert(`Failed to create goal. Status: ${goalResponse.status}`);
        } else {
          const data = await goalResponse.json();
          console.log('Here is the successful goal return: ', data);
          navigate('/calendar');
        }
    } catch (err) {
	console.error("Error creating goal: ", err);
    }
    };
    postGoals();
  }

  return (
    <>
      <form onSubmit={handleGoalSubmit}>
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
          />
        </label>
        <br />

        <h1>Sleep</h1>
        <label>
          Number of Hours of Sleep
          <input
            type="number"
            value={sleep}
            onChange={(e) => setSleep(Number(e.target.value))}
          />
        </label>
        <br />

        {/* NEW: End date input */}
        <h2>Goal End Date</h2>
        <label>
          Pick a date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <br />

        <button type="submit">Submit Goals</button>
      </form>
    </>
  );

}

export default SetUserGoals;