import React, {useEffect, useState, useContext, useCallback  } from 'react'
import {AuthContext} from '../UserContext/UserContext'
import NotificationList from './NotificationList'
import NotiViewerNew from './NotiViewerNew'
import PostFeedSmart from '../PostFeed/PostFeedSmart'
import {getUserByUsername, getGoalbyUserId, usernameifAuthorized } from '../../API/Axios'


export interface Exercise {
	duration : number;
	volume : number;
	calories : number;
	ExerciseDate : Date;
};

export interface Nutrition {
	Kal : number;
	fat : number;
	carb : number;
	weight : number;
	protein : number;
	NutritionDate : Date;
};

export interface Goal {
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

export interface Tracker {
	id : number;
	user_id : number;
	goal_id : number;
	goal : Goal;
}
function Inbox() {
 	const [div, setDiv] = useState<number>(0);
	const [clicked, setClicked] = useState(false);
	const [userId, setUserId] = useState(0);
	
	useEffect( () => {	
		usernameifAuthorized().then((username) => {
			getUserByUsername(username).then((data)=>{
				let user = data;
				console.log(user)
				setUserId(user.id);
				})
		})
	}, [])
	
	const handleClick2 = (event : any) => {
		let clickedGoal = event.target.getAttribute('a-key');
		console.log(clickedGoal);
		setDiv((prev) => (prev != clickedGoal ? clickedGoal : prev));
		console.log(div);
		setClicked((prev) => !prev);
	};
		
	
  return (
    <>
        <div>
		<NotificationList handleClick = {handleClick2} />
	</div>
	<div>
		<NotiViewerNew userId = {userId} goalId = {div} clicked = {clicked} />
	</div>
    </>
  )
}

export default Inbox
