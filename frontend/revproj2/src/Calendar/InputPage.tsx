import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function InputPage() {
  const { dayId } = useParams(); // Get the dayId from the URL
  const navigate = useNavigate();

  // Form states for exercise
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [workouts, setWorkouts] = useState<{ weight: string; reps: string; sets: string }[]>([]);
  const [time, setTime] = useState('');
  const [totalVolume, setTotalVolume] = useState(0); // Calculate total volume dynamically

  // Form states for sleep
  const [hoursSlept, setHoursSlept] = useState('');

  // Form states for water intake
  const [waterIntake, setWaterIntake] = useState('');

  // Form states for nutrition (food inputs)
  const [weight, setWeight] = useState('');
  const [foods, setFoods] = useState<{ name: string }[]>([]);

  const handleSave = () => {
    console.log(`Saving progress for ${dayId}:`, {
      exercise: { caloriesBurned, totalVolume, time, workouts },
      sleep: { hoursSlept },
      water: { waterIntake },
      nutrition: { foods },
    });
    navigate('/calendar'); // Redirect back to the calendar
  };

  const handleProgess = () => {
    navigate(`/progress/${dayId}`);
  };

  const addWorkout = () => {
    setWorkouts([...workouts, { weight: '', reps: '', sets: '' }]);
  };

  const updateWorkout = (index: number, field: 'weight' | 'reps' | 'sets', value: string) => {
    const updatedWorkouts = [...workouts];
    updatedWorkouts[index][field] = value;
    setWorkouts(updatedWorkouts);

    // Calculate total volume dynamically
    const total = updatedWorkouts.reduce((acc, workout) => {
      const weightNum = parseFloat(workout.weight) || 0;
      const repsNum = parseFloat(workout.reps) || 0;
      const setsNum = parseFloat(workout.sets) || 0;
      return acc + weightNum * repsNum * setsNum;
    }, 0);
    setTotalVolume(total);
  };

  const addFood = () => {
    setFoods([...foods, { name: '' }]);
  };

  const updateFood = (index: number, value: string) => {
    const updatedFoods = [...foods];
    updatedFoods[index].name = value;
    setFoods(updatedFoods);
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
        <label>Total Volume: {totalVolume} (weight × reps × sets)</label>
        <br /><br />
        {workouts.map((workout, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <label>
              Weight:
              <input
                type="number"
                value={workout.weight}
                onChange={(e) => updateWorkout(index, 'weight', e.target.value)}
              />
            </label>
            <label>
              Reps:
              <input
                type="number"
                value={workout.reps}
                onChange={(e) => updateWorkout(index, 'reps', e.target.value)}
              />
            </label>
            <label>
              Sets:
              <input
                type="number"
                value={workout.sets}
                onChange={(e) => updateWorkout(index, 'sets', e.target.value)}
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={addWorkout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          Add Workout
        </button>
        <br />
        <label>
          Total Time (minutes):
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
          Weight (lbs):
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </label>
        <br /><br />
        
        {foods.map((food, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <label>
              Food Name:
              <input
                type="text"
                value={food.name}
                onChange={(e) => updateFood(index, e.target.value)}
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={addFood}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          Add Food
        </button>
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
