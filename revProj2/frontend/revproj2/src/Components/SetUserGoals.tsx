import React, { useState } from 'react'
import { useNavigate} from 'react-router-dom'

function SetUserGoals() {
    const[calories, setCalories] = useState("0");
    const[carbs, setCarbs] = useState("0");
    const[fat, setFat] = useState("0");
    const[protein, setProtein] = useState("0");

    const[weight, setWeight] = useState("0");
    const[reps, setReps] = useState("0");
    const[sets, setSets] = useState("0");
    const[bmi, setBmi] = useState("0");
    const[cardio, setCardio] = useState("0");

    const[water, setWater] = useState("0");

    const[sleep, setSleep] = useState("0");
    const navigate = useNavigate();

  return (
    <>
        <form id='nutrition'>
            <h1>Nutrition</h1>
            <label>Calories
                <input type='number' value={calories} onChange={(e:any) => setCalories(e.target.value)}/>
            </label><br/>

            <label>Carbs
                <input type='number' value={carbs} onChange={(e:any) => setCarbs(e.target.value)}/>
            </label><br/>

            <label>Fat
                <input type='number' value={fat} onChange={(e:any) => setFat(e.target.value)}/>
            </label><br/>

            <label>Protein
                <input type='number' value={protein} onChange={(e:any) => setProtein(e.target.value)}/>
            </label><br/>

            <button type='submit'>Submit Nutrition Goals</button>
        </form>

        <form id='exercise'>
            <h1>Exercise</h1>
            <label>Max Weight Lifted in LBS
                <input type='number' value={weight} onChange={(e:any) => setWeight(e.target.value)}/>
            </label><br/>

            <label>Reps
                <input type='number' value={reps} onChange={(e:any) => setReps(e.target.value)}/>
            </label><br/>

            <label>Sets
                <input type='number' value={sets} onChange={(e:any) => setSets(e.target.value)}/>
            </label><br/>

            <label>BMI
                <input type='number' value={bmi} onChange={(e:any) => setBmi(e.target.value)}/>
            </label><br/>

            <label>Time Spent Doing Cardio in Minutes
                <input type='number' value={cardio} onChange={(e:any) => setCardio(e.target.value)}/>
            </label><br/>

            <button type='submit'>Submit Exercise Goals</button>
        </form>

        <form id='water'>
            <h1>Water Intake</h1>

            <label>Daily Water Intake in oz.
                <input type='number' value={water} onChange={(e:any) => setWater(e.target.value)}/>
            </label><br/>

            <button type='submit'>Submit Water Intake Goal</button>
        </form>

        <form id='sleep'>
            <h1>Sleep</h1>
            <label>Number of Hours of Sleep
                <input type='number' value={sleep} onChange={(e:any) => setSleep(e.target.value)}/>
            </label><br/>

            <button type='submit'>Submit Sleep Goal</button>
        </form>
	<button onClick = {() => navigate('/Calendar')} > Navigate to Calendar </button>

    </>
  )
}

export default SetUserGoals
