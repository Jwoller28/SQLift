import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const NUTRITION_API_KEY = 'gg1FPG2C5LRmeHth7W78aQ==AzZg9ImEsiX2oEbc';

function InputPage() {
  const { dayId } = useParams(); // e.g. "2024-12-20"
  const navigate = useNavigate();

  // We’ll fetch userId & goalId on mount:
  const [userId, setUserId] = useState<number | null>(null);
  const [goalId, setGoalId] = useState<number | null>(null);

  // ---------- State for exercise ----------
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [workouts, setWorkouts] = useState<{ weight: string; reps: string; sets: string }[]>([]);
  const [time, setTime] = useState('');
  const [totalVolume, setTotalVolume] = useState(0);

  // ---------- State for sleep ----------
  const [hoursSlept, setHoursSlept] = useState('');

  // ---------- State for water ----------
  const [waterIntake, setWaterIntake] = useState('');

  // ---------- State for nutrition ----------
  // The user’s weight, plus macros from foods
  const [weight, setWeight] = useState('');

  // Foods typed by the user
  const [foods, setFoods] = useState<{ name: string }[]>([]);

  const [userToken, setToken] = useState('');
  const [userName, setName] = useState('');

  // Summed macros from the API calls
  const [nutritionTotals, setNutritionTotals] = useState({
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
  });

  // NEW: We'll store any error text here and display if not null
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // NEW

  // ---------------------------------------------------------------------------
  // 1) On mount, load token
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        setToken(JSON.parse(token));
      } catch {
        // If parse fails, treat token as raw
        setToken(token);
      }
    } else {
      setErrorMessage('No token found. Please log in first.');
      return;
    }
  }, []);

  // ---------------------------------------------------------------------------
  // 2) Once we have token, fetch /me => username
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!userToken) return;

    const fetchMe = async () => {
      try {
        const meRes = await fetch('http://18.221.145.66:8080/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
            'Access-Control-Allow-Origin': '*',
          },
          credentials: 'include',
        });
        if (!meRes.ok) {
          throw new Error(`GET /me failed: ${meRes.status}`);
        }
        const username = await meRes.text();
        setName(username);
      } catch (err: any) {
        setErrorMessage(`Error fetching user info: ${err.message}`);
      }
    };

    fetchMe();
  }, [userToken]);

  // ---------------------------------------------------------------------------
  // 3) Once we have username, fetch user => userId
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!userName) return;

    const fetchUsername = async () => {
      try {
        const userRes = await fetch(`http://18.221.145.66:8080/username/${userName}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (!userRes.ok) {
          throw new Error(`GET /username/${userName} failed: ${userRes.status}`);
        }
        const userObj = await userRes.json();
        setUserId(userObj.id);
      } catch (err: any) {
        setErrorMessage(`Error fetching user by username: ${err.message}`);
      }
    };

    fetchUsername();
  }, [userName, userToken]);

  // ---------------------------------------------------------------------------
  // 4) Once we have userId, fetch goal => goalId
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!userId) return;

    const fetchGoal = async () => {
      try {
        const goalRes = await fetch(`http://18.221.145.66:8080/goalUser/${userId}`, {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        if (!goalRes.ok) {
          throw new Error(`GET /goalUser/${userId} failed: ${goalRes.status}`);
        }
        const goalObj = await goalRes.json();
        setGoalId(goalObj.id);
      } catch (err: any) {
        setErrorMessage(`Error fetching goal: ${err.message}`);
      }
    };

    fetchGoal();
  }, [userId, userToken]);

  // ---------------------------------------------------------------------------
  // 5) Recalc totalVolume whenever workouts changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let total = 0;
    workouts.forEach((w) => {
      const weightNum = parseFloat(w.weight) || 0;
      const repsNum = parseFloat(w.reps) || 0;
      const setsNum = parseFloat(w.sets) || 0;
      total += weightNum * repsNum * setsNum;
    });
    setTotalVolume(total);
  }, [workouts]);

  // ---------------------------------------------------------------------------
  // 6) Foods + calling the Nutrition API
  // ---------------------------------------------------------------------------
  const addFood = () => {
    setFoods([...foods, { name: '' }]);
  };

  const updateFood = (index: number, value: string) => {
    const updated = [...foods];
    updated[index].name = value;
    setFoods(updated);
  };

  const handleFetchNutrition = async () => {
    const localToken = localStorage.getItem('token');
    if (!localToken) {
      setErrorMessage('No token found. Please log in first.');
      return;
    }

    let totalCals = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalProtein = 0;

    for (let i = 0; i < foods.length; i++) {
      const foodName = foods[i].name.trim();
      if (!foodName) continue;

      try {
        const response = await fetch(
          `https://api.calorieninjas.com/v1/nutrition?query=${encodeURIComponent(foodName)}`,
          {
            headers: {
              'X-Api-Key': NUTRITION_API_KEY,
            },
          }
        );
        if (!response.ok) {
          throw new Error(`Nutrition API failed: ${response.status}`);
        }
        const data = await response.json();
        if (data.items && data.items[0]) {
          const item = data.items[0];
          totalCals += item.calories || 0;
          totalCarbs += item.carbohydrates_total_g || 0;
          totalFat += item.fat_total_g || 0;
          totalProtein += item.protein_g || 0;
        }
      } catch (err: any) {
        setErrorMessage(`Error fetching nutrition for "${foodName}": ${err.message}`);
      }
    }

    setNutritionTotals({
      calories: totalCals,
      carbs: totalCarbs,
      fat: totalFat,
      protein: totalProtein,
    });
  };

  // ---------------------------------------------------------------------------
  // 7) handleSave => create new Tracker
  // ---------------------------------------------------------------------------
  const handleSave = async () => {
    if (!userId || !goalId) {
      setErrorMessage('User or goal ID not yet loaded. Please wait or log in again.');
      return;
    }



    const requestBody = {
      appUser: { id: userId },
      goal: { id: goalId },

      // exercise
      exercise: {
        caloriesBurned: parseFloat(caloriesBurned) || 0,
        duration: parseFloat(time) || 0,
        volume: totalVolume,
        exerciseDate: dayId,
      },
      // nutrition
      nutrition: {
        weight: parseFloat(weight) || 0,
        kal: parseFloat(nutritionTotals.calories.toFixed(2)),
        carb: parseFloat(nutritionTotals.carbs.toFixed(2)),
        fat: parseFloat(nutritionTotals.fat.toFixed(2)),
        protein: parseFloat(nutritionTotals.protein.toFixed(2)),
        nutritionDate: dayId,
      },
      // sleep
      sleep: parseFloat(hoursSlept) || 0,
      sleepDate: dayId,
      // water
      water: parseFloat(waterIntake) || 0,
      waterDate: dayId,
    };

    try {
      const response = await fetch('http://18.221.145.66:8080/Tracker', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to create tracker. Status: ${response.status}`);
      }

      const created = await response.json();
      console.log('Tracker created:', created);
      localStorage.setItem(`completed_${userId}_${dayId}`, "true");
      navigate('/calendar');
    } catch (err: any) {
      setErrorMessage(`Error saving tracker: ${err.message}`);
    }
  };

  const handleProgress = () => {
    navigate(`/progress/${dayId}`);
  };

  const handleCalendar = () => {
    navigate(`calendar`);
  };

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------
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
        
        <div
  style={{
    position: 'relative', // let us absolutely position the button
    marginBottom: '20px',
  }}
>
  {/* Back button at top-left */}
  <button
    type="button"
    onClick={() => navigate('/calendar')}
    style={{
      position: 'absolute',
      left: 0,                  // anchor to the left
      top: '50%',               // anchor vertically near middle
      transform: 'translateY(-50%)', // shift button up 50% of its own height
      padding: '8px 16px',
      backgroundColor: '#2282ff',
      color: '#000',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    }}
  >
    Back
  </button>

  {/* Heading centered by default within this container */}
  <h2 style={{
    color: '#fff',
    textAlign: 'center',  // center text within the container
    margin: 0,            // remove extra margin
  }}>
    Input Progress for {dayId}
  </h2>
</div>



        <h3 style={{ color: '#fff', marginTop: '10px' }}>Exercise</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>
            Calories Burned (kcal):
            <input
              type="number"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>Total Volume: {totalVolume}</label>
          <span style={{ fontSize: '0.9em' }}>(weight × reps × sets)</span>
        </div>

        {workouts.map((workout, idx) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
            <label style={{ marginRight: '10px' }}>
              Weight:
              <input
                type="number"
                value={workout.weight}
                onChange={(e) => {
                  const val = e.target.value;
                  setWorkouts((prev) => {
                    const copy = [...prev];
                    copy[idx].weight = val;
                    return copy;
                  });
                }}
                style={{ marginLeft: '5px', marginRight: '10px' }}
              />
            </label>
            <label style={{ marginRight: '10px' }}>
              Reps:
              <input
                type="number"
                value={workout.reps}
                onChange={(e) => {
                  const val = e.target.value;
                  setWorkouts((prev) => {
                    const copy = [...prev];
                    copy[idx].reps = val;
                    return copy;
                  });
                }}
                style={{ marginLeft: '5px', marginRight: '10px' }}
              />
            </label>
            <label style={{ marginRight: '10px' }}>
              Sets:
              <input
                type="number"
                value={workout.sets}
                onChange={(e) => {
                  const val = e.target.value;
                  setWorkouts((prev) => {
                    const copy = [...prev];
                    copy[idx].sets = val;
                    return copy;
                  });
                }}
                style={{ marginLeft: '5px' }}
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setWorkouts([...workouts, { weight: '', reps: '', sets: '' }])}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2282ff',
            color: '#000',
            border: 'none',
            cursor: 'pointer',
            margin: '5px 0',
            borderRadius: '4px',
          }}
        >
          Add Workout
        </button>

        <div style={{ marginTop: '10px', marginBottom: '20px' }}>
          <label style={{ marginRight: '10px' }}>
            Total Time (minutes):
            <input
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        <h3 style={{ color: '#fff', marginTop: '10px' }}>Sleep</h3>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px' }}>
            Hours Slept:
            <input
              type="number"
              value={hoursSlept}
              onChange={(e) => setHoursSlept(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        <h3 style={{ color: '#fff', marginTop: '10px' }}>Water Intake</h3>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ marginRight: '10px' }}>
            Water Intake (fl oz.):
            <input
              type="number"
              value={waterIntake}
              onChange={(e) => setWaterIntake(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        <h3 style={{ color: '#fff', marginTop: '10px' }}>Nutrition</h3>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>
            Weight (lbs):
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>

        {/* Foods + API */}
        <div style={{ marginBottom: '10px' }}>
          <button
            type="button"
            onClick={addFood}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2282ff',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px',
              borderRadius: '4px',
            }}
          >
            Add Food
          </button>
          <button
            type="button"
            onClick={handleFetchNutrition}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2282ff',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            Fetch Nutrition from API
          </button>
        </div>

        {foods.map((food, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            <input
              type="text"
              value={food.name}
              onChange={(e) => updateFood(index, e.target.value)}
              placeholder="e.g. mac and cheese"
              style={{ width: '250px' }}
            />
          </div>
        ))}

        {/* Show the totals from the API calls */}
        <p style={{ marginTop: '10px' }}>
          <strong>Food totals (from API):</strong>
          <br />
          Calories: {nutritionTotals.calories} kcal
          <br />
          Carbs: {nutritionTotals.carbs} g
          <br />
          Fat: {nutritionTotals.fat} g
          <br />
          Protein: {nutritionTotals.protein} g
        </p>

        <div style={{ marginTop: '20px' }}>
          <button
            type="button"
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2282ff',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px',
              borderRadius: '4px',
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleProgress}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2282ff',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            See Progress
          </button>
        </div>
      </div>
    </div>
  );
}

export default InputPage;
