import React, { FormEvent, useEffect, useState } from 'react'

function SetUserGoals() {
    const[kal, setCalories] = useState(0);
    const[carb, setCarbs] = useState(0);
    const[fat, setFat] = useState(0);
    const[protein, setProtein] = useState(0);
    const[userWeight, setUserWeight] = useState(0);

    // const[weight, setWeight] = useState("0");
    // const[reps, setReps] = useState("0");
    const[caloriesBurned, setCaloriesBurned] = useState(0);
    const[volume, setVolume] = useState(0);
    const[duration, setDuration] = useState(0);

    const[water, setWater] = useState(0);

    const[sleep, setSleep] = useState(0);

    const [token, setToken] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [id, setUserId] = useState(null);

    const getUserIdAndPass = async () => {
        const userIdResponse = await fetch(`http://localhost:8080/username/${username}`,{
            headers: {
                'Authorization' : `Bearer ${token}`
            }
        });

        if(!userIdResponse.ok)
        {
            alert(`Something went wrong getting user id ERROR CODE: ${userIdResponse.status}`);
        }
        else{
            const userIdData = await userIdResponse.json();
            setUserId(userIdData.id);
            setPassword(userIdData.password)
            // console.log("Here is the userIdData: ",userIdData);
        }
        
    }

    useEffect(() => {
        if(username)
            getUserIdAndPass();
    }, [username]);

    useEffect(() => { // This useEffect will be called on render to grab token and user id from local storage
        const sessionTok = localStorage.getItem('token');
        const userId = localStorage.getItem('id');
        if(sessionTok){
          setToken(JSON.parse(sessionTok));
          }
        if(id){
            setUserId(JSON.parse(String(userId)));
        }
        
      }, []);

    useEffect(() => { // This useEffect checks our me endpoint in springboot to see if current user token is valid.
        const userValidToken = async () =>{
        const responseValidToken = await fetch("http://localhost:8080/me", {
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${token}`,
                'Access-Control-Allow-Origin': "*"
                },
                credentials : 'include'
        });
    
        const userTokenName = await responseValidToken.text();
        console.log(`The username is: ${userTokenName}`);
        setUsername(userTokenName);
        }
        userValidToken();
    }, [token]);

    const nutrition = {
        kal: kal,
        fat: fat,
        carb: carb,
        weight: userWeight,
        protein: protein
    }

    const exercise = {
        duration: duration,
        volume: volume,
        caloriesBurned: caloriesBurned
    }

    const createdAt = Date.now();

    const user = {
        id: id,
        username: username,
        password: password
    }
    

    useEffect(() => {
        if(password){
            user.password = password;
        }
    }, [password]);

    function handleGoalSubmit(event: FormEvent){
        event.preventDefault();
        const postGoals = async () => {
            const goalResponse = await fetch('http://localhost:8080/goal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify({createdAt, user, sleep, water, nutrition, exercise})
            });
    
            if(!goalResponse.ok){
                alert(`Did not go through Error code is: ${goalResponse.status}`);
            }
            else{
                const data = await goalResponse.json();
                console.log("Here is the successful goal return: ", data);
            }
        }
        postGoals();
    }


  return (
    <>
        <form onSubmit={handleGoalSubmit}>
            <h1>Nutrition</h1>
            <label>Calories
                <input type='number' value={kal} onChange={(e:any) => setCalories(e.target.value)}/>
            </label><br/>

            <label>Carbs
                <input type='number' value={carb} onChange={(e:any) => setCarbs(e.target.value)}/>
            </label><br/>

            <label>Fat
                <input type='number' value={fat} onChange={(e:any) => setFat(e.target.value)}/>
            </label><br/>

            <label>Protein
                <input type='number' value={protein} onChange={(e:any) => setProtein(e.target.value)}/>
            </label><br/>

            <label>Current Weight
                <input type='number' value={userWeight} onChange={(e:any) => setUserWeight(e.target.value)}/>
            </label><br/>

            {/* <button type='submit'>Submit Nutrition Goals</button> */}

            <h1>Exercise</h1>
            {/* <label>Max Weight Lifted in LBS
                <input type='number' value={weight} onChange={(e:any) => setWeight(e.target.value)}/>
            </label><br/>

            <label>Reps
                <input type='number' value={reps} onChange={(e:any) => setReps(e.target.value)}/>
            </label><br/> */}

            <label>Calories To Burn For Goal
                <input type='number' value={caloriesBurned} onChange={(e:any) => setCaloriesBurned(e.target.value)}/>
            </label><br/>

            <label>Volume
                <input type='number' value={volume} onChange={(e:any) => setVolume(e.target.value)}/>
            </label><br/>

            <label>Workout Duration
                <input type='number' value={duration} onChange={(e:any) => setDuration(e.target.value)}/>
            </label><br/>

            {/* <button type='submit'>Submit Exercise Goals</button> */}

            <h1>Water Intake</h1>

            <label>Daily Water Intake in oz.
                <input type='number' value={water} onChange={(e:any) => setWater(e.target.value)}/>
            </label><br/>

            {/* <button type='submit'>Submit Water Intake Goal</button> */}

            <h1>Sleep</h1>
            <label>Number of Hours of Sleep
                <input type='number' value={sleep} onChange={(e:any) => setSleep(e.target.value)}/>
            </label><br/>

            <button type='submit'>Submit Goals</button>
        </form>
    </>
  )
}

export default SetUserGoals