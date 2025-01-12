import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

interface IGoal {
  id: number;
  sleep: number; // Maps directly to the "sleep" column
  water: number; // Maps directly to the "water" column
  weight?: number; // Maps directly to the "weight" column
  burnedCalories?: number; // Maps to "calories_burned"
  exerciseDuration?: number; // Maps to "duration"
  caloriesConsumed?: number; // Maps to "kal"
  volume?: number; // Maps to "volume"
}


function ProgressPage() {
  const { dayId } = useParams();
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [goal, setGoal] = useState<IGoal | null>(null);

  const [allTrackers, setAllTrackers] = useState<ITracker[]>([]);
  const [dayTracker, setDayTracker] = useState<ITracker | null>(null);

  const [totalSleep, setTotalSleep] = useState(0);
  const [totalWater, setTotalWater] = useState(0);
  const [totalExerciseCalories, setTotalExerciseCalories] = useState(0);
  const [totalExerciseDuration, setTotalExerciseDuration] = useState(0);
  const [totalNutritionCalories, setTotalNutritionCalories] = useState(0);
  const [totalWeight, setWeight] = useState(0);
  const [totalVolume, setVolume] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  useEffect(() => {
    if (!token) return;
    const fetchMe = async () => {
      try {
        const res = await fetch('http://18.221.145.66:8080/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`GET /me failed: ${res.status}`);
        const name = await res.text();
        setUsername(name);
      } catch (err: any) {
        setErrorMessage(`Error fetching user info (/me): ${err.message}`);
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
        if (!res.ok) throw new Error(`GET /username/${username} failed: ${res.status}`);
        const userObj = await res.json();
        setUserId(userObj.id);
      } catch (err: any) {
        setErrorMessage(`Error fetching user: ${err.message}`);
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
        if (!res.ok) throw new Error(`GET /goalUser/${userId} failed: ${res.status}`);
        const goalObj = await res.json();

        console.log("Fetched goal object:", goalObj);
        // Map the response to the correct interface structure
        setGoal({
          id: goalObj.id,
          sleep: goalObj.sleep || 0,
          water: goalObj.water || 0,
          weight: goalObj.nutrition.weight || 0,
          burnedCalories: goalObj.exercise.caloriesBurned || 0,
          exerciseDuration: goalObj.exercise.duration || 0, 
          caloriesConsumed: goalObj.nutrition.kal || 0,
          volume: goalObj.exercise.volume || 0, 
        });
      } catch (err: any) {
        setErrorMessage(`Error fetching goal: ${err.message}`);
      }
    };
    fetchGoal();
  }, [userId, token]);
  
  useEffect(() => {
    if (goal) {
      console.log('Goal state updated:', goal);
    }
  }, [goal]);


  useEffect(() => {
    if (!userId || !goal || !token) return;
    const fetchTrackers = async () => {
      try {
        const res = await fetch(`http://localhost:8080/Tracker/${userId}/${goal.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`GET /Tracker/${userId}/${goal.id} failed: ${res.status}`);
        const trackers = await res.json();
        console.log("Fetched trackers:", trackers);
        setAllTrackers(trackers);
      } catch (err: any) {
        setErrorMessage(`Error fetching trackers: ${err.message}`);
      }
    };
    fetchTrackers();
  }, [userId, goal, token]);

  useEffect(() => {
    const foundTracker =
      allTrackers.find((t) => {
        const exDate = t.exercise?.exerciseDate;
        const slDate = t.sleepDate;
        const wtDate = t.waterDate;
        const nuDate = t.nutrition?.nutritionDate;
        return exDate === dayId || slDate === dayId || wtDate === dayId || nuDate === dayId;
      }) || null;
    setDayTracker(foundTracker);

    let sumSleep = 0;
    let sumWater = 0;
    let sumExerciseCalories = 0;
    let sumExerciseDuration = 0;
    let sumNutritionCalories = 0;
    let sumWeight = 0;
    let sumVolume = 0;

    allTrackers.forEach((t) => {
      sumSleep += t.sleep || 0;
      sumWater += t.water || 0;
      sumWeight += t.nutrition?.weight || 0;
      sumExerciseCalories += t.exercise?.caloriesBurned || 0;
      sumExerciseDuration += t.exercise?.duration || 0;
      sumNutritionCalories += t.nutrition?.kal || 0;
      sumVolume += t.exercise?.volume || 0;
    });

    setTotalSleep(sumSleep);
    setTotalWater(sumWater);
    setTotalExerciseCalories(sumExerciseCalories);
    setTotalExerciseDuration(sumExerciseDuration);
    setTotalNutritionCalories(sumNutritionCalories);
    setWeight(sumWeight);
    setVolume(sumVolume);
  }, [allTrackers, dayId]);

  const goBack = () => {
    navigate('/calendar');
  };

  return (
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
              <strong>Calories Consumed (kal):</strong> {dayTracker.nutrition?.kal ?? 0} min
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
            {totalSleep > 0 && (
              <p>
                <strong>Hours Slept:</strong> {totalSleep}/{goal.sleep} total hours
              </p>
            )}
            {totalWater > 0 && (
              <p>
                <strong>Water Drank:</strong> {totalWater}/{goal.water} total oz
              </p>
            )}
            {totalExerciseCalories > 0 && (
              <p>
                <strong>Calories Burned:</strong> {totalExerciseCalories}/{goal.burnedCalories} total kal burned
              </p>
            )}
            {totalExerciseDuration > 0 && (
              <p>
                <strong>Exercise Duration:</strong> {totalExerciseDuration}/{goal.exerciseDuration} total minutes
              </p>
            )}
            {totalNutritionCalories > 0 && (
              <p>
                <strong>Calories Consumed:</strong> {totalNutritionCalories}/{goal.caloriesConsumed} total kal consumed
              </p>
            )}
            {totalWeight > 0 && (
              <p>
                <strong>Weight:</strong> {totalWeight}/{goal.weight} lbs lost
              </p>
            )}
            {totalVolume > 0 && (
              <p>
                <strong>Volume:</strong> {totalVolume}/{goal.volume} lbs
              </p>
            )}
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



