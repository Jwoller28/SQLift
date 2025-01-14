import {useEffect, useState, MouseEventHandler} from 'react';
import {getGoalsbyUserId, usernameifAuthorized, getUserByUsername} from '../../API/Axios';
import {useNavigate} from 'react-router-dom';
import {Exercise, Nutrition, Goal} from './Inbox';


interface NotiListProp {
	handleClick : MouseEventHandler<HTMLDivElement>;
}

function NotificationList(prop: NotiListProp) {
	const [goals, setGoals] = useState<Goal[]>([]);
	const today = new Date();
  
	useEffect(() => {
	  const getGoalsBeforeToday = async () => {
		let username = await usernameifAuthorized();
		let user = await getUserByUsername(username);
		let goalList = await getGoalsbyUserId(user.id);
		return goalList.filter((goal: Goal) => new Date(goal.waterDate) <= today);
	  };
	  getGoalsBeforeToday().then((data) => {
		setGoals(data);
	  });
	}, []);
  
	return (
	  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
		{goals.map((goal: Goal) => (
		  <div
			key={goal.id}
			a-key={goal.id}
			onClick={prop.handleClick} // Pass the event directly
			style={{
			  padding: "15px",
			  borderRadius: "8px",
			  backgroundColor: "#f0f0f0",
			  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
			  cursor: "pointer",
			  transition: "transform 0.2s ease",
			}}
		  >
			<h5 style={{ marginBottom: "5px", fontWeight: "bold" }}>Goal ID: {goal.id}</h5>
			<p style={{ margin: 0, color: "#555" }}>
			  Goal Date: {new Date(goal.waterDate).toLocaleDateString()}
			</p>
		  </div>
		))}
	  </div>
	);
  }
  
  export default NotificationList;
  
  