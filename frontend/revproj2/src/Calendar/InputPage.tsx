import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function InputPage() {
  const { dayId } = useParams(); // Get the dayId from the URL
  const navigate = useNavigate();

  // Form states for exercise
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [volume, setVolume] = useState('');
  const [time, setTime] = useState('');

  // Form states for sleep
  const [hoursSlept, setHoursSlept] = useState('');

  // Form states for water intake
  const [waterIntake, setWaterIntake] = useState('');

  // Form states for nutrition
  const [nutritionCalories, setNutritionCalories] = useState('');
  const [fat, setFat] = useState('');
  const [carbs, setCarbs] = useState('');
  const [protein, setProtein] = useState('');

  const handleSave = () => {
    // Logic to save progress (e.g., send data to backend or update state)
    console.log(`Saving progress for ${dayId}:`, {
      exercise: { caloriesBurned, volume, time },
      sleep: { hoursSlept },
      water: { waterIntake },
      nutrition: { nutritionCalories, fat, carbs, protein },
    });
    navigate('/calendar'); // Redirect back to the calendar
  };

  const handleProgess = () => {
    navigate(`/progress/${dayId}`);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Input Progress for {dayId}</h2>
      <form>
        {/* Exercise Section */}
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
        <label>
          Volume (weight × reps × sets):
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
          />
        </label>
        <br />
        <label>
          Time (minutes):
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
        <br />

        {/* Sleep Section */}
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

        {/* Water Intake Section */}
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

        {/* Nutrition Section */}
        <h3>Nutrition</h3>
        <label>
          Calories (kcal):
          <input
            type="number"
            value={nutritionCalories}
            onChange={(e) => setNutritionCalories(e.target.value)}
          />
        </label>
        <br />
        <label>
          Fat (g):
          <input
            type="number"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
          />
        </label>
        <br />
        <label>
          Carbs (g):
          <input
            type="number"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
        </label>
        <br />
        <label>
          Protein (g):
          <input
            type="number"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
        </label>
        <br />

        <button
          type="button"
          onClick={handleSave}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            margin: '5px',
          }}
        >
          Save Progress
        </button>
        <button
          type="button"
          onClick={handleProgess}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            margin: '5px',
          }}
        >
          See Progress
        </button>
      </form>
    </div>
  );
}

export default InputPage;
