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

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setToken(JSON.parse(token));
    }
    else{
      console.error('No token found. Please log in first.');
      return;
    }

  }, []);


  useEffect(() => {
    const fetchMe = async () => {
      try {
        // 1) GET /me to get username
        const meRes = await fetch("http://3.142.210.41:8081/me", {
          headers: {
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${userToken}`,
              'Access-Control-Allow-Origin': "*"
              },
              credentials : 'include'
        });
        if (!meRes.ok) {
          throw new Error(`GET /me failed: ${meRes.status}`);
        }
        const username = await meRes.text(); // e.g. "user1"
        setName(username);
      } catch (err) {
        console.error('Error fetching user/goal:', err);
      }};
      fetchMe();
  }, [userToken]);


  useEffect(() => {
    if(userName)
      fetchUsername();
  }, [userName]);

  useEffect(() => {
    if(userId)
      fetchGoal();
  }, [userId]);


  const fetchUsername = async () => {
      // 2) GET /username/{username} to get user object (including id)
      const userRes = await fetch(`http://3.142.210.41:8081/username/${userName}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (!userRes.ok) {
        throw new Error(`GET /username/${userName} failed: ${userRes.status}`);
      }
      const userObj = await userRes.json(); 
      setUserId(userObj.id);
    };

    const fetchGoal = async () => {
      // 3) GET /goalUser/{userId} to get the user’s goal object (including goalId)
      const goalRes = await fetch(`http://3.142.210.41:8081/goalUser/${userId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      if (!goalRes.ok) {
        throw new Error(`GET /goalUser/${userId} failed: ${goalRes.status}`);
      }
      const goalObj = await goalRes.json(); 
      setGoalId(goalObj.id);
      console.log(goalId);
    };


  // 2) Recalc totalVolume whenever workouts changes
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

  // 3) Handling foods + calling the Nutrition API
  const addFood = () => {
    setFoods([...foods, { name: '' }]);
  };

  const updateFood = (index: number, value: string) => {
    const updated = [...foods];
    updated[index].name = value;
    setFoods(updated);
  };

  // On “Fetch Nutrition” we’ll sum up all the foods from the API
  const handleFetchNutrition = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found. Please log in first.');
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
        const data = await response.json(); // { items: [{ calories, carbs, fat, protein, ... }] }
        if (data.items && data.items[0]) {
          const item = data.items[0];
          totalCals += item.calories || 0;
          totalCarbs += item.carbohydrates_total_g || 0;
          totalFat += item.fat_total_g || 0;
          totalProtein += item.protein_g || 0;
        }
      } catch (err) {
        console.error('Error fetching nutrition for', foodName, err);
      }
    }

    setNutritionTotals({
      calories: totalCals,
      carbs: totalCarbs,
      fat: totalFat,
      protein: totalProtein,
    });

    console.log('Total from foods:', {
      calories: totalCals,
      carbs: totalCarbs,
      fat: totalFat,
      protein: totalProtein,
    });
  };

  // ====================================================================
  // 4) handleSave: POST new Tracker to your backend
  // ====================================================================
  const handleSave = async () => {
    if (!userId || !goalId) {
      console.error('User or goal ID not yet loaded. Wait or log in again.');
      return;
    }

    // Combine the data from your states + the nutritionTotals
    // Because your "Tracker" has "nutrition" with macros, we’ll put them there.
    const requestBody = {
      appUser: { id: userId },
      goal: { id: goalId },

      // exercise
      exercise: {
        caloriesBurned: parseFloat(caloriesBurned) || 0,
        duration: parseFloat(time) || 0,
        volume: totalVolume,
        exerciseDate: dayId, // you can store dayId as a string date
      },

      // nutrition
      nutrition: {
        weight: parseFloat(weight) || 0, // user’s body weight
        kal: parseFloat(nutritionTotals.calories.toFixed(2)), // from the API sums
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
      const response = await fetch('http://3.142.210.41:8081/Tracker', {
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
      navigate('/calendar');
    } catch (err) {
      console.error('Error saving tracker:', err);
    }
  };

  const handleProgress = () => {
    navigate(`/progress/${dayId}`);
  };

  // ====================================================================
  // RENDER
  // ====================================================================
  return (
    <div style={{ padding: '20px' }}>
      <h2>Input Progress for {dayId}</h2>

      <h3>Exercise</h3>
      <label>
        Calories Burned (kcal):
        <input
          type="number"
          value={caloriesBurned}
          onChange={(e) => setCaloriesBurned(e.target.value)}
        />
      </label>
      <br />
      <label>Total Volume: {totalVolume} (weight × reps × sets)</label>
      <br /><br />

      {workouts.map((workout, idx) => (
        <div key={idx} style={{ marginBottom: '10px' }}>
          <label>
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
            />
          </label>
          <label>
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
            />
          </label>
          <label>
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
            />
          </label>
        </div>
      ))}
      <button type="button" onClick={() => setWorkouts([...workouts, { weight: '', reps: '', sets: '' }])}>
        Add Workout
      </button>
      <br />
      <label>
        Total Time (minutes):
        <input type="number" value={time} onChange={(e) => setTime(e.target.value)} />
      </label>
      <br />

      <h3>Sleep</h3>
      <label>
        Hours Slept:
        <input
          type="number"
          value={hoursSlept}
          onChange={(e) => setHoursSlept(e.target.value)}
        />
      </label>
      <br />

      <h3>Water Intake</h3>
      <label>
        Water Intake (fl oz.):
        <input
          type="number"
          value={waterIntake}
          onChange={(e) => setWaterIntake(e.target.value)}
        />
      </label>
      <br />

      <h3>Nutrition</h3>
      <label>
        Weight (lbs):
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </label>
      <br /><br />

      {/* Foods + API */}
      <button type="button" onClick={addFood}>Add Food</button>
      <button type="button" onClick={handleFetchNutrition} style={{ marginLeft: '10px' }}>
        Fetch Nutrition from API
      </button>
      {foods.map((food, index) => (
        <div key={index} style={{ margin: '5px 0' }}>
          <input
            type="text"
            value={food.name}
            onChange={(e) => updateFood(index, e.target.value)}
            placeholder="e.g. mac and cheese"
          />
        </div>
      ))}
      <br />

      {/* Show the totals from the API calls */}
      <p>
        <strong>Food totals (from API):</strong><br />
        Calories: {nutritionTotals.calories} kcal<br />
        Carbs: {nutritionTotals.carbs} g<br />
        Fat: {nutritionTotals.fat} g<br />
        Protein: {nutritionTotals.protein} g
      </p>

      <button type="button" onClick={handleSave} style={{ marginRight: '10px' }}>
        Save Progress
      </button>
      <button type="button" onClick={handleProgress}>
        See Progress
      </button>
    </div>
  );
}

export default InputPage;
