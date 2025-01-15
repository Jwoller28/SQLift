import React from 'react'
import {useEffect, useState, useContext, useCallback  } from 'react'
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

	useEffect(() => {
		usernameifAuthorized().then((username) => {
			getUserByUsername(username).then((data) => {
				let user = data;
				setUserId(user.id);
			});
		});
	}, []);

	const handleClick2 = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		const target = event.target as HTMLDivElement;
		const clickedGoal = parseInt(target.getAttribute("a-key") || "0", 10);

		if (!isNaN(clickedGoal)) {
			setDiv(clickedGoal);
			setClicked(true); // Always set clicked to true when a goal is selected
		}
	};

	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "1fr 2fr 1fr",
				gridGap: "20px",
				padding: "20px",
				background: "linear-gradient(135deg, #ff6bcb, #504dff)",
				minHeight: "100vh",
			}}
		>
			{/* Notification List */}
			<div
				style={{
					background: "linear-gradient(to bottom, #2F2F2F , #1A1A1A )",
					color: "#000",
					padding: "20px",
					borderRadius: "10px",
					boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
					overflowY: "auto",
				}}
			>
				<h3 style={{ textAlign: "center", marginBottom: "15px", color: "#0099FF" }}>
					Your Goals
				</h3>
				<NotificationList handleClick={handleClick2} />
			</div>

			{/* Notification Viewer (Analytics) */}
			<div
				style={{
					background: "linear-gradient(to bottom, #2F2F2F , #1A1A1A )",
					color: "#000",
					padding: "20px",
					borderRadius: "10px",
					boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
					overflowY: "auto",
				}}
			>
				<h3 style={{ textAlign: "center", marginBottom: "15px", color: "#C613D0" }}>
					Analytics
				</h3>
				<NotiViewerNew userId={userId} goalId={div} clicked={clicked} />
			</div>

			{/* Message Box */}
			<div
				style={{
					background: "linear-gradient(to bottom, #2F2F2F , #1A1A1A )",
					color: "#fff",
					padding: "20px",
					borderRadius: "10px",
					boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
					overflowY: "auto",
				}}
			>
				<h3 style={{ textAlign: "center", marginBottom: "15px", color: "#4CAF50" }}>
					Message Box
				</h3>
				<PostFeedSmart goalId={div} userId={userId} />
			</div>
		</div>
	);
}

export default Inbox;