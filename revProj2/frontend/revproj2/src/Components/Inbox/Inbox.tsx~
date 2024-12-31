import React from 'react'
import {useEffect, useState, useContext  } from 'react'
import {AuthContext} from '../UserContext/UserContext'
import {getUserByUsername, getGoalbyUserId, usernameifAuthorized } from '../../API/Axios'


interface Notification {
	id : number;
	user_id : number;
	goal_id : number;
	data : Tracker[];

}

interface Exercise {
	duration : number;
	volume : number;
	calories : number;
	ExerciseDate : Date;
};

interface Nutrition {
	Kal : number;
	fat : number;
	carb : number;
	weight : number;
	protein : number;
	NutritionDate : Date;
};

interface Goal {
	id : number;
	user_id : number;
	createdAt : Date;
	sleep : number;
	water : number;
	sleepDate : Date;
	waterDate : Date;
	exercise : Exercise;
	nutrition : Nutrition;
}

interface Tracker {
	id : number;
	user_id : number;
	goal_id : number;
	goal : Goal;
}
function Inbox() {

  // Get Current Date
  const today = useState(new Date());
  const notis = useState<Notification[] | undefined>(undefined);


  const currentGoal = async (username : string) => {

	  let user = await getUserByUsername(username);
	  
	  // let goal = await getGoalbyUserId(user.userId);
	  console.log(user);
  }
  

  useEffect(() => {
	  const username = usernameifAuthorized();

	  console.log(username);
  },[]);


  return (
    <>
    	<div>
		<header>Button Div</header>
		<button>Click me</button>
	</div>
	<div>
		<header> Display Div </header>
	</div>
    </>
  )
}

export default Inbox
